import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Building,
  Calendar,
  FileCheck2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BordereauCnamgsPdfModal({ batch, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !batch) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Bordereau-CNAMGS-${numeroBordereau}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const numeroBordereau = batch.numeroBordereau || batch.referenceBordereau || batch.id || 'BORD-CNAMGS-2026';
  const moisReference = batch.moisReference || batch.mois || batch.periode || 'Période 2026';
  const nombreFactures = batch.nombreFactures || batch.nbFactures || 0;
  const montantTotalReclameXaf = batch.montantTotalReclameXaf !== undefined ? batch.montantTotalReclameXaf : (batch.montantTotalCnamgs || 0);
  const montantLiquideXaf = batch.montantLiquideXaf !== undefined ? batch.montantLiquideXaf : (batch.montantLiquide || 0);
  const montantRejeteXaf = batch.montantRejeteXaf !== undefined ? batch.montantRejeteXaf : (batch.montantRejete || 0);
  
  const tauxCalcul = montantTotalReclameXaf > 0 ? ((montantLiquideXaf / montantTotalReclameXaf) * 100).toFixed(1) : (batch.tauxAcceptation || '0.0');
  const responsableLiquidation = batch.responsableLiquidation || 'M. Sylvain NDONG OBIANG (Directeur des Prestations CNAMGS)';
  const referenceVirement = batch.referenceVirement || (batch.montantVire > 0 ? `VIR-TRESOR-${batch.id}` : 'En attente ordonnancement Trésor');
  const observations = batch.observations || batch.notes || 'Télétransmission consolidée des prestations OPN/CNAMGS.';

  const isPaye = batch.statut === 'PAYE_VIREMENT' || batch.statut === 'VIRE_TRESOR';

  const verificationUrl = `https://opn.ga/verify/cnamgs/${numeroBordereau}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in duration-200">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Bordereau Mensuel CNAMGS</h3>
                <span className="px-2 py-0.5 rounded-sm text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  {numeroBordereau}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Caisse Nationale d'Assurance Maladie et de Garantie Sociale • OPN Gabon</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-md bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
              title="Fermer la prévisualisation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div 
            ref={printRef}
            className="w-full max-w-[210mm] bg-white p-8 sm:p-10 shadow-lg print:shadow-none border border-slate-200 print:border-none rounded-sm print:rounded-none text-slate-800 font-sans text-xs print:text-[11px] print:w-full"
            style={{ minHeight: '297mm' }}
          >
            {/* Flag Bar */}
            <div className="h-2 w-full flex rounded-xs overflow-hidden mb-5">
              <div className="bg-[#009E60] flex-1"></div>
              <div className="bg-[#FCD116] flex-1"></div>
              <div className="bg-[#3A75C4] flex-1"></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5 mb-5">
              <div className="w-1/2">
                <div className="flex items-center gap-3 mb-2">
                  <OpnLogo className="h-10 w-auto" />
                  <div>
                    <h2 className="font-extrabold text-xs text-slate-900 tracking-tight uppercase">Office Pharmaceutique National</h2>
                    <p className="text-[9.5px] text-slate-600 font-medium">Direction Administrative et Financière</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Hub Central d'Owendo • B.P. 2244 Libreville<br />
                  Cellule Tiers-Payant & Télétransmission CNAMGS
                </p>
              </div>

              <div className="w-1/2 text-right">
                <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">RÉPUBLIQUE GABONAISE</h3>
                <p className="text-[9px] text-slate-600 font-semibold italic">Union — Travail — Justice</p>
                <div className="mt-1 text-[10px] text-slate-700 font-bold uppercase">
                  Ministère des Affaires Sociales & de la Santé
                </div>
                <div className="text-[9px] text-emerald-800 font-bold uppercase">
                  Caisse Nationale d'Assurance Maladie et de Garantie Sociale (CNAMGS)
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg mb-5 text-center relative overflow-hidden border border-slate-800">
              <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-emerald-400">
                BORDEREAU DE LIQUIDATION TIERS-PAYANT CNAMGS
              </h1>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                N° Bordereau : <span className="font-mono text-white font-bold">{numeroBordereau}</span> • Mois de Référence : <span className="text-emerald-300 font-bold">{moisReference}</span>
              </p>
            </div>

            {/* Status Summary Banner */}
            <div className={`p-3.5 rounded-lg border flex items-center justify-between mb-5 ${
              isPaye 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`w-5 h-5 ${isPaye ? 'text-emerald-600' : 'text-blue-600'}`} />
                <div>
                  <h4 className="font-bold text-xs uppercase">
                    STATUT DU BORDEREAU : {batch.statutLabel || batch.statut || 'En instruction'}
                  </h4>
                  <p className="text-[10px] opacity-80 mt-0.5">
                    {isPaye ? `Lot liquidé et viré le ${batch.dateReglement || batch.dateTransmission} (${referenceVirement})` : 'En cours d\'instruction technique par la direction des prestations CNAMGS.'}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isPaye ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {nombreFactures} FACTURES GROUPÉES
              </span>
            </div>

            {/* Financial Details Table */}
            <div className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white px-3 py-2 font-bold text-[11px] uppercase flex justify-between items-center">
                <span>Synthèse Financière de la Liquidation Mensuelle</span>
                <span className="text-[10px] font-normal text-emerald-300">Transmission GEF Électronique</span>
              </div>
              <table className="w-full text-left border-collapse text-[11px]">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-700">Date de Télétransmission du Lot :</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900 text-right">{batch.dateTransmission}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">Nombre de Factures Établissements Rattachées :</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 text-right">{nombreFactures} factures</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-700">Montant Total Brut des Prestations Réclamé :</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900 text-right">{formatXAF(montantTotalReclameXaf)}</td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-950 font-black">
                    <td className="py-3 px-4 text-xs">Montant Total Liquidé & Accordé par la CNAMGS :</td>
                    <td className="py-3 px-4 font-mono text-right text-sm text-emerald-800">{formatXAF(montantLiquideXaf)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">Montant Rejeté / En Instance de Justificatif :</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-rose-700 text-right">{formatXAF(montantRejeteXaf)}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-700">Taux d'Admission & Conformité Globale :</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700 text-right">
                      {tauxCalcul}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Observations */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] text-slate-700 mb-6 space-y-1">
              <strong>Observations de la Liquidation CNAMGS :</strong>
              <p className="italic">« {observations} »</p>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[10px] text-slate-500">
                <span>Responsable de Liquidation CNAMGS : <strong>{responsableLiquidation}</strong></span>
                <span>Référence Virement Trésor : <strong>{referenceVirement}</strong></span>
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div className="grid grid-cols-3 gap-4 border-t-2 border-slate-800 pt-4 mt-6">
              
              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">La Directrice Financière OPN</h6>
                  <p className="text-[9px] text-slate-500">Mme Chantal NZENGUE OBIANG</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[TRANSMISSION VALIDÉE]</span>
                  <span className="text-[8.5px] text-slate-400">DAF/OPN/CNAMGS/{batch.dateTransmission}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Direction Financière OPN
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Direction Prestations CNAMGS</h6>
                  <p className="text-[9px] text-slate-500">M. Sylvain NDONG OBIANG</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[LIQUIDATION CONFORME]</span>
                  <span className="text-[8.5px] text-slate-400">CNAMGS/DIR-PREST/2026</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Cachet CNAMGS Libreville
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 flex items-center gap-2.5 bg-slate-50/50 h-28">
                <div className="w-16 h-16 shrink-0 bg-white p-1 rounded border border-slate-200 shadow-sm flex items-center justify-center">
                  <img src={qrSvgUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="text-left overflow-hidden">
                  <h6 className="font-bold text-[9.5px] uppercase text-slate-900 leading-tight">Authenticité ANINF</h6>
                  <p className="text-[8.5px] text-emerald-700 font-bold truncate">CNAMGS-BORD-SECURE</p>
                  <p className="text-[8px] text-slate-500 leading-tight mt-1">
                    Vérification publique ANINF. Tiers-payant souverain.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-400">
              Convention de Tiers-Payant OPN - CNAMGS • Ministère de la Santé & Ministère des Affaires Sociales • République Gabonaise.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
