import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Building,
  Calendar,
  Wallet
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';

export default function RecordPaymentModal({ invoice, isOpen, onClose, onRecordPayment }) {
  const [montantRegle, setMontantRegle] = useState(invoice ? invoice.soldeRestantXaf : 0);
  const [modeReglement, setModeReglement] = useState('Virement Trésor Public');
  const [referenceTransaction, setReferenceTransaction] = useState(`VIR-TRESOR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().slice(0, 10));
  const [compteBancaire, setCompteBancaire] = useState('BGFI Bank Gabon • Compte Trésorerie OPN');

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payAmount = Number(montantRegle);
    const newEncaisse = (invoice.montantEncaisseXaf || 0) + payAmount;
    const newSolde = Math.max(0, invoice.montantNetXaf - newEncaisse);
    const newStatut = newSolde === 0 ? 'PAYEE' : 'PARTIELLEMENT_PAYEE';

    onRecordPayment(invoice.id, {
      montantEncaisseXaf: newEncaisse,
      soldeRestantXaf: newSolde,
      statut: newStatut,
      modeReglement: `${modeReglement} (Réf: ${referenceTransaction})`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Enregistrement d'un Encaissement</h3>
              <p className="text-xs text-slate-400">{invoice.numeroFacture} • {invoice.clientNom}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Invoice Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Montant Total Facturé :</span>
              <strong className="font-mono text-slate-900">{formatXAF(invoice.montantNetXaf)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Déjà Encaissé :</span>
              <span className="font-mono font-semibold text-emerald-700">{formatXAF(invoice.montantEncaisseXaf || 0)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
              <span className="text-slate-700">Solde Restant Dû :</span>
              <span className="font-mono text-rose-700 text-sm">{formatXAF(invoice.soldeRestantXaf)}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Montant à Encaisser (XAF)</label>
            <input
              type="number"
              required
              min="1"
              max={invoice.soldeRestantXaf}
              value={montantRegle}
              onChange={(e) => setMontantRegle(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono font-black text-emerald-900 text-base"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mode de Règlement</label>
            <select
              value={modeReglement}
              onChange={(e) => setModeReglement(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="Virement Trésor Public">Virement Trésor Public (Mandatement Administratif)</option>
              <option value="Virement Bancaire BGFI">Virement Bancaire Direct (BGFI)</option>
              <option value="Compensation Tiers-Payant CNAMGS">Compensation Tiers-Payant CNAMGS</option>
              <option value="Chèque Bancaire Certifié">Chèque Bancaire Certifié</option>
              <option value="Versement Espèces en Caisse OPN">Versement Espèces en Caisse OPN</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Référence du Paiement / Transaction</label>
            <input
              type="text"
              required
              value={referenceTransaction}
              onChange={(e) => setReferenceTransaction(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date d'Encaissement</label>
              <input
                type="date"
                required
                value={datePaiement}
                onChange={(e) => setDatePaiement(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Compte Crédité</label>
              <input
                type="text"
                value={compteBancaire}
                onChange={(e) => setCompteBancaire(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-[11px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-2 shadow-md hover:shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider l'Encaissement</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
