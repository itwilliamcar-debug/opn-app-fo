import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlusCircle, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  Download,
  Filter,
  Layers
} from 'lucide-react';
import { fetchSuppliers, fetchPurchaseOrders, createPurchaseOrder, advancePurchaseOrderWorkflow } from '../../services/api';
import { formatXAF } from '../../utils/formatters';

export default function ProcurementManager({ activePersona, sanctumReady = false }) {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Formulaire d'émission nouvelle commande d'achat
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fournisseurId, setFournisseurId] = useState(1);
  const [quantiteCommandee, setQuantiteCommandee] = useState(45000);
  const [prixUnitaire, setPrixUnitaire] = useState(1850);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const [suppRes, ordRes] = await Promise.all([fetchSuppliers(), fetchPurchaseOrders()]);
      setSuppliers(suppRes?.fournisseurs || []);
      const list = ordRes?.commandes || [];
      setOrders(list);
      setSelectedOrder(list[0] || null);
    } catch (err) {
      setSuppliers([]);
      setOrders([]);
      setSelectedOrder(null);
      setActionError(err?.backendUnavailable ? '' : (err?.message || 'Achats indisponibles.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceWorkflow = async (etape) => {
    if (!selectedOrder) return;
    if (!sanctumReady) {
      setActionError('Session Sanctum inactive — Acces Intranet requis.');
      return;
    }
    setSubmitting(true);
    setActionError(null);

    try {
      const res = await advancePurchaseOrderWorkflow(selectedOrder.id, {
        etape,
        action: 'APPROUVER',
      });
      if (!res?.success) {
        setActionError(res?.message || `Etape ${etape} refusee.`);
        return;
      }
      setActionSuccess(`Etape ${etape} validee avec succes.`);
      setTimeout(() => setActionSuccess(null), 3000);
      await loadData();
    } catch (err) {
      setActionError(err?.backendUnavailable ? '' : (err?.message || `Échec de la validation ${etape}.`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionError(null);

    const payload = {
      fournisseur_id: fournisseurId,
      lignes: [
        {
          produit_id: 1,
          quantite_commandee: parseInt(quantiteCommandee, 10),
          prix_unitaire_xaf: parseFloat(prixUnitaire),
        },
      ],
      conditions_paiement: 'Lettre de Credit Irrevocable (LC / BPF)',
      notes: "Commande d'approvisionnement international OPN Gabon 2026",
    };

    try {
      const res = await createPurchaseOrder(payload);
      if (!res?.success) {
        setActionError(res?.message || 'Creation commande refusee.');
        return;
      }
      setIsModalOpen(false);
      setActionSuccess(res.message || 'Commande creee.');
      setTimeout(() => setActionSuccess(null), 3000);
      await loadData();
    } catch (err) {
      setActionError(err?.backendUnavailable ? '' : (err?.message || 'Échec de création de la commande.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Module Achats & Marchés */}
      <div className="bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
              <span className="text-[11px] font-bold text-[#00A651] uppercase tracking-wider">
                Module Achats & Relations Fabricants Mondiaux (Article 12)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Procurement & Marchés Pharmaceutiques
            </h1>
            <p className="text-xs text-slate-600">
              Circuit institutionnel de validation : <strong>DIR ↓ APPRO ↓ DAF ↓ DG</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nouvelle Commande Fournisseur</span>
        </button>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 2. Fournisseurs Agréés OPN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {s.pays}
              </span>
              <span className="text-[9px] font-mono text-slate-400">Délai : {s.delai_moyen_livraison_jours}j</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate">{s.nom}</h4>
            <p className="text-[10px] text-slate-500 truncate">{s.certifications}</p>
          </div>
        ))}
      </div>

      {/* 3. Tableau des Bons de Commande & Circuit de Validation Institutionnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Liste des commandes */}
        <div className="lg:col-span-1 bg-white rounded-md border border-slate-200 shadow-sm p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Commandes Fournisseurs ({orders.length})
          </h3>

          <div className="space-y-2">
            {orders.map(o => (
              <div 
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`p-3 rounded-md border cursor-pointer transition-all text-xs space-y-1 ${
                  selectedOrder?.id === o.id 
                    ? 'border-[#2E68B4] bg-blue-50/70 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{o.numero_commande}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    o.statut === 'VALIDE_SIGNE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {o.statut.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate">{o.fournisseur?.nom}</p>
                <span className="font-black text-[#2E68B4] text-xs block">{formatXAF(o.montant_total_xaf)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Détail de la commande & Circuit Institutionnel (DIR -> APPRO -> DAF -> DG) */}
        {selectedOrder ? (
          <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm p-5 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[#2E68B4] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedOrder.numero_commande}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Fournisseur : {selectedOrder.fournisseur?.nom} ({selectedOrder.fournisseur?.pays})
                </h3>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-slate-900 block">{formatXAF(selectedOrder.montant_total_xaf)}</span>
                <span className="text-[11px] text-slate-500">Livraison estimée : {selectedOrder.date_livraison_prevue || 'J+30'}</span>
              </div>
            </div>

            {/* Circuit Institutionnel en 4 étapes */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Circuit Institutionnel de Validation Obligatoire (Article 12) :
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                
                {/* Étape 1 : DIR */}
                <div className={`p-3 rounded border ${selectedOrder.visa_dir_nom ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">1. Visa DIR</span>
                    {selectedOrder.visa_dir_nom ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <span className="text-[10px] text-slate-600 block truncate">{selectedOrder.visa_dir_nom || 'En attente DIR'}</span>
                  {!selectedOrder.visa_dir_nom && (
                    <button 
                      disabled={submitting}
                      onClick={() => handleAdvanceWorkflow('VISA_DIR')}
                      className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px]"
                    >
                      Approuver DIR
                    </button>
                  )}
                </div>

                {/* Étape 2 : APPRO */}
                <div className={`p-3 rounded border ${selectedOrder.visa_appro_nom ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">2. Visa APPRO</span>
                    {selectedOrder.visa_appro_nom ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <span className="text-[10px] text-slate-600 block truncate">{selectedOrder.visa_appro_nom || 'En attente Appro'}</span>
                  {selectedOrder.visa_dir_nom && !selectedOrder.visa_appro_nom && (
                    <button 
                      disabled={submitting}
                      onClick={() => handleAdvanceWorkflow('VISA_APPRO')}
                      className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px]"
                    >
                      Approuver Appro
                    </button>
                  )}
                </div>

                {/* Étape 3 : DAF */}
                <div className={`p-3 rounded border ${selectedOrder.visa_daf_nom ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">3. Visa DAF</span>
                    {selectedOrder.visa_daf_nom ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <span className="text-[10px] text-slate-600 block truncate">{selectedOrder.visa_daf_nom || 'En attente DAF'}</span>
                  {selectedOrder.visa_appro_nom && !selectedOrder.visa_daf_nom && (
                    <button 
                      disabled={submitting}
                      onClick={() => handleAdvanceWorkflow('VISA_DAF')}
                      className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px]"
                    >
                      Approuver DAF
                    </button>
                  )}
                </div>

                {/* Étape 4 : DG */}
                <div className={`p-3 rounded border ${selectedOrder.visa_dg_nom ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">4. Signature DG</span>
                    {selectedOrder.visa_dg_nom ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00A651]" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <span className="text-[10px] text-slate-600 block truncate">{selectedOrder.visa_dg_nom || 'En attente DG'}</span>
                  {selectedOrder.visa_daf_nom && !selectedOrder.visa_dg_nom && (
                    <button 
                      disabled={submitting}
                      onClick={() => handleAdvanceWorkflow('VISA_DG')}
                      className="mt-2 w-full py-1 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded text-[10px]"
                    >
                      Signer & Sceller DG
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Certificat de scellement si validé DG */}
            {selectedOrder.statut === 'VALIDE_SIGNE' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 space-y-1 font-medium">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-[#00A651]">
                    <ShieldCheck className="w-4 h-4" />
                    Bon de Commande Certifié & Signé par la Direction Générale
                  </span>
                  <span className="font-mono text-[10px]">{selectedOrder.qr_token}</span>
                </div>
                <p className="text-[10px] text-emerald-700">
                  Hash Cryptographique : <span className="font-mono">{selectedOrder.signature_hash}</span>
                </p>
              </div>
            )}

            {/* Lignes de commande */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Produits commandés :</span>
              <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
                {(selectedOrder.lignes || []).map((l, i) => (
                  <div key={i} className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200 last:border-none">
                    <div>
                      <strong className="text-slate-900">{l.produit?.designation || 'Molécule DCI'}</strong>
                      <span className="text-slate-500 block text-[11px]">{l.quantite_commandee} unités x {formatXAF(l.prix_unitaire_xaf)}</span>
                    </div>
                    <span className="font-bold text-[#2E68B4]">{formatXAF(l.total_ligne_xaf)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 text-center py-12 text-slate-400 text-xs">
            Sélectionnez une commande pour afficher son détail.
          </div>
        )}

      </div>

      {/* 4. MODALE DE CRÉATION D'UNE COMMANDE D'ACHAT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-amber-500 text-white flex items-center justify-center font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Émettre une Commande Fournisseur</h3>
                  <p className="text-[11px] text-slate-500">Achat groupé international de médicaments essentiels</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Laboratoire Fabricant / Fournisseur</label>
                <select
                  value={fournisseurId}
                  onChange={(e) => setFournisseurId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.nom} ({s.pays})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantité (Boîtes)</label>
                  <input
                    type="number"
                    value={quantiteCommandee}
                    onChange={(e) => setQuantiteCommandee(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix Unitaire (XAF)</label>
                  <input
                    type="number"
                    value={prixUnitaire}
                    onChange={(e) => setPrixUnitaire(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-right">
                <span className="text-[11px] text-slate-500 block">Montant Total de la Commande :</span>
                <span className="text-base font-black text-[#2E68B4]">
                  {formatXAF(quantiteCommandee * prixUnitaire)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded shadow-sm"
                >
                  {submitting ? 'Émission...' : 'Soumettre au Circuit DIR'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
