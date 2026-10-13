import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building, 
  Calendar, 
  ClipboardCheck, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Scale,
  FileSpreadsheet
} from 'lucide-react';
import { formatNumber, formatXAF } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function PvInventairePdfModal({ campaign, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !campaign) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `PV-Inventaire-${campaign.numeroPv || 'wms'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const isConforme = campaign.ecartQuantite === 0;
  const verificationUrl = `https://opn.ga/verify/wms/inventory/${campaign.numeroPv}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Procès-Verbal d'Inventaire Tournant WMS</h3>
                <span className="px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  {campaign.numeroPv}
                </span>
              </div>
              <p className="text-xs text-slate-400">Hub Central d'Owendo • Direction Financière & Pharmacie Centrale</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600 shadow-sm cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Imprimer</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-emerald-500/20 cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
              title="Fermer"
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
            <div className="h-2 w-full flex rounded-t overflow-hidden mb-5">
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
                    <h2 className="font-extrabold text-sm text-slate-900 tracking-tight uppercase">Office Pharmaceutique National</h2>
                    <p className="text-[10px] text-slate-600 font-medium">Commission Permanente des Inventaires et de l'Audit Stock</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Hub Central d'Owendo • Zone Portuaire • B.P. 2244 Libreville<br />
                  Direction Administrative et Financière (DAF) • Direction des Approvisionnements
                </p>
              </div>

              <div className="w-1/2 text-right">
                <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">RÉPUBLIQUE GABONAISE</h3>
                <p className="text-[9px] text-slate-600 font-semibold italic">Union — Travail — Justice</p>
                <div className="mt-1 text-[10px] text-slate-700 font-bold uppercase">
                  Ministère de la Santé
                </div>
                <div className="text-[9px] text-emerald-800 font-bold uppercase">
                  Contrôle des Stocks & Régularisations Comptables
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg mb-5 text-center relative overflow-hidden border border-slate-800">
              <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-emerald-400">
                PROCÈS-VERBAL OFFICIEL D'INVENTAIRE TOURNANT
              </h1>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                N° PV : <span className="font-mono text-white font-bold">{campaign.numeroPv}</span> • Zone Ciblée : <span className="text-emerald-300 font-bold">{campaign.zoneNom}</span>
              </p>
            </div>

            {/* Executive Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Stock Théorique WMS</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {formatNumber(campaign.stockTheoriqueTotal)}
                </span>
                <span className="text-[9.5px] text-slate-500 block">Unités enregistrées</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Stock Physique Compté</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {formatNumber(campaign.stockPhysiqueCompte)}
                </span>
                <span className="text-[9.5px] text-slate-500 block">Unités vérifiées sur rack</span>
              </div>

              <div className={`p-3 border rounded-lg ${
                isConforme ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <span className="text-[10px] uppercase font-bold block mb-0.5">Taux de Concordance</span>
                <span className="text-base font-black font-mono">
                  {campaign.tauxConformiteStock}%
                </span>
                <span className="text-[9.5px] block font-bold">
                  {isConforme ? 'Aucun écart' : `Écart : ${formatNumber(campaign.ecartQuantite)} un.`}
                </span>
              </div>
            </div>

            {/* Discrepancies Table (Lignes d'écarts) */}
            <div className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white px-3 py-2 font-bold text-[11px] uppercase flex justify-between items-center">
                <span>Détail des Écarts et Justifications Techniques</span>
                <span className="text-[10px] font-normal text-emerald-300">
                  {campaign.lignesEcart.length} ligne(s) d'ajustement
                </span>
              </div>
              <table className="w-full text-left border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2 px-3">Désignation DCI & Lot</th>
                    <th className="py-2 px-3 text-right">Théorique</th>
                    <th className="py-2 px-3 text-right">Physique</th>
                    <th className="py-2 px-3 text-right">Écart</th>
                    <th className="py-2 px-3 text-right">Impact Valeur XAF</th>
                    <th className="py-2 px-3">Cause / Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {campaign.lignesEcart.length > 0 ? (
                    campaign.lignesEcart.map((ligne, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-900 block">{ligne.dci}</span>
                          <span className="font-mono text-[9.5px] text-slate-500">{ligne.lot}</span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono">{formatNumber(ligne.theorique)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">{formatNumber(ligne.reel)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">{formatNumber(ligne.ecart)}</td>
                        <td className="py-2 px-3 text-right font-mono font-black text-slate-900">{formatXAF(ligne.valeurXaf)}</td>
                        <td className="py-2 px-3 text-slate-600 italic text-[10px]">{ligne.cause}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-emerald-700 font-bold bg-emerald-50/30">
                        ✓ Aucun écart constaté lors du comptage physique. Stock 100% conforme.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Impact & Conclusions */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] text-slate-700 mb-6 space-y-1.5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <span className="font-bold text-slate-900 uppercase text-[11px]">Impact Financier Net de l'Inventaire :</span>
                <span className={`font-mono font-black text-xs ${campaign.valeurEcartXaf < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {formatXAF(campaign.valeurEcartXaf)}
                </span>
              </div>
              <div>
                <strong>Synthèse de la Commission :</strong>
                <p className="italic text-slate-600 mt-0.5">« {campaign.justificationEcart} »</p>
              </div>
            </div>

            {/* Tripartite Signatures & QR Code */}
            <div className="grid grid-cols-3 gap-4 border-t-2 border-slate-800 pt-4 mt-6">
              
              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Le Chef de Magasin Owendo</h6>
                  <p className="text-[9px] text-slate-500">{campaign.responsableInventaire}</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[COMPTAGE CERTIFIÉ]</span>
                  <span className="text-[8.5px] text-slate-400">{campaign.dateCloture}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Visa Équipe Comptage
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Le Pharmacien Chef National</h6>
                  <p className="text-[9px] text-slate-500">{campaign.superviseurPharma}</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[CONFORMITÉ FEFO]</span>
                  <span className="text-[8.5px] text-slate-400">PHARMA/OPN/2026</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Direction Technique
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 flex items-center gap-2.5 bg-slate-50/50 h-28">
                <div className="w-16 h-16 shrink-0 bg-white p-1 rounded border border-slate-200 shadow-sm flex items-center justify-center">
                  <img src={qrSvgUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="text-left overflow-hidden">
                  <h6 className="font-bold text-[9.5px] uppercase text-slate-900 leading-tight">Audit Légal OPN</h6>
                  <p className="text-[8.5px] text-emerald-700 font-bold truncate">OPN-INV-VALID</p>
                  <p className="text-[8px] text-slate-500 leading-tight mt-1">
                    Certification officielle pour le commissariat aux comptes.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-400">
              Procès-Verbal d'Inventaire Physique des Stocks • Office Pharmaceutique National • République Gabonaise.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
