import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, AlertTriangle, CheckCircle2, Siren } from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function DeclarationDestockageUrgencePdfModal({ isOpen, onClose, destockage }) {
  const documentRef = useRef(null);
  if (!isOpen || !destockage) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownload = () => {
    const filename = `Declaration-Destockage-${destockage.reference || destockage.id || 'urgence'}.pdf`;
    downloadElementAsPdf(documentRef, filename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
        
        {/* Modal Top Bar (Screen Only) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-rose-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Déclaration de Déstockage d'Urgence Sanitaire</h3>
              <p className="text-[11px] text-slate-300">Réf : {destockage.reference || destockage.id} — Mobilisation Réserve Stratégique</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E68B4] hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* A4 Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          
          <div ref={documentRef} className="w-full max-w-[210mm] min-h-[297mm] bg-white p-8 sm:p-10 shadow-lg print:shadow-none print:p-0 border border-slate-200 print:border-none relative flex flex-col justify-between text-slate-900 font-sans text-xs">
            
            {/* Top Sovereign Tricolor Ribbon */}
            <div className="h-2 w-full bg-gradient-to-r from-[#009E49] via-[#FCD116] to-[#0072CE] absolute top-0 left-0" />

            <div>
              {/* Header Institutionnel */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-5 pt-2">
                <div className="text-center w-52">
                  <p className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 leading-tight">
                    RÉPUBLIQUE GABONAISE
                  </p>
                  <p className="text-[9px] font-semibold text-slate-600 italic">
                    Union — Travail — Justice
                  </p>
                  <div className="w-10 h-0.5 bg-[#009E49] mx-auto my-1.5" />
                  <p className="text-[8.5px] font-bold text-slate-700 uppercase leading-snug">
                    MINISTÈRE DE LA SANTÉ ET DES AFFAIRES SOCIALES
                  </p>
                </div>

                <div className="text-center flex-1 px-4">
                  <div className="flex items-center justify-center mb-1">
                    <OpnLogo className="h-10 w-auto" />
                  </div>
                  <p className="text-[11px] font-black tracking-tight text-rose-700 uppercase">
                    OFFICE PHARMACEUTIQUE NATIONAL
                  </p>
                  <p className="text-[9.5px] font-bold text-slate-800 uppercase">
                    CELLULE OPÉRATIONNELLE DE DÉFENSE SANITAIRE (COD)
                  </p>
                  <p className="text-[8.5px] text-slate-500">
                    Arrêté Ministériel de Mobilisation des Réserves Stratégiques d'État (RSSE)
                  </p>
                </div>

                <div className="text-right w-48 text-[9px] text-slate-600">
                  <p className="font-bold text-slate-900">Acte Officiel :</p>
                  <p className="font-mono text-rose-700 font-black text-[10px]">{destockage.reference || 'DEC-URG-2026-01'}</p>
                  <p className="text-slate-500 mt-1">Date : {destockage.dateHeure || new Date().toLocaleDateString('fr-FR')}</p>
                  <p className="font-mono text-[8px] text-slate-400">RSSE-URGENCE-ETAT</p>
                </div>
              </div>

              {/* Titre Document */}
              <div className="bg-rose-950 text-white rounded-lg p-3.5 mb-5 flex items-center justify-between shadow-xs border border-rose-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[9px] uppercase rounded">
                      DÉCISION DE DÉSTOCKAGE EXCEPTIONNEL
                    </span>
                    <span className="text-rose-200 text-[10px] font-semibold">
                      Réserve Stratégique Sanitaire Inviolable
                    </span>
                  </div>
                  <h1 className="text-base font-extrabold tracking-tight mt-1 text-white">
                    {destockage.motif || 'Mobilisation d\'Urgence pour Riposte Épidémique'}
                  </h1>
                </div>
                <div className="text-right pl-4 border-l border-rose-800">
                  <p className="text-[9px] text-rose-300 uppercase font-semibold">Base Légale</p>
                  <p className="text-xs font-mono font-bold text-white">Arrêté Min. N° 0418/MSAS</p>
                </div>
              </div>

              {/* Grille Informations Contexte de Crise */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                
                {/* Bloc 1 : Justification de Crise */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Contexte & Motif Sanitaire d'Urgence</span>
                  </h4>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nature de la Crise :</span>
                      <span className="font-bold text-rose-800">{destockage.natureCrise || 'Alerte Épidémique Nationale'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Régions Sanitaires Cibles :</span>
                      <span className="font-bold text-slate-900">{destockage.provincesCibles || '9 Provinces'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Autorité Déclarative :</span>
                      <span className="text-slate-800">Ministre de la Santé / Dir. Gén. OPN</span>
                    </div>
                  </div>
                </div>

                {/* Bloc 2 : Emplacement & Logistique */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E68B4]" />
                    <span>Lieu de Déstockage & Vecteur d'Acheminement</span>
                  </h4>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Entrepôt Source :</span>
                      <span className="font-bold text-slate-900">Hub Central d'Owendo (Chambre Forte)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mode d'Expédition :</span>
                      <span className="font-bold text-slate-900">Convoi Rapide Sécurisé COD / Pistes 4x4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Responsable Libération :</span>
                      <span className="text-slate-800">Pharmacien Chef National OPN</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Tableau des Médicaments & Produits Déstockés */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase mb-2">
                  Dotations Thérapeutiques Prélevées sur la Réserve Stratégique
                </h4>

                <table className="w-full border-collapse text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold">
                      <th className="p-2.5 text-center w-10 border border-slate-700">N°</th>
                      <th className="p-2.5 text-left border border-slate-700">Désignation DCI & Forme</th>
                      <th className="p-2.5 text-center w-28 border border-slate-700">Stock Réserve Total</th>
                      <th className="p-2.5 text-center w-28 border border-slate-700">Quantité Déstockée</th>
                      <th className="p-2.5 text-center w-28 border border-slate-700">Stock Résiduel Sécurité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 border border-slate-200">
                    {destockage.lignes && destockage.lignes.map((l, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                          {l.dci}
                        </td>
                        <td className="p-2.5 text-center font-mono text-slate-700 border-r border-slate-200">
                          {l.quantiteReservee ? l.quantiteReservee.toLocaleString() : '—'} {l.uom}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-rose-700 border-r border-slate-200 bg-rose-50/50">
                          {l.quantiteDestockee ? l.quantiteDestockee.toLocaleString() : '—'} {l.uom}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-800">
                          {l.quantiteResiduelle ? l.quantiteResiduelle.toLocaleString() : '—'} {l.uom}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Engagement de Réassort Obligatoire */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6 text-[10px] text-amber-900 leading-snug">
                <p className="font-bold flex items-center gap-1 text-amber-950 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Clause Légale de Reconstitution Obligatoire sous 60 Jours :
                </p>
                <p>
                  Conformément à la réglementation sur les Réserves Stratégiques Sanitaires d'État, toute quantité déstockée dans le cadre d'un plan d'urgence déclenche automatiquement un ordre d'achat prioritaire de reconstitution auprès de la Direction Financière de l'OPN.
                </p>
              </div>

            </div>

            {/* Cadre Tripartite de Visas & Signatures */}
            <div>
              <div className="grid grid-cols-3 gap-3 border-t-2 border-slate-800 pt-3 text-[9px]">
                
                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Le Coordinateur COD</p>
                  <p className="text-[8px] text-slate-500">Demande opérationnelle de crise</p>
                  <div className="font-bold text-slate-700 text-[8.5px] pt-3">
                    Dr. Hugues NZAMBA — COD
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Le Pharmacien Chef National</p>
                  <p className="text-[8px] text-slate-500">Visa pharmaceutique de sortie</p>
                  <div className="font-bold text-emerald-800 text-[8.5px] pt-3">
                    Dr. Solange NTSAME — Pharmacien Chef
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Direction Générale OPN</p>
                  <p className="text-[8px] text-slate-500">Ordre d'exécution & transmission Ministre</p>
                  <div className="font-bold text-rose-800 text-[8.5px] pt-3">
                    Dr. Eric Baye — DG OPN
                  </div>
                </div>

              </div>

              {/* Footer Légal & ANINF Verification */}
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
                <div className="flex items-center gap-2">
                  <QrCode className="w-7 h-7 text-slate-700" />
                  <div>
                    <p className="font-mono font-bold text-slate-600">CERTIFICAT ANINF : RSSE-DESTOCK-{destockage.id || '2026'}-GA</p>
                    <p>Déclaration officielle d'utilité publique sous le haut contrôle du Ministère de la Santé.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-600">Office Pharmaceutique National • République Gabonaise</p>
                  <p>Centre Stratégique de Réserve Sanitaire Nationale</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
