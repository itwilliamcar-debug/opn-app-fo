import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  FileText, 
  Receipt, 
  ShieldCheck, 
  Coins, 
  TrendingUp, 
  Percent 
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function EtatRapprochementTresorPdfModal({
  isOpen,
  onClose,
  invoices = [],
  kpis = {},
  activePersona
}) {
  const documentRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleSavePdf = () => {
    const filename = `Etat-Rapprochement-Tresor-DGCPT-${new Date().getFullYear()}.pdf`;
    downloadElementAsPdf(documentRef, filename);
  };

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const numEtat = `ETAT-TP-CNAMGS-${new Date().getFullYear()}-09`;

  const totalEmis = invoices.reduce((acc, inv) => acc + (inv.montantTTC || 0), 0);
  const totalPaye = invoices.reduce((acc, inv) => acc + (inv.montantPaye || 0), 0);
  const totalReste = invoices.reduce((acc, inv) => acc + (inv.montantReste || 0), 0);
  const totalCnamgs = invoices.reduce((acc, inv) => acc + (inv.partCnamgs || 0), 0);
  const totalDirect = invoices.reduce((acc, inv) => acc + (inv.partStructure || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-md shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Barre d'actions supérieure (non imprimable) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#2E68B4] text-white rounded-sm">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                État Récapitulatif de Rapprochement Trésor Public & Conciliation CNAMGS
              </h2>
              <p className="text-[11px] text-slate-400">
                Réf : {numEtat} — Document Comptable & Budgétaire Direction Administrative et Financière
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer
            </button>
            <button
              onClick={handleSavePdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer ml-2"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps du Document A4 (Imprimable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0 print:overflow-visible flex justify-center">
          <div ref={documentRef} className="max-w-[210mm] w-full mx-auto bg-white p-8 sm:p-10 rounded-sm shadow-md border border-slate-200 print:shadow-none print:border-none print:p-6 print:m-0 text-slate-900 text-xs">
            
            {/* Liseré tricolore Gabon */}
            <div className="h-2 w-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4] mb-5 rounded-xs" />

            {/* En-tête Institutionnel Gabon */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
              <div className="space-y-1 max-w-[35%]">
                <p className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900">RÉPUBLIQUE GABONAISE</p>
                <p className="text-[9px] font-semibold text-slate-600 italic">Union — Travail — Justice</p>
                <div className="pt-1">
                  <p className="font-bold text-[9px] uppercase text-slate-700">MINISTÈRE DU BUDGET ET DES COMPTES PUBLICS</p>
                  <p className="text-[8px] text-slate-500">Direction Générale de la Comptabilité Publique et du Trésor</p>
                </div>
              </div>

              {/* Logo OPN Central */}
              <div className="flex flex-col items-center justify-center text-center px-2">
                <OpnLogo className="h-11 w-auto mb-1" />
                <span className="text-[9px] font-black text-slate-800 uppercase">Centrale Nationale d'Achat</span>
                <span className="text-[8px] font-bold text-slate-600">DIRECTION ADMINISTRATIVE ET FINANCIÈRE</span>
              </div>

              <div className="text-right w-48 shrink-0 text-[9px] text-slate-600">
                <div className="inline-block bg-slate-900 text-white font-mono text-[9px] px-2.5 py-1 rounded-sm font-bold mb-1">
                  {numEtat}
                </div>
                <p className="font-bold text-slate-900">Date : {todayStr}</p>
                <p className="text-[#00A651] font-bold mt-0.5">EXERCICE BUDGÉTAIRE 2026</p>
                <p className="text-[8px] text-slate-400 font-mono">DGCPT-CONCIL-GA</p>
              </div>
            </div>

            {/* Titre de l'État Récapitulatif */}
            <div className="text-center bg-slate-900 text-white py-3 px-4 rounded-md mb-6 shadow-sm">
              <h1 className="text-base font-black uppercase tracking-wider text-emerald-400">
                ÉTAT RÉCAPITULATIF DE RAPPROCHEMENT TRÉSOR & CONCILIATION CNAMGS
              </h1>
              <p className="text-[10.5px] font-medium text-slate-200 mt-0.5">
                Pointage des Mandatements Publics, Tiers-Payant 100/90/80% et Règlements Hospitaliers
              </p>
            </div>

            {/* 1. Synthèse Financière Consolidée */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-6 text-center">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Total Facturé Émis</span>
                <span className="text-xs font-black text-slate-900">{formatXAF(totalEmis)}</span>
                <span className="text-[8.5px] text-slate-400 block mt-0.5">TVA 0% (Exonération OPN)</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Total Recouvré Trésor</span>
                <span className="text-xs font-black text-[#00A651]">{formatXAF(totalPaye)}</span>
                <span className="text-[8.5px] text-emerald-600 font-bold block mt-0.5">Taux : {totalEmis > 0 ? ((totalPaye / totalEmis) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Prise en Charge CNAMGS</span>
                <span className="text-xs font-black text-[#2E68B4]">{formatXAF(totalCnamgs)}</span>
                <span className="text-[8.5px] text-blue-600 font-bold block mt-0.5">Télétransmission EDI</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Créances Restantes</span>
                <span className="text-xs font-black text-rose-700">{formatXAF(totalReste)}</span>
                <span className="text-[8.5px] text-amber-600 font-bold block mt-0.5">En cours d'ordonnancement</span>
              </div>
            </div>

            {/* 2. Tableau Exhaustif des Factures & Mandatements */}
            <div className="mb-6">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#00A651]" />
                <h2 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                  Tableau des Factures Émises, Prises en Charge CNAMGS et Mandatements Reçus
                </h2>
              </div>

              <div className="overflow-x-auto rounded border border-slate-200">
                <table className="w-full text-left border-collapse text-[9.5px]">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase text-[8.5px]">
                      <th className="p-2 border-r border-slate-800">N° Facture</th>
                      <th className="p-2 border-r border-slate-800">Structure de Santé & Province</th>
                      <th className="p-2 border-r border-slate-800 text-right">Montant TTC</th>
                      <th className="p-2 border-r border-slate-800 text-center">Taux CNAMGS</th>
                      <th className="p-2 border-r border-slate-800 text-right">Part CNAMGS</th>
                      <th className="p-2 border-r border-slate-800 text-right">Montant Réglé</th>
                      <th className="p-2 border-r border-slate-800 text-right">Solde Dû</th>
                      <th className="p-2 text-center">Réf Mandat / Virement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {invoices.map((inv, idx) => (
                      <tr key={inv.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-2 font-mono font-bold text-[#2E68B4] border-r border-slate-200">
                          {inv.numeroFacture || inv.id}
                        </td>
                        <td className="p-2 text-slate-800 border-r border-slate-200">
                          <strong>{inv.structureNom}</strong> ({inv.structureVille})
                        </td>
                        <td className="p-2 font-semibold text-slate-900 text-right border-r border-slate-200 font-mono">
                          {formatXAF(inv.montantTTC)}
                        </td>
                        <td className="p-2 text-center font-bold border-r border-slate-200 text-blue-700">
                          {inv.tauxCnamgs}%
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                          {formatXAF(inv.partCnamgs)}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-700 border-r border-slate-200">
                          {formatXAF(inv.montantPaye || 0)}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-rose-700 border-r border-slate-200">
                          {formatXAF(inv.montantReste || 0)}
                        </td>
                        <td className="p-2 text-center font-mono text-[8.5px] text-slate-600">
                          {inv.referencePaiement || (inv.montantReste === 0 ? 'VIR-TRESOR-OK' : 'En instance TP')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Recommandations DAF & Visa de Clôture */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-6 text-[9.5px] text-slate-700 space-y-1.5">
              <p className="font-bold text-slate-900 uppercase text-[10px]">Observations & Visa de Conformité Comptable :</p>
              <p>
                1. Les bordereaux de télétransmission mensuelle CNAMGS sont transmis selon le protocole EDI normalisé.
              </p>
              <p>
                2. Les mandatements du Trésor Public pour les Centres Hospitaliers Universitaires et Régionaux font l'objet d'un apurement régulier avec un taux d'encaissement consolidé supérieur à 85%.
              </p>
            </div>

            {/* Signatures Officielles & Visas */}
            <div className="border-t-2 border-slate-900 pt-4 mt-6">
              <div className="grid grid-cols-3 gap-6 text-center text-[9px]">
                <div>
                  <p className="font-bold text-slate-700">Le Contrôleur Budgétaire</p>
                  <p className="text-slate-500 italic mt-0.5">Ministère du Budget / DGCPT</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-dashed border-slate-300 px-2 py-1 rounded">
                      [VISA CONTRÔLE BUDGÉTAIRE]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">M. Arsène NTOUTOUME</p>
                </div>

                <div>
                  <p className="font-bold text-slate-700">Le Directeur des Affaires Financières (DAF)</p>
                  <p className="text-slate-500 italic mt-0.5">Visa Rapprochement OPN</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-dashed border-slate-300 px-2 py-1 rounded">
                      [RAPPROCHEMENT DAF CERTIFIÉ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">M. Fabrice MENGUE</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 uppercase">Le Directeur Général de l'OPN</p>
                  <p className="text-slate-500 italic mt-0.5">Approbation & Sceau Officiel</p>
                  <div className="h-14 flex items-center justify-center">
                    <div className="border-2 border-[#2E68B4] rounded-full w-14 h-14 flex items-center justify-center text-[7.5px] font-black text-[#2E68B4] uppercase rotate-[-12deg]">
                      DAF OPN GABON
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">Dr. Jude MBAKOMO</p>
                </div>
              </div>

              {/* Pied de page souverain */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Système ERP OPN Gabon v2.6</span>
                  <span>•</span>
                  <span>Direction Administrative & Financière</span>
                </div>
                <div>
                  État certifié conforme • Page 1 / 1 • Diffusion Comptable & Trésor
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
