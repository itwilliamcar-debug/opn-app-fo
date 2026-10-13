import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Thermometer, 
  UserCheck, 
  Fuel, 
  FileText,
  AlertTriangle,
  Radio,
  Clock
} from 'lucide-react';
import { formatXAF, formatNumber } from '../../utils/formatters';
import OpnLogo from '../common/OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';

export default function FeuilleRouteConvoiPdfModal({
  isOpen,
  onClose,
  tournee,
  vehicule,
  chauffeur
}) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleSavePdf = () => {
    const filename = `Feuille-Route-Convoi-${numMission}.pdf`;
    downloadElementAsPdf(printRef, filename);
  };

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const numMission = tournee?.id ? `FDR-CONVOI-2026-${tournee.id.replace('TRN-', '')}` : 'FDR-CONVOI-2026-042';
  const itineraire = tournee?.itineraire || 'Axe Sud : Owendo ➔ Lambaréné (RN1) ➔ Mouila (RN1) ➔ Ndendé ➔ Tchibanga (RN6)';
  const destination = tournee?.destination || 'Provinces du Moyen-Ogooué, Ngounié & Nyanga';
  const chauffeurNom = chauffeur?.nom || tournee?.chauffeurNom || 'M. Jean-Baptiste MOUSSAVOU';
  const immatriculation = vehicule?.immatriculation || tournee?.vehiculeImmat || 'GA-8821-OPN';
  const vehiculeModele = vehicule?.modele || tournee?.vehiculeModele || 'Camion Frigorifique Isuzu FTR 12T (Chambre Froid Embarqué)';
  const escortePolice = tournee?.escorte || 'Escorte Gendarmerie Nationale (Brigade Routière de Bifoun)';
  const volumeKits = tournee?.volumeKits || '142 Caisses & 18 Bacs Isothermes (+2°C/+8°C)';

  const etapes = [
    { pk: 'PK 0', ville: 'Magasin Central Owendo (Départ)', heure: '06:00', temp: '+4.2°C', etatPiste: 'Asphalte (Excellent)', obs: 'Plombage N° PL-OPN-8821' },
    { pk: 'PK 185', ville: 'Carrefour Bifoun (Contrôle Escorte)', heure: '09:15', temp: '+4.5°C', etatPiste: 'Asphalte (Bon)', obs: 'Relais Gendarmerie effectué' },
    { pk: 'PK 240', ville: 'Antenne Provinciale Lambaréné (CHR G3)', heure: '11:00', temp: '+4.1°C', etatPiste: 'Asphalte (Bon)', obs: 'Livraison Lot CHR Lambaréné' },
    { pk: 'PK 380', ville: 'Mouila (Antenne Provinciale Ngounié G4)', heure: '15:30', temp: '+4.8°C', etatPiste: 'Piste Latérite (Dégradée)', obs: 'Ravitaillement Carburant 120L' },
    { pk: 'PK 520', ville: 'Ndendé (Dispensaire Rural & Urgences)', heure: '18:45', temp: '+5.0°C', etatPiste: 'Piste Forestière (Bourbiers)', obs: 'Décharge kits antipaludiques' },
    { pk: 'PK 610', ville: 'Tchibanga (Antenne Régionale Nyanga G5)', heure: '21:30', temp: '+4.4°C', etatPiste: 'Asphalte / Piste (Moyen)', obs: 'Fin de convoi & Dépôt chambre froide' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-md shadow-2xl border border-slate-300 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Barre d'actions supérieure (non imprimable) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-600 text-white rounded-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                Feuille de Route Officielle de Convoi Sécurisé & Ordre de Mission Routier
              </h2>
              <p className="text-[11px] text-slate-400">
                Réf : {numMission} — Direction de la Logistique & Flotte Territoriale OPN
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
            <div className="flex justify-between items-start border-b border-slate-300 pb-5 mb-5">
              <div className="flex items-start gap-3 max-w-[50%]">
                <OpnLogo className="h-10 w-auto mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold text-[11px] tracking-wider text-slate-800 uppercase">
                    RÉPUBLIQUE GABONAISE
                  </p>
                  <p className="text-[10px] text-slate-600 font-semibold italic">
                    Union — Travail — Justice
                  </p>
                  <p className="text-[10px] font-bold text-slate-700">MINISTÈRE DE LA SANTÉ</p>
                  <p className="text-[10px] font-black text-emerald-800">OFFICE PHARMACEUTIQUE NATIONAL (OPN)</p>
                  <p className="text-[9px] text-slate-600">Direction de la Logistique, Distribution & Flotte (DLD)</p>
                </div>
              </div>

              {/* Sceau & Visa Sécurité */}
              <div className="text-right space-y-1 max-w-[48%]">
                <div className="inline-block p-2 bg-amber-50 border border-amber-300 rounded-sm text-center">
                  <span className="text-[9px] font-bold text-amber-900 block uppercase">
                    LAISSEZ-PASSER PRIORITAIRE SANITAIRE
                  </span>
                  <span className="text-xs font-black text-slate-900 block font-mono">
                    CONVOI MÉDICAL D'URGENCE
                  </span>
                  <span className="text-[9.5px] text-amber-800 font-semibold block mt-0.5">
                    Priorité de Circulation sur Axes Routiers & Pistes Nationales
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Délivré à Libreville, le <strong>{todayStr}</strong>
                </p>
              </div>
            </div>

            {/* Titre du document */}
            <div className="text-center my-4 py-2.5 bg-amber-50/80 border-y border-amber-300">
              <h1 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                FEUILLE DE ROUTE OFFICIELLE DE CONVOI & ORDRE DE MISSION LOGISTIQUE
              </h1>
              <p className="text-[10px] text-amber-800 font-medium mt-0.5 font-mono">
                Mission N° : {numMission} • Déploiement Inter-Provinces 2026
              </p>
            </div>

            {/* Grille des caractéristiques du convoi */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Cadre Véhicule & Équipage */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-700" />
                  Véhicule, Équipage & Sécurité
                </h3>
                <table className="w-full text-[10.5px]">
                  <tbody>
                    <tr>
                      <td className="text-slate-500 py-0.5 w-1/3">Camion Frigorifique :</td>
                      <td className="font-bold text-slate-900">{vehiculeModele}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Immatriculation :</td>
                      <td className="font-mono font-bold text-emerald-800">{immatriculation}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Chauffeur Principal :</td>
                      <td className="font-bold text-slate-900">{chauffeurNom}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Escorte Sécurité :</td>
                      <td className="font-semibold text-blue-900">{escortePolice}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Dotation Carburant :</td>
                      <td className="font-mono font-bold text-slate-800">450 Litres Gasoil (Réservoir + 2 Jerricans)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cadre Marchandises & Chaîne du Froid */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                  Cargaison & Intégrité Thermique
                </h3>
                <table className="w-full text-[10.5px]">
                  <tbody>
                    <tr>
                      <td className="text-slate-500 py-0.5 w-1/3">Nature Cargaison :</td>
                      <td className="font-semibold text-slate-900">Médicaments Essentiels & Vaccins Stratégiques</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Volume Transporté :</td>
                      <td className="font-bold text-slate-900">{volumeKits}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Plage Thermique :</td>
                      <td className="font-mono font-bold text-emerald-700">+2°C à +8°C (Enregistreur IoT actif)</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Itinéraire Global :</td>
                      <td className="font-semibold text-slate-800">{destination}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500 py-0.5">Axe Principal :</td>
                      <td className="text-slate-700 font-mono text-[9.5px]">{itineraire}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tableau des Points de Passage (Waypoints) et Contrôles */}
            <div className="mb-5">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase mb-2 flex items-center justify-between">
                <span>Journal des Étapes, Points de Contrôle (Waypoints) & Relevés Thermiques</span>
                <span className="text-[10px] font-normal text-slate-500">Contrôle Métrologique & Pointage Chauffeur</span>
              </h3>

              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[10px]">
                    <th className="py-1.5 px-2 border-r border-slate-300">Point Kilométrique</th>
                    <th className="py-1.5 px-2 border-r border-slate-300">Étape / Établissement Sanitaire</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 text-center">Heure Prévue</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 text-center">Température Caisse</th>
                    <th className="py-1.5 px-2 border-r border-slate-300">État de la Piste</th>
                    <th className="py-1.5 px-2">Visa / Émargement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[10px]">
                  {etapes.map((etape, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : ''}>
                      <td className="py-1.5 px-2 font-mono font-bold text-slate-700 border-r border-slate-300">{etape.pk}</td>
                      <td className="py-1.5 px-2 font-semibold text-slate-900 border-r border-slate-300">{etape.ville}</td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800 border-r border-slate-300">{etape.heure}</td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold text-emerald-800 border-r border-slate-300">
                        {etape.temp}
                      </td>
                      <td className="py-1.5 px-2 text-slate-700 border-r border-slate-300">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                          etape.etatPiste.includes('Bourbiers') ? 'bg-red-100 text-red-800' :
                          etape.etatPiste.includes('Dégradée') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {etape.etatPiste}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-slate-600 italic text-[9.5px]">
                        {etape.obs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Consignes de Sécurité & Urgence */}
            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded mb-5 text-[10px] space-y-1">
              <h4 className="font-bold text-amber-950 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Instructions Impératives de Convoi Sanitaire
              </h4>
              <p className="text-amber-900">
                1. <strong>Chaîne du froid</strong> : En cas d'élévation thermique au-delà de +8.0°C pendant plus de 45 minutes, enclencher le groupe frigorifique de secours et contacter le COD Central (+241 011 76 00 00).
              </p>
              <p className="text-amber-900">
                2. <strong>Franchissement des bourbiers</strong> : Ne pas s'engager seul sans l'appui du véhicule d'escorte ou du treuil 4x4.
              </p>
              <p className="text-amber-900">
                3. <strong>Émargement obligatoire</strong> : Faire signer et tamponner le bordereau de livraison par le Pharmacien Responsable de chaque antenne ou le Médecin-Chef du dispensaire desservi.
              </p>
            </div>

            {/* Signatures & Visas Tripartites */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-center">
              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Directeur de la Logistique OPN</p>
                  <p className="text-[9px] text-slate-500">Ordonnateur du Transport</p>
                </div>
                <div className="text-[9.5px] font-mono text-emerald-800 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  M. Jean-Baptiste MOUSSAVOU<br />
                  <span className="text-[8px] text-slate-500 font-normal">Bon pour départ de convoi</span>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Chauffeur-Livreur Chef de Convoi</p>
                  <p className="text-[9px] text-slate-500">Prise en charge de la cargaison</p>
                </div>
                <div className="text-[9.5px] font-mono text-slate-900 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Émargement Chauffeur<br />
                  <span className="text-[8px] text-slate-500 font-normal">Plombs et caisses vérifiés</span>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase">Le Commandant d'Escorte</p>
                  <p className="text-[9px] text-slate-500">Gendarmerie Nationale / Police</p>
                </div>
                <div className="text-[9.5px] font-mono text-blue-900 font-bold border-t border-dotted border-slate-400 pt-1 inline-block">
                  Sécurité Routière Assurée<br />
                  <span className="text-[8px] text-slate-500 font-normal">Visa Escorte d'Urgence</span>
                </div>
              </div>
            </div>

            {/* Bas de page officiel */}
            <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[8.5px] text-slate-500">
              Office Pharmaceutique National (OPN) — Direction de la Logistique & Flotte — Système Central ERP Gabon 2026 • Assistance Radio VHF / Téléphone Satellite : Canal Urgence OPN-1
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
