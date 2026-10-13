import React, { useRef } from 'react';
import { X, Printer, Download, ShieldAlert, QrCode, AlertTriangle, CheckCircle2, FileText, User, Building2, MapPin, Phone } from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function RecepisseSignalementPdfModal({
  isOpen,
  onClose,
  report
}) {
  const printRef = useRef(null);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Recepisse-Signalement-${report.id || 'Alerte'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const dateGeneration = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200 border border-slate-300">
        
        {/* Header Modale */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Récépissé Officiel d'Enregistrement de Signalement Citoyen</h3>
              <p className="text-[11px] text-slate-400">Guichet National de Vigilance Citoyenne — OPN Gabon</p>
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

        {/* Zone de contenu A4 imprimable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div 
            ref={printRef}
            id="recepisse-signalement-print"
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
                    <p className="text-[9px] text-slate-500">Direction de l'Inspection Pharmaceutique & des Enquêtes Spéciales</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-rose-600 bg-rose-50 text-rose-800 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide mb-1">
                    DOSSIER D'INSTRUCTION CITOYENNE
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold">N° Dossier : <span className="font-mono text-rose-700">{report.id}</span></p>
                  <p className="text-[9.5px] text-slate-500">Enregistré le : <span className="font-semibold text-slate-700">{report.date}</span></p>
                  <p className="text-[9px] text-slate-400">Canal : Guichet Numérique OPN 2026</p>
                </div>
              </div>

              {/* Titre Principal */}
              <div className="text-center bg-rose-50 border border-rose-200 rounded-lg py-3 px-4 mb-6">
                <h2 className="text-lg font-black text-rose-950 uppercase tracking-tight">
                  RÉCÉPISSÉ OFFICIEL DE SIGNALEMENT & DE CONSTAT DE RUPTURE OU SURTARIFICATION
                </h2>
                <p className="text-xs text-rose-700 mt-0.5 font-medium">
                  Enregistrement garanti au Registre National des Plaintes & Alertes Thérapeutiques de l'OPN
                </p>
              </div>

              {/* Bloc 1 : Identité & Déclarant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h5 className="text-[11px] font-bold uppercase text-slate-600 tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Déclarant & Confidentialité
                  </h5>
                  <div className="space-y-1 text-xs">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Nom & Prénom :</span>
                      <span className="font-bold text-slate-900">{report.anonyme ? 'Déclaration Sous Anonymat Protégé' : report.declarantNom}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Téléphone de Contact :</span>
                      <span className="font-mono text-slate-800">{report.declarantTel}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Protection Légale :</span>
                      <span className="text-emerald-700 font-semibold">Statut Lanceur d'Alerte Sanitaire</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h5 className="text-[11px] font-bold uppercase text-slate-600 tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" /> Structure & Localisation Incriminée
                  </h5>
                  <div className="space-y-1 text-xs">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Établissement :</span>
                      <span className="font-bold text-slate-900">{report.structure}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Province & Ville :</span>
                      <span className="font-semibold text-slate-800">{report.province} ({report.ville})</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Juridiction Sanitaire :</span>
                      <span className="text-slate-700">Direction Régionale de Santé {report.province}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloc 2 : Nature du Signalement & Préjudice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-5">
                <h5 className="text-[11px] font-bold uppercase text-amber-900 tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Qualification des Faits & Médicament Concerné
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="mb-1"><span className="text-slate-500">Motif de l'Infraction :</span> <span className="font-bold text-amber-900">{report.motifLabel}</span></p>
                    <p className="mb-1"><span className="text-slate-500">Médicament Cible :</span> <span className="font-bold text-slate-900">{report.medicament}</span></p>
                    <p><span className="text-slate-500">Justificatif Reçu :</span> <span className="font-semibold text-slate-700">{report.preuveFournie}</span></p>
                  </div>

                  <div className="p-3 bg-white border border-amber-300 rounded-md">
                    <p className="flex justify-between text-slate-700 mb-1">
                      <span>Prix Public Plafonné (Légal) :</span>
                      <span className="font-bold text-emerald-700">{formatXAF(report.prixPlafondXAF)}</span>
                    </p>
                    <p className="flex justify-between text-slate-700 mb-1">
                      <span>Montant Réclamé au Patient :</span>
                      <span className="font-bold text-rose-700">{formatXAF(report.prixFactureXAF)}</span>
                    </p>
                    <p className="flex justify-between font-extrabold text-xs text-rose-900 border-t border-amber-200 pt-1">
                      <span>Surcoût Illégal Constaté :</span>
                      <span>+{formatXAF(report.surcoutXAF)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloc 3 : Déclaration & Circonstances */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-5">
                <h5 className="text-[11px] font-bold uppercase text-slate-700 tracking-wider mb-1">Détail des Circonstances Déclarées par l'Usager :</h5>
                <p className="text-xs text-slate-800 leading-relaxed italic bg-white p-3 rounded border border-slate-200">
                  « {report.description} »
                </p>
              </div>

              {/* Bloc 4 : Décision & Mesures Conservatoires de l'Inspection */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-5">
                <h5 className="text-[11px] font-bold uppercase text-emerald-900 tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Traitement Administratif & Décision d'Inspection
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    {report.statutLabel}
                  </span>
                </h5>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed mb-1">
                  {report.decisionInspection}
                </p>
                <p className="text-[10px] text-emerald-700 italic">
                  Instructeur Référent : {report.reponduPar}
                </p>
              </div>

              {/* Engagements de l'OPN */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-3 text-[10px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 uppercase">Engagements Régaliens de l'Office Pharmaceutique National :</p>
                <p>
                  • Tout dossier enregistré fait l'objet d'une instruction sous 24 à 48 heures ouvrées par la Brigade de Répression des Fraudes Pharmaceutiques.
                </p>
                <p>
                  • Le déclarant peut suivre l'avancement de son dossier en appelant le <strong>1410</strong> muni du numéro <strong>{report.id}</strong>.
                </p>
              </div>
            </div>

            {/* Pied de Page & Authentification */}
            <div className="border-t-2 border-slate-800 pt-4 mt-4">
              <div className="grid grid-cols-3 items-end text-center">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <div>
                      <p className="text-[8px] text-slate-500 font-mono">ANINF TRACKING</p>
                      <p className="text-[9px] font-bold text-rose-700">{report.id}</p>
                      <p className="text-[8px] text-slate-400">www.opn.ga/plaintes</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Inspection Pharmaceutique OPN</p>
                  <p className="text-[9px] text-slate-500 italic">Dr. Jeanne ENGONE</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-[#009e60]">Enregistrement Validé</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Secrétariat Général OPN</p>
                  <p className="text-[9px] text-slate-500 italic">République Gabonaise</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-slate-800">Visa & Récépissé Légal</p>
                </div>
              </div>

              <div className="mt-3 text-center text-[8px] text-slate-400 border-t border-slate-200 pt-1">
                Office Pharmaceutique National — BP 527 Libreville, Gabon — Guichet Citoyen : 1410 (Gratuit) — Email : vigilance.citoyenne@opn.ga
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
