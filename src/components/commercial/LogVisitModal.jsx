import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

export const VISIT_RESULTS = [
  { id: 'INTERESSE', label: 'Très Intéressé (Devis à préparer)', color: 'text-slate-700 bg-slate-50 border-slate-200' },
  { id: 'DEVIS_DEMANDE', label: 'Devis Demandé Immédiatement', color: 'text-slate-700 bg-slate-50 border-slate-200' },
  { id: 'A_RELANCER', label: 'À Relancer (Décideur absent / En réflexion)', color: 'text-slate-700 bg-slate-50 border-slate-200' },
  { id: 'COMMANDE_PASSEE', label: 'Bon de Commande Signé !', color: 'text-slate-800 bg-slate-100 border-slate-300' },
  { id: 'PAS_INTERESSE', label: 'Pas Intéressé / Fournisseur Exclusif Existant', color: 'text-slate-500 bg-slate-50 border-slate-200' }
];

export default function LogVisitModal({ isOpen, onClose, prospect, onSaveVisit }) {
  if (!isOpen || !prospect) return null;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [commercial, setCommercial] = useState('M. Paul MEBIAME (Commercial Terrain)');
  const [resultat, setResultat] = useState('INTERESSE');
  const [commentaire, setCommentaire] = useState('');
  const [prochaineAction, setProchaineAction] = useState('');
  const [dateProchaineRelance, setDateProchaineRelance] = useState('');
  const [nouveauStatutProspect, setNouveauStatutProspect] = useState(prospect.statut);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentaire.trim()) return;

    const newVisit = {
      id: `VIS-${Date.now()}`,
      date,
      commercial,
      resultat,
      commentaire,
      prochaineAction: prochaineAction || 'Suivi commercial standard',
      dateProchaineRelance
    };

    onSaveVisit(prospect.id, newVisit, nouveauStatutProspect);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-slate-200">
              Fiche {prospect.code}
            </span>
            <h3 className="font-bold text-base text-slate-900">{prospect.nomStructure}</h3>
            <p className="text-xs text-slate-500">{prospect.localite} ({prospect.province})</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date de la Visite *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Commercial Auteur *
              </label>
              <input
                type="text"
                value={commercial}
                onChange={(e) => setCommercial(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
              />
            </div>
          </div>

          {/* Résultat de la visite */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Résultat / Issue de la Visite *
            </label>
            <div className="space-y-1.5">
              {VISIT_RESULTS.map((res) => (
                <label 
                  key={res.id} 
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    resultat === res.id 
                      ? `${res.color} font-bold ring-2 ring-[#003366]/20 shadow-sm` 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="resultatVisite"
                    value={res.id}
                    checked={resultat === res.id}
                    onChange={() => {
                      setResultat(res.id);
                      if (res.id === 'DEVIS_DEMANDE') setNouveauStatutProspect('DEVIS_ENVOYE');
                      else if (res.id === 'COMMANDE_PASSEE') setNouveauStatutProspect('CONVERTI');
                      else if (res.id === 'PAS_INTERESSE') setNouveauStatutProspect('PERDU');
                      else setNouveauStatutProspect('CONTACTE');
                    }}
                    className="text-[#003366] focus:ring-0"
                  />
                  <span>{res.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Commentaire de l'échange */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Compte-Rendu &amp; Besoins Exprimés *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Ex: Le médecin-chef souhaite une offre sur les antipaludiques et solutés. Prêt à commander si livraison en 48h..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
            />
          </div>

          {/* Prochaine Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prochaine Action Attendue
              </label>
              <input
                type="text"
                placeholder="ex: Transmettre Devis chiffré"
                value={prochaineAction}
                onChange={(e) => setProchaineAction(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date de Relance Prévue
              </label>
              <input
                type="date"
                value={dateProchaineRelance}
                onChange={(e) => setDateProchaineRelance(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
              />
            </div>
          </div>

          {/* Nouveau Statut Prospect */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Statut Prospect après cette visite :</span>
            <select
              value={nouveauStatutProspect}
              onChange={(e) => setNouveauStatutProspect(e.target.value)}
              className="text-xs font-bold px-2 py-1 bg-white border border-slate-300 rounded-md focus:outline-none text-[#003366]"
            >
              <option value="IDENTIFIE">IDENTIFIÉ</option>
              <option value="CONTACTE">CONTACTÉ</option>
              <option value="DEVIS_ENVOYE">DEVIS ENVOYÉ</option>
              <option value="CONVERTI">CONVERTI EN CLIENT</option>
              <option value="PERDU">PERDU / SANS SUITE</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
              Enregistrer le Rapport de Visite
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
