import React, { useState } from 'react';
import { 
  X, 
  Send, 
  FileText, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Calculator,
  Calendar,
  Layers
} from 'lucide-react';
import { INITIAL_INVOICES } from '../../data/billingData';

export default function NewCnamgsBatchModal({ isOpen, onClose, onSaveBatch }) {
  const [period, setPeriod] = useState('09/2026');
  const [monthName, setMonthName] = useState('Septembre 2026');
  const [notes, setNotes] = useState('Télétransmission mensuelle consolidée des factures OPN éligibles au tiers-payant CNAMGS.');
  const [fonds1Checked, setFonds1Checked] = useState(true);
  const [fonds2Checked, setFonds2Checked] = useState(true);
  const [fonds3Checked, setFonds3Checked] = useState(true);
  const [transmissionMode, setTransmissionMode] = useState('TELETRANSMISSION_EDI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter invoices that have CNAMGS share and are in current active period
  const eligibleInvoices = INITIAL_INVOICES.filter(inv => inv.partCnamgs > 0);
  
  const totalFacturesCount = eligibleInvoices.length;
  const totalAmountCnamgs = eligibleInvoices.reduce((acc, inv) => acc + inv.partCnamgs, 0);
  const totalFonds1 = eligibleInvoices.filter(i => i.tauxCnamgs === 100).reduce((acc, i) => acc + i.partCnamgs, 0);
  const totalFonds2 = eligibleInvoices.filter(i => i.tauxCnamgs === 90).reduce((acc, i) => acc + i.partCnamgs, 0);
  const totalFonds3 = eligibleInvoices.filter(i => i.tauxCnamgs === 80).reduce((acc, i) => acc + i.partCnamgs, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const batchId = `BATCH-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newBatch = {
      id: batchId,
      periode: period,
      mois: monthName,
      dateTransmission: now.toISOString().split('T')[0],
      nbFactures: totalFacturesCount,
      montantTotalCnamgs: totalAmountCnamgs,
      montantLiquide: 0,
      montantRejete: 0,
      montantVire: 0,
      tauxAcceptation: 0,
      statut: 'TRANSMIS',
      statutLabel: 'Transmis - En attente validation',
      statutColor: 'bg-amber-100 text-amber-800 border-amber-300',
      referenceBordereau: `BORD-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      modeTransmission: transmissionMode,
      detailsFonds: {
        fonds1GEF: totalFonds1,
        fonds2SalariePublic: totalFonds2,
        fonds3SalariePrive: totalFonds3
      },
      notes: notes
    };

    setTimeout(() => {
      onSaveBatch(newBatch);
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
              <Send className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Nouveau Bordereau Télétransmission CNAMGS</h2>
              <p className="text-xs text-emerald-100">Consolidation mensuelle du Tiers-Payant & Liquidation OPN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Information banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <Building2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold">Protocole CNAMGS / OPN :</span> Ce bordereau consolide les créances de tiers-payant éligibles des structures sanitaires conventionnées pour transmission au guichet unique de liquidation de la CNAMGS (Libreville).
            </div>
          </div>

          {/* Period selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Période Fiscale (Mois/Année)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <select
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    if (e.target.value === '09/2026') setMonthName('Septembre 2026');
                    if (e.target.value === '10/2026') setMonthName('Octobre 2026');
                    if (e.target.value === '11/2026') setMonthName('Novembre 2026');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="09/2026">09/2026 (Septembre 2026)</option>
                  <option value="10/2026">10/2026 (Octobre 2026)</option>
                  <option value="11/2026">11/2026 (Novembre 2026)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Canal de Transmission
              </label>
              <select
                value={transmissionMode}
                onChange={(e) => setTransmissionMode(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="TELETRANSMISSION_EDI">Télétransmission Sécurisée EDI (Recommandé)</option>
                <option value="BORDEREAU_PHYSIQUE_BORDEREAU">Bordereau Physique + Support Numérique (USB/CD)</option>
                <option value="PORTAIL_WEB_CNAMGS">Téléchargement Portail Partenaires CNAMGS</option>
              </select>
            </div>
          </div>

          {/* Fonds inclusion */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Régimes & Fonds CNAMGS Inclus dans ce lot
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className={`flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition-all ${fonds1Checked ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={fonds1Checked}
                    onChange={(e) => setFonds1Checked(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold">Fonds 1 - GEF</span>
                </div>
                <span className="text-[11px] text-slate-500">Gratuité / 100%</span>
                <span className="font-mono font-bold mt-1 text-emerald-800">{totalFonds1.toLocaleString('fr-FR')} FCFA</span>
              </label>

              <label className={`flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition-all ${fonds2Checked ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={fonds2Checked}
                    onChange={(e) => setFonds2Checked(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold">Fonds 2 - Public</span>
                </div>
                <span className="text-[11px] text-slate-500">Fonctionnaires / 90%</span>
                <span className="font-mono font-bold mt-1 text-emerald-800">{totalFonds2.toLocaleString('fr-FR')} FCFA</span>
              </label>

              <label className={`flex flex-col p-3 rounded-xl border text-xs cursor-pointer transition-all ${fonds3Checked ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={fonds3Checked}
                    onChange={(e) => setFonds3Checked(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold">Fonds 3 - Privé</span>
                </div>
                <span className="text-[11px] text-slate-500">Salariés Privés / 80%</span>
                <span className="font-mono font-bold mt-1 text-emerald-800">{totalFonds3.toLocaleString('fr-FR')} FCFA</span>
              </label>
            </div>
          </div>

          {/* Consolidated Summary */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-semibold">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Synthèse Consolidée du Lot
              </span>
              <span>Période : {monthName}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block">Factures Normalisées Associées</span>
                <span className="text-xl font-black text-white">{totalFacturesCount} factures</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total Créance CNAMGS à Réclamer</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {totalAmountCnamgs.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Observations / Références Administratives
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Ex: Référence lettre d'envoi DAF/OPN..."
            />
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
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Télétransmission en cours...' : 'Générer & Télétransmettre à la CNAMGS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
