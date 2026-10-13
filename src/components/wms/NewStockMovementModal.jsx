import React, { useState } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  Boxes, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { BATCH_RECORDS, WAREHOUSE_LOCATIONS, STORAGE_ZONES } from '../../data/wmsData';

export default function NewStockMovementModal({ isOpen, onClose, onSaveMovement }) {
  const [selectedBatchId, setSelectedBatchId] = useState(BATCH_RECORDS[0]?.id || '');
  const [movementType, setMovementType] = useState('TRANSFERT_EMPLACEMENT');
  const [quantity, setQuantity] = useState(1000);
  const [destLocation, setDestLocation] = useState('ALL-A02-T03-N1');
  const [motif, setMotif] = useState('Réorganisation interne pour optimisation picking FEFO');
  const [operator, setOperator] = useState('M. Marc MBA EDZANG (Chef Magasinier)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentBatch = BATCH_RECORDS.find(b => b.id === selectedBatchId) || BATCH_RECORDS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const movementId = `MVT-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const typeLabels = {
      TRANSFERT_EMPLACEMENT: 'Transfert Inter-Allées',
      ENTREE_RECEPTION: 'Entrée en Stock / Réception',
      SORTIE_EXPEDITION: 'Sortie Expédition Provinciale',
      MISE_QUARANTAINE: 'Mise en Quarantaine / Isolement'
    };

    const typeColors = {
      TRANSFERT_EMPLACEMENT: 'bg-blue-100 text-blue-800',
      ENTREE_RECEPTION: 'bg-emerald-100 text-emerald-800',
      SORTIE_EXPEDITION: 'bg-purple-100 text-purple-800',
      MISE_QUARANTAINE: 'bg-amber-100 text-amber-800'
    };

    const newMovement = {
      id: movementId,
      dateHeure: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
      typeMouvement: movementType,
      typeLabel: typeLabels[movementType] || 'Mouvement WMS',
      typeColor: typeColors[movementType] || 'bg-slate-100 text-slate-800',
      dci: currentBatch.dci,
      lotNumero: currentBatch.id,
      quantite: Number(quantity),
      unite: currentBatch.uniteMesure,
      emplacementSource: currentBatch.emplacementActuel,
      emplacementDestination: destLocation,
      operateur: operator,
      motif: motif
    };

    setTimeout(() => {
      onSaveMovement(newMovement);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <ArrowRightLeft className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Enregistrer un Mouvement de Stock WMS</h2>
              <p className="text-xs text-emerald-100">Hub National d'Owendo • Traçabilité par Lot & Emplacement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Operation Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Type d'Opération WMS
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'TRANSFERT_EMPLACEMENT', label: 'Transfert d\'Emplacement (Rack à Rack)' },
                { id: 'SORTIE_EXPEDITION', label: 'Sortie Préparation Convoi Provincial' },
                { id: 'ENTREE_RECEPTION', label: 'Entrée Réception / Arrivage Maritime' },
                { id: 'MISE_QUARANTAINE', label: 'Mise en Quarantaine (Blocage LNCM)' }
              ].map(t => (
                <label
                  key={t.id}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 font-medium transition-all ${
                    movementType === t.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="mvtType"
                    value={t.id}
                    checked={movementType === t.id}
                    onChange={(e) => setMovementType(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Batch Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Lot & Médicament DCI
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {BATCH_RECORDS.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.dci} — N° Lot: {batch.id} (Dispo: {batch.quantiteStock.toLocaleString('fr-FR')} {batch.uniteMesure} • Exp: {batch.datePeremption})
                </option>
              ))}
            </select>
          </div>

          {/* Location details card */}
          {currentBatch && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5">
                <span>Emplacement Source Actuel :</span>
                <span className="font-mono font-bold text-emerald-400">{currentBatch.emplacementActuel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Régime Thermique Exigé :</span>
                <span className="font-bold text-teal-300">{currentBatch.temperatureStockage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Statut FEFO :</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentBatch.statutFefo === 'CRITIQUE' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {currentBatch.statutFefoLabel}
                </span>
              </div>
            </div>
          )}

          {/* Quantity & Destination Rack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Quantité à Déplacer ({currentBatch?.uniteMesure || 'Unités'})
              </label>
              <input
                type="number"
                min="1"
                max={currentBatch?.quantiteStock || 100000}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Emplacement Rack Destination
              </label>
              <select
                value={destLocation}
                onChange={(e) => setDestLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ALL-A01-T01-N1">ALL-A01-T01-N1 (Zone A — Sol)</option>
                <option value="ALL-A02-T03-N1">ALL-A02-T03-N1 (Zone A — Sol)</option>
                <option value="ALL-A03-T02-N3">ALL-A03-T02-N3 (Zone A — Niveau 3)</option>
                <option value="ALL-B01-CF1-N1">ALL-B01-CF1-N1 (Zone B — Chambre Froide 1)</option>
                <option value="ALL-B02-CF2-N1">ALL-B02-CF2-N1 (Zone B — Chambre Froide 2)</option>
                <option value="ALL-C01-T01-N1">ALL-C01-T01-N1 (Zone C — Solutés)</option>
                <option value="ALL-D01-COF-N1">ALL-D01-COF-N1 (Zone D — Coffre Fort)</option>
                <option value="ALL-E01-QUA-N1">ALL-E01-QUA-N1 (Zone E — Quarantaine LNCM)</option>
                <option value="QUAI-EXPEDITION-01">QUAI-EXPEDITION-01 (Zone Dispatch)</option>
              </select>
            </div>
          </div>

          {/* Motif & Operator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Motif Opérationnel
              </label>
              <input
                type="text"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Ex: Préparation convoi ou réorganisation rack..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Opérateur / Cariste
              </label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Validation WMS en cours...' : 'Valider le Mouvement de Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
