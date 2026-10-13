import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, TrendingUp, Coins, Calendar, CheckCircle2 } from 'lucide-react';
import { PROGRAMMES_SANTE_PUBLIQUE } from '../../data/strategicPlanningData';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function PlanDirecteurApprovisionnementPdfModal({ isOpen, onClose, plan }) {
  const documentRef = useRef(null);
  if (!isOpen || !plan) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownload = () => {
    const filename = `Plan-Directeur-${plan.reference || 'PNA-2026'}.pdf`;
    downloadElementAsPdf(documentRef, filename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
        
        {/* Modal Top Bar (Screen Only) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Plan Directeur Annuel d'Approvisionnement (PNA)</h3>
              <p className="text-[11px] text-slate-300">{plan.reference} — {plan.anneeFiscale}</p>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
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
                  <p className="text-[11px] font-black tracking-tight text-[#009E49] uppercase">
                    OFFICE PHARMACEUTIQUE NATIONAL
                  </p>
                  <p className="text-[9.5px] font-bold text-slate-800 uppercase">
                    DIRECTION DES APPROVISIONNEMENTS & DIRECTION FINANCIÈRE
                  </p>
                  <p className="text-[8.5px] text-slate-500">
                    Schéma Directeur Annuel des Besoins Thérapeutiques & Budgétisation Nationale
                  </p>
                </div>

                <div className="text-right w-48 text-[9px] text-slate-600">
                  <p className="font-bold text-slate-900">Réf. Document :</p>
                  <p className="font-mono text-emerald-700 font-black text-[10px]">{plan.reference}</p>
                  <p className="text-slate-500 mt-1">{plan.anneeFiscale}</p>
                  <p className="font-mono text-[8px] text-slate-400">PNA-SOUVERAINETÉ-GA</p>
                </div>
              </div>

              {/* Titre Document */}
              <div className="bg-slate-900 text-white rounded-lg p-3.5 mb-5 flex items-center justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase rounded">
                      DOCUMENT STRATÉGIQUE D'ÉTAT
                    </span>
                    <span className="text-slate-300 text-[10px] font-semibold">
                      Plan Directeur Annuel d'Approvisionnement (PNA)
                    </span>
                  </div>
                  <h1 className="text-base font-extrabold tracking-tight mt-1 text-white">
                    Programmation des Achats & Dotations Thérapeutiques Nationales
                  </h1>
                </div>
                <div className="text-right pl-4 border-l border-slate-700">
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">Budget Consolidé</p>
                  <p className="text-sm font-mono font-black text-emerald-400">
                    {plan.montantGlobalXaf.toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              {/* Synthèse Macro-Économique */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Enveloppe Votée (XAF)</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">18 500 000 000 FCFA</span>
                  <span className="text-[9px] text-emerald-700 font-semibold">100% Financement État / OPN</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Engagé & Liquidé</span>
                  <span className="text-sm font-black text-[#2E68B4] mt-0.5 block">13 875 000 000 FCFA</span>
                  <span className="text-[9px] text-slate-500 font-semibold">Taux d'exécution : 75.0%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Autonomie Cible Hub</span>
                  <span className="text-sm font-black text-emerald-700 mt-0.5 block">6 Mois Minimum</span>
                  <span className="text-[9px] text-emerald-800 font-semibold">+ 2 mois en antennes</span>
                </div>
              </div>

              {/* Tableau de Répartition par Programme de Santé Publique */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase mb-2 flex items-center justify-between">
                  <span>Ventilation Budgétaire par Programme National de Santé Publique</span>
                  <span className="text-[9px] text-slate-500 font-normal">5 Programmes Stratégiques</span>
                </h4>

                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold">
                      <th className="p-2 text-left border border-slate-700">Programme National de Santé</th>
                      <th className="p-2 text-left border border-slate-700">Famille Thérapeutique & DCI Majeures</th>
                      <th className="p-2 text-right w-28 border border-slate-700">Enveloppe Annuelle</th>
                      <th className="p-2 text-center w-20 border border-slate-700">Exécution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 border border-slate-200">
                    {PROGRAMMES_SANTE_PUBLIQUE.map((prog, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                          {prog.nom}
                          <span className="block text-[8.5px] text-slate-500 font-normal mt-0.5">{prog.ministereTutelle}</span>
                        </td>
                        <td className="p-2 border-r border-slate-200 text-slate-700">
                          <p className="font-semibold text-slate-800">{prog.famillePrincipale}</p>
                          <p className="text-[8.5px] text-slate-500 italic truncate max-w-xs">{prog.medicamentsCles.join(', ')}</p>
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-slate-900 border-r border-slate-200">
                          {prog.enveloppeAnnuelleXaf.toLocaleString()} XAF
                        </td>
                        <td className="p-2 text-center font-bold text-emerald-700">
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-mono text-[9px]">
                            {prog.tauxExecution}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calendrier d'Exécution par Tranches Trimestrielles */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase mb-2">
                  Échéancier des Tranches Trimestrielles d'Approvisionnement
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {plan.tranches && plan.tranches.map((tr, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-center">
                      <span className="font-bold text-[10px] text-slate-800 block">{tr.trimestre}</span>
                      <span className="font-mono font-black text-slate-900 text-xs block mt-1">
                        {tr.montantPrevuXaf.toLocaleString()} FCFA
                      </span>
                      <span className="text-[8.5px] font-bold text-emerald-700 block mt-0.5">
                        {tr.statut.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Déclaration de Conformité Réglementaire */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg mb-6 text-[9.5px] text-slate-700 leading-snug">
                <p className="font-bold text-slate-900 mb-0.5">
                  Règles Impératives de Gestion des Stocks Stratégiques & Approvisionnements :
                </p>
                <p>
                  1. Le présent Plan Directeur constitue la base légale d'engagement des marchés publics de médicaments et réactifs de laboratoire de l'OPN.
                  2. L'OPN garantit en permanence le maintien des 3 mois de stocks tampons inviolables au Hub Central d'Owendo.
                  3. Tout écart de prévision supérieur à 15% fait l'objet d'un avenant validé par le Conseil d'Administration de l'OPN.
                </p>
              </div>

            </div>

            {/* Cadre Tripartite de Visas & Signatures */}
            <div>
              <div className="grid grid-cols-3 gap-3 border-t-2 border-slate-800 pt-3 text-[9px]">
                
                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">La Direction Financière (DAF)</p>
                  <p className="text-[8px] text-slate-500">Validation de la couverture budgétaire</p>
                  <div className="font-bold text-slate-700 text-[8.5px] pt-3">
                    Mme Chantal NZENGUE — DAF
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Le Pharmacien Chef National</p>
                  <p className="text-[8px] text-slate-500">Conformité de la liste nationale DCI</p>
                  <div className="font-bold text-emerald-800 text-[8.5px] pt-3">
                    Dr. Solange NTSAME — Pharmacien Chef
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Direction Générale OPN</p>
                  <p className="text-[8px] text-slate-500">Approbation finale & transmission Ministère</p>
                  <div className="font-bold text-[#2E68B4] text-[8.5px] pt-3">
                    Dr. Eric Baye — DG OPN
                  </div>
                </div>

              </div>

              {/* Footer Légal & ANINF Verification */}
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
                <div className="flex items-center gap-2">
                  <QrCode className="w-7 h-7 text-slate-700" />
                  <div>
                    <p className="font-mono font-bold text-slate-600">CERTIFICAT ANINF : PNA-{plan.id}-2026-GA</p>
                    <p>Plan Directeur Annuel validé par le Ministère de la Santé et des Affaires Sociales.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-600">Office Pharmaceutique National • République Gabonaise</p>
                  <p>Secrétariat Permanent du Comité National des Approvisionnements</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
