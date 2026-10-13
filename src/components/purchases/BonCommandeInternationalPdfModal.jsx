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
  Globe, 
  FileText,
  Coins,
  Landmark,
  CreditCard,
  Ship
} from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BonCommandeInternationalPdfModal({
  isOpen,
  onClose,
  purchaseOrder,
}) {
  const printRef = useRef(null);

  if (!isOpen || !purchaseOrder) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Bon-Commande-${purchaseOrder.numeroCommande || 'PO'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const po = purchaseOrder;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between rounded-t-md shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#00A651]/20 border border-[#00A651] flex items-center justify-center text-[#00A651]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-[#00A651] uppercase">Achat International OPN</span>
                <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {po.incoterm}
                </span>
              </div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Bon de Commande : <span className="text-[#00A651]">{po.numeroCommande}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-md bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors ml-2 cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 Content Area */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white print:p-0 print:m-0">
          
          {/* Institutional Tricolor Ribbon */}
          <div className="h-2 w-full flex rounded-t overflow-hidden mb-6">
            <div className="w-1/3 bg-[#00A651]" />
            <div className="w-1/3 bg-[#FCD116]" />
            <div className="w-1/3 bg-[#3A75C4]" />
          </div>

          {/* Institutional Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-5">
            <div className="space-y-1 max-w-[35%]">
              <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">RÉPUBLIQUE GABONAISE</p>
              <p className="text-[10px] font-bold text-slate-600">MINISTÈRE DE LA SANTÉ</p>
              <h1 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
                OFFICE PHARMACEUTIQUE NATIONAL
              </h1>
              <p className="text-[10px] font-black text-[#00A651] uppercase tracking-wide mt-0.5">
                Direction des Approvisionnements & Achats Internationaux
              </p>
              <p className="text-[9px] text-slate-500 mt-1">
                Zone Portuaire d'Owendo • BP 295 Libreville
              </p>
            </div>

            {/* Logo OPN Central */}
            <div className="flex flex-col items-center justify-center text-center px-2">
              <OpnLogo className="h-11 w-auto mb-1" />
              <span className="text-[9px] font-black text-slate-800 uppercase">Centrale Nationale d'Achat</span>
            </div>

            <div className="text-right shrink-0 max-w-[35%]">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-black text-xs rounded mb-1">
                {po.numeroCommande}
              </div>
              <p className="text-[10px] text-slate-500">
                Date d'émission : <span className="font-bold text-slate-800">{po.dateCommande}</span>
              </p>
              <p className="text-[10px] text-slate-500">
                Livraison prévisionnelle : <span className="font-bold text-slate-800">{po.dateLivraisonPrevue}</span>
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mandat d'Importation Valide</span>
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-slate-900 text-white px-4 py-3 rounded-lg flex items-center justify-between mb-5 shadow-sm">
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase">BON DE COMMANDE INTERNATIONAL / PURCHASE ORDER</h3>
              <p className="text-[10px] text-slate-300">Approvisionnement en produits pharmaceutiques et dispositifs médicaux</p>
            </div>
            <div className="px-3 py-1 bg-[#00A651] rounded text-white font-mono font-bold text-xs">
              Devise : {po.devise} (1 {po.devise} = {po.tauxChange} XAF)
            </div>
          </div>

          {/* Supplier & Commercial Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
            {/* Supplier Info */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Fournisseur / Laboratoire Fabricant
              </span>
              <p className="font-black text-slate-900 text-sm">{po.fournisseurNom}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">Pays : <strong className="text-slate-800">{po.fournisseurPays}</strong> (Code : {po.fournisseurCode})</p>
              <p className="text-slate-600 text-[11px]">Agrément République Gabonaise : <strong className="text-emerald-700">Conforme DMP / OMS</strong></p>
              <p className="text-slate-600 text-[11px] mt-1 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Règlement : {po.conditionsPaiement}</span>
              </p>
            </div>

            {/* Terms of Delivery */}
            <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block mb-1">
                Modalités de Livraison & Fret
              </span>
              <p className="font-bold text-slate-900">Incoterm : <span className="text-emerald-800 font-black">{po.incoterm}</span></p>
              <p className="text-slate-700 text-[11px] mt-0.5">Mode : <strong className="text-slate-900">{po.shipping?.mode || 'Maritime'}</strong> ({po.shipping?.compagnie || 'CMA CGM'})</p>
              <p className="text-slate-700 text-[11px]">Port de destination : <strong>Port d'Owendo (Libreville - Gabon)</strong></p>
              <p className="text-slate-700 text-[11px] mt-0.5">Conteneurs prévus : <strong>{po.shipping?.nombreConteneurs || 'Fret conteneurisé'}</strong></p>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="mb-6 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold text-[11px]">
                  <th className="py-2.5 px-3">Code DCI</th>
                  <th className="py-2.5 px-3">Désignation Internationale & Dosage</th>
                  <th className="py-2.5 px-2 text-center">Forme</th>
                  <th className="py-2.5 px-3 text-right">Quantité Commandée</th>
                  <th className="py-2.5 px-3 text-right">P.U. ({po.devise})</th>
                  <th className="py-2.5 px-3 text-right">Total ({po.devise})</th>
                  <th className="py-2.5 px-3 text-right">Contrevaleur (XAF)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {po.lignes?.map((ligne, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-600">{ligne.codeDci}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{ligne.designation}</td>
                    <td className="py-2 px-2 text-center text-[10px] text-slate-600">{ligne.forme}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      {ligne.quantiteCommandee?.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">
                      {ligne.prixUnitaireDevise?.toFixed(2)} {po.devise}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                      {ligne.totalLigneDevise?.toLocaleString('fr-FR')} {po.devise}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-black text-[#00A651]">
                      {ligne.totalLigneXaf?.toLocaleString('fr-FR')} XAF
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                  <td colSpan={5} className="py-3 px-3 text-right uppercase tracking-wider text-xs">
                    Montant Total Commande ({po.incoterm}) :
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-sm text-slate-900">
                    {po.montantDevise?.toLocaleString('fr-FR')} {po.devise}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-sm text-[#00A651]">
                    {po.montantTotalXaf?.toLocaleString('fr-FR')} XAF
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Observations & Security QR Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
            <div className="md:col-span-2 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Conditions Spéciales d'Exécution & Contrôle Qualité
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                1. Les produits doivent être accompagnés du Certificat d'Analyse (CoA) officiel et disposer d'une durée de validité résiduelle minimale de 80% à l'arrivée au Port d'Owendo.
                <br />
                2. Les emballages et étiquetages doivent respecter la réglementation de la République Gabonaise (DCI en langue française).
              </p>
            </div>

            {/* QR Code Verification */}
            <div className="p-3 rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded p-1 shadow-sm flex items-center justify-center mb-1.5">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold uppercase">VISA SOUVERAIN OPN</span>
              <span className="text-[8px] text-slate-300 font-mono mt-0.5 truncate max-w-[180px]">{po.numeroCommande}</span>
            </div>
          </div>

          {/* Official 4-Visa Boxes Block */}
          <div className="border-t-2 border-slate-200 pt-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Circuit des Visas & Signatures Réglementaires
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
              
              {/* 1. Acheteur */}
              <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 min-h-[85px] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-[10px] block">1. Chargé d'Achats</span>
                  <span className="text-[9px] text-emerald-700 font-bold">✓ Émis & Chiffré</span>
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">{po.acheteurNom || 'Sandrine AVOMO'}</div>
              </div>

              {/* 2. Directeur Appro */}
              <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 min-h-[85px] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-[10px] block">2. Directeur Appro (DIR)</span>
                  <span className="text-[9px] text-emerald-700 font-bold">✓ Visa Technique</span>
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">{po.visaDir?.signataire || 'Pierre ONDO'}</div>
              </div>

              {/* 3. DAF */}
              <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 min-h-[85px] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-[10px] block">3. Directeur Financier (DAF)</span>
                  <span className={`text-[9px] font-bold ${po.visaDaf?.statut === 'VALIDE' ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {po.visaDaf?.statut === 'VALIDE' ? 'Visa budgétaire & L/C' : 'En attente'}
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">{po.visaDaf?.signataire || 'Eric BOULINGUI'}</div>
              </div>

              {/* 4. DG */}
              <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 min-h-[85px] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-[10px] block">4. Directeur Général (DG)</span>
                  <span className={`text-[9px] font-bold ${po.visaDg?.statut === 'SIGNE' ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {po.visaDg?.statut === 'SIGNE' ? 'Signature DG' : 'En attente'}
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 font-semibold">{po.visaDg?.signataire || 'Dr. Jean-Claude MOUSSAVOU'}</div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-xl shrink-0 print:hidden">
          <span className="text-xs text-slate-500">
            Document imprimable • Conforme aux règles d'importation OPN & BEAC
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
