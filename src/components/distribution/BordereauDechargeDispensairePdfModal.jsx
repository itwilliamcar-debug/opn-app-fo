import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, Building2, CheckCircle2, Thermometer, PackageCheck } from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function BordereauDechargeDispensairePdfModal({ isOpen, onClose, tournee, etape }) {
  const printRef = useRef(null);

  if (!isOpen || !tournee || !etape) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownload = () => {
    const filename = `Bordereau-Decharge-${tournee.id}-E${etape.ordre || 1}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
        
        {/* Modal Top Bar (Screen Only) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Bordereau d'Émargement & Décharge Dispensaire (A4)</h3>
              <p className="text-[11px] text-slate-300">{etape.structure} — {tournee.provinceNom || 'Province'}</p>
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
                    PROVINCE DU {tournee.provinceNom ? tournee.provinceNom.toUpperCase() : 'GABON'}
                  </p>
                  <p className="text-[8.5px] text-slate-500">
                    Bordereau Officiel de Réception Physique & Décharge Thérapeutique en Soins Primaires
                  </p>
                </div>

                <div className="text-right w-48 text-[9px] text-slate-600">
                  <p className="font-bold text-slate-900">N° Décharge :</p>
                  <p className="font-mono text-emerald-700 font-black text-[10px]">
                    DCH-{tournee.id}-E{etape.ordre || 1}
                  </p>
                  <p className="text-slate-500 mt-1">Date Livraison : {etape.heureReelle || etape.heurePrevue || new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Titre Document */}
              <div className="bg-slate-900 text-white rounded-lg p-3 mb-5 flex items-center justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase rounded">
                      BORDEREAU D'ÉMARGEMENT & RÉCEPTION
                    </span>
                    <span className="text-slate-300 text-[10px] font-semibold">
                      Dotation Dispensaire Rural / Case de Santé
                    </span>
                  </div>
                  <h1 className="text-base font-extrabold tracking-tight mt-1 text-white">
                    {etape.structure}
                  </h1>
                </div>
                <div className="text-right pl-4 border-l border-slate-700">
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">Tournée de Rattachement</p>
                  <p className="text-xs font-mono font-bold text-emerald-400">{tournee.reference || tournee.id}</p>
                </div>
              </div>

              {/* Grille Informations Structure & Transporteur */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                
                {/* Bloc Structure Réceptionnaire */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Poste Sanitaire Réceptionnaire</span>
                  </h4>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Structure Sanitaire :</span>
                      <span className="font-bold text-slate-900">{etape.structure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Responsable / Qualité :</span>
                      <span className="font-bold text-slate-900">{etape.recepteur || 'Infirmier Chef de Poste (ICP)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Région Sanitaire :</span>
                      <span className="text-slate-800">{tournee.provinceNom}</span>
                    </div>
                  </div>
                </div>

                {/* Bloc Équipage & Vecteur */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E68B4]" />
                    <span>Convoi & Transporteur OPN</span>
                  </h4>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vecteur / Immatriculation :</span>
                      <span className="font-bold text-slate-900">{tournee.vehiculeAssigne}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chauffeur / Piroguier :</span>
                      <span className="font-bold text-slate-900">{tournee.equipage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Antenne Émettrice :</span>
                      <span className="text-slate-800">Antenne Provinciale OPN {tournee.provinceNom}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Contrôle de la Chaîne du Froid à la Réception */}
              <div className="mb-5 p-3 bg-blue-50/80 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10.5px] font-bold text-[#2E68B4] uppercase flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-[#2E68B4]" />
                    <span>Constat Physique & Chaîne du Froid à l'Ouverture des Colis</span>
                  </h4>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Norme OMS : +2.0°C à +8.0°C
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[10px]">
                  <div className="bg-white p-2 rounded border border-blue-100">
                    <span className="text-slate-500 block">État des Scellés :</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Intacts & Non-Violés
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-100">
                    <span className="text-slate-500 block">Température Relevée :</span>
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block">+4.2°C (Conforme Froid)</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-100">
                    <span className="text-slate-500 block">Indicateur Thermochimique :</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">Virage Négatif (OK)</span>
                  </div>
                </div>
              </div>

              {/* Tableau des Kits Sanitaires Déchargés */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase mb-2">
                  Inventaire des Kits de Santé & Médicaments Essentiels Livrés
                </h4>

                <table className="w-full border-collapse text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold">
                      <th className="p-2.5 text-center w-10 border border-slate-700">N°</th>
                      <th className="p-2.5 text-left border border-slate-700">Désignation du Kit Sanitaire OPN</th>
                      <th className="p-2.5 text-center w-28 border border-slate-700">Température Requise</th>
                      <th className="p-2.5 text-center w-20 border border-slate-700">Quantité Livrée</th>
                      <th className="p-2.5 text-center w-28 border border-slate-700">Conformité Réception</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 border border-slate-200">
                    {etape.kits && etape.kits.length > 0 ? (
                      etape.kits.map((kitStr, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                            {kitStr.includes('KIT-ACCOUCH-URG') ? 'Kit Accouchement d\'Urgence & Maternité Rurale (10 Accouchements)' :
                             kitStr.includes('KIT-PALU-GRAVE') ? 'Kit Paludisme Grave & Diagnostic Rapide (25 Cas Sévères)' :
                             kitStr.includes('KIT-PEV-VACCIN') ? 'Kit Vaccinal PEV & Immunisation Nourrissons (Chaîne Froid)' :
                             kitStr.includes('KIT-REHYD-DIARRH') ? 'Kit Réhydratation Aiguë & Lutte Antidiarrhéique / SRO' :
                             kitStr.includes('KIT-URG-TRAUMA') ? 'Kit Traumatologie & Sérums Antivenimeux Panafricains' :
                             kitStr}
                            <span className="block text-[9px] text-slate-500 font-mono font-normal mt-0.5">Code : {kitStr}</span>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            {kitStr.includes('PEV') || kitStr.includes('TRAUMA') ? (
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-[9px]">
                                +2°C à +8°C
                              </span>
                            ) : (
                              <span className="text-slate-600 text-[9px]">15°C à 25°C</span>
                            )}
                          </td>
                          <td className="p-2.5 text-center font-bold text-slate-900 border-r border-slate-200">
                            1 Unité
                          </td>
                          <td className="p-2.5 text-center font-bold text-emerald-700">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[9.5px]">
                              <CheckCircle2 className="w-3 h-3" /> Conforme
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-slate-400 italic">
                          Aucun kit spécifique listé (Livraison de dotation pharmaceutique générale).
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Observations & Décharge Formelle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-6 text-[10px] text-slate-700 leading-snug">
                <p className="font-bold text-slate-900 mb-1">
                  Déclaration Formelle de l'Infirmier Chef de Poste / Réceptionnaire :
                </p>
                <p>
                  Je soussigné(e), responsable de la formation sanitaire susmentionnée, atteste avoir réceptionné en bon état apparent, scellés intacts et conformes aux températures de conservation, les kits et médicaments ci-dessus référencés. Les médicaments sont immédiatement inscrits au registre de dispensation des soins primaires.
                </p>
              </div>

            </div>

            {/* Cadre de Double Signature Émargement */}
            <div>
              <div className="grid grid-cols-2 gap-6 border-t-2 border-slate-800 pt-4 text-[9.5px]">
                
                <div className="border border-slate-200 rounded p-3 text-center h-32 flex flex-col justify-between bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-800 uppercase">Le Chauffeur / Piroguier OPN</p>
                    <p className="text-[8.5px] text-slate-500">"Remise de cargaison effectuée à bon port"</p>
                  </div>
                  <div className="font-semibold text-slate-700 text-[9px]">
                    {tournee.equipage}
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-3 text-center h-32 flex flex-col justify-between bg-emerald-50/50 border-emerald-200">
                  <div>
                    <p className="font-bold text-emerald-900 uppercase">L'Infirmier Chef de Poste (ICP) / Major</p>
                    <p className="text-[8.5px] text-slate-500">"Réception physique & prise en charge officielle"</p>
                  </div>
                  <div className="font-bold text-emerald-800 text-[9px]">
                    [ Cachet & Signature du Dispensaire ]
                  </div>
                </div>

              </div>

              {/* Footer Légal & ANINF Verification */}
              <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
                <div className="flex items-center gap-2">
                  <QrCode className="w-7 h-7 text-slate-700" />
                  <div>
                    <p className="font-mono font-bold text-slate-600">CERTIFICAT ANINF : DCH-{tournee.id}-{etape.ordre || 1}-GA</p>
                    <p>Feuille d'émargement originale à rapatrier et archiver à l'Antenne Provinciale OPN.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-600">Office Pharmaceutique National • République Gabonaise</p>
                  <p>Programme National de Distribution du Dernier Kilomètre</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
