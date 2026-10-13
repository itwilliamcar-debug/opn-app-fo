import React, { useState } from 'react';
import { X, Siren, AlertTriangle, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import { RESERVES_STRATEGIQUES_ETAT } from '../../data/strategicPlanningData';

export default function NewDestockageUrgenceModal({ isOpen, onClose, onDestockageCreated }) {
  const [selectedReserveId, setSelectedReserveId] = useState('RSSE-PALU-01');
  const [motif, setMotif] = useState('Mobilisation Exceptionnelle pour Riposte Palustre en Zone Fluviale');
  const [natureCrise, setNatureCrise] = useState('Pic Saisonnier Épidémique Paludisme (Ngounié & Moyen-Ogooué)');
  const [provincesCibles, setProvincesCibles] = useState('Ngounié, Moyen-Ogooué, Ogooué-Ivindo');
  const [quantitePourcent, setQuantitePourcent] = useState(25); // 25% de la réserve

  if (!isOpen) return null;

  const currentReserve = RESERVES_STRATEGIQUES_ETAT.find(r => r.id === selectedReserveId) || RESERVES_STRATEGIQUES_ETAT[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `DESTOCK-2026-${Math.floor(10 + Math.random() * 90)}`;

    const createdDestockage = {
      id: newId,
      reference: `OPN-DESTOCK-${newId.split('-')[2]}-2026`,
      motif,
      natureCrise,
      provincesCibles,
      dateHeure: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      reserveConcernee: currentReserve.intitule,
      lignes: currentReserve.composition.map(c => {
        const destock = Math.round(c.quantiteReservee * (quantitePourcent / 100));
        return {
          dci: c.dci,
          quantiteReservee: c.quantiteReservee,
          quantiteDestockee: destock,
          quantiteResiduelle: c.quantiteReservee - destock,
          uom: c.uom
        };
      })
    };

    if (onDestockageCreated) {
      onDestockageCreated(createdDestockage);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-950 text-white border-b border-rose-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Déclencher un Déstockage Stratégique d'Urgence Sanitaire</h3>
              <p className="text-[11px] text-rose-200">Procédure Exceptionnelle • Arrêté Ministériel / COD</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-rose-300 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Réserve Stratégique à Mobiliser</label>
            <select
              value={selectedReserveId}
              onChange={(e) => {
                setSelectedReserveId(e.target.value);
                const r = RESERVES_STRATEGIQUES_ETAT.find(res => res.id === e.target.value);
                if (r) {
                  setMotif(`Mobilisation Exceptionnelle pour ${r.intitule}`);
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              {RESERVES_STRATEGIQUES_ETAT.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.intitule} ({r.valeurEstimeeXaf.toLocaleString()} FCFA)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Motif & Intitulé Officiel du Déstockage</label>
            <input
              type="text"
              required
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nature de la Crise / Épidémie</label>
              <input
                type="text"
                required
                value={natureCrise}
                onChange={(e) => setNatureCrise(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Provinces Sanitaires Destinataires</label>
              <input
                type="text"
                required
                value={provincesCibles}
                onChange={(e) => setProvincesCibles(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quantité à Déstocker */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Quote-part Prélevée sur la Réserve</label>
              <span className="font-mono font-bold text-rose-700 text-xs">{quantitePourcent}% du Stock Réserve</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={quantitePourcent}
              onChange={(e) => setQuantitePourcent(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>10% (Min)</span>
              <span>25% (Standard Crise)</span>
              <span>50% (Plafond Légal Max)</span>
            </div>
          </div>

          {/* Aperçu des Lignes Déstockées */}
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
            <span className="text-[10.5px] font-bold text-rose-950 uppercase block mb-1.5">
              Estimation des Prélèvements Thérapeutiques :
            </span>
            <div className="space-y-1 text-xs">
              {currentReserve.composition.map((c, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-rose-100">
                  <span className="font-semibold text-slate-800">{c.dci}</span>
                  <span className="font-mono font-bold text-rose-700">
                    {Math.round(c.quantiteReservee * (quantitePourcent / 100)).toLocaleString()} {c.uom}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Siren className="w-4 h-4" />
              <span>Valider Déstockage & Générer Acte Officiel</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
