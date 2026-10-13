import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/api';
import { getCodeRole, getFluxStage } from '../../data/rbacMatrix';

const STATUTS = {
  SOUMISE_ANTENNE: 'Reçue par l\'antenne',
  TRANSMISE_SIEGE: 'Transmise au siège',
  DISPERSEE: 'Dispersée par le siège',
  REJETEE_ANTENNE: 'Rejetée par l\'antenne',
  REJETEE_SIEGE: 'Rejetée par le siège',
};

const STEPS = [
  { id: 'commande', titre: '1. Commande', texte: 'La pharmacie ou le partenaire commande auprès de son antenne.' },
  { id: 'antenne', titre: '2. Antenne', texte: 'L\'antenne transmet la commande au siège.' },
  { id: 'siege', titre: '3. Siège', texte: 'Le siège disperse les quantités selon la commande.' },
];

function money(value) {
  return `${Number(value || 0).toLocaleString('fr-FR')} F`;
}

export default function FluxApprovisionnement({ activePersona }) {
  const role = getCodeRole(activePersona);
  const localStage = getFluxStage(role);
  const [stage, setStage] = useState(localStage);
  const [commandes, setCommandes] = useState([]);
  const [antennes, setAntennes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partenaire, setPartenaire] = useState(activePersona?.entite || activePersona?.nom || '');
  const [antenneId, setAntenneId] = useState('');
  const [motif, setMotif] = useState('');
  const [ligne, setLigne] = useState({ produit_id: '', quantite_demandee: 1 });
  const [brouillon, setBrouillon] = useState([]);
  const [dispersion, setDispersion] = useState({});

  const peutCommander = stage === 'commande' || stage === 'antenne' || stage === 'supervision';
  const peutTransmettre = stage === 'antenne' || stage === 'supervision';
  const peutDisperser = stage === 'siege' || stage === 'supervision';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [flux, ants, meds] = await Promise.all([
        apiRequest('/flux/commandes'),
        apiRequest('/antennes'),
        apiRequest('/pharmacy/produits'),
      ]);
      setStage(flux.stage || localStage);
      setCommandes(flux.commandes || []);
      setAntennes(ants.antennes || []);
      setProduits((meds.produits || []).slice(0, 80));
    } catch (err) {
      setError(err.message || 'Impossible de charger le flux.');
    } finally {
      setLoading(false);
    }
  }, [localStage]);

  useEffect(() => { load(); }, [load]);

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
        <h1 className="text-xl font-black text-slate-900">Chaîne d'approvisionnement</h1>
        <p className="text-sm text-slate-600 mt-1">
          L'OPN achète les médicaments. Chaque antenne reçoit les commandes de ses pharmacies, les transmet au siège, et le siège disperse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {STEPS.map((step) => (
          <div key={step.id} className={`rounded-md border p-3 ${stage === step.id || stage === 'supervision' ? 'border-[#2E68B4] bg-blue-50' : 'border-slate-200 bg-white'}`}>
            <p className="text-xs font-bold text-slate-900">{step.titre}</p>
            <p className="text-[11px] text-slate-600 mt-1">{step.texte}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}

      {peutCommander && (
        <form onSubmit={envoyerCommande} className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Nouvelle commande</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-xs text-slate-600">
              Qui commande
              <input value={partenaire} onChange={(e) => setPartenaire(e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" required />
            </label>
            <label className="text-xs text-slate-600">
              Antenne destinataire
              <select value={antenneId} onChange={(e) => setAntenneId(e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm">
                {antennes.map((a) => <option key={a.id} value={a.id}>{a.nom} — {a.chef_lieu}</option>)}
              </select>
            </label>
          </div>
          <label className="text-xs text-slate-600 block">
            Motif
            <input value={motif} onChange={(e) => setMotif(e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
          </label>
          <div className="flex flex-wrap gap-2 items-end">
            <label className="text-xs text-slate-600 flex-1 min-w-[220px]">
              Médicament
              <select value={ligne.produit_id} onChange={(e) => setLigne((s) => ({ ...s, produit_id: e.target.value }))} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm">
                <option value="">Choisir</option>
                {produits.map((p) => <option key={p.id} value={p.id}>{p.designation}</option>)}
              </select>
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
          <button disabled={saving} className="px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">{saving ? 'Envoi…' : 'Enregistrer la commande'}</button>
        </form>
      )}

      <div className="space-y-3">
        {loading && <p className="text-sm text-slate-500">Chargement des commandes…</p>}
        {!loading && commandes.length === 0 && <p className="text-sm text-slate-500">Aucune commande pour ce profil.</p>}
        {commandes.map((commande) => (
          <article key={commande.id} className="bg-white border border-slate-200 rounded-md p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">{commande.numero_commande}</p>
                <p className="text-xs text-slate-600">Commandé par {commande.demandeur_nom} · partenaire {commande.partenaire_nom}</p>
                <p className="text-xs text-slate-600">Antenne : {commande.antenne?.nom || commande.antenne_id}</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-700">{STATUTS[commande.statut] || commande.statut}</span>
            </div>
            <ul className="mt-3 text-xs text-slate-700 space-y-1">
              {commande.lignes?.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>{row.designation} — demandé {row.quantite_demandee}, dispersé {row.quantite_dispersee}</span>
                  {peutDisperser && commande.statut === 'TRANSMISE_SIEGE' && (
                    <input
                      type="number"
                      min="0"
                      max={row.quantite_demandee}
                      value={dispersion[row.id] ?? row.quantite_demandee}
                      onChange={(e) => setDispersion((s) => ({ ...s, [row.id]: e.target.value }))}
                      className="w-20 border border-slate-200 rounded px-2 py-1"
                    />
                  )}
                </li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-slate-800 mt-2">{money(commande.montant_total_xaf)}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {peutTransmettre && commande.statut === 'SOUMISE_ANTENNE' && (
                <>
                  <button type="button" onClick={() => action(`/flux/commandes/${commande.id}/transmettre`)} className="px-3 py-1.5 text-xs font-bold rounded bg-[#2E68B4] text-white">Transmettre au siège</button>
                  <button type="button" onClick={() => rejeter(commande)} className="px-3 py-1.5 text-xs font-bold rounded border border-rose-300 text-rose-700">Rejeter</button>
                </>
              )}
              {peutDisperser && commande.statut === 'TRANSMISE_SIEGE' && (
                <>
                  <button type="button" onClick={() => disperser(commande)} className="px-3 py-1.5 text-xs font-bold rounded bg-[#0E2A4F] text-white">Disperser</button>
                  <button type="button" onClick={() => rejeter(commande)} className="px-3 py-1.5 text-xs font-bold rounded border border-rose-300 text-rose-700">Rejeter</button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
