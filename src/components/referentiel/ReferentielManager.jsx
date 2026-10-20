import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Eye, Info, Pencil, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { apiRequest } from '../../services/api';
import { askConfirm, pushToast } from '../../services/toastBus';
import { droit, libelleDroits } from '../../data/rbacMatrix';
import { LigneChargementTableau } from '../common/SpinnerPourcentage';

const VIDE = { ressource: '', colonnes: [], filtres: [], champs: [], rows: [], meta: null };
const TAILLES = [3, 5, 10, 15, 20, 30, 50];

const COLONNES_IMPORT_MEDICAMENTS = [
  'code_produit',
  'designation',
  'dci',
  'categorie',
  'forme',
  'dosage',
  'conditionnement',
  'unite_gestion',
  'pays_provenance',
  'laboratoire',
  'prix_unitaire_xaf',
  'prix_public_plafonne_xaf',
  'stock_national',
  'seuil_min_national',
  'seuil_critique_national',
  'statut',
];

function normaliserCleImport(cle) {
  return String(cle || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

const ALIAS_IMPORT_MEDICAMENTS = {
  code: 'code_produit',
  code_produit: 'code_produit',
  designation: 'designation',
  dci: 'dci',
  categorie: 'categorie',
  forme: 'forme',
  forme_galenique: 'forme',
  dosage: 'dosage',
  conditionnement: 'conditionnement',
  unite: 'unite_gestion',
  unite_gestion: 'unite_gestion',
  pays: 'pays_provenance',
  pays_de_provenance: 'pays_provenance',
  pays_provenance: 'pays_provenance',
  laboratoire: 'laboratoire',
  prix_unitaire: 'prix_unitaire_xaf',
  prix_unitaire_xaf: 'prix_unitaire_xaf',
  prix_public: 'prix_public_plafonne_xaf',
  prix_public_plafonne: 'prix_public_plafonne_xaf',
  prix_public_plafonne_xaf: 'prix_public_plafonne_xaf',
  quantite: 'stock_national',
  stock: 'stock_national',
  stock_national: 'stock_national',
  seuil_min: 'seuil_min_national',
  seuil_min_national: 'seuil_min_national',
  seuil_critique: 'seuil_critique_national',
  seuil_critique_national: 'seuil_critique_national',
  statut: 'statut',
};

/* Onglets connus dès l'ouverture : ils restent visibles pendant le chargement du tableau. */
const ONGLETS = [
  { key: 'medicaments', label: 'Médicaments' },
  { key: 'categories_medicaments', label: 'Catégories médicaments' },
  { key: 'formes_galeniques', label: 'Formes galéniques' },
  { key: 'unites_gestion', label: 'Unités de gestion' },
  { key: 'directions', label: 'Directions' },
  { key: 'provinces', label: 'Provinces' },
  { key: 'villes', label: 'Villes' },
  { key: 'antennes', label: 'Antennes' },
  { key: 'utilisateurs', label: 'Agents et utilisateurs' },
  { key: 'types_structures', label: 'Types de structures' },
  { key: 'departements', label: 'Départements' },
  { key: 'structures', label: 'Structures et pharmacies' },
  { key: 'pays', label: 'Pays de provenance' },
  { key: 'types_fournisseurs', label: 'Types de fournisseurs' },
  { key: 'fournisseurs', label: 'Fournisseurs' },
];

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
  const [ressources, setRessources] = useState(ONGLETS);
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
  const [importBusy, setImportBusy] = useState(false);
  const ongletPrecedent = useRef(null);
  const importInputRef = useRef(null);

  useEffect(() => {
    apiRequest('/referentiel')
      .then((res) => {
        if (Array.isArray(res.ressources) && res.ressources.length) setRessources(res.ressources);
      })
      .catch((err) => setError(err?.backendUnavailable ? '' : err.message));
  }, []);

  /** silent = true : recherche / filtres / pagination sans vider ni spinner le tableau. */
  const load = useCallback(async ({ silent = false } = {}) => {
    if (!actif) return;
    if (!silent) {
      setLoading(true);
      setError('');
    }
    const params = new URLSearchParams({ page: String(page), per_page: String(parPage) });
    if (q.trim()) params.set('q', q.trim());
    Object.entries(filtres).forEach(([key, value]) => {
      if (value && value !== 'ALL') params.set(key, value);
    });
    try {
      const res = await apiRequest(`/referentiel/${actif}?${params.toString()}`, { priority: true });
      setData(res);
      setRessources((liste) => {
        if (liste.some((item) => item.key === actif)) return liste;
        return [...liste, { key: actif, label: res.label || actif }];
      });
    } catch (err) {
      if (!silent) setError(err?.backendUnavailable ? '' : (err.message || 'Impossible de charger le référentiel.'));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [actif, q, filtres, page, parPage]);

  useEffect(() => {
    const changementOnglet = ongletPrecedent.current !== actif;
    ongletPrecedent.current = actif;
    const delai = changementOnglet ? 0 : 280;
    const timer = window.setTimeout(() => {
      load({ silent: !changementOnglet });
    }, delai);
    return () => window.clearTimeout(timer);
  }, [load, actif]);

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
        ? 'Choisissez d’abord une province.'
        : `Le champ « ${manquant.label} » est obligatoire.`);
      return;
    }
    const body = { ...form.values };
    Object.keys(body).forEach((cle) => {
      if (body[cle] === '') delete body[cle];
    });
    if (form.mode === 'edit' && !body.password) delete body.password;
    try {
      const creation = form.mode === 'create';
      await apiRequest(
        creation ? `/referentiel/${actif}` : `/referentiel/${actif}/${form.id}`,
        { method: creation ? 'POST' : 'PUT', priority: true, body: JSON.stringify(body) }
      );
      setForm(null);
      pushToast(
        creation
          ? `Ajout avec succès — ${data.label || 'référentiel'}.`
          : `Modification enregistrée avec succès — ${data.label || 'référentiel'}.`,
        'success'
      );
      await load({ silent: true });
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    }
  }

  async function supprimer(row) {
    const ok = await askConfirm({
      message: 'Supprimer cet élément du référentiel ?',
      confirmLabel: 'Supprimer',
      tone: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      await apiRequest(`/referentiel/${actif}/${row.id}`, { method: 'DELETE', priority: true });
      pushToast('Suppression effectuée avec succès.', 'warning');
      await load({ silent: true });
    } catch (err) {
      setError(err?.backendUnavailable ? '' : err.message);
    }
  }

  function telechargerModeleExcelMedicaments() {
    const exemple = [{
      code_produit: 'OPN-EX-001',
      designation: 'Exemple Artéméther + Luméfantrine 20/120mg',
      dci: 'Artéméther / Luméfantrine',
      categorie: 'Antipaludique (ACT)',
      forme: 'Comprimé dispersible',
      dosage: '20mg / 120mg',
      conditionnement: 'Boîte de 24 comprimés',
      unite_gestion: 'Boîte',
      pays_provenance: 'Inde',
      laboratoire: 'Exemple Pharma',
      prix_unitaire_xaf: 1850,
      prix_public_plafonne_xaf: 2200,
      stock_national: 1000,
      seuil_min_national: 500,
      seuil_critique_national: 200,
      statut: 'DISPONIBLE',
    }];
    const feuille = XLSX.utils.json_to_sheet(exemple, { header: COLONNES_IMPORT_MEDICAMENTS });
    const classeur = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(classeur, feuille, 'Medicaments');
    XLSX.writeFile(classeur, 'modele-import-medicaments-opn.xlsx');
    pushToast('Modèle Excel téléchargé.', 'success');
  }

  async function importerExcelMedicaments(fichier) {
    if (!fichier || importBusy) return;
    setImportBusy(true);
    setError('');
    try {
      const buffer = await fichier.arrayBuffer();
      const classeur = XLSX.read(buffer, { type: 'array' });
      const nomFeuille = classeur.SheetNames[0];
      const feuille = classeur.Sheets[nomFeuille];
      const brutes = XLSX.utils.sheet_to_json(feuille, { defval: '' });
      if (!brutes.length) {
        setError('Le fichier Excel ne contient aucune ligne de données.');
        return;
      }

      const lignes = brutes.map((row) => {
        const mappe = {};
        Object.entries(row).forEach(([cle, valeur]) => {
          const normalise = normaliserCleImport(cle);
          const cible = ALIAS_IMPORT_MEDICAMENTS[normalise];
          if (cible) mappe[cible] = typeof valeur === 'string' ? valeur.trim() : valeur;
        });
        return {
          code_produit: String(mappe.code_produit || ''),
          designation: String(mappe.designation || ''),
          dci: String(mappe.dci || ''),
          categorie: String(mappe.categorie || ''),
          forme: String(mappe.forme || ''),
          dosage: String(mappe.dosage || ''),
          conditionnement: String(mappe.conditionnement || ''),
          unite_gestion: String(mappe.unite_gestion || ''),
          pays_provenance: String(mappe.pays_provenance || ''),
          laboratoire: String(mappe.laboratoire || ''),
          prix_unitaire_xaf: Number(mappe.prix_unitaire_xaf || 0),
          prix_public_plafonne_xaf: Number(mappe.prix_public_plafonne_xaf || 0),
          stock_national: Number(mappe.stock_national || 0),
          seuil_min_national: mappe.seuil_min_national === '' || mappe.seuil_min_national == null ? undefined : Number(mappe.seuil_min_national),
          seuil_critique_national: mappe.seuil_critique_national === '' || mappe.seuil_critique_national == null ? undefined : Number(mappe.seuil_critique_national),
          statut: String(mappe.statut || 'DISPONIBLE'),
        };
      }).filter((ligne) => ligne.code_produit && ligne.designation);

      if (!lignes.length) {
        setError('Aucune ligne valide trouvée. Vérifiez les en-têtes du modèle Excel.');
        return;
      }

      const res = await apiRequest('/referentiel/medicaments/import', {
        method: 'POST',
        priority: true,
        timeoutMs: 60000,
        body: JSON.stringify({ lignes }),
      });
      pushToast(res.message || 'Import Excel terminé avec succès.', 'success');
      if (Array.isArray(res.erreurs) && res.erreurs.length) {
        setError(`${res.erreurs.length} ligne(s) en erreur (ex. ligne ${res.erreurs[0].ligne} : ${res.erreurs[0].message}).`);
      }
      await load({ silent: true });
    } catch (err) {
      setError(err?.backendUnavailable ? '' : (err.message || 'Import Excel impossible.'));
    } finally {
      setImportBusy(false);
      if (importInputRef.current) importInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-4 w-full">
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

      <div className="bg-white border border-slate-200 rounded-md p-3 space-y-3 w-full">
        <div className="flex flex-wrap gap-2 items-end">
          <label className="text-xs text-slate-600 flex-1 min-w-[220px]">
            Recherche
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder={actif === 'medicaments' ? 'Code, désignation, DCI, labo…' : 'Nom, code, email…'}
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
          <button type="button" onClick={() => load({ silent: true })} disabled={loading} className="w-8 h-8 inline-flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50" title="Actualiser" aria-label="Actualiser">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {actif === 'medicaments' && peutCreer && (
            <>
              <button
                type="button"
                onClick={telechargerModeleExcelMedicaments}
                className="px-3 py-1.5 text-xs font-bold rounded border border-slate-300 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
                title="Télécharger le modèle Excel"
              >
                <Download className="w-3.5 h-3.5" />
                Modèle Excel
              </button>
              <button
                type="button"
                disabled={importBusy}
                onClick={() => importInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-bold rounded border border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 inline-flex items-center gap-1.5 disabled:opacity-50"
                title="Importer des médicaments depuis Excel"
              >
                {importBusy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {importBusy ? 'Import…' : 'Import Excel'}
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                className="hidden"
                onChange={(event) => {
                  const fichier = event.target.files?.[0];
                  if (fichier) importerExcelMedicaments(fichier);
                }}
              />
            </>
          )}
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
              {loading && <LigneChargementTableau colonnes={Math.max((data.colonnes || []).length + 1, 1)} libelle="Chargement des données…" />}
              {!loading && (data.rows || []).length === 0 && <tr><td className="py-3 text-slate-500" colSpan={(data.colonnes || []).length + 1}>Aucun élément.</td></tr>}
              {!loading && (data.rows || []).map((row) => (
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
          <div className="flex items-center gap-2 min-w-[200px]">
            <span>Afficher</span>
            <div className="w-24">
              <ListeDeroulante
                value={String(parPage)}
                options={TAILLES.map((taille) => ({ value: String(taille), label: String(taille) }))}
                onChange={(valeur) => { setParPage(Number(valeur) || 10); setPage(1); }}
                placeholder="10"
              />
            </div>
            <span>éléments</span>
          </div>
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
            <p className="text-sm text-slate-600 mt-3">Création, modification et suppression des médicaments, directions, provinces, villes, antennes, agents, structures, pays, types de fournisseurs et fournisseurs.</p>
            <p className="text-sm text-slate-600 mt-2">Pour un médicament : catégorie, forme, unité, pays de provenance et statut sont des listes. Le prix unitaire et la quantité (stock) servent au calcul automatique du montant des bons de commande. Les listes se gèrent dans les onglets Catégories, Formes, Unités et Pays de provenance.</p>
            <p className="text-sm text-slate-600 mt-2">Vous pouvez aussi importer des médicaments via Excel (bouton Import Excel) à partir du modèle fourni.</p>
            <p className="text-sm text-slate-600 mt-2">La recherche et les filtres (catégorie, forme, pays de provenance, statut) permettent de trouver rapidement un médicament dans le tableau.</p>
            <p className="text-sm text-slate-600 mt-2">Pour une antenne, la province se choisit en premier. La liste des villes reste fermée tant que la province n’est pas choisie, puis elle ne propose que les villes de cette province. Le responsable se choisit parmi les agents.</p>
            <p className="text-sm text-slate-600 mt-2">Une province exige le nom de son chef-lieu. Ce chef-lieu est aussi enregistré comme ville de la province.</p>
            <p className="text-sm text-slate-600 mt-2">Pour un fournisseur, le pays et le type se choisissent dans des listes. Ces listes se gèrent dans les onglets Pays de provenance et Types de fournisseurs.</p>
            <p className="text-sm text-slate-600 mt-2">Pour une structure, le type, la province, l’antenne, le département, la ville et le responsable sont des listes. L’antenne, le département et la ville restent fermés tant que la province n’est pas choisie.</p>
            <p className="text-xs text-slate-500 mt-3">Droits sur cette page : {libelleDroits(activePersona, 'referentiel')}.</p>
          </div>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 flex items-start justify-center px-4 pt-24 overflow-y-auto">
          <form onSubmit={(event) => { if (form.mode === 'view') { event.preventDefault(); return; } enregistrer(event); }} className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-6xl p-5 sm:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
            <h2 className="sm:col-span-2 lg:col-span-3 text-sm font-bold text-slate-900">
              {form.mode === 'create' ? `Nouveau — ${data.label || 'élément'}` : form.mode === 'view' ? `Détail — ${data.label || 'élément'}` : `Modifier — ${data.label || 'élément'}`}
            </h2>
            {error && <p className="sm:col-span-2 lg:col-span-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">{error}</p>}
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
                      (data.champs || []).forEach((autre) => {
                        if (autre.dependsOn === champ.key) values[autre.key] = '';
                      });
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
            <div className="sm:col-span-2 lg:col-span-3 flex gap-2 pt-1">
              {form.mode !== 'view' && <button className="px-3 py-2 text-xs font-bold rounded bg-[#0E2A4F] text-white">Enregistrer</button>}
              <button type="button" onClick={() => setForm(null)} className="px-3 py-2 text-xs font-bold rounded border border-slate-300">{form.mode === 'view' ? 'Fermer' : 'Annuler'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
