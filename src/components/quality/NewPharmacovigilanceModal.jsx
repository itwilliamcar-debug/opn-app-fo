import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Building,
  User,
  Pill,
  Send,
  AlertOctagon
} from 'lucide-react';

export default function NewPharmacovigilanceModal({ isOpen, onClose, onSaveReport, activePersona }) {
  const [formData, setFormData] = useState({
    structureNotificatrice: 'Centre Hospitalier Universitaire de Libreville (CHUL)',
    provinceId: 'G1',
    notificateurNom: activePersona?.nom || 'Dr. François MBA ALLOGO',
    notificateurContact: activePersona?.telephone || '+241 077 00 11 22',
    patientAge: '35 ans',
    patientSexe: 'Féminin',
    produitSuspect: 'ARTESUNATE INJECTABLE 60mg',
    dci: 'Artésunate',
    laboratoire: 'Guilin Pharmaceutical / Fosun Pharma',
    numeroLot: 'GLN-ART-2026-045',
    dateAdministration: new Date().toISOString().slice(0, 10),
    descriptionReaction: 'Réaction urticarienne aiguë avec prurit intense et dyspnée modérée survenue 15 minutes après administration IV.',
    gravite: 'GRAVE_HOSPITALISATION',
    evolutionPatient: 'En voie d\'amélioration sous antihistaminique et corticothérapie',
    imputabiliteOms: 'VRAISEMBLABLE',
    actionImmediatePrise: 'Mise en quarantaine préventive du lot dans le service et prélèvement d\'échantillons pour analyse au LNCM.',
    rappelDeLotDeclenche: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      ...formData,
      id: `PV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      dateNotification: new Date().toISOString().slice(0, 10),
      statutInvestigation: formData.rappelDeLotDeclenche ? 'RAPPEL_NATIONAL_ACTIF' : 'INVESTIGATION_LNCM_EN_COURS',
      rapportDmpTransmis: true,
      numeroFicheDmp: `DMP/PV/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onSaveReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Déclaration de Pharmacovigilance & Alerte Sanitaire</h3>
              <p className="text-xs text-slate-400">Signalement officiel d'effet indésirable ou défaut qualité DMP / OPN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          
          {/* Notificateur */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
              <Building className="w-4 h-4 text-rose-600" />
              Structure & Déclarant
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Établissement / Structure Sanitaire</label>
                <input
                  type="text"
                  required
                  value={formData.structureNotificatrice}
                  onChange={(e) => setFormData({ ...formData, structureNotificatrice: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Province Sanitaire</label>
                <select
                  value={formData.provinceId}
                  onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-bold"
                >
                  <option value="G1">G1 - Estuaire (Libreville)</option>
                  <option value="G2">G2 - Haut-Ogooué (Franceville)</option>
                  <option value="G3">G3 - Moyen-Ogooué (Lambaréné)</option>
                  <option value="G4">G4 - Ngounié (Mouila)</option>
                  <option value="G5">G5 - Nyanga (Tchibanga)</option>
                  <option value="G6">G6 - Ogooué-Ivindo (Makokou)</option>
                  <option value="G7">G7 - Ogooué-Lolo (Koula-Moutou)</option>
                  <option value="G8">G8 - Ogooué-Maritime (Port-Gentil)</option>
                  <option value="G9">G9 - Woleu-Ntem (Oyem)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professionnel Déclarant (Médecin / Pharmacien)</label>
                <input
                  type="text"
                  required
                  value={formData.notificateurNom}
                  onChange={(e) => setFormData({ ...formData, notificateurNom: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Téléphone / Contact</label>
                <input
                  type="text"
                  required
                  value={formData.notificateurContact}
                  onChange={(e) => setFormData({ ...formData, notificateurContact: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Patient & Médicament */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
              <Pill className="w-4 h-4 text-rose-600" />
              Patient & Médicament Suspect
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Âge du Patient</label>
                <input
                  type="text"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sexe</label>
                <select
                  value={formData.patientSexe}
                  onChange={(e) => setFormData({ ...formData, patientSexe: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Féminin">Féminin</option>
                  <option value="Masculin">Masculin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date d'Administration</label>
                <input
                  type="date"
                  value={formData.dateAdministration}
                  onChange={(e) => setFormData({ ...formData, dateAdministration: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">DCI / Médicament Suspect</label>
                <input
                  type="text"
                  required
                  value={formData.produitSuspect}
                  onChange={(e) => setFormData({ ...formData, produitSuspect: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Numéro de Lot</label>
                <input
                  type="text"
                  required
                  value={formData.numeroLot}
                  onChange={(e) => setFormData({ ...formData, numeroLot: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono font-bold text-rose-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Laboratoire Fabricant</label>
                <input
                  type="text"
                  value={formData.laboratoire}
                  onChange={(e) => setFormData({ ...formData, laboratoire: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Description & Gravité */}
          <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
            <h4 className="font-bold text-rose-950 flex items-center gap-2 text-xs uppercase tracking-wide">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              Gravité & Réaction Clinique
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Degré de Gravité</label>
                <select
                  value={formData.gravite}
                  onChange={(e) => setFormData({ ...formData, gravite: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-bold text-rose-900"
                >
                  <option value="MINEUR">MINEUR (Effet bénin sans hospitalisation)</option>
                  <option value="MODERE">MODÉRÉ (Nécessite prise en charge ambulatoire)</option>
                  <option value="GRAVE_HOSPITALISATION">GRAVE (Hospitalisation ou mise en jeu du pronostic)</option>
                  <option value="CRITIQUE_VITAL">CRITIQUE VITAL (Menace vitale immédiate / Réanimation)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Imputabilité OMS Présumée</label>
                <select
                  value={formData.imputabiliteOms}
                  onChange={(e) => setFormData({ ...formData, imputabiliteOms: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-semibold"
                >
                  <option value="TRÈS PROBABLE">TRÈS PROBABLE (Lien direct chronologique et clinique)</option>
                  <option value="VRAISEMBLABLE">VRAISEMBLABLE (Réaction documentée compatible)</option>
                  <option value="POSSIBLE">POSSIBLE (Autre étiologie envisageable)</option>
                  <option value="DOUTEUX">DOUTEUX (Imputabilité incertaine)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Description Détaillée de la Réaction / Incident</label>
                <textarea
                  rows="2"
                  required
                  value={formData.descriptionReaction}
                  onChange={(e) => setFormData({ ...formData, descriptionReaction: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-serif"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Mesures Conservatoires Immédiates</label>
                <input
                  type="text"
                  value={formData.actionImmediatePrise}
                  onChange={(e) => setFormData({ ...formData, actionImmediatePrise: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Checkbox Rappel de lot */}
            <div className="mt-3 pt-3 border-t border-rose-200">
              <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-lg border border-rose-300 shadow-sm hover:bg-rose-50/50">
                <input
                  type="checkbox"
                  checked={formData.rappelDeLotDeclenche}
                  onChange={(e) => setFormData({ ...formData, rappelDeLotDeclenche: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <div>
                  <span className="font-bold text-rose-900 block text-xs">Déclencher la Procédure de Rappel de Lot d'Urgence National</span>
                  <span className="text-[10.5px] text-slate-600">Alertera simultanément la DMP, le COD Urgences et les 9 Antennes Provinciales OPN.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold flex items-center gap-2 shadow-md hover:shadow-rose-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Transmettre la Déclaration DMP & OPN</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
