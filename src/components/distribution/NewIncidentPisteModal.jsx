import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { PROVINCES_AXES } from '../../data/distributionData';

export default function NewIncidentPisteModal({ isOpen, onClose, onIncidentLogged, tournees }) {
  const [tourneeRef, setTourneeRef] = useState(tournees && tournees.length > 0 ? tournees[0].reference : 'OPN-TRN-NGO-2026-091');
  const [province, setProvince] = useState('Ngounié');
  const [axe, setAxe] = useState('Axe Mouila → Ndendé → Doussala (PK 42)');
  const [typeIncident, setTypeIncident] = useState('BOURBIER_LATÉRITE');
  const [gravite, setGravite] = useState('MOYENNE');
  const [description, setDescription] = useState('Affaissement de la piste latérite suite aux pluies. Véhicule ralenti, treuillage en cours.');
  const [impactChaineFroid, setImpactChaineFroid] = useState('NUL (Caisson solaire autonome affiche +4.0°C stable)');
  const [actionCorrective, setActionCorrective] = useState('Assistance d\'un engin forestier local. Reprise estimée sous 2h.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncident = {
      id: `INC-2026-0${Math.floor(15 + Math.random() * 85)}`,
      tourneeRef,
      province,
      axe,
      typeIncident,
      gravite,
      dateHeure: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      vehicule: 'Flotte OPN Assignée',
      description,
      impactChaineFroid,
      statut: 'EN_COURS_DEGAGEMENT',
      actionCorrective
    };

    if (onIncidentLogged) {
      onIncidentLogged(newIncident);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 shadow-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Déclarer un Incident de Piste / Aléas Fluvial</h3>
              <p className="text-[11px] text-slate-300">Signalement Télésuivi & Sécurité Sanitaire</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tournée Concernée</label>
              <select
                value={tourneeRef}
                onChange={(e) => setTourneeRef(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {tournees && tournees.map((t) => (
                  <option key={t.id} value={t.reference}>
                    {t.reference} — {t.provinceNom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gravité de l'Incident</label>
              <select
                value={gravite}
                onChange={(e) => setGravite(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="FAIBLE">Faible (Retard &lt; 1h, Aucun risque)</option>
                <option value="MOYENNE">Moyenne (Bourbier / Attente Bac 1-3h)</option>
                <option value="CRITIQUE">Critique (Blocage prolongé &gt; 6h / Panne)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Province</label>
              <input
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nature de l'Incident</label>
              <select
                value={typeIncident}
                onChange={(e) => setTypeIncident(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="BOURBIER_LATÉRITE">Bourbier / Piste Dégradée</option>
                <option value="ATTENTE_BAC_FLUVIAUX">Attente / Arrêt Bac Fluvial</option>
                <option value="HERBIERS_FLUVIAUX">Herbiers Fluviaux / Hélice bloquée</option>
                <option value="PONT_BOIS_FRAGILE">Pont de Grumes Inondé / Fragile</option>
                <option value="PANNE_MECANIQUE">Panne Mécanique / Crevaison</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Localisation / Axe Précis</label>
            <input
              type="text"
              required
              value={axe}
              onChange={(e) => setAxe(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description des Circonstances</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Impact Chaîne du Froid</label>
              <input
                type="text"
                required
                value={impactChaineFroid}
                onChange={(e) => setImpactChaineFroid(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Action Corrective Engagée</label>
              <input
                type="text"
                required
                value={actionCorrective}
                onChange={(e) => setActionCorrective(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
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
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Enregistrer l'Alerte Piste</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
