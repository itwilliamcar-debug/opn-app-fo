import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShoppingCart, 
  Building2, 
  Calendar, 
  AlertCircle, 
  Pill 
} from 'lucide-react';

export default function NewLocalOrderModal({
  isOpen,
  onClose,
  structures,
  stockItems,
  onSaveOrder,
  provinceCode,
}) {
  if (!isOpen) return null;

  const activeStructures = structures.filter((s) => s.provinceCode === provinceCode);
  const [selectedStructureId, setSelectedStructureId] = useState(activeStructures[0]?.id || '');
  const [priorite, setPriorite] = useState('NORMALE');
  const [dateSouhaitee, setDateSouhaitee] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [demandeurNom, setDemandeurNom] = useState('');
  const [contactDemandeur, setContactDemandeur] = useState('');
  const [observations, setObservations] = useState('');

  // Cart lines
  const [orderLines, setOrderLines] = useState([
    {
      codeDci: stockItems[0]?.codeDci || '010101001',
      quantiteDemandee: 10,
    },
  ]);

  const selectedStructure = activeStructures.find((s) => s.id === selectedStructureId) || activeStructures[0];

  const handleAddLine = () => {
    const nextItem = stockItems.find((s) => !orderLines.some((l) => l.codeDci === s.codeDci)) || stockItems[0];
    if (nextItem) {
      setOrderLines([...orderLines, { codeDci: nextItem.codeDci, quantiteDemandee: 10 }]);
    }
  };

  const handleRemoveLine = (idx) => {
    if (orderLines.length > 1) {
      setOrderLines(orderLines.filter((_, i) => i !== idx));
    }
  };

  const handleLineChange = (idx, field, value) => {
    const updated = [...orderLines];
    updated[idx][field] = value;
    setOrderLines(updated);
  };

  // Calculations
  const calculatedLines = orderLines.map((line) => {
    const stk = stockItems.find((s) => s.codeDci === line.codeDci) || {};
    const lot = stk.lots?.[0] || {};
    const qty = Number(line.quantiteDemandee) || 0;
    const pu = stk.prixUnitaireXaf || 0;
    const montant = qty * pu;
    return {
      codeDci: line.codeDci,
      designation: stk.designation || 'Médicament DCI',
      forme: stk.forme || 'Comprimé',
      dosage: stk.dosage || 'Standard',
      lot: lot.numeroLot || 'LT-2026-N1',
      peremption: lot.datePeremption || '2028-12-31',
      quantiteDemandee: qty,
      quantiteAllouee: Math.min(qty, stk.stockDisponible || qty),
      quantiteLivree: 0,
      prixUnitaireXaf: pu,
      montantLigneXaf: montant,
      chaineFroid: Boolean(stk.chaineFroid),
    };
  });

  const totalMontantXaf = calculatedLines.reduce((acc, curr) => acc + curr.montantLigneXaf, 0);
  const priseEnChargeCnamgsXaf = Math.round(totalMontantXaf * 0.9); // 90% tiers-payant
  const resteAChargeXaf = totalMontantXaf - priseEnChargeCnamgsXaf;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: `cmd-${provinceCode.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      codeCommande: `CMD-2026-${provinceCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      codeBlAssocie: null,
      provinceCode,
      structureId: selectedStructure?.id || 'str-custom',
      structureNom: selectedStructure?.nom || 'Structure Sanitaire',
      structureType: selectedStructure?.type || 'Centre Médical',
      ville: selectedStructure?.ville || 'Franceville',
      dateCommande: new Date().toISOString().split('T')[0],
      dateSouhaitee,
      statut: 'RECUE',
      priorite,
      demandeurNom: demandeurNom || selectedStructure?.responsable || 'Pharmacien Responsable',
      contactDemandeur: contactDemandeur || selectedStructure?.contact || '(+241) 077 00 00 00',
      montantTotalXaf: totalMontantXaf,
      priseEnChargeCnamgsXaf,
      resteAChargeXaf,
      lignes: calculatedLines,
      qrPayload: `OPN-CMD:NEW-${Date.now()}|DEST:${selectedStructure?.nom}|XAF:${totalMontantXaf}`,
      observations,
    };

    onSaveOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white rounded-t-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00A651]/20 border border-[#00A651] flex items-center justify-center text-[#00A651]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#00A651] uppercase">Antenne {provinceCode}</span>
              <h3 className="text-base font-black text-white">Nouvelle Commande de Formation Sanitaire</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
          
          {/* Structure Selection & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Structure Sanitaire Bénéficiaire
              </label>
              <select
                value={selectedStructureId}
                onChange={(e) => {
                  setSelectedStructureId(e.target.value);
                  const str = activeStructures.find((s) => s.id === e.target.value);
                  if (str) {
                    setDemandeurNom(str.responsable || '');
                    setContactDemandeur(str.contact || '');
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                {activeStructures.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} ({s.type} - {s.ville})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Priorité</label>
              <select
                value={priorite}
                onChange={(e) => setPriorite(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651] ${
                  priorite === 'URGENCE_VITALE' ? 'border-rose-300 bg-rose-50 text-rose-800' :
                  priorite === 'URGENTE' ? 'border-amber-300 bg-amber-50 text-amber-800' :
                  'border-slate-300 text-slate-800'
                }`}
              >
                <option value="NORMALE">Normale (Standard 72h)</option>
                <option value="URGENTE">Urgente (Sous 24h)</option>
                <option value="URGENCE_VITALE">Urgence vitale (immédiat)</option>
              </select>
            </div>
          </div>

          {/* Demandeur info & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Pharmacien / Demandeur</label>
              <input
                type="text"
                value={demandeurNom || selectedStructure?.responsable || ''}
                onChange={(e) => setDemandeurNom(e.target.value)}
                placeholder="Dr. ..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Téléphone de contact</label>
              <input
                type="text"
                value={contactDemandeur || selectedStructure?.contact || ''}
                onChange={(e) => setContactDemandeur(e.target.value)}
                placeholder="(+241) 07..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Date de livraison souhaitée</label>
              <input
                type="date"
                value={dateSouhaitee}
                onChange={(e) => setDateSouhaitee(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                required
              />
            </div>
          </div>

          {/* Line Items Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Médicaments & Dispositifs Médicaux Demandés</span>
              </h4>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-3 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {orderLines.map((line, idx) => {
                const stk = stockItems.find((s) => s.codeDci === line.codeDci) || {};
                return (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <div className="flex-1">
                      <select
                        value={line.codeDci}
                        onChange={(e) => handleLineChange(idx, 'codeDci', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                      >
                        {stockItems.map((s) => (
                          <option key={s.id} value={s.codeDci}>
                            {s.codeDci} — {s.designation} (Stock dispo : {s.stockDisponible})
                          </option>
                        ))}
                      </select>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>P.U. : <strong className="text-slate-800">{stk.prixUnitaireXaf?.toLocaleString('fr-FR')} XAF</strong></span>
                        <span>•</span>
                        <span>Catégorie : {stk.categorie}</span>
                        {stk.chaineFroid && <span className="text-cyan-700 font-bold">Froid 2°C-8°C</span>}
                      </div>
                    </div>

                    <div className="w-24">
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantiteDemandee}
                        onChange={(e) => handleLineChange(idx, 'quantiteDemandee', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-center text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                      />
                    </div>

                    <div className="w-32 text-right">
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Sous-Total</label>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {((Number(line.quantiteDemandee) || 0) * (stk.prixUnitaireXaf || 0)).toLocaleString('fr-FR')} XAF
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      disabled={orderLines.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total Recap Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Montant Total Estimé</span>
                <div className="text-lg font-black text-[#00A651] font-mono">
                  {totalMontantXaf.toLocaleString('fr-FR')} XAF
                </div>
              </div>
              <div className="text-right text-[11px] space-y-0.5">
                <p className="text-emerald-300">Tiers-Payant CNAMGS (90%) : <span className="font-mono font-bold">{priseEnChargeCnamgsXaf.toLocaleString('fr-FR')} XAF</span></p>
                <p className="text-slate-300">Reste à charge structure : <span className="font-mono font-bold">{resteAChargeXaf.toLocaleString('fr-FR')} XAF</span></p>
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Observations / Remarques</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={2}
                placeholder="Précisions sur la livraison, service demandeur..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer & Soumettre la Commande</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
