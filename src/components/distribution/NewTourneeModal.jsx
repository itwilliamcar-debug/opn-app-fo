import React, { useState } from 'react';
import { X, Plus, Compass, Truck, ShieldCheck, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { PROVINCES_AXES, FLOTTE_MULTIMODALE, KITS_SANITAIRES_CATALOGUE } from '../../data/distributionData';

export default function NewTourneeModal({ isOpen, onClose, onTourneeCreated }) {
  const [selectedProvinceId, setSelectedProvinceId] = useState('G3');
  const [selectedAxeId, setSelectedAxeId] = useState('AXE-MO-01');
  const [intitule, setIntitule] = useState('Rotation Fluviale Moyen-Ogooué : Lambaréné → Lacs du Sud');
  const [typeVecteur, setTypeVecteur] = useState('FLUVIAL_PIROGUE');
  const [vehiculeId, setVehiculeId] = useState('VEH-PIR-01');
  const [chauffeur, setChauffeur] = useState('M. Michel NDONG BIYOGO (Piroguier Certifié)');
  const [dateDepart, setDateDepart] = useState('2026-09-18T06:30');
  const [dateRetour, setDateRetour] = useState('2026-09-20T17:00');
  const [structuresCibles, setStructuresCibles] = useState('Dispensaire Fluvial Lac Zilé, Case d\'Ashuka, Poste Médical Onangué');
  const [selectedKits, setSelectedKits] = useState(['KIT-ACCOUCH-URG', 'KIT-PALU-GRAVE', 'KIT-PEV-VACCIN']);
  const [observations, setObservations] = useState('Glacières autonomes testées à +4.0°C. Priorité de passage sur les bacs et accostages fluviaux.');

  if (!isOpen) return null;

  const currentProvince = PROVINCES_AXES.find(p => p.id === selectedProvinceId) || PROVINCES_AXES[0];

  const handleProvinceChange = (pId) => {
    setSelectedProvinceId(pId);
    const prov = PROVINCES_AXES.find(p => p.id === pId);
    if (prov && prov.axesPrincipaux && prov.axesPrincipaux.length > 0) {
      setSelectedAxeId(prov.axesPrincipaux[0].id);
      setIntitule(`Tournée Distribution ${prov.nom} : ${prov.axesPrincipaux[0].nom}`);
      setTypeVecteur(prov.axesPrincipaux[0].type);
    }
  };

  const handleAxeChange = (axeId) => {
    setSelectedAxeId(axeId);
    const axe = currentProvince.axesPrincipaux.find(a => a.id === axeId);
    if (axe) {
      setIntitule(`Tournée Distribution ${currentProvince.nom} : ${axe.nom}`);
      setTypeVecteur(axe.type);
    }
  };

  const toggleKit = (kitCode) => {
    if (selectedKits.includes(kitCode)) {
      setSelectedKits(selectedKits.filter(k => k !== kitCode));
    } else {
      setSelectedKits([...selectedKits, kitCode]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `TRN-2026-${Math.floor(100 + Math.random() * 900)}`;
    const selectedVeh = FLOTTE_MULTIMODALE.find(v => v.id === vehiculeId) || FLOTTE_MULTIMODALE[0];

    const structuresArray = structuresCibles.split(',').map(s => s.trim()).filter(Boolean);

    const createdTournee = {
      id: newId,
      reference: `OPN-TRN-${selectedProvinceId}-${newId.split('-')[2]}`,
      intitule,
      provinceId: selectedProvinceId,
      provinceNom: currentProvince.nom,
      typeVecteur,
      vehiculeAssigne: selectedVeh.designation,
      moteur: typeVecteur === 'FLUVIAL_PIROGUE' ? 'Yamaha Enduro 60CV' : '4x4 Tropicalisé',
      equipage: chauffeur,
      dateDepart: dateDepart.replace('T', ' '),
      dateRetourPrevue: dateRetour.replace('T', ' '),
      distancePrevue: '140 km / Miles Nautiques',
      statut: 'PROGRAMME',
      progressionPourcent: 0,
      poidsTotalKg: 480,
      valeurMarchandiseXaf: 5600000,
      glacieresSuivies: [
        { id: `GLAC-${selectedProvinceId}-01`, type: 'Dometic Cool-Ice 110L', tempActuelle: '+4.0°C', tempMin: '+2.0°C', tempMax: '+6.0°C', statut: 'CONFORME' }
      ],
      etapes: [
        { ordre: 1, structure: `Départ Antenne OPN ${currentProvince.chefLieu}`, type: 'DEPART', heurePrevue: dateDepart.replace('T', ' '), statut: 'PROGRAMME' },
        ...structuresArray.map((str, idx) => ({
          ordre: idx + 2,
          structure: str,
          type: 'LIVRAISON',
          heurePrevue: 'En cours de tournée',
          kits: selectedKits.map(k => `1x ${k}`),
          dechargeSignee: false
        })),
        { ordre: structuresArray.length + 2, structure: `Retour Antenne OPN ${currentProvince.chefLieu}`, type: 'ARRIVEE', heurePrevue: dateRetour.replace('T', ' '), statut: 'PROGRAMME' }
      ]
    };

    if (onTourneeCreated) {
      onTourneeCreated(createdTournee);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Planifier une Tournée de Distribution Dernier Kilomètre</h3>
              <p className="text-[11px] text-slate-300">Réseau des 9 Provinces & Soins Primaires Ruraux</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Province & Axe Sélection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Province de Destination</label>
              <select
                value={selectedProvinceId}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {PROVINCES_AXES.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.id} — {prov.nom} (Chef-lieu : {prov.chefLieu})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Axe Logistique / Circuit</label>
              <select
                value={selectedAxeId}
                onChange={(e) => handleAxeChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {currentProvince.axesPrincipaux.map((axe) => (
                  <option key={axe.id} value={axe.id}>
                    {axe.nom} ({axe.distanceKm} km/MN • {axe.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Intitulé de la Tournée */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Intitulé Officiel de la Mission</label>
            <input
              type="text"
              required
              value={intitule}
              onChange={(e) => setIntitule(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Vecteur & Équipage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Type de Vecteur</label>
              <select
                value={typeVecteur}
                onChange={(e) => setTypeVecteur(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="TERRESTRE_4X4">Véhicule 4x4 Piste Latérite</option>
                <option value="FLUVIAL_PIROGUE">Pirogue Fluviale Renforcée</option>
                <option value="MARITIME_CHALOUPE">Chaloupe Maritime / Lagune</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Moyen / Flotte OPN</label>
              <select
                value={vehiculeId}
                onChange={(e) => setVehiculeId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {FLOTTE_MULTIMODALE.map((veh) => (
                  <option key={veh.id} value={veh.id}>
                    {veh.designation} ({veh.statut})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chauffeur / Piroguier</label>
              <input
                type="text"
                required
                value={chauffeur}
                onChange={(e) => setChauffeur(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Dates Départ / Retour */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date & Heure de Départ</label>
              <input
                type="datetime-local"
                required
                value={dateDepart}
                onChange={(e) => setDateDepart(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date & Heure de Retour Prévue</label>
              <input
                type="datetime-local"
                required
                value={dateRetour}
                onChange={(e) => setDateRetour(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Structures Sanitaires à Desservir */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dispensaires & Cases de Santé à Desservir (séparés par des virgules)
            </label>
            <input
              type="text"
              required
              value={structuresCibles}
              onChange={(e) => setStructuresCibles(e.target.value)}
              placeholder="Dispensaire d'Ovan, Case de Koumameyong, Centre Médical de Booué..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Kits Sanitaires Embarqués */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kits Sanitaires Standardisés OPN à Embarquer
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {KITS_SANITAIRES_CATALOGUE.map((kit) => {
                const isSelected = selectedKits.includes(kit.code);
                return (
                  <div
                    key={kit.id}
                    onClick={() => toggleKit(kit.code)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] leading-snug">{kit.libelle}</p>
                      <p className="text-[9.5px] text-slate-500 font-mono mt-0.5">{kit.temperatureStockage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observations Logistiques */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Consignes Spéciales & Note Logistique</label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Valider & Éditer Ordre de Mission</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
