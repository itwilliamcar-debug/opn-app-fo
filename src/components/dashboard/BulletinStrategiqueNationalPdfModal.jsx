import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  Thermometer, 
  FileText,
  Building2,
  Lock,
  Layers,
  Activity
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import { NATIONAL_STRATEGIC_METRICS, PROVINCES_STRATEGIC_DATA, EXECUTIVE_STRATEGIC_DIRECTIVES } from '../../data/strategicDashboardData';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BulletinStrategiqueNationalPdfModal({
  isOpen,
  onClose,
  activePersona,
  metrics = NATIONAL_STRATEGIC_METRICS,
  provinces = PROVINCES_STRATEGIC_DATA,
  directives = EXECUTIVE_STRATEGIC_DIRECTIVES
}) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleSavePdf = () => {
    const filename = `Bulletin-Strategique-${metrics.numeroBulletin || 'National'}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-md shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Barre d'actions supérieure (non imprimable) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#00A651] text-white rounded-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                Bulletin mensuel pharmaceutique (Format A4 Officiel)
              </h2>
              <p className="text-[11px] text-slate-400">
                Réf : {metrics.numeroBulletin} — Document Officiel Cabinet du Directeur Général
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-md text-xs font-bold shadow-sm transition-all cursor-pointer"
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0 print:overflow-visible">
          <div ref={printRef} className="max-w-[210mm] mx-auto bg-white p-8 sm:p-10 rounded-sm shadow-md border border-slate-200 print:shadow-none print:border-none print:p-6 print:m-0 text-slate-900 text-xs">
            
            {/* Liseré tricolore Gabon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#2E68B4] mb-6 rounded-xs" />

            {/* En-tête Institutionnel Gabon */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
              <div className="text-center w-64">
                <p className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900">RÉPUBLIQUE GABONAISE</p>
                <p className="text-[9px] font-semibold text-slate-600 italic">Union — Travail — Justice</p>
                <div className="w-10 h-0.5 bg-[#00A651] mx-auto my-1.5" />
                <p className="font-bold text-[9px] uppercase text-slate-700">MINISTÈRE DE LA SANTÉ</p>
                <p className="text-[8.5px] text-slate-500">Direction Générale de la Pharmacie et du Médicament</p>
              </div>

              <div className="text-center flex-1 px-4 flex flex-col items-center">
                <OpnLogo className="h-10 w-auto mb-1" />
                <span className="font-black text-xs text-[#2E68B4] uppercase tracking-widest block">OFFICE PHARMACEUTIQUE NATIONAL</span>
                <span className="text-[9px] font-bold text-slate-700">CABINET DU DIRECTEUR GÉNÉRAL</span>
                <p className="text-[8.5px] text-slate-500 mt-0.5">Siège National & Hub Central : Zone Industrielle d'Owendo, Gabon</p>
              </div>

              <div className="text-right w-60">
                <div className="inline-block bg-slate-900 text-white font-mono text-[9px] px-2.5 py-1 rounded-sm font-bold mb-1">
                  {metrics.numeroBulletin}
                </div>
                <p className="text-[9.5px] font-bold text-slate-800">Date : {todayStr}</p>
                <p className="text-[9px] text-slate-600">Exercice : <strong>{metrics.exercice}</strong></p>
                <p className="text-[8.5px] text-[#00A651] font-bold mt-1">DIFFUSION OFFICIELLE NATIONALE</p>
              </div>
            </div>

            {/* Titre du Rapport */}
            <div className="text-center bg-slate-900 text-white py-3 px-4 rounded-md mb-6 shadow-sm">
              <h1 className="text-base font-black uppercase tracking-wider text-emerald-400">
                BULLETIN MENSUEL DE SOUVERAINETÉ PHARMACEUTIQUE & SANITAIRE
              </h1>
              <p className="text-[10.5px] font-medium text-slate-200 mt-0.5">
                Consolidation Stratégique des 10 Modules Métiers ERP — {metrics.periode}
              </p>
            </div>

            {/* 1. Synthèse Exécutive Macroéconomique & PNA */}
            <div className="mb-6">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#00A651]" />
                <h2 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                  1. Synthèse Macroéconomique & Exécution du Plan National d'Approvisionnement (PNA)
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-3 text-center">
                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                  <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Budget PNA 2026</span>
                  <span className="text-xs font-black text-slate-900">{formatXAF(metrics.budgetPnaTotalXAF)}</span>
                  <span className="text-[8.5px] text-slate-400 block mt-0.5">18,50 Mrd FCFA votés</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                  <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Engagements Fermes</span>
                  <span className="text-xs font-black text-[#2E68B4]">{formatXAF(metrics.budgetPnaEngageXAF)}</span>
                  <span className="text-[8.5px] text-emerald-600 font-bold block mt-0.5">{metrics.tauxExecutionPna}% du PNA engagé</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                  <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Valeur Stock National</span>
                  <span className="text-xs font-black text-[#00A651]">{formatXAF(metrics.valeurStockNationalTotalXAF)}</span>
                  <span className="text-[8.5px] text-slate-500 block mt-0.5">Hub Owendo + 9 Antennes</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                  <span className="text-[9.5px] text-slate-500 font-semibold block uppercase">Autonomie Moyenne</span>
                  <span className="text-xs font-black text-amber-600">{metrics.couvertureMoyenneNationaleJours} Jours</span>
                  <span className="text-[8.5px] text-emerald-600 font-bold block mt-0.5">Cible &gt; {metrics.objectifCouvertureJours} jours</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-700 leading-relaxed text-justify">
                Le Plan National d'Approvisionnement (PNA) 2026 enregistre un taux d'exécution budgétaire de <strong>{metrics.tauxExecutionPna}%</strong> avec une valeur de stock consolidée de <strong>{formatXAF(metrics.valeurStockNationalTotalXAF)}</strong> sur l'ensemble du territoire national. La disponibilité des Médicaments Essentiels sous DCI atteint <strong>{metrics.tauxDisponibiliteDciEssentiels}%</strong>, garantissant l'approvisionnement régulier des formations sanitaires publiques et des officines conventionnées.
              </p>
            </div>

            {/* 2. Matrice Territoriale des 9 Provinces */}
            <div className="mb-6">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#2E68B4]" />
                <h2 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                  2. Situation Opérationnelle & Logistique des 9 Antennes Provinciales
                </h2>
              </div>

              <div className="overflow-x-auto rounded border border-slate-200">
                <table className="w-full text-left border-collapse text-[9.5px]">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase text-[8.5px]">
                      <th className="p-2 border-r border-slate-800">Code / Province</th>
                      <th className="p-2 border-r border-slate-800">Chef-Lieu & Antenne</th>
                      <th className="p-2 border-r border-slate-800 text-right">Valeur Stock (FCFA)</th>
                      <th className="p-2 border-r border-slate-800 text-center">Autonomie</th>
                      <th className="p-2 border-r border-slate-800 text-center">DCI (%)</th>
                      <th className="p-2 border-r border-slate-800">État Pistes / Transit</th>
                      <th className="p-2 border-r border-slate-800 text-center">IoT Froid</th>
                      <th className="p-2 text-center">Alerte Sanitaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {provinces.map((prov, idx) => (
                      <tr key={prov.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                          {prov.id} — {prov.nom}
                        </td>
                        <td className="p-2 text-slate-700 border-r border-slate-200">
                          <strong>{prov.chefLieu}</strong> ({prov.responsable})
                        </td>
                        <td className="p-2 font-semibold text-slate-900 text-right border-r border-slate-200 font-mono">
                          {formatXAF(prov.stockValeurXAF)}
                        </td>
                        <td className="p-2 text-center font-bold border-r border-slate-200">
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                            prov.couvertureJours >= 60 ? 'bg-emerald-100 text-emerald-800' :
                            prov.couvertureJours >= 45 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {prov.couvertureJours} j
                          </span>
                        </td>
                        <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-200">
                          {prov.tauxDisponibiliteDci}%
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold ${prov.pistesStatus.badgeColor}`}>
                            {prov.pistesStatus.label}
                          </span>
                        </td>
                        <td className="p-2 text-center border-r border-slate-200">
                          <span className="font-mono font-bold text-emerald-700">{prov.froidIoT.temperature}</span>
                        </td>
                        <td className="p-2 text-center font-bold">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] ${prov.criseSanitaire.badgeColor}`}>
                            {prov.criseSanitaire.alerteNiveau}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Pôle Qualité, Pharmacovigilance & GMAO Froid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200 font-bold text-slate-800 text-[10.5px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
                  <span>3. Qualité, LNCM & Pharmacovigilance (DMP)</span>
                </div>
                <div className="space-y-1.5 text-[9.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lots contrôlés au LNCM :</span>
                    <span className="font-bold text-slate-900">{metrics.lotsControlesLncm} lots</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taux de conformité analytique :</span>
                    <span className="font-bold text-emerald-700">{metrics.tauxConformiteQualiteLncm}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Alertes CIOMS sous surveillance DMP :</span>
                    <span className="font-bold text-amber-700">{metrics.alertesPharmacovigilanceActives} signalements</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Habilitations BPF / BPD des agents :</span>
                    <span className="font-bold text-slate-900">{metrics.tauxHabilitationConforme}% certifiés</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200 font-bold text-slate-800 text-[10.5px]">
                  <Thermometer className="w-3.5 h-3.5 text-[#2E68B4]" />
                  <span>4. Chaîne du Froid & Sécurité Énergétique (GMAO)</span>
                </div>
                <div className="space-y-1.5 text-[9.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Chambres froides IoT surveillées :</span>
                    <span className="font-bold text-slate-900">{metrics.totalEnceintesFroidIot} enceintes (+2°C/+8°C & -80°C)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Conformité thermique nationale :</span>
                    <span className="font-bold text-emerald-700">{metrics.tauxConformiteChambreFroidIot}% ({metrics.temperatureMoyenneNationale})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Groupes électrogènes industriels :</span>
                    <span className="font-bold text-slate-900">{metrics.totalGroupesElectrogenes} unités secourues</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Autonomie gazole moyenne :</span>
                    <span className="font-bold text-amber-700">{metrics.autonomieMoyenneGroupesHeures} heures continues</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Recouvrement CNAMGS & Directives Stratégiques */}
            <div className="mb-6 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200 font-bold text-slate-800 text-[10.5px]">
                <Activity className="w-3.5 h-3.5 text-[#00A651]" />
                <span>5. Facturation, Recouvrement CNAMGS & Trésor Public</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[9.5px] text-center mb-2">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block">Facturation Émise</span>
                  <strong className="text-slate-900 text-[10.5px]">{formatXAF(metrics.facturationTotaleCnamgsXAF)}</strong>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block">Encaissements Reçus</span>
                  <strong className="text-emerald-700 text-[10.5px]">{formatXAF(metrics.encaissementsCnamgsXAF)} ({metrics.tauxRecouvrementCnamgs}%)</strong>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block">Créances Exigibles Trésor</span>
                  <strong className="text-rose-700 text-[10.5px]">{formatXAF(metrics.creancesExigiblesXAF)}</strong>
                </div>
              </div>
            </div>

            {/* 5. Directives Prioritaires du Directeur Général */}
            <div className="mb-6">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
                <h2 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                  6. Directives Exécutives & Recommandations au Conseil d'Administration
                </h2>
              </div>

              <div className="space-y-2">
                {directives.map((dir) => (
                  <div key={dir.id} className="p-2.5 bg-white rounded border border-slate-200 text-[9.5px]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">
                        [{dir.id}] {dir.titre}
                      </span>
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[8px]">
                        Échéance : {dir.echeance}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug">{dir.description}</p>
                    <div className="mt-1 text-[8.5px] text-slate-500 flex justify-between">
                      <span>Responsable : <strong>{dir.responsable}</strong></span>
                      <span className="font-semibold text-emerald-700">Statut : {dir.statut}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentions Légales & Signatures Officielles */}
            <div className="border-t-2 border-slate-900 pt-4 mt-6">
              <div className="grid grid-cols-3 gap-6 text-center text-[9px]">
                <div>
                  <p className="font-bold text-slate-700">Le Directeur des Affaires Financières (DAF)</p>
                  <p className="text-slate-500 italic mt-0.5">Visa Conformité Budgétaire</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-dashed border-slate-300 px-2 py-1 rounded">
                      [VISA DAF APPOSÉ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">M. Fabrice MENGUE</p>
                </div>

                <div>
                  <p className="font-bold text-slate-700">Le Directeur des Opérations (DIR)</p>
                  <p className="text-slate-500 italic mt-0.5">Visa Logistique & Stocks</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-dashed border-slate-300 px-2 py-1 rounded">
                      [VISA OPERATIONS APPOSÉ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">Dr. Marcelle OBIANG</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 uppercase">Le Directeur Général de l'OPN</p>
                  <p className="text-slate-500 italic mt-0.5">Approbation & Sceau Officiel</p>
                  <div className="h-14 flex items-center justify-center">
                    <div className="border-2 border-[#00A651] rounded-full w-14 h-14 flex items-center justify-center text-[7.5px] font-black text-[#00A651] uppercase rotate-[-12deg]">
                      SCEAU OPN GABON
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">Dr. Jude MBAKOMO</p>
                </div>
              </div>

              {/* Pied de page souverain */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Système ERP OPN Gabon v2.6</span>
                  <span>•</span>
                  <span>Sécurité & Intégrité ANINF Gabon</span>
                </div>
                <div>
                  Document certifié conforme • Page 1 / 1 • Diffusion Réservée
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
