import React, { useRef } from 'react';
import { X, Printer, Download, UserCheck, QrCode, Award, Building2, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function DecisionAffectationPdfModal({
  isOpen,
  onClose,
  affectation
}) {
  const printRef = useRef(null);

  if (!isOpen || !affectation) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Decision-Affectation-${affectation.id || 'RH'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200 border border-slate-300">
        
        {/* Header Modale */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Décision Officielle d'Affectation Provinciale</h3>
              <p className="text-[11px] text-slate-400">Direction des Ressources Humaines — Office Pharmaceutique National</p>
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
            id="decision-affectation-print"
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
                    <p className="text-[9px] text-slate-500">Direction des Ressources Humaines & des Affaires Générales</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-emerald-600 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide mb-1">
                    DÉCISION DU DIRECTEUR GÉNÉRAL
                  </div>
                  <p className="text-[10px] text-slate-700 font-bold">Réf : <span className="font-mono text-emerald-800">{affectation.id}</span></p>
                  <p className="text-[9.5px] text-slate-500">Date de notification : <span className="font-semibold text-slate-700">{affectation.dateDecision}</span></p>
                  <p className="text-[9px] text-slate-400">Date de prise d'effet : {affectation.dateEffet}</p>
                </div>
              </div>

              {/* Titre Principal de la Décision */}
              <div className="text-center bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 mb-6">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  DÉCISION PORTANT AFFECTATION ET NOMINATION SPÉCIALISÉE
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Au titre du renforcement des capacités techniques et pharmaceutiques des Antennes Provinciales
                </p>
              </div>

              {/* Visas Réglementaires */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-5 text-[10px] text-slate-600 space-y-0.5">
                <p><strong>VU</strong> la Constitution de la République Gabonaise ;</p>
                <p><strong>VU</strong> la Loi N° 002/2021 portant réorganisation de l'Office Pharmaceutique National (OPN) ;</p>
                <p><strong>VU</strong> le Décret fixant le statut particulier des personnels spécialisés de l'OPN ;</p>
                <p><strong>VU</strong> les nécessités impérieuses de service et la continuité territoriale d'accès aux médicaments vitaux ;</p>
              </div>

              {/* Dispositif & Identification de l'Agent */}
              <div className="mb-6 space-y-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">ARTICLE 1 : IDENTITÉ DU COLLABORATEUR DÉSIGNÉ</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p><span className="text-slate-500">Nom & Prénom :</span> <strong className="text-slate-900">{affectation.employeNom}</strong></p>
                    <p><span className="text-slate-500">Matricule OPN :</span> <strong className="font-mono text-slate-900">{affectation.matricule}</strong></p>
                    <p><span className="text-slate-500">Grade & Catégorie :</span> <strong className="text-slate-800">{affectation.categorieIndiciaire}</strong></p>
                    <p><span className="text-slate-500">Ancienne Affectation :</span> <span className="text-slate-700">{affectation.ancienPoste}</span></p>
                  </div>
                </div>

                <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/60">
                  <h5 className="text-[11px] font-bold uppercase text-emerald-900 tracking-wider mb-2">ARTICLE 2 : NOUVELLE FONCTION & SITE D'AFFECTATION</h5>
                  <div className="space-y-1.5 text-xs text-emerald-950">
                    <p><span className="text-slate-600">Fonction Assignée :</span> <strong className="text-base text-emerald-900">{affectation.nouveauPoste}</strong></p>
                    <p><span className="text-slate-600">Province & Lieu de Travail :</span> <strong className="text-slate-900">{affectation.provinceDestination} — {affectation.siteDestination}</strong></p>
                    <p><span className="text-slate-600">Motif du Mouvement :</span> <span className="italic">{affectation.motif}</span></p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">ARTICLE 3 : AVANTAGES LIÉS À L'AFFECTATION TERRITORIALE</h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <p className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Prime d'Éloignement & Sujétion :</span>
                      <strong className="font-mono text-slate-900">+{formatXAF(affectation.primeEloignementXAF)} / mois</strong>
                    </p>
                    <p className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Indemnité de Logement :</span>
                      <strong className="font-mono text-slate-900">+{formatXAF(affectation.indemniteLogementXAF)} / mois</strong>
                    </p>
                    <p className="col-span-2 text-slate-600">
                      <span>Logement de Fonction : </span> <strong>{affectation.logementFonction}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-600">
                  <p><strong>ARTICLE 4 :</strong> Le Directeur des Ressources Humaines et le Chef d'Antenne Provinciale sont chargés, chacun en ce qui le concerne, de l'exécution de la présente décision qui sera enregistrée et communiquée partout où besoin sera.</p>
                </div>
              </div>
            </div>

            {/* Pied de Page & Signatures */}
            <div className="border-t-2 border-slate-800 pt-4 mt-4">
              <div className="grid grid-cols-3 items-end text-center">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <div>
                      <p className="text-[8px] text-slate-500 font-mono">ANINF RH TAG</p>
                      <p className="text-[9px] font-bold text-emerald-800">{affectation.id}</p>
                      <p className="text-[8px] text-slate-400">www.opn.ga/rh</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Directeur des Ressources Humaines</p>
                  <p className="text-[9px] text-slate-500 italic">Mme Claire OBIANG</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-[#009e60]">Visa DRH Conforme</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-700 uppercase">Le Directeur Général de l'OPN</p>
                  <p className="text-[9px] text-slate-500 italic">Pr. Edgard NGOUNDOU</p>
                  <div className="h-6" />
                  <p className="text-[9px] font-semibold text-slate-800">Signature & Sceau de l'État</p>
                </div>
              </div>

              <div className="mt-3 text-center text-[8px] text-slate-400 border-t border-slate-200 pt-1">
                Office Pharmaceutique National — BP 527 Libreville, Gabon — Tél : +241 11 70 31 00 — Registre Unique des Personnels OPN 2026
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
