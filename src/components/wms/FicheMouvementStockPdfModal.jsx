import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building, 
  Calendar, 
  Boxes, 
  ArrowRightLeft, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Truck,
  MapPin
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function FicheMouvementStockPdfModal({ movement, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !movement) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Bon-Mouvement-${movement.id || 'wms'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const verificationUrl = `https://opn.ga/verify/wms/movement/${movement.id}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Bon de Mouvement & Transfert WMS</h3>
                <span className="px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  {movement.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Hub National d'Owendo • Direction des Approvisionnements et de la Logistique</p>
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
                    <p className="text-[10px] text-slate-600 font-medium">Hub Central Logistique d'Owendo (WMS)</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Zone Industrielle et Portuaire d'Owendo • B.P. 2244 Libreville<br />
                  Service Gestion des Stocks & Mouvements de Palettes
                </p>
              </div>

              <div className="w-1/2 text-right">
                <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">RÉPUBLIQUE GABONAISE</h3>
                <p className="text-[9px] text-slate-600 font-semibold italic">Union — Travail — Justice</p>
                <div className="mt-1 text-[10px] text-slate-700 font-bold uppercase">
                  Ministère de la Santé
                </div>
                <div className="text-[9px] text-emerald-800 font-bold uppercase">
                  Bonnes Pratiques de Distribution Pharmaceutique (BPDP)
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg mb-5 text-center relative overflow-hidden border border-slate-800">
              <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-emerald-400">
                BON DE MOUVEMENT & TRANSFERT INTERNE D'EMPLACEMENT
              </h1>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                Réf Mouvement : <span className="font-mono text-white font-bold">{movement.id}</span> • Date & Heure : <span className="text-emerald-300 font-bold">{movement.dateHeure}</span>
              </p>
            </div>

            {/* Movement Type & Operator Summary */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                  Type d'Opération WMS
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Catégorie :</span>
                    <span className="font-bold text-slate-900 uppercase">{movement.typeLabel || movement.typeMouvement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Opérateur de Saisie :</span>
                    <strong className="text-slate-800">{movement.operateur}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Statut Traçabilité :</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded text-[10px]">
                      ENREGISTRÉ WMS
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Trajet & Racks Associés
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Emplacement Source :</span>
                    <span className="font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {movement.emplacementSource}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Emplacement Destination :</span>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {movement.emplacementDestination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Validation Physique :</span>
                    <span className="font-semibold text-slate-700">Contrôle Visuel & Scanner QR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product & Batch Table */}
            <div className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white px-3 py-2 font-bold text-[11px] uppercase flex justify-between items-center">
                <span>Détail du Produit Pharmaceutique Déplacé</span>
                <span className="text-[10px] font-normal text-emerald-300">FEFO Conforme</span>
              </div>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">DCI & Désignation Médicament</th>
                    <th className="py-2.5 px-3">N° Lot Fabricant</th>
                    <th className="py-2.5 px-3 text-right">Quantité Déplacée</th>
                    <th className="py-2.5 px-3 text-center">Unité de Mesure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="py-3 px-3 font-semibold text-slate-900">{movement.dci}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{movement.lotNumero}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-800 text-sm">
                      {formatNumber(movement.quantite)}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">{movement.unite}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Motifs & Observations */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] text-slate-700 mb-6 space-y-1">
              <strong>Motif & Justificatif Opérationnel :</strong>
              <p className="italic">« {movement.motif} »</p>
            </div>

            {/* Signatures & QR Code */}
            <div className="grid grid-cols-3 gap-4 border-t-2 border-slate-800 pt-4 mt-6">
              
              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">L'Agent Cariste / Manutentionnaire</h6>
                  <p className="text-[9px] text-slate-500">{movement.operateur}</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[DÉPLACEMENT EFFECTUÉ]</span>
                  <span className="text-[8.5px] text-slate-400">OWD/CARISTE/{movement.dateHeure.split(' ')[0]}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Visa Manutention
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Le Chef de Magasin WMS</h6>
                  <p className="text-[9px] text-slate-500">M. Marc MBA EDZANG</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[VALIDATION RACK]</span>
                  <span className="text-[8.5px] text-slate-400">WMS/CHEF-MAG/2026</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Hub Owendo
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 flex items-center gap-2.5 bg-slate-50/50 h-28">
                <div className="w-16 h-16 shrink-0 bg-white p-1 rounded border border-slate-200 shadow-sm flex items-center justify-center">
                  <img src={qrSvgUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="text-left overflow-hidden">
                  <h6 className="font-bold text-[9.5px] uppercase text-slate-900 leading-tight">Traçabilité WMS</h6>
                  <p className="text-[8.5px] text-emerald-700 font-bold truncate">OPN-WMS-MOVE</p>
                  <p className="text-[8px] text-slate-500 leading-tight mt-1">
                    Scannable pour audit physique et historique d'allée.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-400">
              Office Pharmaceutique National • Hub Central Logistique d'Owendo • République Gabonaise.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
