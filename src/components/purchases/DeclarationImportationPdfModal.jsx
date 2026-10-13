import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  Ship, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Coins, 
  Anchor, 
  FileCheck2, 
  Calendar, 
  AlertTriangle
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function DeclarationImportationPdfModal({
  isOpen,
  onClose,
  purchaseOrder
}) {
  const documentRef = useRef(null);

  if (!isOpen || !purchaseOrder) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleSavePdf = () => {
    const filename = `Declaration-Importation-${purchaseOrder.numeroCommande || 'DPI'}.pdf`;
    downloadElementAsPdf(documentRef, filename);
  };

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const numDeclaration = `DPI-DGDDI-OPN-${purchaseOrder.numeroCommande ? purchaseOrder.numeroCommande.replace('BC-INT-', '') : '2026-089'}`;
  const totalXaf = purchaseOrder.montantTotalXaf || 121352045;
  const totalDevise = purchaseOrder.montantDevise || 185000;
  const devise = purchaseOrder.devise || 'EUR';

  // Calculs d'exonération souveraine
  const economieDroitsDouane = Math.round(totalXaf * 0.10); // 10% droits de douane économisés
  const economieTVA = Math.round(totalXaf * 0.18); // 18% TVA économisée
  const redevancePortuaireGsez = Math.round(totalXaf * 0.015); // 1.5% frais portuaires Owendo

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-md shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Barre d'actions supérieure (non imprimable) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600 text-white rounded-sm">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                Déclaration Prévisionnelle d'Importation & Exonération Douanière
              </h2>
              <p className="text-[11px] text-slate-400">
                Réf : {numDeclaration} — Guichet Unique DGDDI / Port d'Owendo / OPN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer
            </button>
            <button
              onClick={handleSavePdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer ml-2"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps du Document A4 (Imprimable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0 print:overflow-visible flex justify-center">
          <div ref={documentRef} className="max-w-[210mm] w-full mx-auto bg-white p-8 sm:p-10 rounded-sm shadow-md border border-slate-200 print:shadow-none print:border-none print:p-6 print:m-0 text-slate-900 text-xs">
            
            {/* Liseré tricolore Gabon */}
            <div className="h-2 w-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4] mb-5 rounded-xs" />

            {/* En-tête Institutionnel Gabon & Douanes */}
            <div className="flex justify-between items-start border-b border-slate-300 pb-5 mb-5">
              <div className="space-y-1 max-w-[35%]">
                <p className="font-extrabold text-[11px] tracking-wider text-slate-800 uppercase">
                  RÉPUBLIQUE GABONAISE
                </p>
                <p className="text-[10px] text-slate-600 font-semibold italic">
                  Union — Travail — Justice
                </p>
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-700">MINISTÈRE DU BUDGET & DES COMPTES PUBLICS</p>
                  <p className="text-[10px] font-black text-slate-900">DIRECTION GÉNÉRALE DES DOUANES ET DES DROITS INDIRECTS (DGDDI)</p>
                  <p className="text-[9px] text-slate-600">Bureau des Douanes Port d'Owendo • Guichet Unique</p>
                </div>
              </div>

              {/* Logo OPN Central */}
              <div className="flex flex-col items-center justify-center text-center px-2">
                <OpnLogo className="h-11 w-auto mb-1" />
                <span className="text-[9px] font-black text-slate-800 uppercase">Centrale Nationale d'Achat</span>
              </div>

              {/* Sceau & Visa Douanes */}
              <div className="text-right space-y-1 max-w-[35%]">
                <div className="inline-block p-2 bg-slate-50 border border-slate-300 rounded text-center">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">
                    Direction Générale des Douanes et Droits Indirects
                  </span>
                  <span className="text-xs font-black text-slate-900 block font-mono">
                    SYDONIA WORLD GABON
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    RÉGIME SPÉCIAL SANTÉ 4000 (FRANCHISE TOTALE)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Émis à Libreville, le <strong>{todayStr}</strong>
                </p>
              </div>
            </div>

            {/* Titre du document */}
            <div className="text-center my-4 py-2.5 bg-emerald-50 border-y border-emerald-200">
              <h1 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                DÉCLARATION PRÉVISIONNELLE D'IMPORTATION & DEMANDE D'EXONÉRATION DOUANIÈRE
              </h1>
              <p className="text-[10px] text-emerald-800 font-medium mt-0.5 font-mono">
                Réf : {numDeclaration} • Liée au Bon de Commande International : {purchaseOrder.numeroCommande}
              </p>
            </div>

            {/* Grille des informations d'expédition & Fournisseur */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Cadre Fournisseur & Achat */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  Fournisseur & Commande
                </h3>
                <table className="w-full text-[10.5px]">
                  <tbody>
                    <tr>
                      <td className="text-slate-500 py-0.5 w-1/3">Laboratoire :</td>
                      <td className="font-bold text-slate-900">{purchaseOrder.fournisseurNom}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Origine :</td>
                      <td className="font-semibold text-slate-800">{purchaseOrder.fournisseurPays}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Incoterm :</td>
                      <td className="font-bold text-emerald-800">{purchaseOrder.incoterm || 'CIF Port d\'Owendo'}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Montant Facture :</td>
                      <td className="font-bold text-slate-900 font-mono">
                        {totalDevise.toLocaleString('fr-FR')} {devise} ({totalXaf.toLocaleString('fr-FR')} FCFA)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cadre Maritime & Port d'Owendo */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5 text-blue-600" />
                  Acheminement Maritime & Douanes
                </h3>
                <table className="w-full text-[10.5px]">
                  <tbody>
                    <tr>
                      <td className="text-slate-500 py-0.5 w-1/3">Armateur / Navire :</td>
                      <td className="font-semibold text-slate-800">
                        {purchaseOrder.shipping?.compagnie || 'CMA CGM'} • {purchaseOrder.shipping?.navire || 'CMA CGM MONTEVIDEO'}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Connaissement (BL) :</td>
                      <td className="font-mono font-bold text-blue-900">
                        {purchaseOrder.shipping?.connaissementBL || 'BL-CMACGM-OWE-994102'}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Port d'Arrivée :</td>
                      <td className="font-bold text-slate-900">Port d'Owendo (Terminal GSEZ Gabon)</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">ETA Prévisionnelle :</td>
                      <td className="font-semibold text-slate-800">{purchaseOrder.shipping?.etaOwendo || '2026-09-24'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nomenclature des Produits & Articles LNME */}
            <div className="mb-5">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 flex items-center justify-between">
                <span>Désignation des Médicaments & Produits Essentiels</span>
                <span className="text-[10px] font-normal text-slate-500">Nomenclature LNME 2026 • Code SH 3004</span>
              </h3>

              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[10px]">
                    <th className="py-1.5 px-2 border-r border-slate-300">Code DCI</th>
                    <th className="py-1.5 px-2 border-r border-slate-300">Désignation Commune Internationale (DCI)</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 text-center">Conditionnement</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 text-right">Quantité</th>
                    <th className="py-1.5 px-2 text-right">Valeur CIF (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[10px]">
                  {(purchaseOrder.lignes || []).map((ligne, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : ''}>
                      <td className="py-1.5 px-2 font-mono font-bold text-slate-800 border-r border-slate-300">{ligne.codeDci}</td>
                      <td className="py-1.5 px-2 font-semibold text-slate-900 border-r border-slate-300">{ligne.designation}</td>
                      <td className="py-1.5 px-2 text-center text-slate-600 border-r border-slate-300">{ligne.forme}</td>
                      <td className="py-1.5 px-2 text-right font-bold text-slate-800 border-r border-slate-300">
                        {ligne.quantiteCommandee.toLocaleString('fr-FR')}
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">
                        {(ligne.totalLigneXaf || (ligne.quantiteCommandee * (ligne.prixUnitaireXaf || 800))).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 font-bold border-t-2 border-slate-400 text-[10.5px]">
                    <td colSpan="4" className="py-2 px-2 text-right text-emerald-950 uppercase border-r border-slate-300">
                      Valeur Totale Déclarée CIF Owendo (XAF) :
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-black text-emerald-900">
                      {totalXaf.toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Synthèse Fiscale & Franchise Légale */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded mb-5">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 border-b border-slate-200 pb-1">
                Base Légale de la Franchise Totale de Droits et Taxes à l'Importation
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center text-[10.5px]">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block text-[9.5px]">Droits de Douane (0%)</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    Exonéré (Gain : {economieDroitsDouane.toLocaleString('fr-FR')} FCFA)
                  </span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block text-[9.5px]">TVA à l'Importation (0%)</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    Exonéré (Gain : {economieTVA.toLocaleString('fr-FR')} FCFA)
                  </span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block text-[9.5px]">Frais Portuaires GSEZ Estimés</span>
                  <span className="font-bold text-slate-800 font-mono">
                    ~ {redevancePortuaireGsez.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
              <p className="text-[9.5px] text-slate-600 italic mt-2">
                Conformément à l'Article 245 du Code Général des Impôts et au Décret Présidentiel portant statut d'intérêt national des dotations pharmaceutiques de l'Office Pharmaceutique National.
              </p>
            </div>

            {/* Signatures & Visas Tripartites */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-center">
              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Directeur Général de l'OPN</p>
                  <p className="text-[9px] text-slate-500">Pour le compte de l'État Gabonais</p>
                </div>
                <div className="text-[9.5px] font-mono text-emerald-800 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Dr. Jean-Claude MOUSSAVOU<br />
                  <span className="text-[8px] text-slate-500 font-normal">Signature & Sceau OPN</span>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Directeur du Médicament (DMP)</p>
                  <p className="text-[9px] text-slate-500">Autorisation Sanitaire d'Importation</p>
                </div>
                <div className="text-[9.5px] font-mono text-blue-800 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Visa DMP / ASI-2026-09<br />
                  <span className="text-[8px] text-slate-500 font-normal">Approuvé pour distribution nationale</span>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">L'Inspecteur des Douanes (DGDDI)</p>
                  <p className="text-[9px] text-slate-500">Bureau Principal d'Owendo-Port</p>
                </div>
                <div className="text-[9.5px] font-mono text-slate-900 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Bon à Enlever (BAE)<br />
                  <span className="text-[8px] text-slate-500 font-normal">Régime 4000 Accordé</span>
                </div>
              </div>
            </div>

            {/* Bas de page officiel */}
            <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-500">
              Office Pharmaceutique National (OPN) — Établissement Public à Caractère Industriel et Commercial — B.P. 2228 Libreville (Gabon) • ERP OPN
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
