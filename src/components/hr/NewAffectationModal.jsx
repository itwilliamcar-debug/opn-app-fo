import React, { useState } from 'react';
import { X, UserCheck, MapPin, Building2, Calendar, Coins, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { EMPLOYEES_DIRECTORY } from '../../data/humanResourcesData';
import { formatXAF } from '../../utils/formatters';

export default function NewAffectationModal({
  isOpen,
  onClose,
  onSubmitAffectation
}) {
  if (!isOpen) return null;

  const [employeeId, setEmployeeId] = useState('EMP-004');
  const [provinceDestination, setProvinceDestination] = useState('Haut-Ogooué');
  const [siteDestination, setSiteDestination] = useState('Antenne Provinciale OPN Franceville');
  const [nouveauPoste, setNouveauPoste] = useState('Responsable Logistique & Racks WMS Antenne');
  const [motif, setMotif] = useState('Renforcement technique du Hub Provincial et optimisation des stocks FEFO.');
  const [dateEffet, setDateEffet] = useState('01/10/2026');
  const [primeEloignementXAF, setPrimeEloignementXAF] = useState(180000);
  const [indemniteLogementXAF, setIndemniteLogementXAF] = useState(120000);
  const [logementFonction, setLogementFonction] = useState('Villa de fonction OPN Cité Franceville');

  const selectedEmployee = EMPLOYEES_DIRECTORY.find(e => e.id === employeeId) || EMPLOYEES_DIRECTORY[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `DEC-AFF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAff = {
      id: newId,
      dateDecision: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dateEffet,
      matricule: selectedEmployee.matricule,
      employeNom: `${selectedEmployee.titre} ${selectedEmployee.prenom} ${selectedEmployee.nom}`,
      ancienPoste: `${selectedEmployee.poste} (${selectedEmployee.province})`,
      nouveauPoste,
      provinceDestination,
      siteDestination,
      motif,
      categorieIndiciaire: selectedEmployee.categorie,
      primeEloignementXAF: Number(primeEloignementXAF),
      indemniteLogementXAF: Number(indemniteLogementXAF),
      logementFonction,
      signataire: 'Pr. Edgard NGOUNDOU (Directeur Général)',
      statut: 'NOTIFIEE_SIGNEE',
      statutLabel: 'Décision Validée & Notifiée'
    };

    onSubmitAffectation(newAff);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Nouvelle Décision d'Affectation Provinciale</h3>
              <p className="text-xs text-emerald-300">Mobilité Géographique & Renforcement Territorial OPN</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Sélection Collaborateur */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Collaborateur Concerné *</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2.5 bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {EMPLOYEES_DIRECTORY.map(e => (
                <option key={e.id} value={e.id}>
                  {e.matricule} — {e.titre} {e.prenom} {e.nom} ({e.poste} - {e.province})
                </option>
              ))}
            </select>
          </div>

          {/* Destination & Nouveau Poste */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Province de Destination *</label>
              <select
                value={provinceDestination}
                onChange={(e) => {
                  setProvinceDestination(e.target.value);
                  setSiteDestination(`Antenne Provinciale OPN ${e.target.value}`);
                }}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {GABON_PROVINCES.map(p => (
                  <option key={p.id} value={p.name}>{p.name} ({p.capital})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site / Structure de Rattachage *</label>
              <input
                type="text"
                required
                value={siteDestination}
                onChange={(e) => setSiteDestination(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          {/* Fonction & Date de Prise d'Effet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nouvelle Fonction / Titre de Poste *</label>
              <input
                type="text"
                required
                value={nouveauPoste}
                onChange={(e) => setNouveauPoste(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date de Prise de Fonction *</label>
              <input
                type="text"
                required
                value={dateEffet}
                onChange={(e) => setDateEffet(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Motif de l'Affectation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Motif Institutionnel & Justification Métier *</label>
            <textarea
              rows={2}
              required
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
            />
          </div>

          {/* Primes d'Éloignement & Logement */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <h5 className="text-xs font-bold uppercase text-emerald-900 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-700" /> Avantages Financiers & Logement de Fonction
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Prime d'Éloignement Mensuelle (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={primeEloignementXAF}
                  onChange={(e) => setPrimeEloignementXAF(e.target.value)}
                  className="w-full text-xs font-mono font-bold rounded-lg border border-emerald-300 px-3 py-1.5 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Indemnité de Logement Mensuelle (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={indemniteLogementXAF}
                  onChange={(e) => setIndemniteLogementXAF(e.target.value)}
                  className="w-full text-xs font-mono font-bold rounded-lg border border-emerald-300 px-3 py-1.5 bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Désignation du Logement de Fonction</label>
              <input
                type="text"
                value={logementFonction}
                onChange={(e) => setLogementFonction(e.target.value)}
                className="w-full text-xs rounded-lg border border-emerald-300 px-3 py-1.5 bg-white text-slate-800"
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
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Générer la Décision d'Affectation</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
