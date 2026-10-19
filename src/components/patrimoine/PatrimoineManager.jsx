import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import { askConfirm, pushToast } from '../../services/toastBus';
import { droitModule, libelleDroits } from '../../data/rbacMatrix';

const ETATS = ['NEUF', 'BON', 'USAGE', 'DEGRADE', 'HORS_SERVICE'];

const VIDE = {
  designation: '',
  categorie_id: '',
  description: '',
  valeur_acquisition: '',
  date_acquisition: '',
  amortissement_id: '',
  etat: 'BON',
  antenne_id: '',
  detenteur_id: '',
  date_remise: '',
  observations: '',
};

function money(value) {
  return `${Number(value || 0).toLocaleString('fr-FR')} F`;
}

export default function PatrimoineManager({ activePersona }) {
  const peutCreer = droitModule(activePersona, 'patrimoine', 'creer');
  const peutModifier = droitModule(activePersona, 'patrimoine', 'modifier');
  const [biens, setBiens] = useState([]);
  const [antennes, setAntennes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amortissements, setAmortissements] = useState([]);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState(VIDE);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [remise, setRemise] = useState({});

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      const [pat, ants] = await Promise.all([
        apiRequest('/patrimoine'),
        apiRequest('/antennes'),
      ]);
      setBiens(pat.biens || []);
      setAntennes(ants.antennes || []);
      setCategories(pat.categories || []);
      setAmortissements(pat.amortissements || []);
      setAgents(pat.agents || []);
    } catch (err) {
      if (!silent) setError(err?.backendUnavailable ? '' : (err.message || 'Impossible de charger le patrimoine.'));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => load(true), 8000);
    return () => window.clearInterval(timer);
  }, [load]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function enregistrer(event) {
    event.preventDefault();
    setError('');
    try {
      await apiRequest('/patrimoine', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          categorie_id: Number(form.categorie_id),
          amortissement_id: Number(form.amortissement_id),
          antenne_id: form.antenne_id ? Number(form.antenne_id) : null,
          detenteur_id: form.detenteur_id ? Number(form.detenteur_id) : null,
          valeur_acquisition: Number(form.valeur_acquisition),
          date_remise: form.date_remise || null,
        }),
      });
      setForm(VIDE);
      await load();
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    }
  }

  async function changerEtat(bien, etat) {
    setError('');
    try {
      await apiRequest(`/patrimoine/${bien.id}`, {
        method: 'PUT',
        body: JSON.stringify({ etat }),
      });
      await load(true);
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    }
  }

  async function remettre(bien) {
    const data = remise[bien.id] || {};
    if (!data.detenteur_id || !data.date_remise) {
      setError('Indiquez le détenteur et la date de remise.');
      return;
    }
    const ok = await askConfirm({
      message: `Confirmer la remise du bien « ${bien.designation} » ?`,
      confirmLabel: 'Remettre',
    });
    if (!ok) return;
    setError('');
    try {
      await apiRequest(`/patrimoine/${bien.id}/remettre`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      pushToast(`Remise de « ${bien.designation} » enregistrée.`);
      await load();
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    }
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E68B4]">Biens de l'OPN</p>
        <h1 className="text-xl font-black text-slate-900">Gestion du patrimoine</h1>
        <p className="text-sm text-slate-600 mt-1">Médicaments, mobilier, outils et équipements : détenteur, état et amortissement linéaire.</p>
        <p className="text-xs text-slate-500 mt-1">Droits sur cette page : {libelleDroits(activePersona, 'patrimoine')}.</p>
      </div>

      {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}

      {peutCreer && <form onSubmit={enregistrer} className="bg-white border border-slate-200 rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs text-slate-600">Désignation
          <input required value={form.designation} onChange={(e) => setField('designation', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs text-slate-600">Catégorie
          <select required value={form.categorie_id} onChange={(e) => setField('categorie_id', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm">
            <option value="">Choisir</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.libelle}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-600">État
          <select value={form.etat} onChange={(e) => setField('etat', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm">
            {ETATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-600">Valeur d'acquisition (F)
          <input required type="number" min="0" value={form.valeur_acquisition} onChange={(e) => setField('valeur_acquisition', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs text-slate-600">Date d'acquisition
          <input required type="date" value={form.date_acquisition} onChange={(e) => setField('date_acquisition', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs text-slate-600">Plan d'amortissement
          <select required value={form.amortissement_id} onChange={(e) => setField('amortissement_id', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm">
            <option value="">Choisir</option>
            {amortissements.map((plan) => <option key={plan.id} value={plan.id}>{plan.libelle}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-600">Antenne
          <select value={form.antenne_id} onChange={(e) => setField('antenne_id', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm">
            <option value="">Siège</option>
            {antennes.map((a) => <option key={a.id} value={a.id}>{a.nom}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-600">Remis à
          <select value={form.detenteur_id} onChange={(e) => setField('detenteur_id', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm">
            <option value="">Non affecté</option>
            {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.nom}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-600">Date de remise
          <input type="date" value={form.date_remise} onChange={(e) => setField('date_remise', e.target.value)} className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm" />
        </label>
        <div className="md:col-span-3">
          <button className="px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">Enregistrer le bien</button>
        </div>
      </form>}

      {loading && <p className="text-sm text-slate-500">Chargement du patrimoine…</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {biens.map((bien) => (
          <article key={bien.id} className="bg-white border border-slate-200 rounded-md p-4 text-sm">
            <div className="flex justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900">{bien.designation}</p>
                <p className="text-xs text-slate-500">{bien.code_bien} · {bien.categorie?.libelle || '—'} · {bien.etat}</p>
              </div>
              <p className="text-xs font-bold text-slate-800">{money(bien.valeur_nette)}</p>
            </div>
            <p className="text-xs text-slate-600 mt-2">Acquisition {money(bien.valeur_acquisition)} · amorti {money(bien.amortissement_cumule)} sur {bien.amortissement?.duree_mois || 0} mois</p>
            <p className="text-xs text-slate-600">Lieu : {bien.antenne?.nom || bien.siege?.nom || 'Siège'}</p>
            <p className="text-xs text-slate-700 mt-1">Remis à : {bien.detenteur?.nom || 'non affecté'}{bien.date_remise ? ` le ${String(bien.date_remise).slice(0, 10)}` : ''}</p>
            {peutModifier && (
            <label className="text-xs text-slate-600 block mt-2">État du bien
              <select value={bien.etat} onChange={(e) => changerEtat(bien, e.target.value)} className="mt-1 border border-slate-200 rounded px-2 py-1 text-xs">
                {ETATS.map((etat) => <option key={etat}>{etat}</option>)}
              </select>
            </label>
            )}
            {peutModifier && <div className="flex flex-wrap gap-2 mt-3">
              <select
                value={remise[bien.id]?.detenteur_id || ''}
                onChange={(e) => setRemise((s) => ({ ...s, [bien.id]: { ...s[bien.id], detenteur_id: e.target.value } }))}
                className="border border-slate-200 rounded px-2 py-1 text-xs"
              >
                <option value="">Détenteur</option>
                {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.nom}</option>)}
              </select>
              <input
                type="date"
                value={remise[bien.id]?.date_remise || ''}
                onChange={(e) => setRemise((s) => ({ ...s, [bien.id]: { ...s[bien.id], date_remise: e.target.value } }))}
                className="border border-slate-200 rounded px-2 py-1 text-xs"
              />
              <button type="button" onClick={() => remettre(bien)} className="px-2 py-1 text-xs font-bold rounded border border-slate-300">Remettre</button>
            </div>}
          </article>
        ))}
      </div>
    </div>
  );
}
