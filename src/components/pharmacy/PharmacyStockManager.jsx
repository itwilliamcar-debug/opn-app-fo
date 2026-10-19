import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Calendar,
  Boxes,
  FileSpreadsheet,
  ChevronRight,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { fetchProducts } from '../../services/api';
import { formatXAF, formatNumber, getStockStatusBadge } from '../../utils/formatters';
import LotRecallManagerModal from './LotRecallManagerModal';

/** Lots FEFO — Laravel peut sérialiser lots_fefo ou lotsFefo */
function getProductLots(produit) {
  const raw = produit?.lots_fefo ?? produit?.lotsFefo ?? [];
  return [...raw].sort((a, b) => {
    const da = new Date(a.date_peremption || a.datePeremption || 0).getTime();
    const db = new Date(b.date_peremption || b.datePeremption || 0).getTime();
    return da - db;
  });
}

function aggregateStockByAntenne(lots) {
  return lots.reduce((acc, lot) => {
    const key = String(lot.antenne_id ?? lot.antenneId ?? 'n/a');
    acc[key] = (acc[key] || 0) + Number(lot.quantite_disponible ?? lot.quantiteDisponible ?? 0);
    return acc;
  }, {});
}

function formatDateLabel(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toLocaleDateString('fr-GA');
}

function exportInventoryCsv(products) {
  const bom = '\uFEFF';
  const header = [
    'Code',
    'DCI',
    'Famille',
    'Lot',
    'Antenne_id',
    'Qte_disponible',
    'Date_peremption',
    'Prix_unitaire_XAF',
  ];
  const rows = [header];
  products.forEach((p) => {
    const lots = getProductLots(p);
    const code = p.code_opn || p.code || p.id;
    const dci = p.dci || p.nom || '';
    const famille = p.categorie || p.famille || '';
    const prix = p.prix_unitaire_xaf ?? p.prixUnitaireXaf ?? '';
    if (!lots.length) {
      rows.push([code, dci, famille, '', '', p.stock_total ?? '', '', prix]);
      return;
    }
    lots.forEach((lot) => {
      rows.push([
        code,
        dci,
        famille,
        lot.numero_lot || lot.numeroLot || '',
        lot.antenne_id ?? lot.antenneId ?? '',
        lot.quantite_disponible ?? lot.quantiteDisponible ?? 0,
        lot.date_peremption || lot.datePeremption || '',
        prix,
      ]);
    });
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `OPN_Inventaire_FEFO_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const FALLBACK_CATEGORIES = [
  'ALL',
  'Antipaludique',
  'Antibiotique',
  'Analgésique',
  'Urgence',
  'Diabétologie',
  'Santé Maternelle',
  'Solutés',
];

export default function PharmacyStockManager({ activePersona, sanctumReady = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAntenneFilter, setSelectedAntenneFilter] = useState('ALL');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts();
      const list = Array.isArray(res?.produits) ? res.produits : [];
      setProducts(list);
      setSelectedProductDetails((prev) => {
        if (!list.length) return null;
        if (prev && list.some((p) => p.id === prev.id)) {
          return list.find((p) => p.id === prev.id) || list[0];
        }
        return list[0];
      });
    } catch (err) {
      setProducts([]);
      setSelectedProductDetails(null);
      setError(err?.backendUnavailable ? '' : (err?.message || 'Impossible de charger le catalogue pharmacie.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(() => {
    const fromApi = [
      ...new Set(
        products
          .map((p) => p.categorie)
          .filter(Boolean)
          .map((c) => String(c).trim())
      ),
    ].sort((a, b) => a.localeCompare(b, 'fr'));
    return fromApi.length ? ['ALL', ...fromApi] : FALLBACK_CATEGORIES;
  }, [products]);

  const antenneOptions = useMemo(() => {
    const map = new Map();
    products.forEach((prod) => {
      getProductLots(prod).forEach((lot) => {
        const id = lot.antenne_id ?? lot.antenneId;
        if (id == null) return;
        const label =
          lot.antenne?.nom ||
          lot.antenne?.chef_lieu ||
          lot.antenne?.ville_antenne ||
          `Antenne #${id}`;
        if (!map.has(id)) map.set(id, label);
      });
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id: String(id), label }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((prod) => {
      const designation = String(prod.designation || '').toLowerCase();
      const dci = String(prod.dci || '').toLowerCase();
      const code = String(prod.code_produit || prod.code || '').toLowerCase();
      const matchesSearch = !q || designation.includes(q) || dci.includes(q) || code.includes(q);
      const cat = String(prod.categorie || '');
      const matchesCategory =
        selectedCategory === 'ALL' || cat.toLowerCase().includes(selectedCategory.toLowerCase());
      const lots = getProductLots(prod);
      const matchesAntenne =
        selectedAntenneFilter === 'ALL' ||
        lots.some((lot) => String(lot.antenne_id ?? lot.antenneId) === selectedAntenneFilter);
      return matchesSearch && matchesCategory && matchesAntenne;
    });
  }, [products, searchTerm, selectedCategory, selectedAntenneFilter]);

  const selectedLots = selectedProductDetails ? getProductLots(selectedProductDetails) : [];
  const stocksParAntenne = aggregateStockByAntenne(selectedLots);
  const stockNational = Number(
    selectedProductDetails?.stock_national ??
      selectedProductDetails?.stockNational ??
      selectedLots.reduce((s, l) => s + Number(l.quantite_disponible ?? 0), 0)
  );
  const prixUnitaire = Number(
    selectedProductDetails?.prix_unitaire_xaf ?? selectedProductDetails?.prixUnitaireXAF ?? 0
  );
  const prixPublic = Number(
    selectedProductDetails?.prix_public_plafonne_xaf ??
      selectedProductDetails?.prixPublicPlafonneXAF ??
      0
  );
  const unite = selectedProductDetails?.unite_gestion || selectedProductDetails?.uniteGestion || 'unité';
  const codeProduit =
    selectedProductDetails?.code_produit || selectedProductDetails?.code || '—';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {!sanctumReady && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          Session Sanctum inactive — connectez-vous via Accès Intranet pour charger le stock FEFO live.
        </div>
      )}

      {/* Header Module Pharmacie & FEFO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
            <span className="text-[11px] font-bold text-[#00A651] uppercase tracking-wider">
              GESTION DU MÉDICAMENT & LOGISTIQUE FEFO
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2E68B4]">
            Pharmacie & Traçabilité des Lots
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Catalogue DCI branché sur l&apos;API Laravel, suivi des péremptions{' '}
            <strong className="text-[#00A651]">First Expired, First Out (FEFO)</strong> et
            valorisation en FCFA (XAF).
          </p>
          {activePersona?.nom && (
            <p className="text-[11px] text-slate-500 mt-1">
              Opérateur : <strong className="text-slate-700">{activePersona.nom}</strong>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRecallModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-red-300" />
            Rappel de Lot (AM-07)
          </button>
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            type="button"
            onClick={() => {
              if (!products.length) {
                setError('Aucun produit chargé — actualisez le catalogue avant export CSV.');
                return;
              }
              exportInventoryCsv(filteredProducts.length ? filteredProducts : products);
            }}
            disabled={loading || !products.length}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            Exporter Inventaire (XAF)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            <p className="font-normal mt-1 text-rose-700">
              Vérifiez la connexion au serveur, puis réessayez.
            </p>
          </div>
        </div>
      )}

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-md border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher médicament par DCI, marque ou code OPN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-opn-navy focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-opn-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Toutes Catégories' : cat}
            </button>
          ))}
        </div>
      </div>

      {antenneOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Filtrer par antenne
          </span>
          <button
            type="button"
            onClick={() => setSelectedAntenneFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
              selectedAntenneFilter === 'ALL'
                ? 'bg-opn-navy text-white'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Toutes
          </button>
          {antenneOptions.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedAntenneFilter(a.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                selectedAntenneFilter === a.id
                  ? 'bg-opn-navy text-white'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Grille Principale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[320px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-sm font-bold text-opn-navy flex items-center gap-2">
              <Boxes className="w-4 h-4 text-opn-green" />
              Catalogue Produits ({filteredProducts.length} références)
            </h3>
            <span className="text-[11px] text-slate-500">Cliquez pour voir les lots</span>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-10 text-slate-500 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-opn-navy" />
              Chargement du catalogue API…
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-10 text-rose-700 text-xs text-center">
              <AlertTriangle className="w-6 h-6" />
              Catalogue indisponible
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-10 text-slate-500 text-xs text-center">
              <Boxes className="w-6 h-6 text-slate-300" />
              {products.length === 0
                ? 'Aucun produit retourné par l’API pharmacie.'
                : 'Aucun produit ne correspond aux filtres sélectionnés.'}
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Produit / DCI</th>
                    <th className="p-3.5">Stock National</th>
                    <th className="p-3.5">Prix Unitaire</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((prod) => {
                    const isSelected = selectedProductDetails?.id === prod.id;
                    const statusBadge = getStockStatusBadge(prod.statut);
                    const lots = getProductLots(prod);
                    const stock =
                      Number(prod.stock_national ?? prod.stockNational) ||
                      lots.reduce((s, l) => s + Number(l.quantite_disponible ?? 0), 0);
                    const prix = Number(prod.prix_unitaire_xaf ?? prod.prixUnitaireXAF ?? 0);
                    const prixPub = Number(
                      prod.prix_public_plafonne_xaf ?? prod.prixPublicPlafonneXAF ?? 0
                    );
                    const cmm = Number(prod.cmm_nationale ?? prod.cmmNationale ?? 0);
                    const u = prod.unite_gestion || prod.uniteGestion || 'unité';
                    return (
                      <tr
                        key={prod.id}
                        onClick={() => setSelectedProductDetails(prod)}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/70 border-l-4 border-l-opn-navy text-opn-navy font-medium'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 text-xs">{prod.designation}</div>
                          <div className="text-[10px] text-opn-navy font-semibold">{prod.dci}</div>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {prod.code_produit || prod.code}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {formatNumber(stock)} {u}s
                          <div className="text-[10px] text-slate-500 font-normal">
                            CMM : {formatNumber(cmm)}/m
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-amber-700">{formatXAF(prix)}</span>
                          {prixPub > 0 && (
                            <div className="text-[10px] text-slate-500">
                              Public : {formatXAF(prixPub)}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusBadge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <ChevronRight
                            className={`w-4 h-4 inline-block ${
                              isSelected ? 'text-opn-navy translate-x-1' : 'text-slate-400'
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Panneau détail FEFO */}
        <div className="lg:col-span-5 bg-white rounded-md p-5 border border-slate-200 shadow-sm space-y-5">
          {!selectedProductDetails ? (
            <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center text-xs text-slate-500 gap-2">
              <Calendar className="w-6 h-6 text-slate-300" />
              {loading
                ? 'Chargement de la fiche produit…'
                : 'Sélectionnez un produit pour afficher les lots FEFO.'}
            </div>
          ) : (
            <>
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-opn-navy px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                    {codeProduit}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedProductDetails.categorie}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-opn-navy mt-2 leading-snug">
                  {selectedProductDetails.designation}
                </h3>
                <p className="text-xs text-opn-green font-semibold">{selectedProductDetails.dci}</p>
                {selectedProductDetails.laboratoire && (
                  <p className="text-xs text-slate-500 mt-1">
                    Laboratoire Fabricant :{' '}
                    <strong className="text-slate-700">{selectedProductDetails.laboratoire}</strong>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-md bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Valeur Globale en Stock
                  </span>
                  <p className="text-base font-bold text-opn-green mt-0.5">
                    {formatXAF(stockNational * prixUnitaire)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Stock Sécurité Minimum
                  </span>
                  <p className="text-base font-bold text-amber-700 mt-0.5">
                    {formatNumber(
                      selectedProductDetails.seuil_min_national ??
                        selectedProductDetails.seuilMinNational ??
                        0
                    )}{' '}
                    {unite}s
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-opn-green" />
                    Lots Physiques & Ordre de Sortie FEFO
                  </h4>
                  <span className="text-[10px] text-opn-navy font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    Priorité Péremption
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedLots.length > 0 ? (
                    selectedLots.map((lot, idx) => {
                      const statut = lot.statut_fefo || lot.statutFEFO || 'VALIDE';
                      const qte = Number(lot.quantite_disponible ?? lot.quantiteDisponible ?? 0);
                      const numero = lot.numero_lot || lot.numeroLot || `LOT-${idx + 1}`;
                      return (
                        <div
                          key={lot.id || `${numero}-${idx}`}
                          className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-900">{numero}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                statut === 'PRIORITAIRE'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : statut === 'ALERTE_PEREMPTION'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {statut === 'PRIORITAIRE' ? 'Sortie FEFO N°1' : statut}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span>
                              Quantité :{' '}
                              <strong className="text-slate-900">
                                {formatNumber(qte)} {unite}s
                              </strong>
                            </span>
                            <span>
                              Antenne :{' '}
                              <strong className="text-opn-navy">
                                {lot.antenne?.nom ||
                                  lot.antenne?.chef_lieu ||
                                  `#${lot.antenne_id ?? lot.antenneId ?? '—'}`}
                              </strong>
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                            <span>
                              Fab : {formatDateLabel(lot.date_fabrication || lot.dateFabrication)}
                            </span>
                            <span className="font-semibold text-amber-700">
                              Péremption :{' '}
                              {formatDateLabel(lot.date_peremption || lot.datePeremption)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 rounded-md bg-slate-50 text-center text-xs text-slate-500 border border-slate-200">
                      Aucun lot FEFO actif pour ce produit (stock à zéro ou quarantaine).
                    </div>
                  )}
                </div>
              </div>

              {Object.keys(stocksParAntenne).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Niveaux de Stock par Antenne Provinciale
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(stocksParAntenne).map(([antenneId, qte]) => {
                      const lotSample = selectedLots.find(
                        (l) => String(l.antenne_id ?? l.antenneId) === String(antenneId)
                      );
                      const label =
                        lotSample?.antenne?.chef_lieu ||
                        lotSample?.antenne?.nom ||
                        `Antenne ${antenneId}`;
                      const isLow = qte < 1000;
                      return (
                        <div
                          key={antenneId}
                          className="p-2 rounded-md bg-slate-50 border border-slate-200 text-[11px]"
                        >
                          <div className="text-slate-500 truncate">{label}</div>
                          <div
                            className={`font-bold text-xs ${isLow ? 'text-rose-600' : 'text-slate-800'}`}
                          >
                            {formatNumber(qte)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <LotRecallManagerModal
        isOpen={isRecallModalOpen}
        onClose={() => setIsRecallModalOpen(false)}
      />
    </div>
  );
}
