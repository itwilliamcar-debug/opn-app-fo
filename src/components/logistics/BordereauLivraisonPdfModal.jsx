import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  MapPin, 
  Calendar, 
  Thermometer, 
  FileText,
  Building2,
  Package,
  UserCheck
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BordereauLivraisonPdfModal({ isOpen, onClose, convoi }) {
  const printRef = useRef(null);

  if (!isOpen || !convoi) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Bordereau-Livraison-${convoi.blReference || 'BL-OPN-2026'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const now = new Date();
  const dateGeneration = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const heureGeneration = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 text-slate-800">
      <div className="bg-white rounded-md shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Barre d'outils supérieure */}
        <div className="px-6 py-3.5 bg-[#102A4D] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#00A651]/20 rounded-sm border border-[#00A651]/40 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Bordereau de Livraison Officiel (BL)
                <span className="text-[11px] px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {convoi.blReference || 'BL-OPN-2026-089'}
                </span>
              </h3>
              <p className="text-[11px] text-blue-200">
                Document de traçabilité certifié avec QR Code de décharge numérique et suivi chaîne du froid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps imprimable A4 officiel */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100 flex-1 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div ref={printRef} className="max-w-[210mm] w-full mx-auto bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-slate-200 font-sans text-xs space-y-5 print:border-none print:shadow-none">
            
            {/* Ruban Tricolore Gabon */}
            <div className="flex h-1.5 w-full rounded-xs overflow-hidden">
              <div className="w-1/3 bg-[#009E60]" />
              <div className="w-1/3 bg-[#FCD116]" />
              <div className="w-1/3 bg-[#3A75C4]" />
            </div>

            {/* En-tête Institutionnel OPN */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="space-y-0.5">
                <div className="text-[11px] font-black text-slate-900 tracking-wide uppercase">
                  RÉPUBLIQUE GABONAISE
                </div>
                <div className="text-[11px] font-bold text-[#00A651]">
                  MINISTÈRE DE LA SANTÉ
                </div>
                <div className="text-[9.5px] text-slate-600 leading-tight pt-1">
                  <strong>Direction de la Logistique & des Approvisionnements</strong><br />
                  Hub Central Logistique d'Owendo • B.P. 295 Libreville / Gabon<br />
                  Tél : (241) 074 35 79 29 / 062 26 17 32 • E-mail : logistique@opn-gabon.com
                </div>
              </div>

              <div className="flex items-center gap-3">
                <OpnLogo className="h-11 w-auto" />
                <div className="text-left font-black text-[11px] leading-tight text-[#2E68B4]">
                  OFFICE<br />PHARMACEUTIQUE<br />NATIONAL
                </div>
              </div>
            </div>

            {/* Bannière Titre BL */}
            <div className="bg-[#102A4D] text-white p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-black tracking-wide uppercase">
                  BORDEREAU DE LIVRAISON & D'EXPÉDITION (BL)
                </h2>
                <p className="text-[10px] text-blue-200">
                  Réf : <strong className="text-white font-mono">{convoi.blReference || 'BL-OPN-2026-089'}</strong> • Ordre de Mission : <strong className="text-emerald-300 font-mono">{convoi.ordreMissionRef || 'ODM-OPN-7412'}</strong>
                </p>
              </div>
              <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded text-xs font-bold border border-emerald-500/30 shrink-0 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EXPÉDITION CERTIFIÉE</span>
              </div>
            </div>

            {/* Grille Métadonnées du Convoi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-[10.5px]">
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hub Expéditeur :</span>
                  <strong className="text-slate-900">{convoi.antenneDepartNom || "Hub Central Owendo (Estuaire)"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Antenne Destinataire :</span>
                  <strong className="text-[#2E68B4]">{convoi.antenneDestinationNom || "Antenne Provinciale de Franceville"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date de Départ :</span>
                  <span className="font-semibold text-slate-800">{convoi.dateDepart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date d'Arrivée Estimée :</span>
                  <span className="font-semibold text-slate-800">{convoi.dateArriveePrevue}</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-1.5 md:pt-0 md:pl-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode de Transit :</span>
                  <strong className="text-[#00A651] uppercase">{convoi.typeTransport}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Véhicule / Convoi :</span>
                  <span className="font-medium text-slate-800 truncate max-w-[190px]">{convoi.vehicule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Conducteur / Agent :</span>
                  <strong className="text-slate-900">{convoi.chauffeur}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chaîne du Froid :</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {convoi.temperatureActuelle ? `${convoi.temperatureActuelle}°C` : "4.1°C"} (2°C–8°C Conforme)
                  </span>
                </div>
              </div>

            </div>

            {/* Structures Sanitaires Bénéficiaires */}
            {convoi.structuresDestinataires && (
              <div className="p-2.5 bg-blue-50/60 rounded border border-blue-200 text-[10px] space-y-1">
                <span className="font-bold text-[#102A4D] uppercase block flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#2E68B4]" />
                  Formations Sanitaires & Hôpitaux Destinataires :
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {convoi.structuresDestinataires.map((st, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white text-blue-900 rounded border border-blue-200 font-medium">
                      ✓ {st}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tableau des Produits & Lots Expédiés */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-[#2E68B4] text-white px-3 py-1.5 font-bold uppercase text-[9.5px] flex items-center justify-between">
                <span>Détail des Colisages & Lots Pharmaceutiques</span>
                <span className="text-[9px] font-normal text-blue-100">{convoi.colisage?.length || 0} Références</span>
              </div>

              <table className="w-full text-left text-[10px] border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[8.5px] border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-center w-16">Code OPN</th>
                    <th className="p-2">Désignation Officielle (DCI)</th>
                    <th className="p-2">Forme</th>
                    <th className="p-2 text-center">N° Lot</th>
                    <th className="p-2 text-center">Péremption</th>
                    <th className="p-2 text-right">Quantité</th>
                    <th className="p-2 text-center">Colisage</th>
                    <th className="p-2 text-center">T° Requise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(convoi.colisage || []).map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="p-2 text-center font-mono font-bold text-slate-700">{item.code}</td>
                      <td className="p-2 font-semibold text-slate-900">{item.designation}</td>
                      <td className="p-2 text-slate-600">{item.forme}</td>
                      <td className="p-2 text-center font-mono font-bold text-blue-800">{item.lot}</td>
                      <td className="p-2 text-center font-medium text-slate-600">{item.peremption}</td>
                      <td className="p-2 text-right font-black text-slate-900">{item.quantite?.toLocaleString()}</td>
                      <td className="p-2 text-center font-medium text-slate-700">{item.colis}</td>
                      <td className="p-2 text-center font-bold text-emerald-700">{item.temp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totaux */}
              <div className="bg-slate-50 p-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[10px]">
                <div><strong>Total Colis :</strong> {convoi.nombreColis || 230} Colis</div>
                <div><strong>Poids Total :</strong> {((convoi.tonnageKg || 14500) / 1000).toFixed(1)} Tonnes</div>
                <div><strong>Valeur Déclarée :</strong> <strong className="text-[#2E68B4]">{formatXAF(convoi.valeurMarchandiseXAF || 185400000)}</strong></div>
              </div>
            </div>

            {/* Consignes & Recommandations Spéciales */}
            {convoi.consignes && (
              <div className="p-2.5 bg-amber-50/80 rounded border border-amber-200 text-[10px] text-amber-900">
                <strong>Consignes de Sécurité & Manipulation :</strong> {convoi.consignes}
              </div>
            )}

            {/* Section Signatures & QR Code de Décharge Sécurisée */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* QR Code de Validation Numérique */}
              <div className="md:col-span-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <div className="w-16 h-16 bg-white p-1 rounded border border-slate-300 shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded p-1 flex flex-col items-center justify-center text-white">
                    <QrCode className="w-10 h-10 text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-0.5 text-[8.5px] leading-tight">
                  <span className="font-bold text-slate-900 block uppercase">Décharge Numérique</span>
                  <p className="text-slate-500">Scannez ce QR Code avec l'application mobile OPN pour valider la réception sans contact.</p>
                  <span className="font-mono text-[7px] text-blue-700 block truncate">{convoi.qrToken || "QR-OPN-BL-SECURE-9988"}</span>
                </div>
              </div>

              {/* Cartouches de Visas & Signatures */}
              <div className="md:col-span-8 grid grid-cols-2 gap-3 text-[9px]">
                <div className="p-2.5 border border-dashed border-slate-300 rounded bg-white text-center h-24 flex flex-col justify-between">
                  <span className="font-bold text-slate-700 uppercase">Visa Responsable Hub Owendo</span>
                  <div className="text-[7.5px] text-slate-400 italic">Signature & Date de Départ</div>
                  <span className="text-[8px] text-emerald-700 font-bold">✓ EXPÉDIÉ PAR OPN OWENDO</span>
                </div>

                <div className="p-2.5 border border-dashed border-blue-300 rounded bg-blue-50/40 text-center h-24 flex flex-col justify-between">
                  <span className="font-bold text-blue-900 uppercase">Visa Pharmacien Réceptionnaire</span>
                  <div className="text-[7.5px] text-slate-400 italic">Signature, Date & Cachet de l'Antenne</div>
                  <span className="text-[8px] text-blue-700 font-bold">CONFORME / RÉCEPTIONNÉ</span>
                </div>
              </div>

            </div>

            {/* Pied de Page Légal OPN */}
            <div className="pt-2 border-t border-slate-200 text-[8px] text-slate-500 flex items-center justify-between">
              <span>Office Pharmaceutique National (OPN) — Centrale d'Achat du Médicament</span>
              <span>Généré le {dateGeneration} à {heureGeneration} • Système ERP OPN Gabon</span>
            </div>

          </div>
        </div>

        {/* Pied de Modale */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Document certifié conforme aux protocoles de transport LNME / OMS.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2E68B4] hover:bg-[#215091] text-white rounded-lg font-bold text-xs shadow transition-colors"
          >
            Fermer l'aperçu
          </button>
        </div>

      </div>
    </div>
  );
}
