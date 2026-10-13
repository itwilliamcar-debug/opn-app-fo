import React, { useState } from 'react';
import { X, Plus, TrendingUp, Coins, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PROGRAMMES_SANTE_PUBLIQUE } from '../../data/strategicPlanningData';

export default function NewStrategicPlanModal({ isOpen, onClose, onPlanCreated }) {
  const [anneeFiscale, setAnneeFiscale] = useState('Exercice Budgétaire 2026-2027');
  const [montantGlobalXaf, setMontantGlobalXaf] = useState(18500000000);
  const [objectifsAutonomieMois, setObjectifsAutonomieMois] = useState(6);
  const [observations, setObservations] = useState('Planification souveraine validée conformément aux orientations du Ministère de la Santé.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlan = {
      id: `PNA-${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      reference: `OPN-PNA-${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      anneeFiscale,
      dateAdoption: new Date().toLocaleDateString('fr-FR'),
      statut: 'VALIDE_MINISTERE',
      montantGlobalXaf: Number(montantGlobalXaf),
      montantEngageXaf: Number(montantGlobalXaf) * 0.75,
      tranches: [
        { trimestre: 'T1 (Jan-Mar)', montantPrevuXaf: Number(montantGlobalXaf) / 4, montantExecuteXaf: Number(montantGlobalXaf) / 4, statut: 'CLOTURE_100%' },
        { trimestre: 'T2 (Avr-Jui)', montantPrevuXaf: Number(montantGlobalXaf) / 4, montantExecuteXaf: Number(montantGlobalXaf) / 4, statut: 'CLOTURE_100%' },
        { trimestre: 'T3 (Juil-Sep)', montantPrevuXaf: Number(montantGlobalXaf) / 4, montantExecuteXaf: Number(montantGlobalXaf) / 4, statut: 'EN_COURS_EXECUTION' },
        { trimestre: 'T4 (Oct-Dec)', montantPrevuXaf: Number(montantGlobalXaf) / 4, montantExecuteXaf: 0, statut: 'PROGRAMME_AO' },
      ]
    };

    if (onPlanCreated) {
      onPlanCreated(newPlan);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Actualiser le Plan Directeur Annuel d'Approvisionnement</h3>
              <p className="text-[11px] text-slate-300">Budgétisation Nationale Pluriannuelle OPN</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Exercice Budgétaire / Période</label>
            <input
              type="text"
              required
              value={anneeFiscale}
              onChange={(e) => setAnneeFiscale(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enveloppe Globale Votée (XAF)</label>
              <input
                type="number"
                required
                value={montantGlobalXaf}
                onChange={(e) => setMontantGlobalXaf(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Objectif d'Autonomie Hub (Mois)</label>
              <input
                type="number"
                required
                value={objectifsAutonomieMois}
                onChange={(e) => setObjectifsAutonomieMois(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Synthèse des 5 programmes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Programmes Nationaux de Santé Inclus</label>
            <div className="space-y-1.5">
              {PROGRAMMES_SANTE_PUBLIQUE.map((p) => (
                <div key={p.id} className="p-2 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-800">{p.nom}</span>
                  <span className="font-mono text-emerald-800 font-bold">{p.enveloppeAnnuelleXaf.toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Observations & Arbitrage Budgétaire</label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Valider & Générer Plan Directeur</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
