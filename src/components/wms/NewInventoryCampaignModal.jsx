import React, { useState } from 'react';
import { 
  X, 
  ClipboardCheck, 
  Building, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';
import { STORAGE_ZONES } from '../../data/wmsData';

export default function NewInventoryCampaignModal({ isOpen, onClose, onSaveCampaign }) {
  const [zoneId, setZoneId] = useState('ZONE_A');
  const [titre, setTitre] = useState('Inventaire Tournant — Zone A (Produits Secs)');
  const [responsable, setResponsable] = useState('M. Marc MBA EDZANG (Chef Magasinier)');
  const [superviseur, setSuperviseur] = useState('Dr Armel BOUSSAMBA (Pharmacien Chef National)');
  const [auditeur, setAuditeur] = useState('Mme Chantal NZENGUE OBIANG (DAF)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleZoneChange = (zId) => {
    setZoneId(zId);
    const z = STORAGE_ZONES.find(s => s.id === zId);
    if (z) {
      setTitre(`Inventaire Tournant — ${z.nom}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const campaignId = `INV-${now.getFullYear()}-M${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(10 + Math.random() * 90)}`;
    const targetZone = STORAGE_ZONES.find(z => z.id === zoneId) || STORAGE_ZONES[0];

    const newCampaign = {
      id: campaignId,
      numeroPv: `PV-INV-OWD-${now.getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      titre: titre,
      zoneCible: zoneId,
      zoneNom: targetZone.nom,
      dateDebut: now.toISOString().split('T')[0],
      dateCloture: 'En cours (Comptage initial)',
      responsableInventaire: responsable,
      superviseurPharma: superviseur,
      auditeurDaf: auditeur,
      nbArticlesComptes: 35,
      stockTheoriqueTotal: 250000,
      stockPhysiqueCompte: 250000,
      ecartQuantite: 0,
      valeurEcartXaf: 0,
      tauxConformiteStock: 100.0,
      statut: 'EN_COURS',
      statutLabel: 'Comptage physique en cours',
      statutColor: 'bg-blue-100 text-blue-800 border-blue-300',
      justificationEcart: 'Campagne d\'inventaire initialisée. Équipe de comptage déployée sur les allées.',
      lignesEcart: []
    };

    setTimeout(() => {
      onSaveCampaign(newCampaign);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <ClipboardCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Lancer une Campagne d'Inventaire Tournant</h2>
              <p className="text-xs text-emerald-100">Hub National d'Owendo • Rapprochement Physique vs WMS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Zone Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Zone de Stockage à Inventorier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STORAGE_ZONES.map(z => (
                <label
                  key={z.id}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex flex-col justify-between transition-all ${
                    zoneId === z.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="zoneTarget"
                      value={z.id}
                      checked={zoneId === z.id}
                      onChange={() => handleZoneChange(z.id)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold">{z.nom}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-200/60 mt-1">
                    <span>Temp: {z.temperatureConsigne}</span>
                    <span>{z.palettesOccupees}/{z.capacitePalettes} pal.</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Intitulé de la Campagne d'Inventaire
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Tripartite Commission Members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Chef d'Équipe Magasinier
              </label>
              <input
                type="text"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Superviseur Pharmacien
              </label>
              <input
                type="text"
                value={superviseur}
                onChange={(e) => setSuperviseur(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Auditeur DAF / Financier
              </label>
              <input
                type="text"
                value={auditeur}
                onChange={(e) => setAuditeur(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
            <span className="font-bold">Protocole Réglementaire :</span> L'ouverture de l'inventaire bloque temporairement les sorties de palettes sur les allées sélectionnées afin d'assurer l'étanchéité du comptage physique et la sincérité des écarts constatés.
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Ouverture en cours...' : 'Ouvrir la Campagne d\'Inventaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
