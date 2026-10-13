import React, { useState } from 'react';
import { X, Wrench, AlertTriangle, Building2, CheckCircle2, User, Coins, Clock } from 'lucide-react';
import { TECHNICAL_EQUIPMENTS_CATALOG } from '../../data/gmaoMaintenanceData';
import { formatXAF } from '../../utils/formatters';

export default function NewMaintenanceTicketModal({
  isOpen,
  onClose,
  onSubmitTicket
}) {
  if (!isOpen) return null;

  const [equipementId, setEquipementId] = useState('EQ-OW-01');
  const [typeOT, setTypeOT] = useState('CURATIF');
  const [priorite, setPriorite] = useState('HAUTE');
  const [technicienAssigne, setTechnicienAssigne] = useState('M. Serge Alain NZAMBA');
  const [description, setDescription] = useState('Dérive thermique constatée sur sonde IoT (+6.8°C). Nettoyage du condenseur et contrôle pressostatique du groupe frigorifique.');
  const [piecesChangees, setPiecesChangees] = useState('Filtre déshydrateur + Gaz R134a (2 kg)');
  const [tempsArretMinutes, setTempsArretMinutes] = useState(30);
  const [coutTotalXAF, setCoutTotalXAF] = useState(120000);

  const selectedEquip = TECHNICAL_EQUIPMENTS_CATALOG.find(e => e.id === equipementId) || TECHNICAL_EQUIPMENTS_CATALOG[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `OT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOT = {
      id: newId,
      dateCreation: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      equipementId,
      equipementNom: selectedEquip.nom,
      typeOT,
      typeOTLabel: typeOT === 'PREVENTIF' ? 'Maintenance Préventive Programmée' : 'Dépannage Curatif d\'Urgence',
      priorite,
      province: selectedEquip.province,
      site: selectedEquip.site,
      technicienAssigne,
      description,
      piecesChangees,
      tempsArretMinutes: Number(tempsArretMinutes),
      coutTotalXAF: Number(coutTotalXAF),
      statut: 'CLOTURE_CONFORME',
      statutLabel: 'Intervention Validée & Clôturée',
      statutColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      dateCloture: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      visaChefSite: 'Dr. François MBA ALLOGO'
    };

    onSubmitTicket(newOT);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Nouvel Ordre de Travail GMAO</h3>
              <p className="text-xs text-amber-200">Déclaration d'Intervention & Maintenance Équipements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Sélection de l'Équipement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Équipement Concerné (Tag OPN) *</label>
            <select
              value={equipementId}
              onChange={(e) => setEquipementId(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2.5 bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {TECHNICAL_EQUIPMENTS_CATALOG.map(e => (
                <option key={e.id} value={e.id}>
                  [{e.tag}] {e.nom} — {e.province} ({e.tempLive || 'Actif'})
                </option>
              ))}
            </select>
          </div>

          {/* Type d'OT & Priorité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nature de l'Intervention *</label>
              <select
                value={typeOT}
                onChange={(e) => setTypeOT(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="CURATIF">Dépannage Curatif d'Urgence</option>
                <option value="PREVENTIF">Maintenance Préventive Périodique</option>
                <option value="ETALONNAGE">Étalonnage Métrologique & Cartographie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Niveau de Priorité / Criticité *</label>
              <select
                value={priorite}
                onChange={(e) => setPriorite(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="CRITIQUE">CRITIQUE (Menace chaîne du froid)</option>
                <option value="HAUTE">HAUTE (Intervention sous 2h)</option>
                <option value="MOYENNE">MOYENNE (Maintenance standard)</option>
                <option value="BASSE">BASSE (Contrôle de routine)</option>
              </select>
            </div>
          </div>

          {/* Technicien Assigné */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Technicien Frigoriste / Électromécanicien *</label>
            <input
              type="text"
              required
              value={technicienAssigne}
              onChange={(e) => setTechnicienAssigne(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-medium"
            />
          </div>

          {/* Diagnostic & Description des Travaux */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Diagnostic Technique & Travaux à Réaliser *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
            />
          </div>

          {/* Pièces Remplacées */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pièces Détachées / Consommables Utilisés</label>
            <input
              type="text"
              value={piecesChangees}
              onChange={(e) => setPiecesChangees(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
            />
          </div>

          {/* Temps d'Arrêt & Coût */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Temps d'Arrêt Équipement (Minutes)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={tempsArretMinutes}
                onChange={(e) => setTempsArretMinutes(e.target.value)}
                className="w-full text-xs font-mono font-bold rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Coût Estimé de l'Intervention (FCFA)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={coutTotalXAF}
                onChange={(e) => setCoutTotalXAF(e.target.value)}
                className="w-full text-xs font-mono font-bold rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider & Émettre l'Ordre de Travail</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
