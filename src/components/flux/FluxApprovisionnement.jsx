import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, Loader2, Plus, RefreshCw, Search, X } from 'lucide-react';
import { LigneChargementTableau } from '../common/SpinnerPourcentage';
import { BoutonVoir } from '../common/BoutonsActionsTableau';
import { apiRequest } from '../../services/api';
import { droit, getCodeRole, getFluxStage, libelleDroits } from '../../data/rbacMatrix';

const STATUTS = {
  SOUMISE_ANTENNE: 'Reçue par l\'antenne',
  TRANSMISE_SIEGE: 'Transmise au siège',
  DISPERSEE: 'Dispersée par le siège',
  REJETEE_ANTENNE: 'Rejetée par l\'antenne',
  REJETEE_SIEGE: 'Rejetée par le siège',
};

const ACTIONS = {
  CREATION: 'Commande enregistrée',
  TRANSMISSION: 'Transmise au siège',
  DISPERSION: 'Dispersée par le siège',
  REJET: 'Rejetée',
};

const FILTRES = [
  { id: 'tous', label: 'Toutes' },
  { id: 'SOUMISE_ANTENNE', label: 'Reçues' },
  { id: 'TRANSMISE_SIEGE', label: 'Au siège' },
  { id: 'DISPERSEE', label: 'Dispersées' },
  { id: 'REJETEE', label: 'Rejetées' },
];

const STATUT_STYLE = {
  SOUMISE_ANTENNE: 'bg-blue-50 text-blue-800 border-blue-200',
  TRANSMISE_SIEGE: 'bg-amber-50 text-amber-800 border-amber-200',
  DISPERSEE: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  REJETEE_ANTENNE: 'bg-rose-50 text-rose-800 border-rose-200',
  REJETEE_SIEGE: 'bg-rose-50 text-rose-800 border-rose-200',
};

const STEPS = [
  { id: 'commande', titre: '1. Commande', texte: 'La pharmacie ou le partenaire commande auprès de son antenne.' },
  { id: 'antenne', titre: '2. Antenne', texte: 'L\'antenne transmet la commande au siège.' },
  { id: 'siege', titre: '3. Siège', texte: 'Le siège disperse les quantités selon la commande.' },
];

/** Nombre de lignes proposées dans la pagination du tableau. */
const TAILLES_PAGE = [3, 5, 10, 20];

/** Formate un montant en francs CFA. */
function formaterMontant(valeur) {
  return `${Number(valeur || 0).toLocaleString('fr-FR')} F`;
}

/**
 * Liste déroulante avec recherche intégrée.
 * La barre de recherche est dans le panneau, pas au-dessus du champ.
 */
function ListeDeroulante({ valeur, surChangement, options, texteVide = 'Choisir' }) {
  const [ouvert, setOuvert] = useState(false);
  const [rechercheOption, setRechercheOption] = useState('');
  const [position, setPosition] = useState(null);
  const boutonRef = useRef(null);
  const panneauRef = useRef(null);
  const champRechercheRef = useRef(null);

  /* Recale le panneau sous le bouton, ou au-dessus s'il n'y a pas la place. */
  useLayoutEffect(() => {
    if (!ouvert) return undefined;
    const placer = () => {
      const cadre = boutonRef.current?.getBoundingClientRect();
      if (!cadre) return;
      const espaceBas = window.innerHeight - cadre.bottom - 12;
      const espaceHaut = cadre.top - 12;
      const ouvrirVersLeHaut = espaceBas < 220 && espaceHaut > espaceBas;
      const hauteurMax = Math.max(180, Math.min(320, ouvrirVersLeHaut ? espaceHaut : espaceBas));
      setPosition({
        left: cadre.left,
        width: Math.max(cadre.width, 260),
        top: ouvrirVersLeHaut ? Math.max(8, cadre.top - hauteurMax - 4) : cadre.bottom + 4,
        hauteurMax,
      });
    };
    placer();
    window.addEventListener('resize', placer);
    window.addEventListener('scroll', placer, true);
    return () => {
      window.removeEventListener('resize', placer);
      window.removeEventListener('scroll', placer, true);
    };
  }, [ouvert]);

  /* Ferme la liste au clic extérieur ou avec Échap, et place le curseur dans la recherche. */
  useEffect(() => {
    if (!ouvert) return undefined;
    setRechercheOption('');
    champRechercheRef.current?.focus();
    const surDocument = (evenement) => {
      if (boutonRef.current?.contains(evenement.target) || panneauRef.current?.contains(evenement.target)) return;
      setOuvert(false);
    };
    const surClavier = (evenement) => {
      if (evenement.key === 'Escape') setOuvert(false);
    };
    document.addEventListener('mousedown', surDocument);
    document.addEventListener('keydown', surClavier);
    return () => {
      document.removeEventListener('mousedown', surDocument);
      document.removeEventListener('keydown', surClavier);
    };
  }, [ouvert]);

  const optionChoisie = options.find((option) => String(option.value) === String(valeur));
  const terme = rechercheOption.trim().toLowerCase();
  const optionsFiltrees = options.filter((option) => option.label.toLowerCase().includes(terme));

  return (
    <>
      <button
        type="button"
        ref={boutonRef}
        onClick={() => setOuvert((etat) => !etat)}
        className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white text-left flex items-center justify-between gap-2"
        aria-haspopup="listbox"
        aria-expanded={ouvert}
      >
        <span className={`truncate ${optionChoisie ? 'text-slate-900' : 'text-slate-500'}`}>
          {optionChoisie ? optionChoisie.label : texteVide}
        </span>
        <span className="text-[10px] text-slate-400 shrink-0">{ouvert ? '▴' : '▾'}</span>
      </button>
      {ouvert && position && createPortal(
        <div
          ref={panneauRef}
          className="fixed z-[120] bg-white border border-slate-200 rounded shadow-xl overflow-hidden"
          style={{ top: position.top, left: position.left, width: position.width, maxHeight: position.hauteurMax }}
        >
          <label className="relative block border-b border-slate-100 p-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              ref={champRechercheRef}
              value={rechercheOption}
              onChange={(evenement) => setRechercheOption(evenement.target.value)}
              placeholder="Rechercher…"
              className="w-full border border-slate-200 rounded pl-8 pr-2 py-1.5 text-sm"
            />
          </label>
          <ul role="listbox" className="overflow-y-auto py-1" style={{ maxHeight: position.hauteurMax - 52 }}>
            {optionsFiltrees.length === 0 && <li className="px-2 py-1.5 text-xs text-slate-500">Aucun résultat</li>}
            {optionsFiltrees.map((option) => {
              const active = String(option.value) === String(valeur);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      surChangement(String(option.value));
                      setOuvert(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 ${active ? 'bg-blue-50 font-semibold text-[#2E68B4]' : 'text-slate-800'}`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </>
  );
}

export default function FluxApprovisionnement({ activePersona }) {
  const role = getCodeRole(activePersona);
  const localStage = getFluxStage(role);
  const [stage, setStage] = useState(localStage);
  const [commandes, setCommandes] = useState([]);
  const [compteurs, setCompteurs] = useState({ total: 0, recues: 0, transmises: 0, dispersees: 0 });
  const [maj, setMaj] = useState(null);
  const [antennes, setAntennes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partenaire, setPartenaire] = useState('');
  const [antenneId, setAntenneId] = useState('');
  const [motif, setMotif] = useState('');
  const [ligne, setLigne] = useState({ produit_id: '', quantite_demandee: 1 });
  const [brouillon, setBrouillon] = useState([]);
  const [dispersion, setDispersion] = useState({});
  const [modalOuvert, setModalOuvert] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');
  const [ligneOuverte, setLigneOuverte] = useState(null);
  const [taillePage, setTaillePage] = useState(5);
  const [pageCourante, setPageCourante] = useState(1);
  const [aideOuverte, setAideOuverte] = useState(false);

  const peutCommander = (stage === 'commande' || stage === 'antenne' || stage === 'supervision') && droit(activePersona, 'flux', 'creer');
  const peutTransmettre = (stage === 'antenne' || stage === 'supervision') && droit(activePersona, 'flux', 'modifier');
  const peutDisperser = (stage === 'siege' || stage === 'supervision') && droit(activePersona, 'flux', 'valider');

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      const [flux, ants, meds] = await Promise.all([
        apiRequest('/flux/commandes'),
        apiRequest('/antennes'),
        apiRequest('/pharmacy/produits'),
      ]);
      setStage(flux.stage || localStage);
      setCommandes(flux.commandes || []);
      setCompteurs(flux.compteurs || { total: 0, recues: 0, transmises: 0, dispersees: 0 });
      setMaj(new Date());
      setAntennes(ants.antennes || []);
      setProduits((meds.produits || []).slice(0, 80));
      if (silent) setError('');
    } catch (err) {
      if (!silent) setError(err.message || 'Impossible de charger le flux.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [localStage]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => load(true), 5000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!antennes.length || antenneId) return;
    const own = antennes.find((a) => String(a.id) === String(activePersona?.province_id || activePersona?.provinceId));
    setAntenneId(String((own || antennes[0]).id));
  }, [antennes, antenneId, activePersona]);

  const produitChoisi = useMemo(
    () => produits.find((p) => String(p.id) === String(ligne.produit_id)),
    [produits, ligne.produit_id]
  );

  function ajouterLigne() {
    if (!produitChoisi) return;
    setBrouillon((prev) => [...prev, {
      produit_id: produitChoisi.id,
      designation: produitChoisi.designation,
      quantite_demandee: Number(ligne.quantite_demandee) || 1,
    }]);
  }

  async function envoyerCommande(event) {
    event.preventDefault();
    if (!brouillon.length) {
      setError('Ajoutez au moins un médicament.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await apiRequest('/flux/commandes', {
        method: 'POST',
        body: JSON.stringify({
          antenne_id: Number(antenneId),
          partenaire_nom: partenaire,
          partenaire_type: 'PHARMACIE',
          motif,
          lignes: brouillon,
        }),
      });
      setBrouillon([]);
      setMotif('');
      setPartenaire('');
      setModalOuvert(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function action(path) {
    setError('');
    try {
      await apiRequest(path, { method: 'POST', body: JSON.stringify({}) });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function rejeter(commande) {
    const motif = window.prompt('Motif du rejet');
    if (!motif) return;
    setError('');
    try {
      await apiRequest(`/flux/commandes/${commande.id}/rejeter`, {
        method: 'POST',
        body: JSON.stringify({ motif }),
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const commandesVisibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return commandes.filter((commande) => {
      if (filtre === 'REJETEE' && !String(commande.statut || '').startsWith('REJETEE')) return false;
      if (filtre !== 'tous' && filtre !== 'REJETEE' && commande.statut !== filtre) return false;
      if (!q) return true;
      const texte = [
        commande.numero_commande,
        commande.demandeur_nom,
        commande.demandeur_role,
        commande.partenaire_nom,
        commande.antenne?.nom,
        commande.antenne?.chef_lieu,
        commande.motif,
        STATUTS[commande.statut],
        ...(commande.lignes || []).map((row) => row.designation),
      ].filter(Boolean).join(' ').toLowerCase();
      return texte.includes(q);
    });
  }, [commandes, recherche, filtre]);

  /* Revenir à la première page dès que le filtre, la recherche ou la taille changent. */
  useEffect(() => {
    setPageCourante(1);
  }, [recherche, filtre, taillePage]);

  const nombrePages = Math.max(1, Math.ceil(commandesVisibles.length / taillePage));
  const pageAffichee = Math.min(pageCourante, nombrePages);
  const commandesPage = commandesVisibles.slice((pageAffichee - 1) * taillePage, pageAffichee * taillePage);

  function compteFiltre(id) {
    if (id === 'tous') return commandes.length;
    if (id === 'REJETEE') return commandes.filter((c) => String(c.statut || '').startsWith('REJETEE')).length;
    return commandes.filter((c) => c.statut === id).length;
  }

  async function disperser(commande) {
    setError('');
    const lignes = commande.lignes.map((row) => ({
      id: row.id,
      quantite_dispersee: Number(dispersion[row.id] ?? row.quantite_demandee),
    }));
    try {
      await apiRequest(`/flux/commandes/${commande.id}/disperser`, {
        method: 'POST',
        body: JSON.stringify({ lignes }),
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E68B4]">Territoire national · 9 provinces</p>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-slate-900">Chaîne d'approvisionnement</h1>
          <button type="button" onClick={() => setAideOuverte(true)} className="w-6 h-6 rounded-full border border-slate-300 text-[#2E68B4] inline-flex items-center justify-center" title="Explications" aria-label="Explications">
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Suivi en direct{maj ? ` · mis à jour à ${maj.toLocaleTimeString('fr-FR')}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          ['Commandes', compteurs.total],
          ['Chez l\'antenne', compteurs.recues],
          ['Au siège', compteurs.transmises],
          ['Dispersées', compteurs.dispersees],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-md px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
            {loading ? (
              <Loader2 className="w-5 h-5 mt-1 animate-spin text-[#2E68B4]" />
            ) : (
              <p className="text-lg font-black text-slate-900">{value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {STEPS.map((step) => (
          <div key={step.id} className={`rounded-md border p-3 ${stage === step.id || stage === 'supervision' ? 'border-[#2E68B4] bg-blue-50' : 'border-slate-200 bg-white'}`}>
            <p className="text-xs font-bold text-slate-900">{step.titre}</p>
          </div>
        ))}
      </div>

      {error && !modalOuvert && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}

      <section className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Commandes</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{commandesVisibles.length} affichée{commandesVisibles.length > 1 ? 's' : ''} sur {commandes.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => load()} disabled={loading} className="w-8 h-8 inline-flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50" title="Actualiser les commandes" aria-label="Actualiser les commandes">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {peutCommander && (
              <button type="button" onClick={() => setModalOuvert(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">
                <Plus className="w-3.5 h-3.5" />
                Nouvelle commande
              </button>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <label className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un numéro, un demandeur, une pharmacie, un médicament…"
              className="w-full border border-slate-200 rounded pl-8 pr-2 py-1.5 text-sm"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {FILTRES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFiltre(item.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold border ${filtre === item.id ? 'bg-[#0E2A4F] text-white border-[#0E2A4F]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {item.label} ({loading ? '…' : compteFiltre(item.id)})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-bold">N° commande</th>
                <th className="px-3 py-2 font-bold">Demandeur</th>
                <th className="px-3 py-2 font-bold">Partenaire</th>
                <th className="px-3 py-2 font-bold">Antenne</th>
                <th className="px-3 py-2 font-bold">Médicaments</th>
                <th className="px-3 py-2 font-bold">Montant</th>
                <th className="px-3 py-2 font-bold">Statut</th>
                <th className="px-3 py-2 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <LigneChargementTableau colonnes={8} libelle="Chargement des commandes…" />}
              {!loading && commandesVisibles.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                    {commandes.length === 0 ? 'Aucune commande pour ce profil.' : 'Aucune commande ne correspond à cette recherche.'}
                  </td>
                </tr>
              )}
              {!loading && commandesPage.map((commande) => {
                const ouverte = ligneOuverte === commande.id;
                const lignes = commande.lignes || [];
                return (
                  <React.Fragment key={commande.id}>
                    <tr className="border-t border-slate-100 hover:bg-slate-50/80">
                      <td className="px-3 py-2.5 font-bold text-slate-900 whitespace-nowrap">{commande.numero_commande}</td>
                      <td className="px-3 py-2.5 text-slate-700">
                        <p>{commande.demandeur_nom}</p>
                        {commande.demandeur_role && <p className="text-[10px] text-slate-500">{commande.demandeur_role}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">{commande.partenaire_nom}</td>
                      <td className="px-3 py-2.5 text-slate-700">
                        {commande.antenne?.nom || commande.antenne_id}
                        {commande.antenne?.chef_lieu ? ` — ${commande.antenne.chef_lieu}` : ''}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 max-w-[220px]">
                        {lignes.map((row) => row.designation).join(', ') || '—'}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{formaterMontant(commande.montant_total_xaf)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded border font-bold ${STATUT_STYLE[commande.statut] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {STATUTS[commande.statut] || commande.statut}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          <BoutonVoir titre={ouverte ? 'Fermer le détail' : 'Voir le détail'} onClick={() => setLigneOuverte(ouverte ? null : commande.id)} />
                          {peutTransmettre && commande.statut === 'SOUMISE_ANTENNE' && (
                            <button type="button" onClick={() => action(`/flux/commandes/${commande.id}/transmettre`)} className="px-2 py-1 font-bold rounded bg-[#2E68B4] text-white">Transmettre</button>
                          )}
                          {peutDisperser && commande.statut === 'TRANSMISE_SIEGE' && (
                            <button type="button" onClick={() => disperser(commande)} className="px-2 py-1 font-bold rounded bg-[#0E2A4F] text-white">Disperser</button>
                          )}
                          {((peutTransmettre && commande.statut === 'SOUMISE_ANTENNE') || (peutDisperser && commande.statut === 'TRANSMISE_SIEGE')) && (
                            <button type="button" onClick={() => rejeter(commande)} className="px-2 py-1 font-bold rounded border border-rose-300 text-rose-700">Rejeter</button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {ouverte && (
                      <tr className="border-t border-slate-100 bg-slate-50/70">
                        <td colSpan={8} className="px-4 py-3">
                          <ul className="space-y-1.5 text-slate-700">
                            {lignes.map((row) => (
                              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2">
                                <span>{row.designation} — demandé {row.quantite_demandee}, dispersé {row.quantite_dispersee}</span>
                                {peutDisperser && commande.statut === 'TRANSMISE_SIEGE' && (
                                  <input
                                    type="number"
                                    min="0"
                                    max={row.quantite_demandee}
                                    value={dispersion[row.id] ?? row.quantite_demandee}
                                    onChange={(e) => setDispersion((s) => ({ ...s, [row.id]: e.target.value }))}
                                    className="w-20 border border-slate-200 rounded px-2 py-1 bg-white"
                                  />
                                )}
                              </li>
                            ))}
                          </ul>
                          {commande.journal?.length > 0 && (
                            <ol className="mt-3 border-l border-slate-200 pl-3 space-y-1.5">
                              {commande.journal.map((evt) => (
                                <li key={evt.id} className="text-[11px] text-slate-600">
                                  <span className="font-semibold text-slate-800">{ACTIONS[evt.action] || evt.action}</span>
                                  {' '}par {evt.auteur_nom}
                                  {evt.created_at ? ` · ${new Date(evt.created_at).toLocaleString('fr-FR')}` : ''}
                                  {evt.detail ? ` — ${evt.detail}` : ''}
                                </li>
                              ))}
                            </ol>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <label className="flex items-center gap-2">
            Afficher
            <select value={taillePage} onChange={(evenement) => setTaillePage(Number(evenement.target.value))} className="border border-slate-200 rounded px-2 py-1">
              {TAILLES_PAGE.map((taille) => <option key={taille} value={taille}>{taille}</option>)}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <button type="button" disabled={pageAffichee <= 1} onClick={() => setPageCourante(pageAffichee - 1)} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">Précédent</button>
            <span>Page {pageAffichee} / {nombrePages}</span>
            <button type="button" disabled={pageAffichee >= nombrePages} onClick={() => setPageCourante(pageAffichee + 1)} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </section>

      {aideOuverte && (
        <div className="fixed inset-0 z-[80] bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={() => setAideOuverte(false)}>
          <div onMouseDown={(evenement) => evenement.stopPropagation()} className="w-full max-w-lg bg-white border border-slate-200 rounded-md p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">Comment fonctionne la chaîne</h2>
              <button type="button" onClick={() => setAideOuverte(false)} className="p-1 rounded text-slate-500 hover:bg-slate-100" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600">L'OPN achète les médicaments. Chaque antenne reçoit les commandes de ses pharmacies, les transmet au siège, et le siège disperse.</p>
            <p className="text-xs text-slate-500">Droits sur cette page : {libelleDroits(activePersona, 'flux')}.</p>
            <ul className="space-y-2">
              {STEPS.map((etape) => (
                <li key={etape.id} className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">{etape.titre}. </span>
                  {etape.texte}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {modalOuvert && (
        <div className="fixed inset-0 z-[80] bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={() => setModalOuvert(false)}>
          <form onSubmit={envoyerCommande} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white border border-slate-200 rounded-md p-4 space-y-3 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">Nouvelle commande</h2>
              <button type="button" onClick={() => setModalOuvert(false)} className="p-1 rounded text-slate-500 hover:bg-slate-100" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-slate-600">
                Qui commande
                <input value={activePersona?.nom || activePersona?.name || ''} readOnly className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-slate-50" />
              </label>
              <label className="text-xs text-slate-600">
                Pharmacie ou partenaire
                <input value={partenaire} onChange={(e) => setPartenaire(e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" required placeholder="Nom de la pharmacie" />
              </label>
              <label className="text-xs text-slate-600 md:col-span-2">
                Antenne destinataire
                <ListeDeroulante
                  valeur={antenneId}
                  surChangement={setAntenneId}
                  texteVide="Choisir une antenne"
                  options={antennes.map((a) => ({ value: a.id, label: `${a.nom} — ${a.chef_lieu}` }))}
                />
              </label>
            </div>
            <label className="text-xs text-slate-600 block">
              Motif
              <input value={motif} onChange={(e) => setMotif(e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
            </label>
            <div className="flex flex-wrap gap-2 items-end">
              <label className="text-xs text-slate-600 flex-1 min-w-[220px]">
                Médicament
                <ListeDeroulante
                  valeur={ligne.produit_id}
                  surChangement={(produitId) => setLigne((s) => ({ ...s, produit_id: produitId }))}
                  texteVide="Choisir"
                  options={produits.map((p) => ({ value: p.id, label: p.designation }))}
                />
              </label>
              <label className="text-xs text-slate-600 w-24">
                Quantité
                <input type="number" min="1" value={ligne.quantite_demandee} onChange={(e) => setLigne((s) => ({ ...s, quantite_demandee: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
              </label>
              <button type="button" onClick={ajouterLigne} className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded">Ajouter</button>
            </div>
            {brouillon.length > 0 && (
              <ul className="text-xs text-slate-700 space-y-1">
                {brouillon.map((row, index) => <li key={`${row.produit_id}-${index}`}>{row.designation} — {row.quantite_demandee}</li>)}
              </ul>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setModalOuvert(false)} className="px-3 py-2 text-xs font-bold rounded border border-slate-300 text-slate-700">Annuler</button>
              <button disabled={saving} className="px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">{saving ? 'Envoi…' : 'Enregistrer la commande'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
