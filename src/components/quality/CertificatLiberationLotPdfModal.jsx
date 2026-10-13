import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Building,
  Calendar,
  Thermometer,
  QrCode,
  Award
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function CertificatLiberationLotPdfModal({ inspection, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !inspection) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Certificat-Liberation-${inspection.numeroCertificat || 'LNCM'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const isConforme = inspection.statut === 'LIBERE_CONFORME';
  const isQuarantaine = inspection.statut === 'QUARANTAINE_INVESTIGATION';
  const isRejete = inspection.statut === 'REJETE_NON_CONFORME';

  const verificationUrl = `https://opn.ga/verify/certificat/${inspection.numeroCertificat}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Certificat Officiel de Libération de Lot</h3>
                <span className="px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  {inspection.numeroCertificat}
                </span>
              </div>
              <p className="text-xs text-slate-400">Laboratoire National de Contrôle du Médicament (LNCM) • OPN Gabon</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600 shadow-sm cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Imprimer</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-teal-500/20 cursor-pointer"
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

        {/* Printable Document Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div 
            ref={printRef}
            className="w-full max-w-[210mm] bg-white p-8 sm:p-10 shadow-lg print:shadow-none border border-slate-200 print:border-none rounded-sm print:rounded-none text-slate-800 font-sans text-xs print:text-[11px] print:w-full"
            style={{ minHeight: '297mm' }}
          >
            {/* Tricolor Top Bar */}
            <div className="h-2 w-full flex rounded-t overflow-hidden mb-5">
              <div className="bg-[#009E60] flex-1"></div>
              <div className="bg-[#FCD116] flex-1"></div>
              <div className="bg-[#3A75C4] flex-1"></div>
            </div>

            {/* Header Gabon & OPN / LNCM */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-5 mb-5">
              <div className="w-1/2">
                <div className="flex items-center gap-3 mb-2">
                  <OpnLogo className="h-10 w-auto" />
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900 tracking-tight uppercase">Office Pharmaceutique National</h2>
                    <p className="text-[10px] text-slate-600 font-medium">Direction de l'Assurance Qualité & Conformité</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Hub Central d'Owendo • Zone Industrielle • B.P. 2244 Libreville<br />
                  Tél : +241 011 70 20 00 • Email : qualite.lncm@opn.ga
                </p>
              </div>

              <div className="w-1/2 text-right">
                <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">RÉPUBLIQUE GABONAISE</h3>
                <p className="text-[9px] text-slate-600 font-semibold italic">Union — Travail — Justice</p>
                <div className="mt-1 text-[10px] text-slate-700 font-bold uppercase">
                  Ministère de la Santé
                </div>
                <div className="text-[9px] text-teal-800 font-bold uppercase">
                  Direction du Médicament et de la Pharmacie (DMP)
                </div>
                <div className="text-[9px] text-slate-600 font-semibold">
                  Laboratoire National de Contrôle du Médicament (LNCM)
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg mb-5 text-center relative overflow-hidden border border-slate-800">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>
              <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-teal-400">
                CERTIFICAT DE CONTRÔLE QUALITÉ & DE LIBÉRATION DE LOT
              </h1>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                Réf. Officielle : <span className="font-mono text-white font-bold">{inspection.numeroCertificat}</span> • Date d'Émission : {inspection.dateControle}
              </p>
            </div>

            {/* Statut Banner */}
            <div className={`p-3 rounded-lg border flex items-center justify-between mb-5 ${
              isConforme 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : isQuarantaine 
                ? 'bg-amber-50 border-amber-300 text-amber-950' 
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2.5">
                {isConforme && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {isQuarantaine && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
                {isRejete && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                <div>
                  <h4 className="font-bold text-xs uppercase">
                    {isConforme && "Décision : LOT CONFORME — LIBÉRÉ POUR DISTRIBUTION NATIONALE"}
                    {isQuarantaine && "Décision : LOT EN QUARANTAINE — INVESTIGATION ANALYTIQUE EN COURS"}
                    {isRejete && "Décision : LOT NON CONFORME — SÉQUESTRE & PROCÉDURE DE REJET"}
                  </h4>
                  <p className="text-[10px] opacity-80 mt-0.5">
                    {isConforme && "Conforme aux spécifications de l'AMM Gabon, de l'OMS et des pharmacopées de référence."}
                    {isQuarantaine && "Distribution strictement bloquée jusqu'à l'obtention des résultats complémentaires."}
                    {isRejete && "Interdiction absolue de dispensation sur toute l'étendue du territoire national."}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isConforme ? 'bg-emerald-600 text-white' : isQuarantaine ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {inspection.statut.replace('_', ' ')}
              </span>
            </div>

            {/* Section 1: Identification Produit & Fournisseur */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-teal-600" />
                  Identification du Médicament
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Désignation :</span>
                    <span className="font-bold text-slate-900 text-right">{inspection.produitNom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">DCI :</span>
                    <span className="font-semibold text-slate-800 text-right">{inspection.dci}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Forme / Dosage :</span>
                    <span className="font-medium text-slate-800">{inspection.forme} • {inspection.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Code OPN :</span>
                    <span className="font-mono font-bold text-teal-700">{inspection.produitCode}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  Traçabilité du Lot & Fabricant
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Numéro de Lot :</span>
                    <span className="font-mono font-bold text-slate-900 text-right">{inspection.numeroLot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fabricant / Labo :</span>
                    <span className="font-semibold text-slate-800 text-right">{inspection.laboratoire}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Pays d'Origine :</span>
                    <span className="font-medium text-slate-800">{inspection.paysOrigine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fabrication / Péremption :</span>
                    <span className="font-bold text-slate-900">{inspection.dateFabrication} $\rightarrow$ <span className="text-rose-700">{inspection.datePeremption}</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Quantité Contrôlée :</span>
                    <span className="font-bold text-slate-900">{formatNumber(inspection.quantiteLot)} {inspection.unite}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Tableau des Résultats Analytiques LNCM */}
            <div className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white px-3 py-2 font-bold text-[11px] uppercase flex justify-between items-center">
                <span>Résultats des Essais Physico-Chimiques & Microbiologiques (LNCM)</span>
                <span className="text-[10px] font-normal text-teal-300">Échantillonnage : {inspection.echantillonnageQuantite}</span>
              </div>
              <table className="w-full text-left border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2 px-3">Paramètre Analytique</th>
                    <th className="py-2 px-3">Spécifications Référentiel</th>
                    <th className="py-2 px-3">Résultat Observé</th>
                    <th className="py-2 px-3 text-center">Conformité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Aspect & Conditionnement</td>
                    <td className="py-2 px-3 text-slate-600">Intégrité plaquette/flacon, absence corps étranger</td>
                    <td className="py-2 px-3 text-slate-800">{inspection.aspectVisuel}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isRejete ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {isRejete ? 'NON CONFORME' : 'CONFORME'}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Étiquetage & Mentions Légales</td>
                    <td className="py-2 px-3 text-slate-600">Français, DCI, No Lot, Péremption, AMM Gabon</td>
                    <td className="py-2 px-3 text-slate-800">{inspection.etiquetageFrancais}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isRejete ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {isRejete ? 'NON CONFORME' : 'CONFORME'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Dosage du Principe Actif</td>
                    <td className="py-2 px-3 text-slate-600">95.0% à 105.0% de la valeur déclarée</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{inspection.dosagePrincipeActif}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isConforme ? 'bg-emerald-100 text-emerald-800' : isQuarantaine ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isConforme ? 'CONFORME' : isQuarantaine ? 'EN COURS' : 'REJETÉ'}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Essai de Dissolution / Libération</td>
                    <td className="py-2 px-3 text-slate-600">Q ≥ 80% en 45 min (monographie)</td>
                    <td className="py-2 px-3 text-slate-800">{inspection.essaiDissolution}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isConforme ? 'bg-emerald-100 text-emerald-800' : isQuarantaine ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                        {isConforme ? 'CONFORME' : isQuarantaine ? 'EN COURS' : 'N/A'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Pureté & Impuretés Liées</td>
                    <td className="py-2 px-3 text-slate-600">Impuretés totales ≤ 0.50%</td>
                    <td className="py-2 px-3 text-slate-800">{inspection.pureteChromatographique}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isConforme ? 'bg-emerald-100 text-emerald-800' : isQuarantaine ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isConforme ? 'CONFORME' : isQuarantaine ? 'EN COURS' : 'NON CONFORME'}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-900">Stérilité & Contrôle Microbio</td>
                    <td className="py-2 px-3 text-slate-600">Conformité Ph. Int. / Absence germes pathogènes</td>
                    <td className="py-2 px-3 text-slate-800">{inspection.steriliteControleMicrobio}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isConforme ? 'bg-emerald-100 text-emerald-800' : isQuarantaine ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isConforme ? 'CONFORME' : isQuarantaine ? 'EN COURS' : 'NON CONFORME'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Chaîne du Froid & Transport</td>
                    <td className="py-2 px-3 text-slate-600">Respect strict des spécifications produit</td>
                    <td className="py-2 px-3 text-slate-800">{inspection.temperatureTransport}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${inspection.temperatureTransport.includes('Dépassement') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {inspection.temperatureTransport.includes('Dépassement') ? 'ALERTE' : 'CONFORME'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Observations */}
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 mb-6">
              <h5 className="font-bold text-slate-900 text-[10.5px] uppercase mb-1">Conclusions & Observations Analytiques :</h5>
              <p className="text-[10.5px] text-slate-700 leading-relaxed italic">
                « {inspection.observations} »
              </p>
              <div className="mt-2 pt-1.5 border-t border-slate-200 flex justify-between text-[10px] text-slate-500 font-medium">
                <span>Destination de stockage : <strong className="text-slate-800">{inspection.destinationStock}</strong></span>
                <span>Certificat d'Analyse Fabricant (CoA) : <strong className="text-teal-700">{inspection.numeroCoaFournisseur}</strong></span>
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div className="grid grid-cols-3 gap-4 border-t-2 border-slate-800 pt-4 mt-6">
              
              {/* Box 1: Analyste / LNCM */}
              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">L'Analyste Contrôleur LNCM</h6>
                  <p className="text-[9px] text-slate-500">{inspection.inspecteurLncm}</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-teal-800 font-bold block">[SIGNÉ ÉLECTRONIQUEMENT]</span>
                  <span className="text-[8.5px] text-slate-400">LNCM/GA/P.EDOU/{inspection.dateControle}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Sceau du Laboratoire National
                </div>
              </div>

              {/* Box 2: Pharmacien Chef National OPN */}
              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Le Pharmacien Chef National</h6>
                  <p className="text-[9px] text-slate-500">{inspection.pharmacienResponsableOpn}</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-teal-800 font-bold block">[LIBÉRATION PHARMACEUTIQUE]</span>
                  <span className="text-[8.5px] text-slate-400">OPN/DIR-PHAR/F.MBA/{inspection.dateControle}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Direction Pharmaceutique OPN
                </div>
              </div>

              {/* Box 3: Visa DMP & QR Code */}
              <div className="border border-slate-300 rounded-lg p-2.5 flex items-center gap-2.5 bg-slate-50/50 h-28">
                <div className="w-16 h-16 shrink-0 bg-white p-1 rounded border border-slate-200 shadow-sm flex items-center justify-center">
                  <img src={qrSvgUrl} alt="QR Code Vérification" className="w-full h-full object-contain" />
                </div>
                <div className="text-left overflow-hidden">
                  <h6 className="font-bold text-[9.5px] uppercase text-slate-900 leading-tight">Visa DMP Gabon</h6>
                  <p className="text-[8.5px] text-teal-700 font-bold truncate">{inspection.visaDmp}</p>
                  <p className="text-[8px] text-slate-500 leading-tight mt-1">
                    Vérification publique ANINF/OPN. Ce document certifie la conformité légale et sanitaire.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Notice */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-400">
              Office Pharmaceutique National • Document officiel de conformité sanitaire émis sous l'autorité du Ministère de la Santé de la République Gabonaise.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
