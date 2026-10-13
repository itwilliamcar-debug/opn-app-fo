import React, { useRef } from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import { exportProductsToCSV } from '../../utils/exportCatalog';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function CatalogPdfModal({ isOpen, onClose, products, selectedFamily, searchKeyword }) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = () => {
    const filename = `Catalogue-Officiel-OPN-${new Date().getFullYear()}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const handleCsv = () => {
    exportProductsToCSV(products, selectedFamily);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-md shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Barre d'outils supérieure */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#00A651]/20 rounded-sm border border-[#00A651]/40 text-[#00A651]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Aperçu Document Officiel OPN (DCI)
                <span className="text-[11px] px-2 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 font-normal">
                  {products.length} références
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Génération au format officiel certifié avec en-tête, logo et pied de page institutionnel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              title="Exporter les données au format CSV compatible Excel"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Télécharger CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
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

        {/* Aperçu du document (Feuille A4 officielle) */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex-1 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div ref={printRef} className="max-w-[210mm] w-full mx-auto bg-white p-8 rounded-sm shadow-sm border border-slate-200 font-sans text-xs print:border-none print:shadow-none">
            
            {/* Ruban Tricolore Gabon */}
            <div className="flex h-1.5 w-full mb-4 rounded-xs overflow-hidden">
              <div className="w-1/3 bg-[#009E60]" />
              <div className="w-1/3 bg-[#FCD116]" />
              <div className="w-1/3 bg-[#3A75C4]" />
            </div>

            {/* En-tête Officiel OPN */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="space-y-0.5">
                <div className="text-[11px] font-black text-slate-900 tracking-wide uppercase">
                  RÉPUBLIQUE GABONAISE
                </div>
                <div className="text-[11px] font-bold text-[#00A651]">
                  MINISTÈRE DE LA SANTÉ
                </div>
                <div className="text-[9.5px] text-slate-600 leading-tight pt-1">
                  <strong>Zone Industrielle d'Oloumi</strong> — B.P. 295 Libreville / Gabon<br />
                  Tél : (241) 074 35 79 29 / 01 76 55 07<br />
                  E-mail : Commercial@opn-gabon.com • N° Statistique : 202101009992 L
                </div>
              </div>

              <div className="flex items-center gap-3">
                <OpnLogo className="h-11 w-auto" />
                <div className="text-left font-black text-[11px] leading-tight text-[#2E68B4]">
                  OFFICE<br />PHARMACEUTIQUE<br />NATIONAL
                </div>
              </div>
            </div>

            {/* Titre Bannière Officiel */}
            <div className="bg-[#2E68B4] text-white text-center py-2 px-4 rounded mb-4">
              <h2 className="text-sm sm:text-base font-black tracking-wide uppercase">
                PRODUITS DISPONIBILITES — CATALOGUE OFFICIEL (DCI)
              </h2>
              <p className="text-[10px] text-blue-100 mt-0.5">
                Centrale Nationale d'Achat du Médicament • Tarifs Homologués & Réglementés
              </p>
            </div>

            {/* Metadonnées */}
            <div className="bg-slate-50 border-l-4 border-[#00A651] p-2.5 rounded text-[10px] flex flex-wrap items-center justify-between gap-2 mb-4 text-slate-700">
              <div><strong>Famille :</strong> {selectedFamily} {searchKeyword ? `• Recherche : "${searchKeyword}"` : ''}</div>
              <div><strong>Total :</strong> {products.length} références</div>
              <div><strong>Date :</strong> {dateStr}</div>
            </div>

            {/* Tableau des médicaments */}
            <div className="border border-slate-200 rounded overflow-hidden mb-6">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-[#2E68B4] text-white uppercase text-[9px] font-bold">
                  <tr>
                    <th className="p-2 text-center w-20">Code</th>
                    <th className="p-2">Désignation (DCI)</th>
                    <th className="p-2">Famille</th>
                    <th className="p-2">Forme & Dosage</th>
                    <th className="p-2 text-center">Statut</th>
                    <th className="p-2 text-right">Prix OPN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.slice(0, 100).map((p, idx) => (
                    <tr key={p.code + idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="p-2 font-mono text-center font-bold text-slate-700">{p.code}</td>
                      <td className="p-2 font-semibold text-slate-900">{p.designation}</td>
                      <td className="p-2 text-slate-600">{p.famille || p.categorie}</td>
                      <td className="p-2 text-slate-600">{p.forme} {p.dosage ? `– ${p.dosage}` : ''}</td>
                      <td className="p-2 text-center">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {p.statut === 'STOCK_CRITIQUE' ? 'Critique' : 'Disponible'}
                        </span>
                      </td>
                      <td className="p-2 text-right font-bold text-[#2E68B4]">
                        {p.gratuit || p.prixUnitaireXAF === 0 ? (
                          <span className="text-emerald-700 font-bold text-[9px]">GRATUIT (PNLT)</span>
                        ) : (
                          formatXAF(p.prixUnitaireXAF)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length > 100 && (
                <div className="p-2 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 italic">
                  Aperçu affichant les 100 premiers produits. Le document PDF complet contient l'intégralité des {products.length} références.
                </div>
              )}
            </div>

            {/* Pied de page Légal */}
            <div className="border-t border-slate-300 pt-3 flex items-end justify-between text-[8px] text-slate-500">
              <div className="max-w-[70%] leading-relaxed">
                <strong>Office Pharmaceutique National (OPN)</strong> — Société d'État au Capital de 3 500 000 000 FCFA.<br />
                Siège social : Zone Industrielle d’Oloumi B.P. 295 - Libreville/Gabon • Téléphone : +241 74 35 79 29 • N° d'immatriculation 202101009992 L - RCCM N°RG LBV 2021823001.
              </div>
              <div className="border border-dashed border-blue-500 rounded p-1.5 text-center bg-blue-50 text-blue-900 font-bold">
                Direction des Approvisionnements<br />
                <span className="text-[7px] text-emerald-600">✓ CERTIFICATION OFFICIELLE OPN</span>
              </div>
            </div>

          </div>
        </div>

        {/* Pied de modal avec actions rapides */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>
            Document conforme aux normes LNME de l'Organisation Mondiale de la Santé (OMS).
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCsv}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md font-semibold flex items-center gap-1.5 transition-colors text-xs"
              title="Télécharger au format CSV compatible Excel"
            >
              <Download className="w-4 h-4 text-[#00A651]" />
              <span>Télécharger CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-md font-bold flex items-center gap-1.5 shadow transition-colors text-xs"
              title="Lancer l'impression"
            >
              <Printer className="w-4 h-4 text-slate-200" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#2E68B4] hover:bg-[#215091] text-white rounded-md font-bold flex items-center gap-1.5 shadow transition-colors text-xs"
              title="Enregistrer le document officiel en PDF"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>Enregistrer PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
