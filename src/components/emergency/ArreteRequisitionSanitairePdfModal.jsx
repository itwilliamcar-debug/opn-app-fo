import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  Truck, 
  Clock, 
  CheckCircle2,
  Building2,
  Lock,
  Radio,
  Package
} from 'lucide-react';
import { formatXAF } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function ArreteRequisitionSanitairePdfModal({
  isOpen,
  onClose,
  incident,
  protocol,
  activePersona
}) {
  const printRef = useRef(null);

  if (!isOpen || !incident) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleSavePdf = () => {
    const filename = `Arrete-Requisition-${incident.codeIncident || incident.id}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const numArrete = `ARR-REQ-${incident.codeIncident || incident.id}-${new Date().getFullYear()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-md shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Barre d'actions supérieure (non imprimable) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-600 text-white rounded-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                Arrêté de Réquisition Sanitaire & Déploiement d'Urgence
              </h2>
              <p className="text-[11px] text-slate-400">
                Réf : {numArrete} — Acte d'Autorité Publique & Urgence Sanitaire
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
              <div className="text-center w-60">
                <p className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900">RÉPUBLIQUE GABONAISE</p>
                <p className="text-[9px] font-semibold text-slate-600 italic">Union — Travail — Justice</p>
                <div className="w-10 h-0.5 bg-[#00A651] mx-auto my-1.5" />
                <p className="font-bold text-[9px] uppercase text-slate-700">MINISTÈRE DE LA SANTÉ</p>
                <p className="text-[8px] text-slate-500 font-medium">Centre des Opérations d'Urgence Sanitaire (COUS / COD)</p>
              </div>

              <div className="text-center flex-1 px-4 flex flex-col items-center">
                <OpnLogo className="h-10 w-auto mb-1" />
                <span className="font-black text-xs text-[#2E68B4] uppercase tracking-widest block">OFFICE PHARMACEUTIQUE NATIONAL</span>
                <span className="text-[9px] font-bold text-rose-700">CELLULE DE CRISE & RIPOSTE SANITAIRE</span>
                <p className="text-[8.5px] text-slate-500 mt-0.5">Centre Opérationnel de Décision — Libreville / Owendo</p>
              </div>

              <div className="text-right w-60">
                <div className="inline-block bg-rose-700 text-white font-mono text-[9px] px-2.5 py-1 rounded-sm font-bold mb-1">
                  {numArrete}
                </div>
                <p className="text-[9.5px] font-bold text-slate-800">Date : {todayStr}</p>
                <p className="text-[9px] text-rose-700 font-extrabold uppercase mt-0.5">PROCÉDURE D'URGENCE VITALE</p>
                <p className="text-[8.5px] text-slate-500 mt-0.5">Code Incident : <strong>{incident.codeIncident}</strong></p>
              </div>
            </div>

            {/* Titre de l'Arrêté */}
            <div className="text-center bg-slate-900 text-white py-3 px-4 rounded-md mb-6 shadow-sm">
              <h1 className="text-base font-black uppercase tracking-wider text-rose-400">
                ARRÊTÉ PORTANT RÉQUISITION SANITAIRE & DÉPLOIEMENT D'URGENCE
              </h1>
              <p className="text-[10.5px] font-medium text-slate-200 mt-0.5">
                Mobilisation de la Réserve Sanitaire Stratégique d'État (RSSE) & Déblocage Immédiat de Kits
              </p>
            </div>

            {/* Préambule & Visas Juridiques */}
            <div className="mb-5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-[9.5px] text-slate-700 space-y-1">
              <p className="font-bold text-slate-900 uppercase text-[10px] mb-1">Le Directeur Général de l'Office Pharmaceutique National,</p>
              <p>• <strong>Vu</strong> la Constitution de la République Gabonaise ;</p>
              <p>• <strong>Vu</strong> la Loi N° 002/2021 portant organisation de la Pharmacie et du Médicament en République Gabonaise ;</p>
              <p>• <strong>Vu</strong> le Décret N° 0128/PR/MS portant création et attributions de l'Office Pharmaceutique National (OPN) ;</p>
              <p>• <strong>Vu</strong> la notification d'urgence sanitaire transmise par <strong>{incident.declarantNom || 'la structure provinciale'}</strong> en date du {incident.dateDeclaration} ;</p>
              <p>• <strong>Considérant</strong> la situation de crise sanitaire et le risque de rupture imminente pour la prise en charge des patients ;</p>
            </div>

            {/* Corps des Articles de Réquisition */}
            <div className="space-y-4 mb-6">
              
              {/* Article 1 : Constat et Localisation */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                <h3 className="font-bold text-slate-900 text-[10.5px] uppercase mb-1.5 text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Article 1 : Déclaration d'Urgence Sanitaire & Circonstances
                </h3>
                <p className="text-[10px] text-slate-700 leading-relaxed text-justify">
                  Est déclaré en situation d'urgence sanitaire prioritaire le site de : <strong>{incident.lieuPrecis}</strong> (Province du <strong>{incident.provinceNom}</strong>).
                  L'incident porte sur : <em>« {incident.titre} »</em>.
                  Gravité homologuée : <strong className="text-rose-700 font-black">{incident.gravite}</strong>.
                </p>
                <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 text-[9.5px] text-slate-600">
                  <strong>Description opérationnelle :</strong> {incident.description}
                </div>
              </div>

              {/* Article 2 : Dotation & Kits RSSE Déstockés */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                <h3 className="font-bold text-slate-900 text-[10.5px] uppercase mb-1.5 text-[#00A651] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Article 2 : Réquisition & Déstockage des Médicaments de la Réserve Stratégique (RSSE)
                </h3>
                <p className="text-[10px] text-slate-700 mb-2">
                  Il est ordonné le déstockage immédiat depuis le Hub National WMS d'Owendo du kit suivant :
                  <strong className="text-slate-900 block mt-0.5">{protocol?.nom || incident.kitRequis || 'Kit de Riposte Sanitaire'} (Réf : {protocol?.code || 'KIT-RIP'})</strong>
                </p>

                {protocol?.compositionItems && protocol.compositionItems.length > 0 && (
                  <div className="overflow-x-auto rounded border border-slate-200 mt-2">
                    <table className="w-full text-left border-collapse text-[9px]">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold uppercase text-[8px]">
                          <th className="p-1.5 border-r border-slate-800">DCI & Désignation</th>
                          <th className="p-1.5 border-r border-slate-800 text-center">Quantité Réquisitionnée</th>
                          <th className="p-1.5 border-r border-slate-800">Conditionnement</th>
                          <th className="p-1.5 border-r border-slate-800">N° Lot Origine RSSE</th>
                          <th className="p-1.5 text-center">Conservation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {protocol.compositionItems.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">{item.dci}</td>
                            <td className="p-1.5 text-center font-black text-rose-700 border-r border-slate-200">{item.quantite}</td>
                            <td className="p-1.5 text-slate-600 border-r border-slate-200">{item.conditionnement}</td>
                            <td className="p-1.5 font-mono text-slate-800 border-r border-slate-200">{item.lotOrigine}</td>
                            <td className="p-1.5 text-center font-bold text-emerald-700">15°C–25°C / 2°C–8°C</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="mt-2 text-[9px] text-slate-500 flex justify-between">
                  <span>Valeur estimée de la dotation : <strong>{formatXAF(incident.valeurKitXAF || protocol?.valeurEstimeeXAF || 4850000)}</strong></span>
                  <span>Volume logistique : <strong>{protocol?.volumeM3 || '0.85'} m³ ({protocol?.poidsTotalKg || '180'} kg)</strong></span>
                </div>
              </div>

              {/* Article 3 : Logistique & Acheminement */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
                <h3 className="font-bold text-slate-900 text-[10.5px] uppercase mb-1 text-[#2E68B4] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Article 3 : Vecteur d'Acheminement & Priorité sur le Réseau Territorial
                </h3>
                <p className="text-[10px] text-slate-700 leading-relaxed text-justify">
                  Sont réquisitionnés pour l'acheminement prioritaire : <strong>{protocol?.vecteurTransport || 'Véhicule 4x4 Tout-Terrain Express OPN'}</strong>.
                  Les forces de sécurité et brigades de gendarmerie sont requises pour faciliter le transit sans entrave des convois sanitaires d'urgence portant le sigle officiel OPN.
                </p>
                <div className="mt-2 flex items-center justify-between text-[9px] text-slate-600 bg-slate-50 p-2 rounded">
                  <span>Délai cible de mise à disposition : <strong className="text-rose-700 font-bold">{protocol?.delaiRiposteCible || '< 2 Heures'}</strong></span>
                  <span>Équipe d'intervention : <strong>{incident.equipeAffectee}</strong></span>
                </div>
              </div>

            </div>

            {/* Signatures Officielles & Visas */}
            <div className="border-t-2 border-slate-900 pt-4 mt-6">
              <div className="grid grid-cols-3 gap-6 text-center text-[9px]">
                <div>
                  <p className="font-bold text-slate-700">Le Coordinateur National COD</p>
                  <p className="text-slate-500 italic mt-0.5">Cellule Urgences & COUS</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-dashed border-slate-300 px-2 py-1 rounded">
                      [ORDRE COD TRANSMIS]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">Dr. Martial NDOUTOUME</p>
                </div>

                <div>
                  <p className="font-bold text-slate-700">Le Pharmacien Chef National</p>
                  <p className="text-slate-500 italic mt-0.5">Visa Déstockage RSSE</p>
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-400 bg-slate-50 border border-dashed border-slate-300 px-2 py-1 rounded">
                      [VISA RSSE APPOSÉ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">Dr. Sylvie NGUEMA</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 uppercase">Le Directeur Général de l'OPN</p>
                  <p className="text-slate-500 italic mt-0.5">Pouvoir de Réquisition d'État</p>
                  <div className="h-14 flex items-center justify-center">
                    <div className="border-2 border-rose-600 rounded-full w-14 h-14 flex items-center justify-center text-[7.5px] font-black text-rose-700 uppercase rotate-[-12deg]">
                      RÉQUISITION OPN
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
                  Acte exécutoire de plein droit • Page 1 / 1 • Diffusion Immédiate
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
