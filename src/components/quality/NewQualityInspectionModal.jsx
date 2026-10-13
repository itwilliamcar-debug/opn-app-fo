import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Award,
  AlertTriangle,
  FileCheck2,
  Building,
  Thermometer,
  Pill,
  Calendar,
  Layers
} from 'lucide-react';

export default function NewQualityInspectionModal({ isOpen, onClose, onSaveInspection, activePersona }) {
  const [formData, setFormData] = useState({
    produitNom: 'ARTEMETHER + LUMEFANTRINE 20/120mg CP (Coartem)',
    produitCode: '010301001',
    dci: 'Artéméther + Luméfantrine',
    forme: 'Comprimé pelliculé',
    dosage: '20mg / 120mg',
    laboratoire: 'Novartis Pharma SAS',
    paysOrigine: 'Suisse',
    numeroLot: `NVR-${Math.floor(1000 + Math.random() * 9000)}`,
    quantiteLot: 25000,
    unite: 'Boîtes de 24 comprimés',
    valeurXAF: 23750000,
    dateReception: new Date().toISOString().slice(0, 10),
    dateControle: new Date().toISOString().slice(0, 10),
    dateFabrication: '2026-05-01',
    datePeremption: '2028-04-30',
    temperatureTransport: '22.0°C (Conforme)',
    coaFournisseurConforme: true,
    numeroCoaFournisseur: `COA-NVR-${Math.floor(10000 + Math.random() * 90000)}`,
    echantillonnageQuantite: '60 boîtes (Norme OMS)',
    aspectVisuel: 'Conforme — Plaquettes aluminium intactes, comprimés sans défauts',
    etiquetageFrancais: 'Conforme — Mentions DMP et DCI visibles',
    dosagePrincipeActif: '99.8% (Spécification: 95-105%)',
    essaiDissolution: '97.5% en 45 min (Q ≥ 80%)',
    pureteChromatographique: 'Impuretés totales < 0.12%',
    steriliteControleMicrobio: 'Conforme',
    statut: 'LIBERE_CONFORME',
    observations: 'Lot conforme aux spécifications LNCM et prêt pour distribution immédiate.',
    destinationStock: 'Hub Central Owendo — Magasin Central',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInspection = {
      ...formData,
      id: `CQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      numeroCertificat: `LNCM-OPN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      inspecteurLncm: 'Dr. Paulin EDOU EYENE (LNCM)',
      pharmacienResponsableOpn: activePersona?.nom || 'Dr. François MBA ALLOGO (OPN)',
      visaDmp: `VALIDÉ — Réf DMP/INS/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onSaveInspection(newInspection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Nouveau Contrôle Qualité & Libération de Lot LNCM</h3>
              <p className="text-xs text-slate-400">Inspection à réception • Laboratoire National de Contrôle du Médicament</p>
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
          
          {/* Section 1 : Produit & Lot */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
              <Pill className="w-4 h-4 text-teal-600" />
              Identification du Produit & Lot
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Médicament DCI / Désignation</label>
                <input
                  type="text"
                  required
                  value={formData.produitNom}
                  onChange={(e) => setFormData({ ...formData, produitNom: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Laboratoire Fabricant & Pays</label>
                <input
                  type="text"
                  required
                  value={formData.laboratoire}
                  onChange={(e) => setFormData({ ...formData, laboratoire: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Numéro de Lot</label>
                <input
                  type="text"
                  required
                  value={formData.numeroLot}
                  onChange={(e) => setFormData({ ...formData, numeroLot: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantité du Lot & Conditionnement</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantiteLot}
                    onChange={(e) => setFormData({ ...formData, quantiteLot: Number(e.target.value) })}
                    className="w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-bold"
                  />
                  <input
                    type="text"
                    value={formData.unite}
                    onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                    className="w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date de Fabrication</label>
                <input
                  type="date"
                  required
                  value={formData.dateFabrication}
                  onChange={(e) => setFormData({ ...formData, dateFabrication: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date de Péremption</label>
                <input
                  type="date"
                  required
                  value={formData.datePeremption}
                  onChange={(e) => setFormData({ ...formData, datePeremption: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-medium text-rose-700 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Contrôle Documentaire & Physico-Chimique */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              Contrôles Analytiques & Résultats LNCM
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certificat d'Analyse (CoA) Fournisseur</label>
                <input
                  type="text"
                  value={formData.numeroCoaFournisseur}
                  onChange={(e) => setFormData({ ...formData, numeroCoaFournisseur: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="Ex: COA-2026-XXXX"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Température constatée à réception</label>
                <input
                  type="text"
                  value={formData.temperatureTransport}
                  onChange={(e) => setFormData({ ...formData, temperatureTransport: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dosage Principe Actif (% déclaré)</label>
                <input
                  type="text"
                  value={formData.dosagePrincipeActif}
                  onChange={(e) => setFormData({ ...formData, dosagePrincipeActif: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Essai de Dissolution</label>
                <input
                  type="text"
                  value={formData.essaiDissolution}
                  onChange={(e) => setFormData({ ...formData, essaiDissolution: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pureté Chromatographique / Impuretés</label>
                <input
                  type="text"
                  value={formData.pureteChromatographique}
                  onChange={(e) => setFormData({ ...formData, pureteChromatographique: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stérilité / Microbiologie</label>
                <input
                  type="text"
                  value={formData.steriliteControleMicrobio}
                  onChange={(e) => setFormData({ ...formData, steriliteControleMicrobio: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3 : Décision */}
          <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl space-y-3">
            <h4 className="font-bold text-teal-950 flex items-center gap-2 text-xs uppercase tracking-wide">
              <Award className="w-4 h-4 text-teal-700" />
              Décision de Libération Pharmaceutique
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statut Final de Décision</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-bold text-teal-900"
                >
                  <option value="LIBERE_CONFORME">LIBÉRÉ CONFORME (Distribution autorisée)</option>
                  <option value="QUARANTAINE_INVESTIGATION">EN QUARANTAINE (Investigation complémentaire)</option>
                  <option value="REJETE_NON_CONFORME">REJETÉ NON CONFORME (Séquestre & Destruction)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emplacement / Magasin de destination</label>
                <input
                  type="text"
                  value={formData.destinationStock}
                  onChange={(e) => setFormData({ ...formData, destinationStock: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Observations & Conclusions</label>
                <textarea
                  rows="2"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              <span>Valider & Générer le Certificat LNCM</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
