import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, Truck, Compass, CheckCircle2, AlertTriangle } from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function OrdreMissionDistributionPdfModal({ isOpen, onClose, tournee }) {
  const printRef = useRef(null);

  if (!isOpen || !tournee) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownload = () => {
    const filename = `Ordre-Mission-${tournee.reference || tournee.id}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
        
        {/* Modal Top Bar (Screen Only) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Ordre de Mission & Feuille de Route Dernier Kilomètre</h3>
              <p className="text-[11px] text-slate-300">Réf : {tournee.reference || tournee.id} — {tournee.provinceNom || 'Gabon Profond'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white rounded-md text-xs font-bold shadow-sm transition-colors cursor-pointer"
              title="Téléchargement direct du document PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
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

        {/* A4 Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          
          <div ref={printRef} className="w-full max-w-[210mm] min-h-[297mm] bg-white p-8 sm:p-10 shadow-lg print:shadow-none print:p-0 border border-slate-200 print:border-none relative flex flex-col justify-between text-slate-900 font-sans text-xs">
            
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

                <div className="text-center flex-1 px-4 flex flex-col items-center">
                  <OpnLogo className="h-10 w-auto mb-1" />
                  <p className="text-[12px] font-black tracking-tight text-[#009E49] uppercase">
                    OFFICE PHARMACEUTIQUE NATIONAL
                  </p>
                  <p className="text-[9.5px] font-bold text-slate-800 uppercase">
                    DIRECTION DES APPROVISIONNEMENTS ET DE LA LOGISTIQUE
                  </p>
                  <p className="text-[8.5px] text-slate-500">
                    Département Distribution Régionale & Dernier Kilomètre • Réseau des 9 Provinces
                  </p>
                </div>

                <div className="text-right w-48 text-[9px] text-slate-600">
                  <p className="font-bold text-slate-900">Édition Officielle</p>
                  <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
                  <p>Heure : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="font-mono text-[8px] text-slate-400 mt-1">SEC-LOG-DISP-2026</p>
                </div>
              </div>

              {/* Titre Document & Numéro */}
              <div className="bg-slate-900 text-white rounded-lg p-3 mb-5 flex items-center justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase rounded">
                      ORDRE DE MISSION OFFICIEL
                    </span>
                    <span className="text-slate-300 text-[10px] font-semibold">
                      Distribution Terrestre & Fluviale (Gabon Profond)
                    </span>
                  </div>
                  <h1 className="text-base font-extrabold tracking-tight mt-1 text-white">
                    {tournee.intitule || 'Feuille de Route Dernier Kilomètre'}
                  </h1>
                </div>
                <div className="text-right pl-4 border-l border-slate-700">
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">N° Feuille de Route</p>
                  <p className="text-sm font-mono font-black text-emerald-400">{tournee.reference || tournee.id}</p>
                </div>
              </div>

              {/* Grille Informations Mission */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                
                {/* Bloc 1 : Véhicule & Équipage */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <Truck className="w-3.5 h-3.5 text-[#2E68B4]" />
                    <span>Moyen de Transport & Équipage Assigné</span>
                  </h4>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type de Vecteur :</span>
                      <span className="font-bold text-slate-900">
                        {tournee.typeVecteur === 'FLUVIAL_PIROGUE' ? 'Pirogue Fluviale Renforcée' : tournee.typeVecteur === 'MARITIME_CHALOUPE' ? 'Chaloupe Maritime & Lagune' : 'Véhicule 4x4 Tout-Terrain'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Moyen / Immatriculation :</span>
                      <span className="font-bold text-slate-900">{tournee.vehiculeAssigne}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Motorisation / Spécificité :</span>
                      <span className="text-slate-800">{tournee.moteur || '4x4 Tropicalisé / Yamaha'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Équipage Responsable :</span>
                      <span className="font-bold text-slate-900">{tournee.equipage}</span>
                    </div>
                  </div>
                </div>

                {/* Bloc 2 : Calendrier & Itinéraire */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Itinéraire & Données Logistiques</span>
                  </h4>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Province d'Affectation :</span>
                      <span className="font-bold text-emerald-800">{tournee.provinceNom || 'Toutes Provinces'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date/Heure de Départ :</span>
                      <span className="font-bold text-slate-900">{tournee.dateDepart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Retour Prévu :</span>
                      <span className="font-bold text-slate-900">{tournee.dateRetourPrevue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Distance / Charge Totale :</span>
                      <span className="font-semibold text-slate-800">{tournee.distancePrevue} • {tournee.poidsTotalKg || 0} kg</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Chaîne du Froid & Glacières Embarquées */}
              {tournee.glacieresSuivies && tournee.glacieresSuivies.length > 0 && (
                <div className="mb-5 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Équipements Froid Autonomes & Scellés Isothermes (+2°C à +8°C)
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Autonomie 72h Conforme OMS/PQS
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {tournee.glacieresSuivies.map((g, idx) => (
                      <div key={idx} className="bg-white p-1.5 rounded border border-emerald-100 flex justify-between items-center">
                        <span className="font-bold text-slate-800">{g.id} ({g.type})</span>
                        <span className="font-mono font-bold text-emerald-700">{g.tempActuelle || '+4.0°C'} [Min: {g.tempMin || '+2.0°C'} / Max: {g.tempMax || '+6.0°C'}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tableau Détaillé des Étapes & Structures Sanitaires */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase mb-2 flex items-center justify-between">
                  <span>Étapes de Distribution, Dispensaires & Colis Embarqués</span>
                  <span className="text-[9px] text-slate-500 font-normal">
                    {tournee.etapes ? tournee.etapes.length : 0} Points de desserte programmés
                  </span>
                </h4>

                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold">
                      <th className="p-2 text-center w-8 border border-slate-700">N°</th>
                      <th className="p-2 text-left border border-slate-700">Structure Sanitaire / Jalon</th>
                      <th className="p-2 text-center w-24 border border-slate-700">Heure Prévue</th>
                      <th className="p-2 text-left border border-slate-700">Kits Sanitaires & Dotations</th>
                      <th className="p-2 text-center w-24 border border-slate-700">Émargement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 border border-slate-200">
                    {tournee.etapes && tournee.etapes.map((etp, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-2 text-center font-bold text-slate-700 border-r border-slate-200">
                          {etp.ordre || idx + 1}
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          <p className="font-bold text-slate-900">{etp.structure}</p>
                          {etp.recepteur && (
                            <p className="text-[9px] text-slate-500 italic">Destinataire : {etp.recepteur}</p>
                          )}
                          {etp.observations && (
                            <p className="text-[8.5px] text-amber-700 font-medium mt-0.5">Note : {etp.observations}</p>
                          )}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-700 border-r border-slate-200">
                          {etp.heurePrevue}
                          {etp.heureReelle && (
                            <span className="block text-[8px] text-emerald-700 font-bold">Réel : {etp.heureReelle}</span>
                          )}
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          {etp.kits && etp.kits.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {etp.kits.map((k, kIdx) => (
                                <span key={kIdx} className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-[#2E68B4] rounded text-[8.5px] font-semibold">
                                  {k}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[9px]">— Escale / Passage —</span>
                          )}
                        </td>
                        <td className="p-2 text-center font-bold">
                          {etp.dechargeSignee ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Signé
                            </span>
                          ) : etp.type === 'DEPART' || etp.type === 'ARRIVEE' ? (
                            <span className="text-slate-400 text-[8.5px]">Magasin OPN</span>
                          ) : (
                            <span className="text-amber-700 text-[8.5px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              En attente
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Consignes de Sécurité & Piste */}
              <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg mb-6 text-[9.5px] text-amber-900 leading-snug">
                <p className="font-bold flex items-center gap-1 text-amber-950 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Consignes Impératives de Mission & Intégrité Thérapeutique :
                </p>
                <p>
                  1. Interdiction absolue d'ouvrir les glacières isothermes scellées en dehors des locaux des structures destinataires.
                  2. En cas de bourbier ou d'arrêt prolongé, vérifier le maintien de la chaîne du froid (+2°C/+8°C) et contacter immédiatement l'Antenne.
                  3. L'Ordre de Mission autorise la priorité absolue de passage sur tous les bacs fluviaux et barrières de péage forestier du Gabon.
                </p>
              </div>

            </div>

            {/* Cadre Tripartite de Visas & Signatures */}
            <div>
              <div className="grid grid-cols-3 gap-3 border-t-2 border-slate-800 pt-3 text-[9px]">
                
                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Le Chauffeur / Piroguier</p>
                  <p className="text-[8px] text-slate-500 italic">"Pris en charge conforme de la cargaison"</p>
                  <div className="font-mono text-[8px] text-slate-400 pt-3">Signature & Date</div>
                </div>

                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Le Chef d'Antenne Provinciale</p>
                  <p className="text-[8px] text-slate-500">Autorisation de départ & visa logistique</p>
                  <div className="font-bold text-emerald-800 text-[8.5px] pt-3">
                    [ Cachet & Visa Antenne ]
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-2 text-center h-28 flex flex-col justify-between bg-slate-50">
                  <p className="font-bold text-slate-800 uppercase">Direction Générale OPN</p>
                  <p className="text-[8px] text-slate-500">Pour le Directeur Général & P.O.</p>
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
                    <p className="font-mono font-bold text-slate-600">ID TRACABILITE : {tournee.reference || tournee.id}-OPN-GA</p>
                    <p>Document officiel certifié conforme au Schéma Directeur Logistique National OPN.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-600">Office Pharmaceutique National • République Gabonaise</p>
                  <p>Siège : BP 2235 Libreville Gabon • Hub Central d'Owendo</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
