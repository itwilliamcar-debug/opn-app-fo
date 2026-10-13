import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Building,
  Calendar,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileCheck2
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function FactureNormaliseePdfModal({ invoice, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Facture-Normalisee-${numeroFacture}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  // Safe field resolution
  const numeroFacture = invoice.numeroFacture || invoice.id || 'OPN-FAC-2026-000';
  const clientNom = invoice.clientNom || invoice.structureNom || 'Structure Sanitaire';
  const clientCode = invoice.clientCode || invoice.structureType || 'CLI-OPN';
  const clientAdresse = invoice.clientAdresse || invoice.structureAdresse || `${invoice.structureVille || 'Libreville'}`;
  const clientNif = invoice.clientNif || invoice.structureNif || 'NIF-998811-G';
  const provinceId = invoice.provinceId || 'G1';
  const numeroBonLivraison = invoice.numeroBonLivraison || invoice.bonCommandeRef || 'BL-OPN-2026';
  const numeroConvention = invoice.numeroConvention || 'CONV-CNAMGS-2026';
  const tauxCnamgs = invoice.tauxPriseEnChargeCnamgs || `${invoice.tauxCnamgs || 90}%`;
  const modeReglement = invoice.modeReglement || invoice.modePaiement || 'Virement Trésor / CNAMGS';
  const compteBancaire = invoice.compteBancaireOpn || `${invoice.banqueOpn || 'BGFIBank Gabon'} • ${invoice.ribOpn || 'GA21 4000 1000 1234 5678 9012 345'}`;
  
  const articles = invoice.articles || invoice.lignes || [];
  const montantBrutHt = invoice.montantBrutHtXaf || invoice.montantHT || invoice.montantTTC || 0;
  const montantNet = invoice.montantNetXaf || invoice.montantTTC || 0;
  const partCnamgs = invoice.partCnamgsXaf !== undefined ? invoice.partCnamgsXaf : (invoice.partCnamgs || 0);
  const partClient = invoice.partClientXaf !== undefined ? invoice.partClientXaf : (invoice.partStructure || 0);
  const soldeRestant = invoice.soldeRestantXaf !== undefined ? invoice.soldeRestantXaf : (invoice.montantReste !== undefined ? invoice.montantReste : 0);
  const observations = invoice.observations || invoice.notes || 'Facture normalisée émise sous convention OPN / Ministère de la Santé.';

  const isPayee = invoice.statut === 'PAYEE' || invoice.statut === 'SOLDEE';
  const isCnamgsPending = invoice.statut === 'EN_ATTENTE_CNAMGS' || invoice.statut === 'PARTIELLEMENT_PAYEE';

  const verificationUrl = `https://opn.ga/verify/facture/${numeroFacture}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in duration-200">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Facture Officielle Normalisée OPN</h3>
                <span className="px-2 py-0.5 rounded-sm text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  {numeroFacture}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Direction Administrative et Financière (DAF) • République Gabonaise</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-md bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
              title="Fermer la prévisualisation"
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
            <div className="h-2 w-full flex rounded-xs overflow-hidden mb-5">
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
                    <h2 className="font-extrabold text-xs text-slate-900 tracking-tight uppercase">Office Pharmaceutique National</h2>
                    <p className="text-[9.5px] text-slate-600 font-medium">Direction Administrative et Financière (DAF)</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">
                  Hub Central d'Owendo • Zone Portuaire • B.P. 2244 Libreville<br />
                  NIF OPN : <strong>900182-Z</strong> • RCCM Libreville N° 2020-B-1102<br />
                  Tél Comptabilité : +241 011 70 20 05 • facturation@opn.ga
                </p>
              </div>

              <div className="w-1/2 text-right">
                <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">RÉPUBLIQUE GABONAISE</h3>
                <p className="text-[9px] text-slate-600 font-semibold italic">Union — Travail — Justice</p>
                <div className="mt-1 text-[10px] text-slate-700 font-bold uppercase">
                  Ministère de la Santé
                </div>
                <div className="text-[9px] text-emerald-800 font-bold uppercase">
                  Service Facturation, Recouvrement & Tiers-Payant
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg mb-5 flex justify-between items-center relative overflow-hidden border border-slate-800">
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-emerald-400">
                  FACTURE OFFICIELLE NORMALISÉE
                </h1>
                <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                  N° Facture : <span className="font-mono text-white font-bold">{numeroFacture}</span> • Émise le : {invoice.dateEmission}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Date d'Échéance :</span>
                <span className="text-xs font-bold text-amber-400 font-mono">{invoice.dateEcheance}</span>
              </div>
            </div>

            {/* Client & Convention Details */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  Client / Structure Sanitaire Facturée
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div>
                    <span className="text-slate-500 block">Raison Sociale :</span>
                    <strong className="text-slate-900 text-xs block">{clientNom}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Code Client :</span>
                    <span className="font-mono font-bold text-slate-800">{clientCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Adresse & Province :</span>
                    <span className="font-medium text-slate-800">{clientAdresse} ({provinceId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">NIF Client :</span>
                    <span className="font-mono text-slate-700">{clientNif}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-[11px] uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Modalités & Convention de Tiers-Payant
                </h4>
                <div className="space-y-1 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">N° Bon de Livraison / BC :</span>
                    <span className="font-mono font-bold text-emerald-800">{numeroBonLivraison}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Convention CNAMGS :</span>
                    <span className="font-mono font-bold text-slate-900">{numeroConvention}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Prise en Charge Caisse :</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      {tauxCnamgs} Tiers-Payant
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Mode de Règlement :</span>
                    <span className="font-medium text-slate-800">{modeReglement}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Articles */}
            <div className="mb-5 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-800 text-white px-3 py-2 font-bold text-[11px] uppercase flex justify-between items-center">
                <span>Désignation des Produits & Médicaments DCI Livrés</span>
                <span className="text-[10px] font-normal text-emerald-300">Prix Public Plafonné Arrêté Ministériel</span>
              </div>
              <table className="w-full text-left border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2 px-3">Code OPN</th>
                    <th className="py-2 px-3">DCI & Désignation</th>
                    <th className="py-2 px-3">Conditionnement</th>
                    <th className="py-2 px-3 text-right">Quantité</th>
                    <th className="py-2 px-3 text-right">Prix Unit. HT</th>
                    <th className="py-2 px-3 text-right">Montant Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {articles.map((item, idx) => {
                    const code = item.code || '010000000';
                    const dci = item.dci || 'Produit DCI';
                    const cond = item.conditionnement || 'Unité';
                    const qte = item.quantite || 0;
                    const pu = item.prixUnitaireXaf || item.prixUnitaire || 0;
                    const total = item.totalLigneXaf || item.montantTotal || (qte * pu);

                    return (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="py-2 px-3 font-mono font-bold text-slate-700">{code}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{dci}</td>
                        <td className="py-2 px-3 text-slate-600">{cond}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-800">{formatNumber(qte)}</td>
                        <td className="py-2 px-3 text-right font-mono">{formatNumber(pu)} XAF</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatXAF(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              {/* Payment Details */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-[10px] space-y-1.5 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 uppercase text-[10.5px] border-b border-slate-200 pb-1 mb-1.5">
                    Coordonnées Bancaires de Règlement :
                  </h5>
                  <p className="text-slate-700 font-mono text-[9.5px] leading-relaxed">
                    {compteBancaire}
                  </p>
                  <p className="text-slate-500 italic mt-1.5 leading-tight">
                    * Mentionner obligatoirement le numéro de facture <strong className="text-slate-900">{numeroFacture}</strong> dans le libellé de votre virement ou chèque.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-600">Statut du Règlement :</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    isPayee ? 'bg-emerald-100 text-emerald-800' : isCnamgsPending ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {invoice.statutLabel || invoice.statut || 'En cours'}
                  </span>
                </div>
              </div>

              {/* Totals Box */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-[11px]">
                <div className="divide-y divide-slate-200 bg-white">
                  <div className="flex justify-between p-2">
                    <span className="text-slate-600 font-medium">Total Brut Hors Taxes (HT) :</span>
                    <span className="font-mono font-bold text-slate-900">{formatXAF(montantBrutHt)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50">
                    <span className="text-slate-600 font-medium">TVA (0% Exonération Légale Médicaments) :</span>
                    <span className="font-mono text-emerald-700 font-semibold">0 XAF (Exonéré)</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-100 font-black text-xs border-t-2 border-slate-300">
                    <span className="text-slate-900">MONTANT TOTAL NET :</span>
                    <span className="font-mono text-emerald-800 text-sm">{formatXAF(montantNet)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-50/70 text-emerald-950 font-bold">
                    <span>Dont Prise en charge CNAMGS ({tauxCnamgs}) :</span>
                    <span className="font-mono">{formatXAF(partCnamgs)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 font-semibold">
                    <span>Part Reste à Charge Client / Structure :</span>
                    <span className="font-mono text-slate-900">{formatXAF(partClient)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-100 font-black text-slate-900">
                    <span>Solde Restant Dû :</span>
                    <span className="font-mono text-rose-700 text-xs">{formatXAF(soldeRestant)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Observations */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600 mb-6">
              <strong>Note / Observations :</strong> {observations}
            </div>

            {/* Signatures & QR Code */}
            <div className="grid grid-cols-3 gap-4 border-t-2 border-slate-800 pt-4 mt-6">
              
              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">Le Caissier / Facturier OPN</h6>
                  <p className="text-[9px] text-slate-500">Service Recouvrement</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[CERTIFIÉ CONFORME]</span>
                  <span className="text-[8.5px] text-slate-400">OPN/FACT/{invoice.dateEmission}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Cachet Service Comptable
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 text-center bg-slate-50/50 flex flex-col justify-between h-28">
                <div>
                  <h6 className="font-bold text-[10px] uppercase text-slate-900">La Directrice Administrative & Financière</h6>
                  <p className="text-[9px] text-slate-500">Mme Chantal NZENGUE OBIANG</p>
                </div>
                <div className="py-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block">[VISA DAF VALIDE]</span>
                  <span className="text-[8.5px] text-slate-400">DAF/OPN/GA/{invoice.dateEmission}</span>
                </div>
                <div className="text-[8.5px] text-slate-500 border-t border-slate-200 pt-0.5">
                  Direction Financière OPN
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2.5 flex items-center gap-2.5 bg-slate-50/50 h-28">
                <div className="w-16 h-16 shrink-0 bg-white p-1 rounded border border-slate-200 shadow-sm flex items-center justify-center">
                  <img src={qrSvgUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="text-left overflow-hidden">
                  <h6 className="font-bold text-[9.5px] uppercase text-slate-900 leading-tight">Authenticité ANINF</h6>
                  <p className="text-[8.5px] text-emerald-700 font-bold truncate">OPN-FACT-SECURE</p>
                  <p className="text-[8px] text-slate-500 leading-tight mt-1">
                    Vérification publique ANINF. Document fiscalement opposable.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-400">
              Office Pharmaceutique National • Établissement Public à Caractère Industriel et Commercial (EPIC) • République Gabonaise.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
