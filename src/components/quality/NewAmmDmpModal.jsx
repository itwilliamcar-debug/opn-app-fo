import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  Building,
  Pill,
  Calendar,
  Globe,
  Award
} from 'lucide-react';

export default function NewAmmDmpModal({ isOpen, onClose, onSaveAmm }) {
  const [formData, setFormData] = useState({
    numeroAmm: `DMP/AMM/2026/${Math.floor(100 + Math.random() * 900)}`,
    dci: 'Céfotaxime',
    nomCommercial: 'CLAFORAN 1g Poudre pour injection',
    formeDosage: 'Poudre stérile pour injection IV/IM (1g)',
    conditionnement: 'Boîte de 1 flacon + ampoule de solvant',
    laboratoireTitulaire: 'Sanofi Winthrop Industrie',
    siteFabrication: 'Le Trait, France',
    dateOctroiAmm: new Date().toISOString().slice(0, 10),
    dateExpirationAmm: '2031-09-17',
    statut: 'VALIDE',
    classificationOms: 'Homologation EMA & ANSM',
    categorieLegale: 'Liste I — Usage Hospitalier & Officine',
    tauxRemboursementCnamgs: '90%',
    observations: 'Dossier complet conforme aux exigences CTD Module 1 à 5 de la DMP Gabon.',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAmm = {
      ...formData,
      id: `AMM-GA-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onSaveAmm(newAmm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Enregistrement d'Homologation AMM (DMP)</h3>
              <p className="text-xs text-slate-400">Autorisation de Mise sur le Marché • Ministère de la Santé du Gabon</p>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Numéro Officiel AMM</label>
              <input
                type="text"
                required
                value={formData.numeroAmm}
                onChange={(e) => setFormData({ ...formData, numeroAmm: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono font-bold text-teal-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Statut Juridique de l'AMM</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-bold"
              >
                <option value="VALIDE">VALIDE (Autorisé pour 5 ans)</option>
                <option value="EN_INSTRUCTION">EN INSTRUCTION TECHNIQUE (Dossier déposé)</option>
                <option value="EN_RENOUVELLEMENT">EN RENOUVELLEMENT QUINQUENNAL</option>
                <option value="SUSPENDU">SUSPENDU (Alerte / Sanction)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">DCI (Dénomination Commune)</label>
              <input
                type="text"
                required
                value={formData.dci}
                onChange={(e) => setFormData({ ...formData, dci: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom Commercial Déposé</label>
              <input
                type="text"
                required
                value={formData.nomCommercial}
                onChange={(e) => setFormData({ ...formData, nomCommercial: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Forme & Dosage</label>
              <input
                type="text"
                required
                value={formData.formeDosage}
                onChange={(e) => setFormData({ ...formData, formeDosage: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Conditionnement Agréé</label>
              <input
                type="text"
                value={formData.conditionnement}
                onChange={(e) => setFormData({ ...formData, conditionnement: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Laboratoire Titulaire</label>
              <input
                type="text"
                required
                value={formData.laboratoireTitulaire}
                onChange={(e) => setFormData({ ...formData, laboratoireTitulaire: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Site de Fabrication Certifié</label>
              <input
                type="text"
                value={formData.siteFabrication}
                onChange={(e) => setFormData({ ...formData, siteFabrication: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date d'Octroi</label>
              <input
                type="date"
                required
                value={formData.dateOctroiAmm}
                onChange={(e) => setFormData({ ...formData, dateOctroiAmm: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date d'Expiration (5 ans)</label>
              <input
                type="date"
                required
                value={formData.dateExpirationAmm}
                onChange={(e) => setFormData({ ...formData, dateExpirationAmm: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Classification / Préqualification OMS</label>
              <input
                type="text"
                value={formData.classificationOms}
                onChange={(e) => setFormData({ ...formData, classificationOms: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prise en charge CNAMGS</label>
              <select
                value={formData.tauxRemboursementCnamgs}
                onChange={(e) => setFormData({ ...formData, tauxRemboursementCnamgs: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-bold"
              >
                <option value="100%">100% (Programme Gratuité / Maladies Chroniques)</option>
                <option value="90%">90% (Médicament Spécialisé / Affection Longue Durée)</option>
                <option value="80%">80% (Médicament Essentiel Standard)</option>
                <option value="0%">0% (Non remboursé)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Observations Réglementaires</label>
              <textarea
                rows="2"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold flex items-center gap-2 shadow-md hover:shadow-teal-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer l'Homologation DMP</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
