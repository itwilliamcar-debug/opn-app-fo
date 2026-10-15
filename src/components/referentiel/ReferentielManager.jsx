import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Info, Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { droit, libelleDroits } from '../../data/rbacMatrix';
import { LigneChargementTableau } from '../common/SpinnerPourcentage';

const VIDE = { ressource: '', colonnes: [], filtres: [], champs: [], rows: [], meta: null };
const TAILLES = [3, 5, 10, 15, 20, 30, 50];

function valeurOption(option) {
  return option && typeof option === 'object' ? String(option.value) : String(option);
}

function libelleOption(option) {
  if (option && typeof option === 'object') return option.label;
  if (option === '1') return 'Oui';
  if (option === '0') return 'Non';
  return option;
}

/**
 * Liste déroulante avec une recherche à l'intérieur du menu.
 * Sert aux filtres du tableau et aux champs Province, Ville et Responsable.
 * Si dependante est vrai et qu'aucune province n'est choisie, la liste reste fermée.
 */
function ListeDeroulante({ label, value, options, onChange, desactive = false, obligatoire = false, placeholder = 'Choisir', messageBloque = '' }) {
  const [ouvert, setOuvert] = useState(false);
  const [cherche, setCherche] = useState('');
  const [position, setPosition] = useState(null);
  const boutonRef = useRef(null);
  const panneauRef = useRef(null);
  const saisieRef = useRef(null);
  const bloque = desactive;

  useLayoutEffect(() => {
    if (!ouvert) return undefined;
    const placer = () => {
      const cadre = boutonRef.current?.getBoundingClientRect();
      if (!cadre) return;
      setPosition({ top: cadre.bottom + 4, left: cadre.left, width: Math.max(cadre.width, 220) });
    };
    placer();
    saisieRef.current?.focus();
    window.addEventListener('resize', placer);
    window.addEventListener('scroll', placer, true);
    return () => {
      window.removeEventListener('resize', placer);
      window.removeEventListener('scroll', placer, true);
    };
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert) return undefined;
    const fermerSiDehors = (event) => {
      if (boutonRef.current?.contains(event.target) || panneauRef.current?.contains(event.target)) return;
      setOuvert(false);
    };
    document.addEventListener('mousedown', fermerSiDehors);
    return () => document.removeEventListener('mousedown', fermerSiDehors);
  }, [ouvert]);

  const visibles = (options || []).filter((option) => libelleOption(option).toLowerCase().includes(cherche.trim().toLowerCase()));
  const choisi = value
    ? libelleOption((options || []).find((option) => valeurOption(option) === String(value)) || value)
    : (bloque && messageBloque ? messageBloque : placeholder);

  return (
    <div className="text-xs text-slate-600">
      {label && (
        <span>
          {label}
          {obligatoire ? ' *' : ''}
        </span>
      )}
      <button
        type="button"
        ref={boutonRef}
        disabled={bloque}
        onClick={() => {
          if (bloque) return;
          setOuvert((actuel) => !actuel);
          setCherche('');
        }}
        className={`mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-left flex items-center justify-between gap-2 ${bloque ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-800'}`}
      >
        <span className="truncate">{choisi}</span>
        <span className="text-[10px] text-slate-400">{ouvert ? '▴' : '▾'}</span>
      </button>
      {ouvert && !bloque && position && createPortal(
        <div
          ref={panneauRef}
          className="fixed z-[130] bg-white border border-slate-200 rounded shadow-xl p-1.5"
          style={{ top: position.top, left: position.left, width: position.width }}
        >
          <input
            ref={saisieRef}
            value={cherche}
            onChange={(e) => setCherche(e.target.value)}
            placeholder="Rechercher…"
            className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm mb-1"
          />
          <ul className="max-h-52 overflow-y-auto">
            <li>
              <button type="button" onClick={() => { onChange(''); setOuvert(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 rounded">{placeholder}</button>
            </li>
            {visibles.length === 0 && <li className="px-2 py-1.5 text-xs text-slate-500">Aucun résultat</li>}
            {visibles.map((option) => {
              const valeur = valeurOption(option);
              return (
                <li key={valeur}>
                  <button
                    type="button"
                    onClick={() => { onChange(valeur); setOuvert(false); }}
                    className={`w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 rounded ${String(value) === valeur ? 'bg-blue-50 font-semibold text-[#2E68B4]' : ''}`}
                  >
                    {libelleOption(option)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

function FiltreRecherche({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [cherche, setCherche] = useState('');
  const [pos, setPos] = useState(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 220) });
    };
    place();
    inputRef.current?.focus();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (event) => {
      if (buttonRef.current?.contains(event.target) || panelRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const visibles = options.filter((option) => libelleOption(option).toLowerCase().includes(cherche.trim().toLowerCase()));
  const choisi = value && value !== 'ALL'
    ? libelleOption(options.find((option) => valeurOption(option) === value) || value)
    : 'Tous';

  return (
    <div className="text-xs text-slate-600 min-w-[170px]">
      {label}
      <button
        type="button"
        ref={buttonRef}
        onClick={() => { setOpen((current) => !current); setCherche(''); }}
        className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm bg-white text-left flex items-center justify-between gap-2"
      >
        <span className="truncate">{choisi}</span>
        <span className="text-[10px] text-slate-400">{open ? '▴' : '▾'}</span>
      </button>
      {open && pos && createPortal(
        <div
          ref={panelRef}
          className="fixed z-[90] bg-white border border-slate-200 rounded shadow-xl p-1.5"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          <input
            ref={inputRef}
            value={cherche}
            onChange={(e) => setCherche(e.target.value)}
            placeholder="Rechercher…"
            className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm mb-1"
          />
          <ul className="max-h-52 overflow-y-auto">
            <li>
              <button type="button" onClick={() => { onChange('ALL'); setOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 rounded">Tous</button>
            </li>
            {visibles.length === 0 && <li className="px-2 py-1.5 text-xs text-slate-500">Aucun résultat</li>}
            {visibles.map((option) => {
              const valeur = valeurOption(option);
              return (
                <li key={valeur}>
                  <button
                    type="button"
                    onClick={() => { onChange(valeur); setOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 rounded ${value === valeur ? 'bg-blue-50 font-semibold text-[#2E68B4]' : ''}`}
                  >
                    {libelleOption(option)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function ReferentielManager({ activePersona }) {
  const peutCreer = droit(activePersona, 'referentiel', 'creer');
  const peutLire = droit(activePersona, 'referentiel', 'lire');
  const peutModifier = droit(activePersona, 'referentiel', 'modifier');
  const [ressources, setRessources] = useState([]);
  const [actif, setActif] = useState('medicaments');
  const [data, setData] = useState(VIDE);
  const [q, setQ] = useState('');
  const [filtres, setFiltres] = useState({});
  const [page, setPage] = useState(1);
  const [parPage, setParPage] = useState(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [aideOuverte, setAideOuverte] = useState(false);

  useEffect(() => {
    apiRequest('/referentiel')
      .then((res) => setRessources(res.ressources || []))
      .catch((err) => setError(err.message));
  }, []);

  const load = useCallback(async () => {
    if (!actif) return;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: String(page), per_page: String(parPage) });
    if (q.trim()) params.set('q', q.trim());
    Object.entries(filtres).forEach(([key, value]) => {
      if (value && value !== 'ALL') params.set(key, value);
    });
    try {
      const res = await apiRequest(`/referentiel/${actif}?${params.toString()}`);
      setData(res);
    } catch (err) {
      setError(err.message || 'Impossible de charger le référentiel.');
    } finally {
      setLoading(false);
    }
  }, [actif, q, filtres, page, parPage]);

  useEffect(() => {
    const timer = window.setTimeout(load, 250);
    return () => window.clearTimeout(timer);
  }, [load]);

  function ouvrirCreation() {
    const draft = {};
    (data.champs || []).forEach((champ) => { draft[champ.key] = ''; });
    setForm({ mode: 'create', values: draft });
  }

  function ouvrirFiche(row, mode) {
    const values = {};
    (data.champs || []).forEach((champ) => { values[champ.key] = row[champ.key] ?? ''; });
    if (values.password !== undefined) values.password = '';
    setForm({ mode, id: row.id, values });
  }

  async function enregistrer(event) {
    event.preventDefault();
    setError('');
    const manquant = (data.champs || []).find((champ) => champ.required && champ.key !== 'password' && !String(form.values[champ.key] || '').trim());
    if (manquant) {
      setError(manquant.dependsOn && !form.values[manquant.dependsOn]
        ? 'Choisissez d’abord une province, puis une ville.'
        : `Le champ « ${manquant.label} » est obligatoire.`);
      return;
    }
    const body = { ...form.values };
    if (form.mode === 'edit' && !body.password) delete body.password;
    try {
      await apiRequest(
        form.mode === 'create' ? `/referentiel/${actif}` : `/referentiel/${actif}/${form.id}`,
        { method: form.mode === 'create' ? 'POST' : 'PUT', body: JSON.stringify(body) }
      );
      setForm(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function supprimer(row) {
    if (!window.confirm('Supprimer cet élément du référentiel ?')) return;
    setError('');
    try {
      await apiRequest(`/referentiel/${actif}/${row.id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E68B4]">Données de base</p>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-slate-900">Référentiel</h1>
          <button type="button" onClick={() => setAideOuverte(true)} className="w-6 h-6 rounded-full border border-slate-300 text-[#2E68B4] inline-flex items-center justify-center" title="Explications" aria-label="Explications">
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {ressources.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => { setActif(item.key); setPage(1); setFiltres({}); setQ(''); }}
            className={`px-3 py-1.5 rounded text-xs font-bold border ${actif === item.key ? 'bg-[#0E2A4F] text-white border-[#0E2A4F]' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}

      <div className="bg-white border border-slate-200 rounded-md p-3 space-y-3">
        <div className="flex flex-wrap gap-2 items-end">
          <label className="text-xs text-slate-600 flex-1 min-w-[220px]">
            Recherche
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Nom, code, courriel…"
              className="mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm"
            />
          </label>
          {(data.filtres || []).map((filtre) => (
            <FiltreRecherche
              key={filtre.key}
              label={filtre.label}
              value={filtres[filtre.key] || 'ALL'}
              options={filtre.options}
              onChange={(value) => { setFiltres((prev) => ({ ...prev, [filtre.key]: value })); setPage(1); }}
            />
          ))}
          <button type="button" onClick={() => load()} disabled={loading} className="w-8 h-8 inline-flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50" title="Actualiser" aria-label="Actualiser">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {peutCreer && <button type="button" onClick={ouvrirCreation} className="px-3 py-1.5 text-xs font-bold rounded bg-[#00A651] text-white">Nouveau</button>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                {(data.colonnes || []).map((col) => <th key={col.key} className="py-2 pr-3 font-semibold">{col.label}</th>)}
                <th className="py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <LigneChargementTableau colonnes={(data.colonnes || []).length + 1} libelle="Chargement des données…" />}
              {!loading && (data.rows || []).length === 0 && <tr><td className="py-3 text-slate-500" colSpan={(data.colonnes || []).length + 1}>Aucun élément.</td></tr>}
              {(data.rows || []).map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  {(data.colonnes || []).map((col) => <td key={col.key} className="py-2 pr-3 text-slate-800">{row[col.key] ?? '—'}</td>)}
                  <td className="py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {peutLire && (
                        <button type="button" onClick={() => ouvrirFiche(row, 'view')} title="Voir" className="p-1.5 rounded text-slate-600 hover:bg-slate-100">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {peutModifier && (
                        <button type="button" onClick={() => ouvrirFiche(row, 'edit')} title="Modifier" className="p-1.5 rounded text-[#2E68B4] hover:bg-blue-50">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {peutModifier && (
                        <button type="button" onClick={() => supprimer(row)} title="Supprimer" className="p-1.5 rounded text-rose-700 hover:bg-rose-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <label className="flex items-center gap-2">
            Afficher
            <select
              value={parPage}
              onChange={(e) => { setParPage(Number(e.target.value)); setPage(1); }}
              className="border border-slate-200 rounded px-2 py-1 bg-white"
            >
              {TAILLES.map((taille) => <option key={taille} value={taille}>{taille}</option>)}
            </select>
            éléments
          </label>
          <span>{data.meta?.total ?? 0} au total</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-2 py-1 border border-slate-200 rounded disabled:opacity-40">Précédent</button>
            <span>{page} / {data.meta?.last_page || 1}</span>
            <button type="button" disabled={!data.meta || page >= data.meta.last_page} onClick={() => setPage((p) => p + 1)} className="px-2 py-1 border border-slate-200 rounded disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </div>

      {aideOuverte && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={() => setAideOuverte(false)}>
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg p-5" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">Référentiel</h2>
              <button type="button" onClick={() => setAideOuverte(false)} className="p-1 rounded text-slate-500 hover:bg-slate-100" aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mt-3">Création, modification et suppression des médicaments, directions, provinces, villes, antennes, agents, structures et fournisseurs.</p>
            <p className="text-sm text-slate-600 mt-2">Pour une antenne, la province se choisit en premier. La liste des villes reste fermée tant que la province n’est pas choisie, puis elle ne propose que les villes de cette province. Le responsable se choisit parmi les agents.</p>
            <p className="text-sm text-slate-600 mt-2">Une province exige le nom de son chef-lieu. Ce chef-lieu est aussi enregistré comme ville de la province.</p>
            <p className="text-xs text-slate-500 mt-3">Droits sur cette page : {libelleDroits(activePersona, 'referentiel')}.</p>
          </div>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 flex items-start justify-center px-4 pt-24 overflow-y-auto">
          <form onSubmit={(event) => { if (form.mode === 'view') { event.preventDefault(); return; } enregistrer(event); }} className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-2xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <h2 className="sm:col-span-2 text-sm font-bold text-slate-900">
              {form.mode === 'create' ? `Nouveau — ${data.label || 'élément'}` : form.mode === 'view' ? `Détail — ${data.label || 'élément'}` : `Modifier — ${data.label || 'élément'}`}
            </h2>
            {error && <p className="sm:col-span-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}
            {(data.champs || []).filter((champ) => form.mode !== 'view' || champ.key !== 'password').map((champ) => {
              const lecture = form.mode === 'view';
              const obligatoire = !lecture && champ.required && !(champ.key === 'password' && form.mode === 'edit');
              const classe = `mt-1 w-full border border-slate-200 rounded px-2 py-1.5 text-sm ${lecture ? 'bg-slate-50' : 'bg-white'}`;
              const provinceChoisie = Boolean(form.values[champ.dependsOn]);
              const villeBloquee = Boolean(champ.dependsOn) && !provinceChoisie;
              const options = (champ.options || []).filter((option) => !champ.dependsOn || String(option.parent) === String(form.values[champ.dependsOn] || ''));
              if (champ.type === 'select') {
                return (
                  <ListeDeroulante
                    key={champ.key}
                    label={champ.label}
                    value={form.values[champ.key] ?? ''}
                    options={villeBloquee ? [] : options}
                    desactive={lecture || villeBloquee}
                    obligatoire={obligatoire && !villeBloquee}
                    placeholder="Choisir"
                    messageBloque="Choisir une province d'abord"
                    onChange={(valeur) => setForm((prev) => {
                      const values = { ...prev.values, [champ.key]: valeur };
                      if (champ.key === 'province_id') values.ville_id = '';
                      return { ...prev, values };
                    })}
                  />
                );
              }
              return (
                <label key={champ.key} className="text-xs text-slate-600">
                  {champ.label}{obligatoire ? ' *' : ''}
                  <input
                    type={champ.type === 'number' ? 'number' : 'text'}
                    required={obligatoire}
                    readOnly={lecture}
                    value={form.values[champ.key] ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, values: { ...prev.values, [champ.key]: e.target.value } }))}
                    className={classe}
                  />
                </label>
              );
            })}
            <div className="sm:col-span-2 flex gap-2">
              {form.mode !== 'view' && <button className="px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">Enregistrer</button>}
              <button type="button" onClick={() => setForm(null)} className="px-3 py-2 text-xs font-bold rounded border border-slate-300">{form.mode === 'view' ? 'Fermer' : 'Annuler'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
