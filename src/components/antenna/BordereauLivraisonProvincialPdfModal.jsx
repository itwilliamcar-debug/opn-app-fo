import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  MapPin, 
  Phone, 
  ThermometerSnowflake, 
  FileText 
} from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BordereauLivraisonProvincialPdfModal({
  isOpen,
  onClose,
  order,
  antenna,
}) {
  const printRef = useRef(null);

  if (!isOpen || !order) return null;

  const ant = antenna || {
    nom: 'Antenne Provinciale du Haut-Ogooué',
    ville: 'Franceville',
    province: 'Haut-Ogooué (G2)',
    adresse: 'Zone Industrielle Poto-Poto, Route Nationale 3, Franceville',
    responsable: 'Dr. Paul MBA',
    titreResponsable: 'Pharmacien Chef Provincial',
    contact: '(+241) 077 12 45 80',
  };

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Bordereau-Livraison-${blCode}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const hasColdChain = order.lignes?.some((l) => l.chaineFroid);
  const blCode = order.codeBlAssocie || `BL-${order.provinceCode || 'G2'}-2026-${order.codeCommande.slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#00A651]/20 border border-[#00A651] flex items-center justify-center text-[#00A651]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-[#00A651] uppercase">Document Officiel OPN</span>
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Antenne {ant.province}
                </span>
              </div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                Bordereau de Livraison & Décharge : <span className="text-[#00A651] font-mono">{blCode}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-md bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 Content Area */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white print:p-0 print:m-0">
          
          {/* Institutional Tricolor Ribbon */}
          <div className="h-2 w-full flex rounded-xs overflow-hidden mb-6">
            <div className="w-1/3 bg-[#00A651]" />
            <div className="w-1/3 bg-[#FCD116]" />
            <div className="w-1/3 bg-[#3A75C4]" />
          </div>

          {/* Header Institutional Gabon */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-5">
            <div className="flex items-start gap-4">
              <OpnLogo className="h-11 w-auto" />
              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">RÉPUBLIQUE GABONAISE</p>
                <p className="text-[10px] font-bold text-slate-600">MINISTÈRE DE LA SANTÉ</p>
                <h1 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                  OFFICE PHARMACEUTIQUE NATIONAL (OPN)
                </h1>
                <p className="text-xs font-black text-[#00A651] uppercase tracking-wide mt-0.5">
                  {ant.nom || `Antenne Provinciale de ${ant.ville}`}
                </p>
                <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{ant.adresse}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-sm font-mono font-bold text-xs text-slate-900 mb-1">
                N° {blCode}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                Réf. Commande : <span className="font-mono font-bold text-slate-800">{order.codeCommande}</span>
              </p>
              <p className="text-[10px] text-slate-500">
                Date d'émission : <span className="font-bold text-slate-800">{new Date().toLocaleDateString('fr-FR')}</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Décharge Numérique Validée</span>
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg flex items-center justify-between mb-5 shadow-sm">
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase">BORDEREAU DE LIVRAISON & DE DÉCHARGE</h3>
              <p className="text-[10px] text-slate-300">Distribution Pharmaceutique Provinciale — OPN</p>
            </div>
            {hasColdChain && (
              <div className="px-2.5 py-1 bg-cyan-900/80 border border-cyan-400 rounded text-cyan-200 text-[10px] font-bold flex items-center gap-1.5">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-300" />
                <span>Chaîne du Froid Certifiée (2°C – 8°C)</span>
              </div>
            )}
          </div>

          {/* Destinataire & Emetteur Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Émetteur / Expéditeur</span>
              <p className="font-bold text-slate-900">{ant.nom}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">Responsable : <span className="font-semibold text-slate-800">{ant.responsable}</span> ({ant.titreResponsable})</p>
              <p className="text-slate-600 text-[11px]">Contact Antenne : {ant.contact}</p>
              <p className="text-slate-500 text-[10px] mt-1 italic">Délivré sous visa pharmaceutique provincial OPN.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block mb-1">Destinataire / Structure Bénéficiaire</span>
              <p className="font-bold text-slate-900 text-sm">{order.structureNom}</p>
              <p className="text-slate-700 text-[11px] mt-0.5">Ville & Dépt : <span className="font-semibold">{order.ville}</span> ({order.structureType})</p>
              <p className="text-slate-700 text-[11px]">Demandeur : <span className="font-semibold">{order.demandeurNom}</span></p>
              <p className="text-slate-700 text-[11px]">Contact : {order.contactDemandeur}</p>
            </div>
          </div>

          {/* Products & Lots Table */}
          <div className="mb-6 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold text-[11px]">
                  <th className="py-2 px-3">Code DCI</th>
                  <th className="py-2 px-3">Désignation & Dosage</th>
                  <th className="py-2 px-2 text-center">N° Lot</th>
                  <th className="py-2 px-2 text-center">Péremption</th>
                  <th className="py-2 px-2 text-right">Qté Dde</th>
                  <th className="py-2 px-2 text-right">Qté Liv.</th>
                  <th className="py-2 px-3 text-right">P.U. (XAF)</th>
                  <th className="py-2 px-3 text-right">Total (XAF)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.lignes?.map((item, idx) => {
                  const qte = item.quantiteLivree || item.quantiteAllouee || item.quantiteDemandee;
                  const total = (qte * (item.prixUnitaireXaf || 0));
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-600">{item.codeDci}</td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-slate-900">{item.designation}</div>
                        <div className="text-[10px] text-slate-500">{item.forme} — {item.dosage}</div>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                          {item.lot || 'LT-2026-N1'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-[10px] text-slate-600">
                        {item.peremption || '2028-12-31'}
                      </td>
                      <td className="py-2 px-2 text-right font-medium text-slate-500">{item.quantiteDemandee}</td>
                      <td className="py-2 px-2 text-right font-black text-[#00A651]">{qte}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">
                        {item.prixUnitaireXaf ? item.prixUnitaireXaf.toLocaleString('fr-FR') : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {total.toLocaleString('fr-FR')} XAF
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                  <td colSpan={6} className="py-2.5 px-3 text-right text-xs uppercase tracking-wider">
                    Montant Total Livraison :
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-right text-sm font-black text-[#00A651] font-mono">
                    {order.montantTotalXaf ? order.montantTotalXaf.toLocaleString('fr-FR') : '—'} XAF
                  </td>
                </tr>
                {order.priseEnChargeCnamgsXaf > 0 && (
                  <tr className="bg-emerald-50/70 text-[11px] text-emerald-900 border-t border-emerald-200 font-semibold">
                    <td colSpan={6} className="py-1 px-3 text-right">
                      Dont Prise en charge CNAMGS (Tiers-Payant) :
                    </td>
                    <td colSpan={2} className="py-1 px-3 text-right font-mono font-bold">
                      {order.priseEnChargeCnamgsXaf.toLocaleString('fr-FR')} XAF
                    </td>
                  </tr>
                )}
                {order.resteAChargeXaf > 0 && (
                  <tr className="bg-slate-50 text-[11px] text-slate-700 border-t border-slate-200 font-semibold">
                    <td colSpan={6} className="py-1 px-3 text-right">
                      Reste à charge Structure Sanitaire :
                    </td>
                    <td colSpan={2} className="py-1 px-3 text-right font-mono font-bold text-slate-900">
                      {order.resteAChargeXaf.toLocaleString('fr-FR')} XAF
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* Observations & Security Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Consignes & Mentions Légales
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                Les médicaments et dispositifs médicaux livrés sont certifiés conformes aux standards FEFO et au tarif officiel plafonné de la République Gabonaise. Tout écart ou avarie doit être notifié sous 48h à l'Antenne Provinciale OPN.
              </p>
              {order.observations && (
                <p className="mt-1.5 text-[11px] text-slate-600 font-semibold bg-white p-2 rounded border border-slate-200">
                  Note : {order.observations}
                </p>
              )}
            </div>

            {/* QR Code Discharge Payload */}
            <div className="p-3 rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded p-1 shadow-sm flex items-center justify-center mb-1.5">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold uppercase">QR DÉCHARGE OPN</span>
              <span className="text-[8px] text-slate-300 font-mono mt-0.5 truncate max-w-[180px]">{blCode}</span>
            </div>
          </div>

          {/* Signature Boxes */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t-2 border-slate-200 text-center text-xs">
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[90px] flex flex-col justify-between">
              <span className="font-bold text-slate-800 text-[11px]">Magasinier Émetteur (OPN)</span>
              <div className="text-[10px] text-slate-400 italic">Signature & Date</div>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[90px] flex flex-col justify-between">
              <span className="font-bold text-slate-800 text-[11px]">Chauffeur / Livreur OPN</span>
              <div className="text-[10px] text-slate-400 italic">Signature & Date</div>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[90px] flex flex-col justify-between">
              <span className="font-bold text-slate-800 text-[11px]">Pharmacien / Réceptionnaire</span>
              <div className="text-[10px] text-slate-400 italic">Cachet & Signature Client</div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-xl shrink-0 print:hidden">
          <span className="text-xs text-slate-500">
            Document imprimable • Conforme aux spécifications DGCPMP & OPN Gabon
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-lg bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Enregistrer PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
