import React, { useRef } from 'react';
import { X, Printer, Download, Clock, QrCode, ShieldAlert, Phone, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function TableauGardesPdfModal({
  isOpen,
  onClose,
  schedules = []
}) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Tableau-Gardes-Astreintes-OPN-${new Date().getFullYear()}.pdf`;
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
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Tableau Officiel des Gardes & Astreintes Sanitaires 24/7</h3>
              <p className="text-[11px] text-slate-400">Permanence des Soins & Continuité Thérapeutique — OPN Gabon</p>
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
            id="tableau-gardes-print"
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
                    <p className="text-[9px] text-slate-500">Direction des Opérations & Centre d'Opérations d'Urgence (COUS)</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-amber-600 bg-amber-50 text-amber-800 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide mb-1">
                    SERVICE DE GARDE NATIONALE 24/7
                  </div>
                  <p className="text-[10px] text-slate-700 font-bold">Réf : <span className="font-mono text-slate-900">TAB-GARDE-OPN-2026</span></p>
                  <p className="text-[9.5px] text-slate-500">Période : <span className="font-semibold text-slate-700">Septembre / Octobre 2026</span></p>
                  <p className="text-[9px] text-slate-400">Édité le : {dateGeneration}</p>
                </div>
              </div>

              {/* Titre Principal */}
              <div className="text-center bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 mb-6">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  TABLEAU NATIONAL DE ROULEMENT DES GARDES & ASTREINTES PHARMACEUTIQUES
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Continuité de service d'urgence pour le Hub Central Owendo et les 9 Antennes Provinciales
                </p>
              </div>

              {/* Tableau des Astreintes */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                      <th className="py-2.5 px-3">Province & Site</th>
                      <th className="py-2.5 px-3">Type de Garde</th>
                      <th className="py-2.5 px-3">Pharmacien Responsable</th>
                      <th className="py-2.5 px-3">Technicien Froid & Chauffeur</th>
                      <th className="py-2.5 px-3 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {schedules.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{item.province}</p>
                          <p className="text-[10px] text-slate-500">{item.site}</p>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-amber-800">
                          {item.typeGarde}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{item.pharmacienGarde}</p>
                          <p className="text-[10px] font-mono text-emerald-700 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" /> {item.pharmacienTel}
                          </p>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-medium text-slate-800">{item.technicienFroid}</p>
                          <p className="text-[10px] text-slate-500">{item.chauffeurConvoi}</p>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Opérationnel
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Consignes Impératives de Garde */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-xs text-amber-950 space-y-1.5">
                <h5 className="font-bold text-amber-900 uppercase text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> Consignes Opérationnelles Impératives de Permanence :
                </h5>
                <p>1. <strong>Disponibilité Téléphonique 24h/24 :</strong> Les personnels inscrits au présent tableau doivent maintenir leur téléphone de service en veille active permanente.</p>
                <p>2. <strong>Délai de Mobilisation d'Urgence :</strong> Tout déstockage d'urgence (RSSE ou solutés massifs) doit être amorcé sous 30 minutes après alerte du COD.</p>
                <p>3. <strong>Surveillance Thermique Chaîne du Froid :</strong> Relevé manuel obligatoire toutes les 6 heures en cas de coupure SEEG ou bascule groupe électrogène.</p>
              </div>
            </div>

            {/* Pied de Page & Authentification */}
            <div className="border-t-2 border-slate-800 pt-4 mt-4">
              <div className="grid grid-cols-3 items-end text-center">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <div>
                      <p className="text-[8px] text-slate-500 font-mono">ANINF GARDE TAG</p>
                      <p className="text-[9px] font-bold text-slate-800">TAB-GARDE-2026</p>
                      <p className="text-[8px] text-slate-400">www.opn.ga/gardes</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Pharmacien Chef National</p>
                  <p className="text-[9px] text-slate-500 italic">Dr. François MBA ALLOGO</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-[#009e60]">Visa Technique Médical</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Directeur Général</p>
                  <p className="text-[9px] text-slate-500 italic">Pr. Edgard NGOUNDOU</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-slate-800">Approbation & Exécution</p>
                </div>
              </div>

              <div className="mt-3 text-center text-[8px] text-slate-400 border-t border-slate-200 pt-1">
                Office Pharmaceutique National — BP 527 Libreville, Gabon — Permanence Sanitaire Nationale 24/7 : 1410 (Gratuit)
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
