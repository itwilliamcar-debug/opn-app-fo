import React, { useRef } from 'react';
import { X, Printer, Download, Snowflake, QrCode, ShieldCheck, CheckCircle2, Thermometer, Building2, MapPin, Activity } from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function RapportQualificationFroidPdfModal({
  isOpen,
  onClose,
  qualification
}) {
  const printRef = useRef(null);

  if (!isOpen || !qualification) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Rapport-Qualification-Froid-${qualification.id || 'METRO'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200 border border-slate-300">
        
        {/* Header Modale */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-sm">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Rapport Officiel de Qualification Thermique & Cartographie Froid</h3>
              <p className="text-[11px] text-slate-400">Direction de l'Assurance Qualité & Pôle Cryogénie — OPN Gabon</p>
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
            id="rapport-qualification-froid-print"
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
                    <p className="text-[9px] text-slate-500">Direction de la Maintenance, GMAO & Métrologie Biomédicale</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-blue-600 bg-blue-50 text-blue-800 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide mb-1">
                    CERTIFICAT MÉTROLOGIQUE BPD
                  </div>
                  <p className="text-[10px] text-slate-700 font-bold">Réf : <span className="font-mono text-blue-900">{qualification.id}</span></p>
                  <p className="text-[9.5px] text-slate-500">Date d'audit : <span className="font-semibold text-slate-700">{qualification.dateQualification}</span></p>
                  <p className="text-[9px] text-slate-400">Validité jusqu'au : {qualification.dateValidite}</p>
                </div>
              </div>

              {/* Titre Principal */}
              <div className="text-center bg-blue-50/70 border border-blue-200 rounded-lg py-3 px-4 mb-6">
                <h2 className="text-lg font-black text-blue-950 uppercase tracking-tight">
                  RAPPORT OFFICIEL DE QUALIFICATION OPÉRATIONNELLE & CARTOGRAPHIE THERMIQUE
                </h2>
                <p className="text-xs text-blue-800 mt-0.5 font-medium">
                  Conforme aux Lignes Directrices OMS TRS 957 Annexe 5 (Stockage & Distribution des Produits Thermosensibles)
                </p>
              </div>

              {/* Identification de l'Équipement */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">Enceinte Frigorifique Évaluée</h5>
                  <p><span className="text-slate-500">Code Tag OPN :</span> <strong className="font-mono text-slate-900">{qualification.equipementTag}</strong></p>
                  <p><span className="text-slate-500">Désignation :</span> <strong className="text-slate-900">{qualification.equipementNom}</strong></p>
                  <p><span className="text-slate-500">Localisation :</span> <span className="text-slate-700">{qualification.province} — {qualification.site}</span></p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">Protocole Métrologique Appliqué</h5>
                  <p><span className="text-slate-500">Nombre de Sondes PT100 :</span> <strong className="font-mono text-slate-900">{qualification.nombreSondesInstallees} Capteurs Calibrés</strong></p>
                  <p><span className="text-slate-500">Durée d'Enregistrement Continu :</span> <strong className="text-slate-900">{qualification.dureeTestHeures} Heures consécutives</strong></p>
                  <p><span className="text-slate-500">Pas d'Échantillonnage :</span> <span className="text-slate-700">Toutes les 5 minutes</span></p>
                </div>
              </div>

              {/* Résultats & Statistiques Métrologiques */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-5">
                <h5 className="text-xs font-bold uppercase text-emerald-900 tracking-wider mb-3 flex items-center justify-between">
                  <span>Résultats Consolidés de la Cartographie Thermique</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2.5 py-0.5 rounded font-bold">
                    {qualification.resultatLabel}
                  </span>
                </h5>

                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-400 font-medium block">Température Moyenne</span>
                    <span className="text-xl font-black text-emerald-700 font-mono">{qualification.tempMoyenneMesuree}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-400 font-medium block">Point Froid (Minima)</span>
                    <span className="text-xl font-black text-blue-700 font-mono">{qualification.tempMinimaEnregistree}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-400 font-medium block">Point Chaud (Maxima)</span>
                    <span className="text-xl font-black text-amber-700 font-mono">{qualification.tempMaximaEnregistree}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-800 bg-white p-3 rounded-lg border border-emerald-100">
                  <p><strong>• Point Chaud Détecté : </strong> {qualification.pointChaudIdentifie}</p>
                  <p><strong>• Point Froid Détecté : </strong> {qualification.pointFroidIdentifie}</p>
                  <p><strong>• Excursion Hors Plage (+2°C/+8°C) : </strong> <span className="text-emerald-700 font-bold">0 minute (100% de conformité thermique)</span></p>
                </div>
              </div>

              {/* Recommandations Techniques */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900 uppercase text-[11px]">Recommandations d'Exploitation & Maintenance Préventive :</p>
                <p className="italic">« {qualification.recommandations} »</p>
              </div>

              {/* Mention de Validité */}
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-[10px] text-blue-950 space-y-0.5">
                <p><strong>ATTESTATION :</strong> La présente qualification atteste que l'enceinte frigorifique répond intégralement aux exigences des Bonnes Pratiques de Distribution pharmaceutique pour la conservation des vaccins PEV, insulines, sérums antivenimeux et produits sanguins labiles.</p>
              </div>
            </div>

            {/* Pied de Page & Authentification */}
            <div className="border-t-2 border-slate-800 pt-4 mt-4">
              <div className="grid grid-cols-3 items-end text-center">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <div>
                      <p className="text-[8px] text-slate-500 font-mono">ANINF METRO TAG</p>
                      <p className="text-[9px] font-bold text-blue-800">{qualification.id}</p>
                      <p className="text-[8px] text-slate-400">www.opn.ga/metrologie</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">L'Auditeur Métrologue</p>
                  <p className="text-[9px] text-slate-500 italic">{qualification.auditeurMetrologue}</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-[#009e60]">Visa Technique Frigorifique</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Directeur Assurance Qualité</p>
                  <p className="text-[9px] text-slate-500 italic">{qualification.pharmacienResponsable}</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-slate-800">Approbation Pharmaceutique</p>
                </div>
              </div>

              <div className="mt-3 text-center text-[8px] text-slate-400 border-t border-slate-200 pt-1">
                Office Pharmaceutique National — BP 527 Libreville, Gabon — Département GMAO & Froid — Système Central OPN 2026
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
