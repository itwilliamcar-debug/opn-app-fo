import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Building,
  User,
  Pill,
  Calendar,
  ShieldAlert,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function FichePharmacovigilancePdfModal({ report, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Fiche-Pharmacovigilance-${report.id || 'DMP'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const isCritique = report.gravite === 'CRITIQUE_VITAL' || report.gravite === 'CRITIQUE_DECES';
  const isGrave = report.gravite === 'GRAVE_HOSPITALISATION';

  const verificationUrl = `https://opn.ga/verify/pharmacovigilance/${report.id}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Fiche Officielle de Pharmacovigilance</h3>
                <span className="px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-rose-400/20 text-rose-300 border border-rose-400/30 font-mono">
                  {report.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Direction du Médicament et de la Pharmacie (DMP) • OPN Gabon</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600 shadow-sm cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-4 h-4 text-rose-400" />
              <span>Imprimer</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-rose-500/20 cursor-pointer"
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

        {/* Printable Sheet */}
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
                    <p className="text-[10px] text-slate-600 font-medium">Cellule Nationale de Pharmacovigilance & Qualité</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Hub Central d'Owendo • B.P. 2244 Libreville<br />
                  Ligne Alerte 24/7 : +241 011 70 20 00 • pharmacovigilance@opn.ga
                </p>
              </div>

              <div className="w-1/2 text-right">
                <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">RÉPUBLIQUE GABONAISE</h3>
                <p className="text-[9px] text-slate-600 font-semibold italic">Union — Travail — Justice</p>
                <div className="mt-1 text-[10px] text-slate-700 font-bold uppercase">
                  Ministère de la Santé
                </div>
                <div className="text-[9px] text-rose-800 font-bold uppercase">
                  Direction du Médicament et de la Pharmacie (DMP)
                </div>
                <div className="text-[9px] text-slate-600 font-semibold">
                  Centre National de Pharmacovigilance
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg mb-5 text-center relative overflow-hidden border border-slate-800">
              <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-rose-400">
                FICHE OFFICIELLE DE PHARMACOVIGILANCE & D'ALERTE SANITAIRE
              </h1>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                Réf : <span className="font-mono text-white font-bold">{report.id}</span> • N° Dossier DMP : <span className="font-bold text-amber-300">{report.numeroFicheDmp}</span> • Notifié le : {report.dateNotification}
              </p>
            </div>

            {/* Severity Banner */}
            <div className={`p-3.5 rounded-lg border flex items-center justify-between mb-5 ${
              isCritique 
                ? 'bg-rose-100 border-rose-400 text-rose-950' 
                : isGrave 
                ? 'bg-orange-50 border-orange-300 text-orange-950' 
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-3">
                <AlertOctagon className={`w-6 h-6 shrink-0 ${isCritique ? 'text-rose-700 animate-pulse' : 'text-orange-600'}`} />
                <div>
                  <h4 className="font-bold text-xs uppercase">
                    NIVEAU DE GRAVITÉ : {report.gravite.replace('_', ' ')}
                  </h4>
                  <p className="text-[10px] opacity-90 mt-0.5 font-medium">
                    Imputabilité OMS : <strong>{report.imputabiliteOms}</strong> • Statut : <strong>{report.statutInvestigation.replace('_', ' ')}</strong>
                  </p>
                </div>
              </div>

              {report.rappelDeLotDeclenche && (
                <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-700 text-white border border-rose-800 flex items-center gap-1.5 shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  RAPPEL NATIONAL ACTIF
                </span>
              )}
            </div>

            {/* Grid 1: Notificateur & Patient */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-rose-600" />
                  Structure Notificatrice & Déclarant
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Établissement :</span>
                    <span className="font-bold text-slate-900 text-right">{report.structureNotificatrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Professionnel déclarant :</span>
                    <span className="font-semibold text-slate-800 text-right">{report.notificateurNom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Contact direct :</span>
                    <span className="font-medium text-slate-800">{report.notificateurContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Province sanitaire :</span>
                    <span className="font-bold text-teal-700">{report.provinceId}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-600" />
                  Patient & Contexte d'Exposition
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Âge du patient :</span>
                    <span className="font-bold text-slate-900">{report.patientAge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Sexe :</span>
                    <span className="font-semibold text-slate-800">{report.patientSexe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Date d'administration :</span>
                    <span className="font-medium text-slate-800">{report.dateAdministration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Évolution clinique :</span>
                    <span className="font-bold text-emerald-800">{report.evolutionPatient}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Médicament Suspect */}
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 mb-4">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5 text-[11px] uppercase flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-rose-600" />
                Médicament Suspect & Traçabilité du Lot
              </h4>
              <div className="grid grid-cols-3 gap-4 text-[10.5px]">
                <div>
                  <span className="text-slate-500 block">Désignation Produit :</span>
                  <strong className="text-slate-900 text-xs">{report.produitSuspect}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">DCI & Fabricant :</span>
                  <strong className="text-slate-800">{report.dci}</strong> ({report.laboratoire})
                </div>
                <div>
                  <span className="text-slate-500 block">Numéro de Lot Incriminé :</span>
                  <span className="font-mono font-black text-rose-700 text-xs px-2 py-0.5 bg-rose-100 rounded inline-block">
                    {report.numeroLot}
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Description Clinique */}
            <div className="border border-slate-200 rounded-lg p-3.5 bg-white mb-4 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 text-[11px] uppercase">
                Description Clinique de la Réaction / Incident Qualité :
              </h4>
              <p className="text-[11px] text-slate-800 leading-relaxed font-serif">
                « {report.descriptionReaction} »
              </p>
            </div>

            {/* Section: Mesures Prises & Décisions Conservatoires */}
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 mb-6">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 text-[11px] uppercase">
                Mesures Conservatoires Prises par l'OPN & la DMP :
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed italic">
                {report.actionImmediatePrise}
              </p>
            </div>

            {/* Signatures & QR Code */}
            <div className="grid grid-cols-3 gap-4 border-t-2 border-slate-800 pt-4 mt-6">
              
              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Le Notificateur Référent</h6>
                  <p className="text-[9px] text-slate-500">{report.notificateurNom}</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-slate-700 font-bold block">[DÉCLARATION INITIALE]</span>
                  <span className="text-[8.5px] text-slate-400">{report.dateNotification}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Cachet de la Structure
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Cellule Vigilance OPN</h6>
                  <p className="text-[9px] text-slate-500">Dr. François MBA ALLOGO</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-rose-800 font-bold block">[TRANSMIS LNCM / DMP]</span>
                  <span className="text-[8.5px] text-slate-400">OPN/PV/{report.id}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Pharmacien Chef National
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 flex items-center gap-2.5 bg-slate-50/50 h-28">
                <div className="w-16 h-16 shrink-0 bg-white p-1 rounded border border-slate-200 shadow-sm flex items-center justify-center">
                  <img src={qrSvgUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="text-left overflow-hidden">
                  <h6 className="font-bold text-[9.5px] uppercase text-slate-900 leading-tight">Enregistrement DMP</h6>
                  <p className="text-[8.5px] text-rose-700 font-bold truncate">{report.numeroFicheDmp}</p>
                  <p className="text-[8px] text-slate-500 leading-tight mt-1">
                    Vérification officielle ANINF. Transmis au Centre Mondial OMS d'Uppsala (UMC).
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-400">
              Système National de Pharmacovigilance • République Gabonaise • Enregistré selon les directives de l'Organisation Mondiale de la Santé (OMS).
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
