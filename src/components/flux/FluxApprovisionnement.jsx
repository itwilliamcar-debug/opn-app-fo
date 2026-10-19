import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, Loader2, Plus, RefreshCw, Search, X } from 'lucide-react';
import { LigneChargementTableau } from '../common/SpinnerPourcentage';
import { BoutonSupprimer, BoutonVoir } from '../common/BoutonsActionsTableau';
import { apiRequest } from '../../services/api';
import { askConfirm, pushToast } from '../../services/toastBus';
import { droit, getCodeRole, getFluxStage, libelleDroits } from '../../data/rbacMatrix';

const STATUTS = {
  SOUMISE_ANTENNE: 'Reçue par l\'antenne',
  EFFECTUEE_CHEF_ANTENNE: 'Effectuée par le chef d\'antenne',
  TRANSFEREE_SIEGE: 'Transférée au siège',
  PARTIELLEMENT_TRANSMISE: 'Prise en charge partielle',
  PARTIELLEMENT_ARCHIVEE: 'Reliquat (prise partielle)',
  TRANSMISE_SIEGE: 'Prise en charge au siège',
  PARTIELLEMENT_DISPERSEE: 'Dispersion partielle',
  DISPERSEE: 'Satisfaite (dispersée)',
  REJETEE_ANTENNE: 'Rejetée par l\'antenne',
  REJETEE_SIEGE: 'Rejetée par le siège',
};

const ACTIONS = {
  CREATION: 'Commande enregistrée',
  TRANSFERT: 'Transfert antenne → siège',
  PRISE_EN_CHARGE: 'Prise en charge siège',
  TRANSMISSION: 'Prise en charge / transmission',
  DISPERSION: 'Dispersion',
  REJET: 'Rejetée',
};

const FILTRES_ANTENNE = [
  { id: 'tous', label: 'Toutes' },
  { id: 'RECUE', label: 'À transférer' },
  { id: 'SIEGE', label: 'Transférées' },
  { id: 'DISPERSEE', label: 'Satisfaites' },
  { id: 'REJETEE', label: 'Rejetées' },
];

const FILTRES_SIEGE = [
  { id: 'tous', label: 'Toutes' },
  { id: 'EN_ATTENTE', label: 'En attente' },
  { id: 'RELIQUAT', label: 'Reliquats' },
  { id: 'SATISFAITE', label: 'Satisfaites' },
  { id: 'PRISE', label: 'Prises en charge' },
  { id: 'REJETEE', label: 'Rejetées' },
];

const STATUT_STYLE = {
  SOUMISE_ANTENNE: 'bg-blue-50 text-blue-800 border-blue-200',
  EFFECTUEE_CHEF_ANTENNE: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  TRANSFEREE_SIEGE: 'bg-amber-50 text-amber-900 border-amber-300',
  PARTIELLEMENT_TRANSMISE: 'bg-sky-50 text-sky-800 border-sky-200',
  PARTIELLEMENT_ARCHIVEE: 'bg-violet-50 text-violet-800 border-violet-200',
  TRANSMISE_SIEGE: 'bg-sky-50 text-sky-900 border-sky-300',
  PARTIELLEMENT_DISPERSEE: 'bg-orange-50 text-orange-800 border-orange-200',
  DISPERSEE: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  REJETEE_ANTENNE: 'bg-rose-50 text-rose-800 border-rose-200',
  REJETEE_SIEGE: 'bg-rose-50 text-rose-800 border-rose-200',
};

const STEPS = [
  { id: 'commande', titre: '1. Commande', texte: 'La pharmacie ou le partenaire initie la demande auprès de son antenne.' },
  { id: 'antenne', titre: '2. Antenne', texte: 'Le chef d\'antenne consulte les demandes de sa localité et les transfère au siège (sans prise en charge des quantités).' },
  { id: 'siege', titre: '3. Siège (Direction générale)', texte: 'La Direction générale centralise par année et par mois. À l’intérieur : l’antenne qui a transféré, puis le demandeur — ou l’antenne elle-même si c’est elle qui a commandé. L’admin métier et le super admin voient la même centralisation.' },
];

const STATUTS_A_TRANSFERER = ['SOUMISE_ANTENNE', 'EFFECTUEE_CHEF_ANTENNE'];
const STATUTS_AU_SIEGE = ['TRANSFEREE_SIEGE', 'TRANSMISE_SIEGE', 'PARTIELLEMENT_DISPERSEE', 'PARTIELLEMENT_TRANSMISE', 'PARTIELLEMENT_ARCHIVEE', 'DISPERSEE'];
const STATUTS_PRISE_SIEGE = ['TRANSFEREE_SIEGE', 'TRANSMISE_SIEGE', 'PARTIELLEMENT_ARCHIVEE', 'PARTIELLEMENT_TRANSMISE', 'PARTIELLEMENT_DISPERSEE'];

function reliquatLigne(row) {
  const demandee = Number(row.quantite_demandee || 0);
  const prise = Number(row.quantite_prise_en_charge || 0);
  return Math.max(0, Number(row.quantite_reliquat ?? demandee - prise));
}

function resteDispersionLigne(row) {
  return Math.max(0, Number(row.quantite_prise_en_charge || 0) - Number(row.quantite_dispersee || 0));
}

/** Totaux demandé / pris en charge / archivé d'une commande. */
function suiviQuantites(commande) {
  return (commande.lignes || []).reduce((totaux, row) => {
    totaux.demande += Number(row.quantite_demandee || 0);
    totaux.pris += Number(row.quantite_prise_en_charge || 0);
    totaux.archive += reliquatLigne(row);
    return totaux;
  }, { demande: 0, pris: 0, archive: 0 });
}

/** Nombre de lignes proposées dans la pagination du tableau. */
const TAILLES_PAGE = [3, 5, 10, 20];

/** Formate un montant en francs CFA. */
function formaterMontant(valeur) {
  return `${Number(valeur || 0).toLocaleString('fr-FR')} F`;
}

/** Formate une date d'enregistrement, de transmission ou de dispersion. */
function formaterDate(valeur) {
  if (!valeur) return '—';
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('fr-FR');
}

/** Une ligne du détail : libellé au-dessus de la valeur. */
function ChampDetail({ libelle, valeur, large = false }) {
  return (
    <div className={large ? 'sm:col-span-2' : ''}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{libelle}</p>
      <p className="text-sm text-slate-800 whitespace-pre-wrap">{valeur || '—'}</p>
    </div>
  );
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
  const [compteurs, setCompteurs] = useState({
    total: 0, recues: 0, transmises: 0, dispersees: 0, archivees: 0,
    en_attente: 0, satisfaites: 0, reliquats: 0, transferees: 0,
  });
  const [groupees, setGroupees] = useState([]);
  const [anneeOuverte, setAnneeOuverte] = useState(null);
  const [moisOuvert, setMoisOuvert] = useState(null);
  const [antenneOuverte, setAntenneOuverte] = useState(null);
  const [origineOuverte, setOrigineOuverte] = useState(null);
  const [transfertEnCours, setTransfertEnCours] = useState(null);
  const [antenneCompte, setAntenneCompte] = useState(null);
  const [structureCompte, setStructureCompte] = useState('');
  const [antennes, setAntennes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partenaire, setPartenaire] = useState('');
  const [antenneId, setAntenneId] = useState('');
  const [motif, setMotif] = useState('');
  const [selections, setSelections] = useState({}); // { [produit_id]: quantite }
  const [rechercheMed, setRechercheMed] = useState('');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');
  const [ligneOuverte, setLigneOuverte] = useState(null);
  const [taillePage, setTaillePage] = useState(5);
  const [pageCourante, setPageCourante] = useState(1);
  const [aideOuverte, setAideOuverte] = useState(false);
  const [peutSupprimer, setPeutSupprimer] = useState(false);
  const [modalAction, setModalAction] = useState(null); // { type: 'prise'|'dispersion', commande }
  const [quantitesAction, setQuantitesAction] = useState({});
  const [noteAction, setNoteAction] = useState('');
  const [savingAction, setSavingAction] = useState(false);

  const codeRoleCompte = role || activePersona?.codeRole || activePersona?.code_role;
  const estChefAntenne = ['CHEF_ANTENNE_PROVINCIALE', 'PHARMACIEN_CHEF_ANTENNE'].includes(codeRoleCompte);
  // Id numérique d'antenne uniquement (pas le code G2 / G8 du persona).
  const antenneDuCompte = (() => {
    const candidats = [activePersona?.antenne_id, activePersona?.antenneId, activePersona?.province_id];
    const num = candidats.find((v) => v !== undefined && v !== null && v !== '' && !Number.isNaN(Number(v)) && String(v) === String(Number(v)));
    return num !== undefined ? Number(num) : null;
  })();
  const antenneImposee = Boolean(antenneDuCompte) && !['SUPER_ADMIN', 'ADMIN_METIER'].includes(codeRoleCompte);
  const estDirectionGenerale = codeRoleCompte === 'DG';
  const estSupervision = ['SUPER_ADMIN', 'ADMIN_METIER'].includes(codeRoleCompte);
  const titreMenu = (codeRoleCompte === 'DEMANDEUR_PHARMACIEN' || codeRoleCompte === 'DEMANDEUR_STRUCTURE')
    ? 'Mes demandes'
    : estDirectionGenerale
      ? 'Siège — Direction générale'
      : estSupervision
        ? 'Siège — toutes les antennes'
        : 'Chaîne d\'approvisionnement';
  const estDemandeur = stage === 'commande';
  const estVueSiege = stage === 'siege' || stage === 'supervision';
  const peutCommander = estDemandeur || ((stage === 'antenne' || stage === 'supervision') && droit(activePersona, 'flux', 'creer'));
  const peutTransferer = (stage === 'antenne' || stage === 'supervision') && droit(activePersona, 'flux', 'modifier');
  const peutPrendreCharge = estVueSiege && (droit(activePersona, 'flux', 'modifier') || droit(activePersona, 'flux', 'valider'));
  const peutDisperser = estVueSiege && droit(activePersona, 'flux', 'valider');
  const nomChef = activePersona?.nom || activePersona?.name || '';
  const FILTRES = estVueSiege ? FILTRES_SIEGE : FILTRES_ANTENNE;

  const loadEnCours = useRef(false);
  const load = useCallback(async (silent = false) => {
    if (loadEnCours.current) return;
    loadEnCours.current = true;
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      if (silent) {
        // Poll léger : uniquement les commandes (évite de saturer php artisan serve).
        const flux = await apiRequest('/flux/commandes');
        setStage(flux.stage || localStage);
        setCommandes(flux.commandes || []);
        setCompteurs(flux.compteurs || {});
        setGroupees(flux.groupees || []);
        setAntenneCompte(flux.antenne_compte || null);
        setStructureCompte(flux.structure_compte || '');
        setPeutSupprimer(Boolean(flux.peut_supprimer));
        setError('');
      } else {
        // Commandes d'abord (critique) ; antennes/produits en best-effort pour ne pas vider la liste.
        const flux = await apiRequest('/flux/commandes');
        setStage(flux.stage || localStage);
        setCommandes(flux.commandes || []);
        setCompteurs(flux.compteurs || {});
        setGroupees(flux.groupees || []);
        setAntenneCompte(flux.antenne_compte || null);
        setStructureCompte(flux.structure_compte || '');
        setPeutSupprimer(Boolean(flux.peut_supprimer));
        const [ants, meds] = await Promise.allSettled([
          apiRequest('/antennes'),
          apiRequest('/pharmacy/produits'),
        ]);
        if (ants.status === 'fulfilled') setAntennes(ants.value.antennes || []);
        if (meds.status === 'fulfilled') setProduits((meds.value.produits || []).slice(0, 80));
      }
    } catch (err) {
      if (!silent && !err?.skipped) setError(err?.backendUnavailable ? '' : (err.message || 'Impossible de charger le flux.'));
    } finally {
      loadEnCours.current = false;
      if (!silent) setLoading(false);
    }
  }, [localStage]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!ligneOuverte) return undefined;
    const surClavier = (evenement) => {
      if (evenement.key === 'Escape') setLigneOuverte(null);
    };
    document.addEventListener('keydown', surClavier);
    return () => document.removeEventListener('keydown', surClavier);
  }, [ligneOuverte]);

  useEffect(() => {
    const timer = window.setInterval(() => load(true), 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!antennes.length || antenneId) return;
    const propre = antennes.find((antenne) => String(antenne.id) === String(antenneDuCompte));
    setAntenneId(String((propre || antennes[0]).id));
  }, [antennes, antenneId, antenneDuCompte]);

  const antenneChoisie = antennes.find((antenne) => String(antenne.id) === String(antenneId));
  const antenneParDefaut = (antenneCompte && String(antenneCompte.id) === String(antenneId || antenneCompte.id) ? antenneCompte : null)
    || antennes.find((antenne) => String(antenne.id) === String(antenneDuCompte || antenneCompte?.id))
    || antenneCompte;
  const antenneVerrouillee = Boolean(antenneParDefaut) && (estDemandeur || estChefAntenne || antenneImposee);
  const libelleAntenneDefaut = antenneParDefaut
    ? [antenneParDefaut.nom, antenneParDefaut.chef_lieu].filter(Boolean).join(' — ')
    : '';

  /** Demandeur = sa structure ; chef = demande à son propre nom. */
  function ouvrirDemande() {
    if (estChefAntenne) {
      setPartenaire(nomChef);
    } else {
      const structure = structureCompte || activePersona?.entite || activePersona?.structure || '';
      setPartenaire(structure);
    }
    const idAntenne = antenneCompte?.id || antenneDuCompte;
    if (idAntenne) setAntenneId(String(idAntenne));
    setSelections({});
    setRechercheMed('');
    setError('');
    setModalOuvert(true);
  }

  /** Coche / décoche un médicament. Si coché, initialise la quantité à 1. */
  function toggleSelection(produitId) {
    setSelections((prev) => {
      if (prev[produitId] !== undefined) {
        const next = { ...prev };
        delete next[produitId];
        return next;
      }
      return { ...prev, [produitId]: 1 };
    });
  }

  /** Met à jour la quantité d'un médicament sélectionné. */
  function majQuantite(produitId, valeur) {
    const qte = Math.max(1, Number(valeur) || 1);
    setSelections((prev) => ({ ...prev, [produitId]: qte }));
  }

  async function envoyerCommande(event) {
    event.preventDefault();
    const lignesSelections = Object.entries(selections)
      .filter(([, qte]) => qte > 0)
      .map(([produitId, qte]) => {
        const p = produits.find((prod) => String(prod.id) === String(produitId));
        return { produit_id: Number(produitId), quantite_demandee: qte, designation: p?.designation };
      });
    if (!lignesSelections.length) {
      setError('Sélectionnez au moins un médicament.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await apiRequest('/flux/commandes', {
        method: 'POST',
        body: JSON.stringify({
          antenne_id: Number(antenneCompte?.id || antenneDuCompte || antenneId),
          partenaire_nom: estChefAntenne ? nomChef : partenaire,
          partenaire_type: estChefAntenne ? 'ANTENNE' : 'PHARMACIE',
          motif,
          lignes: lignesSelections,
        }),
      });
      setSelections({});
      setRechercheMed('');
      setMotif('');
      setPartenaire('');
      setModalOuvert(false);
      await load();
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    } finally {
      setSaving(false);
    }
  }

  /** Transfert simple antenne → siège (pas de choix de quantités). */
  async function transfererAuSiege(commande) {
    const ok = await askConfirm({
      message: `Transférer ${commande.numero_commande} au siège OPN ?`,
      confirmLabel: 'Transférer',
    });
    if (!ok) return;
    setTransfertEnCours(commande.id);
    setError('');
    try {
      await apiRequest(`/flux/commandes/${commande.id}/transferer`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      pushToast(`${commande.numero_commande} transférée au siège.`);
      await load();
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    } finally {
      setTransfertEnCours(null);
    }
  }

  /** Ouvre le modal de prise en charge (siège) ou de dispersion (siège). */
  function ouvrirAction(type, commande) {
    const initial = {};
    (commande.lignes || []).forEach((row) => {
      const max = type === 'prise' ? reliquatLigne(row) : resteDispersionLigne(row);
      initial[row.id] = max > 0 ? max : 0;
    });
    setQuantitesAction(initial);
    setNoteAction('');
    setError('');
    setModalAction({ type, commande });
  }

  function majQuantiteAction(ligneId, max, valeur) {
    const qte = Math.max(0, Math.min(max, Number(valeur) || 0));
    setQuantitesAction((prev) => ({ ...prev, [ligneId]: qte }));
  }

  function toutPrendreAction() {
    if (!modalAction) return;
    const initial = {};
    (modalAction.commande.lignes || []).forEach((row) => {
      const max = modalAction.type === 'prise' ? reliquatLigne(row) : resteDispersionLigne(row);
      initial[row.id] = max;
    });
    setQuantitesAction(initial);
  }

  function toutZeroAction() {
    if (!modalAction) return;
    const initial = {};
    (modalAction.commande.lignes || []).forEach((row) => {
      initial[row.id] = 0;
    });
    setQuantitesAction(initial);
  }

  async function confirmerAction() {
    if (!modalAction) return;
    const { type, commande } = modalAction;
    const lignes = (commande.lignes || [])
      .map((row) => ({
        id: row.id,
        quantite: Number(quantitesAction[row.id] || 0),
      }))
      .filter((ligne) => ligne.quantite > 0);

    if (!lignes.length) {
      setError('Indiquez au moins une quantité supérieure à 0.');
      return;
    }

    setSavingAction(true);
    setError('');
    try {
      if (type === 'prise') {
        await apiRequest(`/flux/commandes/${commande.id}/transmettre`, {
          method: 'POST',
          body: JSON.stringify({ lignes, note: noteAction || undefined }),
        });
      } else {
        await apiRequest(`/flux/commandes/${commande.id}/disperser`, {
          method: 'POST',
          body: JSON.stringify({
            lignes: lignes.map((l) => ({ id: l.id, quantite: l.quantite })),
            note_dispersion: noteAction || undefined,
          }),
        });
      }
      setModalAction(null);
      pushToast(type === 'prise' ? `Prise en charge enregistrée pour ${commande.numero_commande}.` : `Dispersion enregistrée pour ${commande.numero_commande}.`);
      await load();
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    } finally {
      setSavingAction(false);
    }
  }

  async function supprimerCommande(commande) {
    const ok = await askConfirm({
      message: `Supprimer la commande ${commande.numero_commande} ?`,
      confirmLabel: 'Supprimer',
      tone: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      await apiRequest(`/flux/commandes/${commande.id}`, { method: 'DELETE' });
      if (ligneOuverte === commande.id) setLigneOuverte(null);
      pushToast(`Commande ${commande.numero_commande} supprimée.`, 'warning');
      await load();
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    }
  }

  async function rejeter(commande) {
    const decision = await askConfirm({
      message: `Rejeter la commande ${commande.numero_commande} ?`,
      confirmLabel: 'Rejeter',
      tone: 'danger',
      reasonLabel: 'Motif du rejet',
      reasonRequired: true,
    });
    if (!decision) return;
    const motif = decision.reason;
    setError('');
    try {
      await apiRequest(`/flux/commandes/${commande.id}/rejeter`, {
        method: 'POST',
        body: JSON.stringify({ motif }),
      });
      pushToast(`Commande ${commande.numero_commande} rejetée.`, 'warning');
      await load();
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    }
  }

  const commandesVisibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return commandes.filter((commande) => {
      if (filtre === 'REJETEE' && !String(commande.statut || '').startsWith('REJETEE')) return false;
      if (filtre === 'RECUE' && !STATUTS_A_TRANSFERER.includes(commande.statut)) return false;
      if (filtre === 'SIEGE' && !STATUTS_AU_SIEGE.includes(commande.statut)) return false;
      if (filtre === 'EN_ATTENTE' && commande.statut !== 'TRANSFEREE_SIEGE') return false;
      if (filtre === 'RELIQUAT' && commande.statut !== 'PARTIELLEMENT_ARCHIVEE') return false;
      if (filtre === 'SATISFAITE' && commande.statut !== 'DISPERSEE') return false;
      if (filtre === 'PRISE' && !['TRANSMISE_SIEGE', 'PARTIELLEMENT_DISPERSEE', 'PARTIELLEMENT_ARCHIVEE'].includes(commande.statut)) return false;
      if (filtre === 'DISPERSEE' && commande.statut !== 'DISPERSEE') return false;
      if (!q) return true;
      const texte = [
        commande.numero_commande,
        commande.demandeur_nom,
        commande.demandeur_role,
        commande.partenaire_nom,
        commande.antenne?.nom,
        commande.antenne?.chef_lieu,
        commande.motif,
        commande.transferee_au_siege_par_nom,
        commande.prise_en_charge_siege_par_nom,
        commande.partenaire_type,
        commande.note_dispersion,
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

  const commandeDetail = commandes.find((commande) => commande.id === ligneOuverte) || null;

  function compteFiltre(id) {
    if (id === 'tous') return commandes.length;
    if (id === 'REJETEE') return commandes.filter((c) => String(c.statut || '').startsWith('REJETEE')).length;
    if (id === 'RECUE') return commandes.filter((c) => STATUTS_A_TRANSFERER.includes(c.statut)).length;
    if (id === 'SIEGE') return commandes.filter((c) => STATUTS_AU_SIEGE.includes(c.statut)).length;
    if (id === 'EN_ATTENTE') return commandes.filter((c) => c.statut === 'TRANSFEREE_SIEGE').length;
    if (id === 'RELIQUAT') return commandes.filter((c) => c.statut === 'PARTIELLEMENT_ARCHIVEE').length;
    if (id === 'SATISFAITE' || id === 'DISPERSEE') return commandes.filter((c) => c.statut === 'DISPERSEE').length;
    if (id === 'PRISE') return commandes.filter((c) => ['TRANSMISE_SIEGE', 'PARTIELLEMENT_DISPERSEE', 'PARTIELLEMENT_ARCHIVEE'].includes(c.statut)).length;
    return commandes.filter((c) => c.statut === id).length;
  }

  function actionsCommande(commande) {
    const lignes = commande.lignes || [];
    const aTransferer = peutTransferer && STATUTS_A_TRANSFERER.includes(commande.statut);
    const aPrendre = peutPrendreCharge
      && STATUTS_PRISE_SIEGE.includes(commande.statut)
      && lignes.some((row) => reliquatLigne(row) > 0);
    const aDisperser = peutDisperser
      && STATUTS_PRISE_SIEGE.includes(commande.statut)
      && lignes.some((row) => resteDispersionLigne(row) > 0);
    const aRejeter = aTransferer || aPrendre || (peutDisperser && STATUTS_AU_SIEGE.includes(commande.statut) && !String(commande.statut).startsWith('REJETEE'));
    return { aTransferer, aPrendre, aDisperser, aRejeter };
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {error && !modalOuvert && !modalAction && <p className="shrink-0 mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}

      <section className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="shrink-0 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900">{titreMenu}</h1>
              <button type="button" onClick={() => setAideOuverte(true)} className="w-6 h-6 rounded-full border border-slate-300 text-[#2E68B4] inline-flex items-center justify-center" title="Explications" aria-label="Explications">
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {commandesVisibles.length} affichée{commandesVisibles.length > 1 ? 's' : ''} sur {commandes.length}
              {estChefAntenne ? ' — demandes des partenaires de votre antenne uniquement' : ''}
              {(estDirectionGenerale || estSupervision) && estVueSiege ? ' — année, mois, antenne qui a transféré, puis demandeur' : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(estVueSiege
              ? [
                ['Commandes', compteurs.total],
                ['En attente', compteurs.en_attente],
                ['Reliquats', compteurs.reliquats],
                ['Satisfaites', compteurs.satisfaites],
              ]
              : [
                ['Commandes', compteurs.total],
                ['À transférer', compteurs.recues],
                ['Transférées', compteurs.transferees ?? compteurs.transmises],
                ['Satisfaites', compteurs.dispersees],
              ]
            ).map(([label, value]) => (
              <div key={label} className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50">
                <p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">{label}</p>
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 mt-1 animate-spin text-[#2E68B4]" />
                ) : (
                  <p className="text-sm font-black text-slate-900 leading-tight">{value ?? 0}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => load()} disabled={loading} className="w-8 h-8 inline-flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50" title="Actualiser les commandes" aria-label="Actualiser les commandes">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {peutCommander && (
              <button type="button" onClick={ouvrirDemande} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">
                <Plus className="w-3.5 h-3.5" />
                {estDemandeur || estChefAntenne ? 'Nouvelle demande' : 'Nouvelle commande'}
              </button>
            )}
          </div>
        </div>

        <div className="shrink-0 px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
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

        <div className="flex-1 min-h-0 overflow-auto">
          {estVueSiege && !loading && groupees.length > 0 && filtre === 'tous' && !recherche.trim() ? (
            <div className="p-3 space-y-2">
              <p className="text-[11px] text-slate-500 px-1">
                Centralisation du siège : année, puis mois. À l’intérieur, l’antenne qui a transféré, puis le demandeur — ou l’antenne elle-même si c’est elle qui a commandé.
              </p>
              {groupees.map((anneeBloc) => {
                const anOuverte = anneeOuverte === anneeBloc.annee;
                return (
                  <div key={anneeBloc.annee} className="border border-slate-200 rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setAnneeOuverte(anOuverte ? null : anneeBloc.annee);
                        setMoisOuvert(null);
                        setAntenneOuverte(null);
                        setOrigineOuverte(null);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-[#0E2A4F] text-white text-left"
                    >
                      <span className="text-sm font-black">{anneeBloc.annee}</span>
                      <span className="text-[11px] font-semibold">{anneeBloc.nb_commandes} commande{anneeBloc.nb_commandes > 1 ? 's' : ''}</span>
                    </button>
                    {anOuverte && (anneeBloc.mois || []).map((moisBloc) => {
                      const mKey = `${anneeBloc.annee}-${moisBloc.mois}`;
                      const mOuvert = moisOuvert === mKey;
                      return (
                        <div key={moisBloc.mois} className="border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              setMoisOuvert(mOuvert ? null : mKey);
                              setAntenneOuverte(null);
                              setOrigineOuverte(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100"
                          >
                            {moisBloc.libelle} {anneeBloc.annee} — {moisBloc.nb_commandes} commande{moisBloc.nb_commandes > 1 ? 's' : ''}
                          </button>
                          {mOuvert && (moisBloc.antennes || []).map((antenne) => {
                            const aKey = `${mKey}-${antenne.antenne_id}`;
                            const aOuverte = antenneOuverte === aKey;
                            const transferes = (antenne.transferee_par || []).filter(Boolean);
                            return (
                              <div key={antenne.antenne_id} className="border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAntenneOuverte(aOuverte ? null : aKey);
                                    setOrigineOuverte(null);
                                  }}
                                  className="w-full flex flex-wrap items-center justify-between gap-2 px-5 py-2 text-left hover:bg-blue-50/40"
                                >
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{antenne.antenne_nom}{antenne.chef_lieu ? ` — ${antenne.chef_lieu}` : ''}</p>
                                    <p className="text-[10px] text-amber-800">
                                      Transférée par {transferes.length ? transferes.join(', ') : '—'}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">{antenne.en_attente} en attente</span>
                                    <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-800 border border-violet-200">{antenne.reliquats} reliquat{antenne.reliquats > 1 ? 's' : ''}</span>
                                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">{antenne.satisfaites} satisfaite{antenne.satisfaites > 1 ? 's' : ''}</span>
                                  </div>
                                </button>
                                {aOuverte && (antenne.origines || []).map((origine) => {
                                  const oKey = `${aKey}-${origine.cle}`;
                                  const oOuverte = origineOuverte === oKey;
                                  const parAntenne = origine.type === 'antenne';
                                  return (
                                    <div key={origine.cle} className="border-t border-slate-50">
                                      <button
                                        type="button"
                                        onClick={() => setOrigineOuverte(oOuverte ? null : oKey)}
                                        className="w-full px-7 py-1.5 text-left text-[11px] hover:bg-slate-50"
                                      >
                                        <span className={`font-bold ${parAntenne ? 'text-indigo-800' : 'text-slate-800'}`}>
                                          {parAntenne ? 'Demande de l’antenne elle-même' : origine.nom}
                                        </span>
                                        <span className="text-slate-500"> — {origine.nb_commandes} commande{origine.nb_commandes > 1 ? 's' : ''}</span>
                                        {!parAntenne && origine.role && <span className="block text-[10px] text-slate-500">{origine.role}{origine.partenaire_nom ? ` · ${origine.partenaire_nom}` : ''}</span>}
                                        {parAntenne && <span className="block text-[10px] text-indigo-700">{origine.nom}</span>}
                                      </button>
                                      {oOuverte && (
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
                                            <tr>
                                              <th className="px-3 py-1.5">N°</th>
                                              <th className="px-3 py-1.5">Transféré par</th>
                                              <th className="px-3 py-1.5">Quantités</th>
                                              <th className="px-3 py-1.5">Statut</th>
                                              <th className="px-3 py-1.5">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(origine.commandes || []).map((commande) => {
                                              const q = commande.quantites || suiviQuantites(commande);
                                              const act = actionsCommande(commande);
                                              return (
                                                <tr key={commande.id} className="border-t border-slate-100">
                                                  <td className="px-3 py-2 font-bold whitespace-nowrap">{commande.numero_commande}</td>
                                                  <td className="px-3 py-2">
                                                    <p>{commande.transferee_au_siege_par_nom || '—'}</p>
                                                    <p className="text-[10px] text-slate-500">{formaterDate(commande.transferee_au_siege_at)}</p>
                                                  </td>
                                                  <td className="px-3 py-2 whitespace-nowrap">
                                                    <p>Dem. {q.demandee ?? q.demande}</p>
                                                    <p className="text-emerald-800">Pris {q.prise ?? q.pris}</p>
                                                    <p className="text-violet-800">Rel. {q.reliquat ?? q.archive}</p>
                                                  </td>
                                                  <td className="px-3 py-2">
                                                    <span className={`inline-flex px-2 py-0.5 rounded border font-bold ${STATUT_STYLE[commande.statut] || ''}`}>
                                                      {STATUTS[commande.statut] || commande.statut}
                                                    </span>
                                                  </td>
                                                  <td className="px-3 py-2">
                                                    <div className="flex flex-wrap gap-1">
                                                      <BoutonVoir titre="Voir le détail" onClick={() => setLigneOuverte(commande.id)} />
                                                      {act.aPrendre && (
                                                        <button type="button" onClick={() => ouvrirAction('prise', commande)} className="px-2 py-1 font-bold rounded bg-[#2E68B4] text-white">Prendre en charge</button>
                                                      )}
                                                      {act.aDisperser && (
                                                        <button type="button" onClick={() => ouvrirAction('dispersion', commande)} className="px-2 py-1 font-bold rounded bg-[#0E2A4F] text-white">Disperser</button>
                                                      )}
                                                    </div>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {commandes.some((c) => ![...STATUTS_AU_SIEGE, 'REJETEE_SIEGE'].includes(c.statut)) && (
                <div className="border border-dashed border-slate-300 rounded-md p-3">
                  <p className="text-[11px] font-bold text-slate-700 mb-2">Encore à l’antenne — pas encore transférées au siège</p>
                  <ul className="space-y-1">
                    {commandes.filter((c) => ![...STATUTS_AU_SIEGE, 'REJETEE_SIEGE'].includes(c.statut)).map((commande) => (
                      <li key={commande.id} className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span>
                          <span className="font-bold">{commande.numero_commande}</span>
                          {' · '}{commande.antenne?.nom || 'Antenne'}
                          {' · '}{commande.initiee_par_antenne || commande.partenaire_type === 'ANTENNE' ? 'Demande de l’antenne' : commande.demandeur_nom}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded border font-bold ${STATUT_STYLE[commande.statut] || ''}`}>
                          {STATUTS[commande.statut] || commande.statut}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-bold">N° commande</th>
                <th className="px-3 py-2 font-bold">Initié par</th>
                <th className="px-3 py-2 font-bold">Partenaire</th>
                <th className="px-3 py-2 font-bold">Antenne</th>
                <th className="px-3 py-2 font-bold">Médicaments</th>
                <th className="px-3 py-2 font-bold">Quantités</th>
                <th className="px-3 py-2 font-bold">Statut</th>
                <th className="px-3 py-2 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <LigneChargementTableau colonnes={8} libelle="Chargement des commandes…" />}
              {!loading && commandesVisibles.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                    {commandes.length === 0
                      ? (estDemandeur ? 'Aucune demande enregistrée. Utilisez Nouvelle demande pour commander auprès de votre antenne.' : 'Aucune commande pour ce profil.')
                      : 'Aucune commande ne correspond à cette recherche.'}
                  </td>
                </tr>
              )}
              {!loading && commandesPage.map((commande) => {
                const lignes = commande.lignes || [];
                const suivi = commande.quantites || suiviQuantites(commande);
                const act = actionsCommande(commande);
                return (
                  <tr key={commande.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="px-3 py-2.5 font-bold text-slate-900 whitespace-nowrap">{commande.numero_commande}</td>
                    <td className="px-3 py-2.5 text-slate-700">
                      <p>{commande.demandeur_nom}</p>
                      {commande.demandeur_role && <p className="text-[10px] text-slate-500">{commande.demandeur_role}</p>}
                      {commande.transferee_au_siege_par_nom && (
                        <p className="text-[10px] text-amber-700 mt-0.5">Transférée par {commande.transferee_au_siege_par_nom}</p>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">
                      <p>{commande.partenaire_nom}</p>
                      {commande.partenaire_type === 'ANTENNE' && (
                        <p className="text-[10px] text-indigo-600 font-semibold">Demande chef d&apos;antenne</p>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">
                      {commande.antenne?.nom || commande.antenne_id}
                      {commande.antenne?.chef_lieu ? ` — ${commande.antenne.chef_lieu}` : ''}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 max-w-[220px]">
                      {lignes.map((row) => `${row.designation} (${row.quantite_demandee})`).join(', ') || '—'}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-700">
                      <p>Dem. <span className="font-semibold">{suivi.demandee ?? suivi.demande}</span></p>
                      <p>Pris <span className="font-semibold text-emerald-800">{suivi.prise ?? suivi.pris}</span></p>
                      <p>Rel. <span className="font-semibold text-violet-800">{suivi.reliquat ?? suivi.archive}</span></p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 rounded border font-bold ${STATUT_STYLE[commande.statut] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {STATUTS[commande.statut] || commande.statut}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        <BoutonVoir titre="Voir le détail" onClick={() => setLigneOuverte(commande.id)} />
                        {peutSupprimer && (
                          <BoutonSupprimer titre="Supprimer la commande" onClick={() => supprimerCommande(commande)} />
                        )}
                        {act.aTransferer && (
                          <button
                            type="button"
                            disabled={transfertEnCours === commande.id}
                            onClick={() => transfererAuSiege(commande)}
                            className="px-2 py-1 font-bold rounded bg-amber-600 text-white disabled:opacity-60"
                          >
                            {transfertEnCours === commande.id ? 'Transfert…' : 'Transférer au siège'}
                          </button>
                        )}
                        {act.aPrendre && (
                          <button type="button" onClick={() => ouvrirAction('prise', commande)} className="px-2 py-1 font-bold rounded bg-[#2E68B4] text-white">Prendre en charge</button>
                        )}
                        {act.aDisperser && (
                          <button type="button" onClick={() => ouvrirAction('dispersion', commande)} className="px-2 py-1 font-bold rounded bg-[#0E2A4F] text-white">Disperser</button>
                        )}
                        {act.aRejeter && (
                          <button type="button" onClick={() => rejeter(commande)} className="px-2 py-1 font-bold rounded border border-rose-300 text-rose-700">Rejeter</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>

        <div className="shrink-0 px-4 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
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

      {commandeDetail && (
        <div className="fixed inset-0 z-[85] bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={() => setLigneOuverte(null)}>
          <div onMouseDown={(evenement) => evenement.stopPropagation()} className="w-full max-w-3xl bg-white border border-slate-200 rounded-md p-4 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Détail — {commandeDetail.numero_commande}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex px-2 py-0.5 rounded border text-[11px] font-bold ${STATUT_STYLE[commandeDetail.statut] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {STATUTS[commandeDetail.statut] || commandeDetail.statut}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {suiviQuantites(commandeDetail).pris} pris en charge · {suiviQuantites(commandeDetail).archive} archivé{suiviQuantites(commandeDetail).archive > 1 ? 's' : ''}, en attente du prochain arrivage
                  </span>
                </p>
              </div>
              <button type="button" onClick={() => setLigneOuverte(null)} className="p-1 rounded text-slate-500 hover:bg-slate-100" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <ChampDetail libelle="N° demande" valeur={commandeDetail.numero_commande} />
              <ChampDetail libelle="Initiée par" valeur={commandeDetail.demandeur_nom} />
              <ChampDetail libelle="Fonction" valeur={commandeDetail.demandeur_role} />
              <ChampDetail libelle="Partenaire / structure" valeur={commandeDetail.partenaire_nom} />
              <ChampDetail libelle="Type" valeur={commandeDetail.partenaire_type} />
              <ChampDetail libelle="Antenne" valeur={[commandeDetail.antenne?.nom, commandeDetail.antenne?.chef_lieu].filter(Boolean).join(' — ')} />
              <ChampDetail libelle="Montant" valeur={formaterMontant(commandeDetail.montant_total_xaf)} />
              <ChampDetail libelle="Enregistrée le" valeur={formaterDate(commandeDetail.created_at)} />
              <ChampDetail
                libelle="Transférée au siège"
                valeur={commandeDetail.transferee_au_siege_at
                  ? `${formaterDate(commandeDetail.transferee_au_siege_at)}${commandeDetail.transferee_au_siege_par_nom ? ` par ${commandeDetail.transferee_au_siege_par_nom}` : ''}`
                  : ''}
              />
              <ChampDetail
                libelle="Prise en charge siège"
                valeur={commandeDetail.prise_en_charge_siege_at
                  ? `${formaterDate(commandeDetail.prise_en_charge_siege_at)}${commandeDetail.prise_en_charge_siege_par_nom ? ` par ${commandeDetail.prise_en_charge_siege_par_nom}` : ''}`
                  : ''}
              />
              <ChampDetail libelle="Dispersée le" valeur={commandeDetail.dispersee_at ? `${formaterDate(commandeDetail.dispersee_at)}${commandeDetail.dispersee_par_nom ? ` par ${commandeDetail.dispersee_par_nom}` : ''}` : ''} />
              <ChampDetail
                libelle="Quantités"
                valeur={`Demandée ${commandeDetail.quantites?.demandee ?? suiviQuantites(commandeDetail).demande} · Prise ${commandeDetail.quantites?.prise ?? suiviQuantites(commandeDetail).pris} · Reliquat ${commandeDetail.quantites?.reliquat ?? suiviQuantites(commandeDetail).archive} · Dispersée ${commandeDetail.quantites?.dispersee ?? 0}`}
                large
              />
              <ChampDetail libelle="Motif" valeur={commandeDetail.motif} large />
              <ChampDetail libelle="Note de dispersion" valeur={commandeDetail.note_dispersion} large />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Médicaments</p>
              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-2 py-1.5 font-bold">Désignation</th>
                      <th className="px-2 py-1.5 font-bold">Demandé</th>
                      <th className="px-2 py-1.5 font-bold">Pris en charge</th>
                      <th className="px-2 py-1.5 font-bold">Archivé</th>
                      <th className="px-2 py-1.5 font-bold">Dispersé</th>
                      <th className="px-2 py-1.5 font-bold">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(commandeDetail.lignes || []).map((row) => (
                      <tr key={row.id} className="border-t border-slate-100">
                        <td className="px-2 py-1.5 font-semibold text-slate-800">{row.designation}</td>
                        <td className="px-2 py-1.5">{row.quantite_demandee}</td>
                        <td className="px-2 py-1.5">{row.quantite_prise_en_charge || 0}</td>
                        <td className="px-2 py-1.5">{reliquatLigne(row)}</td>
                        <td className="px-2 py-1.5">{row.quantite_dispersee || 0}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">{formaterMontant(row.prix_unitaire_xaf)}</td>
                      </tr>
                    ))}
                    {(commandeDetail.lignes || []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-2 py-3 text-center text-slate-500">Aucun médicament</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {commandeDetail.journal?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Journal</p>
                <ol className="border-l border-slate-200 pl-3 space-y-1.5">
                  {commandeDetail.journal.map((evt) => (
                    <li key={evt.id} className="text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">{ACTIONS[evt.action] || evt.action}</span>
                      {' '}par {evt.auteur_nom}
                      {evt.created_at ? ` · ${formaterDate(evt.created_at)}` : ''}
                      {evt.detail ? ` — ${evt.detail}` : ''}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="flex justify-end">
              <button type="button" onClick={() => setLigneOuverte(null)} className="px-3 py-2 text-xs font-bold rounded border border-slate-300 text-slate-700">Fermer</button>
            </div>
          </div>
        </div>
      )}

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

      {modalAction && (
        <div className="fixed inset-0 z-[85] bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={() => !savingAction && setModalAction(null)}>
          <div onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white border border-slate-200 rounded-md p-4 space-y-3 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {modalAction.type === 'prise' ? 'Prise en charge' : 'Dispersion'} — {modalAction.commande.numero_commande}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {modalAction.type === 'prise'
                    ? 'Indiquez la quantité à engager maintenant. Le reste est archivé et pourra être pris en charge au prochain arrivage.'
                    : 'Dispersez tout ou une partie des quantités déjà prises en charge. Le solde pourra être traité plus tard.'}
                </p>
              </div>
              <button type="button" disabled={savingAction} onClick={() => setModalAction(null)} className="p-1 rounded text-slate-500 hover:bg-slate-100" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={toutPrendreAction} className="px-2.5 py-1 text-[11px] font-bold rounded border border-[#2E68B4] text-[#2E68B4]">
                Tout sélectionner
              </button>
              <button type="button" onClick={toutZeroAction} className="px-2.5 py-1 text-[11px] font-bold rounded border border-slate-300 text-slate-600">
                Tout à zéro
              </button>
            </div>
            <ul className="border border-slate-200 rounded divide-y divide-slate-100">
              {(modalAction.commande.lignes || []).map((row) => {
                const max = modalAction.type === 'prise' ? reliquatLigne(row) : resteDispersionLigne(row);
                const disabled = max <= 0;
                return (
                  <li key={row.id} className={`flex flex-wrap items-center gap-3 px-3 py-2.5 ${disabled ? 'bg-slate-50 opacity-70' : ''}`}>
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-xs font-semibold text-slate-800">{row.designation}</p>
                      <p className="text-[10px] text-slate-500">
                        Demandé {row.quantite_demandee}
                        {' · '}pris {row.quantite_prise_en_charge || 0}
                        {' · '}reliquat {reliquatLigne(row)}
                        {' · '}dispersé {row.quantite_dispersee || 0}
                        {disabled ? ' — rien à traiter' : ` — max cette vague : ${max}`}
                      </p>
                    </div>
                    <label className="flex items-center gap-1.5 shrink-0 text-[10px] text-slate-500">
                      Qté maintenant
                      <input
                        type="number"
                        min="0"
                        max={max}
                        disabled={disabled || savingAction}
                        value={quantitesAction[row.id] ?? 0}
                        onChange={(e) => majQuantiteAction(row.id, max, e.target.value)}
                        className="w-20 border border-slate-200 rounded px-2 py-1 text-xs text-center bg-white disabled:bg-slate-100"
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
            <label className="block text-xs text-slate-600">
              Note (optionnel)
              <input
                value={noteAction}
                onChange={(e) => setNoteAction(e.target.value)}
                disabled={savingAction}
                placeholder={modalAction.type === 'prise' ? 'Ex. stock partiel, reste à l\'arrivage prévu' : 'Ex. dispersion selon stock Owendo'}
                className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm"
              />
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" disabled={savingAction} onClick={() => setModalAction(null)} className="px-3 py-2 text-xs font-bold rounded border border-slate-300 text-slate-700">Annuler</button>
              <button type="button" disabled={savingAction} onClick={confirmerAction} className="px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">
                {savingAction ? 'Enregistrement…' : (modalAction.type === 'prise' ? 'Confirmer la prise en charge' : 'Confirmer la dispersion')}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOuvert && (
        <div className="fixed inset-0 z-[80] bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={() => setModalOuvert(false)}>
          <form onSubmit={envoyerCommande} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white border border-slate-200 rounded-md p-4 space-y-3 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">
                {estChefAntenne ? 'Nouvelle demande (chef d\'antenne)' : (estDemandeur ? 'Nouvelle demande' : 'Nouvelle commande')}
              </h2>
              <button type="button" onClick={() => setModalOuvert(false)} className="p-1 rounded text-slate-500 hover:bg-slate-100" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            {estChefAntenne && (
              <p className="text-[11px] text-indigo-800 bg-indigo-50 border border-indigo-100 rounded px-3 py-2">
                Cette demande sera enregistrée à votre nom. Vous continuez à voir toutes les demandes des pharmacies de votre antenne.
              </p>
            )}
            {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-slate-600">
                Qui commande
                <input value={activePersona?.nom || activePersona?.name || ''} readOnly className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-slate-50" />
              </label>
              <label className="text-xs text-slate-600">
                {estChefAntenne ? 'Demande au nom de' : (estDemandeur ? 'Structure' : 'Pharmacie ou partenaire')}
                <input
                  value={estChefAntenne ? nomChef : partenaire}
                  onChange={(e) => setPartenaire(e.target.value)}
                  readOnly={estDemandeur || estChefAntenne || antenneVerrouillee}
                  className={`mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm ${(estDemandeur || estChefAntenne || antenneVerrouillee) ? 'bg-slate-50' : ''}`}
                  required
                  placeholder="Nom de la pharmacie"
                />
              </label>
              <label className="text-xs text-slate-600 md:col-span-2">
                Antenne
                {antenneVerrouillee ? (
                  <input value={libelleAntenneDefaut || (antenneChoisie ? `${antenneChoisie.nom} — ${antenneChoisie.chef_lieu}` : '')} readOnly className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-slate-50" />
                ) : (
                  <ListeDeroulante
                    valeur={antenneId}
                    surChangement={setAntenneId}
                    texteVide="Choisir une antenne"
                    options={antennes.map((a) => ({ value: a.id, label: `${a.nom} — ${a.chef_lieu}` }))}
                  />
                )}
              </label>
            </div>
            <label className="text-xs text-slate-600 block">
              Motif
              <input value={motif} onChange={(e) => setMotif(e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
            </label>
            {/* ── Sélection multi-médicaments ── */}
            {(() => {
              const termeMed = rechercheMed.trim().toLowerCase();
              const produitsFiltres = produits.filter((p) =>
                !termeMed || p.designation.toLowerCase().includes(termeMed)
              );
              const nbSelectionnes = Object.keys(selections).length;
              return (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-600 font-semibold">
                      Médicaments
                      {nbSelectionnes > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-[#2E68B4] text-white text-[10px] font-bold">
                          {nbSelectionnes} sélectionné{nbSelectionnes > 1 ? 's' : ''}
                        </span>
                      )}
                    </p>
                    {nbSelectionnes > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelections({})}
                        className="text-[10px] text-rose-600 hover:underline"
                      >
                        Tout déselectionner
                      </button>
                    )}
                  </div>
                  {/* Barre de recherche */}
                  <label className="relative block">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      value={rechercheMed}
                      onChange={(e) => setRechercheMed(e.target.value)}
                      placeholder="Rechercher un médicament…"
                      className="w-full border border-slate-200 rounded pl-8 pr-2 py-1.5 text-sm"
                    />
                  </label>
                  {/* Liste scrollable */}
                  <div className="border border-slate-200 rounded overflow-y-auto" style={{ maxHeight: 240 }}>
                    {produitsFiltres.length === 0 && (
                      <p className="px-3 py-4 text-center text-xs text-slate-500">Aucun médicament trouvé.</p>
                    )}
                    {produitsFiltres.map((p) => {
                      const estCoche = selections[p.id] !== undefined;
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-b border-slate-100 last:border-0 hover:bg-blue-50/60 transition-colors ${estCoche ? 'bg-blue-50' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={estCoche}
                            onChange={() => toggleSelection(p.id)}
                            className="w-4 h-4 rounded accent-[#2E68B4] shrink-0"
                          />
                          <span className={`flex-1 text-xs truncate ${estCoche ? 'font-semibold text-[#2E68B4]' : 'text-slate-800'}`}>
                            {p.designation}
                          </span>
                          {estCoche && (
                            <label className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap">Qté</span>
                              <input
                                type="number"
                                min="1"
                                value={selections[p.id]}
                                onChange={(e) => majQuantite(p.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-16 border border-[#2E68B4] rounded px-1.5 py-0.5 text-xs text-center bg-white"
                              />
                            </label>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {/* Récapitulatif des sélectionnés */}
                  {nbSelectionnes > 0 && (
                    <ul className="text-[11px] text-slate-600 space-y-0.5 pt-1 pl-1">
                      {Object.entries(selections).map(([pid, qte]) => {
                        const p = produits.find((prod) => String(prod.id) === String(pid));
                        return (
                          <li key={pid} className="flex items-center gap-1">
                            <span className="text-[#2E68B4]">✓</span>
                            <span className="truncate">{p?.designation || pid}</span>
                            <span className="ml-auto shrink-0 font-semibold">× {qte}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setModalOuvert(false)} className="px-3 py-2 text-xs font-bold rounded border border-slate-300 text-slate-700">Annuler</button>
              <button disabled={saving} className="px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">{saving ? 'Envoi…' : 'Enregistrer la demande'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
