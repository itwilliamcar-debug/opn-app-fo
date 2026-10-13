import React, { useRef } from 'react';
import { X, Printer, Download, Wrench, QrCode, ShieldCheck, CheckCircle2, Coins, Clock, Building2, MapPin } from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BonInterventionGmaoPdfModal({
  isOpen,
  onClose,
  workOrder
}) {
  const printRef = useRef(null);

  if (!isOpen || !workOrder) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Bon-Intervention-GMAO-${workOrder.id || 'OT'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200 border border-slate-300">
        
        {/* Header Modale */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Ordre de Travail & Bon d'Intervention Technique GMAO</h3>
              <p className="text-[11px] text-slate-400">Direction de la Maintenance & Sécurité des Infrastructures — OPN Gabon</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-2 cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zone A4 imprimable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div 
            ref={printRef}
            id="bon-intervention-gmao-print"
            className="bg-white text-slate-800 p-8 sm:p-10 rounded-sm shadow-md border border-slate-200 print:shadow-none print:border-none print:p-6 print:m-0 w-full max-w-[210mm] min-h-[297mm] relative flex flex-col justify-between text-xs"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {/* Liseré Tricolore Gabon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4] mb-6 rounded-xs" />

            <div>
              {/* En-tête Institutionnel Gabonais */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-5 mb-6">
                <div className="flex items-start gap-4">
                  <OpnLogo className="h-10 w-auto" />
                  <div>
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800">RÉPUBLIQUE GABONAISE</h4>
                    <p className="text-[10px] text-slate-500 font-medium italic">Union — Travail — Justice</p>
                    <div className="h-0.5 w-12 bg-[#009e60] my-1" />
                    <p className="text-[10px] font-bold text-slate-700 uppercase">MINISTÈRE DE LA SANTÉ</p>
                    <p className="text-[10px] font-extrabold text-[#009e60]">OFFICE PHARMACEUTIQUE NATIONAL (OPN)</p>
                    <p className="text-[9px] text-slate-500">Service de la GMAO & Maintenance des Équipements Biomédicaux</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-amber-600 bg-amber-50 text-amber-900 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide mb-1">
                    ORDRE DE TRAVAIL GMAO
                  </div>
                  <p className="text-[10px] text-slate-700 font-bold">N° OT : <span className="font-mono text-amber-800">{workOrder.id}</span></p>
                  <p className="text-[9.5px] text-slate-500">Date d'émission : <span className="font-semibold text-slate-700">{workOrder.dateCreation}</span></p>
                  <p className="text-[9px] text-slate-400">Date clôture : {workOrder.dateCloture}</p>
                </div>
              </div>

              {/* Titre Principal */}
              <div className="text-center bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 mb-6">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  RAPPORT D'INTERVENTION TECHNIQUE & BON DE TRAVAIL TERMINÉ
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {workOrder.typeOTLabel} — Priorité : {workOrder.priorite}
                </p>
              </div>

              {/* Identification de l'Équipement & Localisation */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">Équipement Concerné</h5>
                  <p><span className="text-slate-500">Désignation :</span> <strong className="text-slate-900">{workOrder.equipementNom}</strong></p>
                  <p><span className="text-slate-500">Localisation :</span> <span className="text-slate-700">{workOrder.province} — {workOrder.site}</span></p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">Intervenant Assigné</h5>
                  <p><span className="text-slate-500">Technicien Frigoriste :</span> <strong className="text-slate-900">{workOrder.technicienAssigne}</strong></p>
                  <p><span className="text-slate-500">Temps d'Arrêt Machine :</span> <strong className="text-emerald-700 font-mono">{workOrder.tempsArretMinutes} Minutes</strong></p>
                  <p><span className="text-slate-500">Statut Final :</span> <strong className="text-emerald-800">{workOrder.statutLabel}</strong></p>
                </div>
              </div>

              {/* Diagnostic & Travaux Réalisés */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg mb-5 space-y-3 text-xs">
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-600 tracking-wider mb-1">Description des Travaux & Diagnostic Technique :</h5>
                  <p className="text-slate-800 italic bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                    « {workOrder.description} »
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Pièces & Consommables Remplacés :</span>
                    <p className="font-semibold text-slate-900">{workOrder.piecesChangees}</p>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-900 block mb-1">Coût Global des Travaux (Pièces + MO) :</span>
                    <p className="text-base font-black text-emerald-700 font-mono">{formatXAF(workOrder.coutTotalXAF)}</p>
                  </div>
                </div>
              </div>

              {/* Essais de Remise en Service & Mesures de Sécurité */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 text-[10px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 uppercase">Contrôles de Remise en Service Effectués :</p>
                <p>• Test de fuite fluide frigorigène / étanchéité circuit : <strong>Conforme (0 ppm)</strong>.</p>
                <p>• Contrôle des sécurités électriques (disjoncteurs différentiels, relais thermiques) : <strong>Conforme</strong>.</p>
                <p>• Température stabilisée à la consigne nominale (+4.0°C) : <strong>Vérifiée sur sonde IoT</strong>.</p>
              </div>
            </div>

            {/* Pied de Page & Authentification */}
            <div className="border-t-2 border-slate-800 pt-4 mt-4">
              <div className="grid grid-cols-3 items-end text-center">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <div>
                      <p className="text-[8px] text-slate-500 font-mono">ANINF GMAO TAG</p>
                      <p className="text-[9px] font-bold text-slate-800">{workOrder.id}</p>
                      <p className="text-[8px] text-slate-400">www.opn.ga/gmao</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Technicien Intervenant</p>
                  <p className="text-[9px] text-slate-500 italic">{workOrder.technicienAssigne}</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-[#009e60]">Visa Travaux Terminés</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Responsable du Site</p>
                  <p className="text-[9px] text-slate-500 italic">{workOrder.visaChefSite}</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-slate-800">Validation & Réception</p>
                </div>
              </div>

              <div className="mt-3 text-center text-[8px] text-slate-400 border-t border-slate-200 pt-1">
                Office Pharmaceutique National — BP 527 Libreville, Gabon — Tél : +241 11 70 31 00 — Registre GMAO & GMAO Central 2026
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
