import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Building2, Pill, Upload, CheckCircle2, User, Phone, MapPin, Coins } from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { CITIZEN_REPORT_MOTIFS, ESSENTIAL_MEDICINES_CATALOG, PUBLIC_HEALTH_FACILITIES_DIRECTORY } from '../../data/publicCitizenData';
import { formatXAF } from '../../utils/formatters';

export default function NewCitizenSignalementModal({
  isOpen,
  onClose,
  onSubmitReport
}) {
  if (!isOpen) return null;

  const [province, setProvince] = useState('Estuaire');
  const [structure, setStructure] = useState('Centre Hospitalier Universitaire de Libreville (CHUL)');
  const [medicamentId, setMedicamentId] = useState('MED-001');
  const [motifId, setMotifId] = useState('SURTARIFICATION');
  const [prixFactureXAF, setPrixFactureXAF] = useState(3500);
  const [declarantNom, setDeclarantNom] = useState('');
  const [declarantTel, setDeclarantTel] = useState('');
  const [anonyme, setAnonyme] = useState(false);
  const [description, setDescription] = useState('');
  const [preuveNom, setPreuveNom] = useState('Ticket_caisse_recu.jpg');

  const selectedMed = ESSENTIAL_MEDICINES_CATALOG.find(m => m.id === medicamentId) || ESSENTIAL_MEDICINES_CATALOG[0];
  const selectedMotif = CITIZEN_REPORT_MOTIFS.find(m => m.id === motifId) || CITIZEN_REPORT_MOTIFS[0];
  const filteredFacilities = PUBLIC_HEALTH_FACILITIES_DIRECTORY.filter(f => f.province === province);

  const surcout = Math.max(0, prixFactureXAF - (selectedMed?.prixPlafondXAF || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `SIG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport = {
      id: newId,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      province,
      ville: filteredFacilities[0]?.ville || 'Libreville',
      structure,
      medicament: selectedMed.dci,
      motifId,
      motifLabel: selectedMotif.label,
      prixFactureXAF: motifId === 'SURTARIFICATION' ? Number(prixFactureXAF) : selectedMed.prixPlafondXAF,
      prixPlafondXAF: selectedMed.prixPlafondXAF,
      surcoutXAF: motifId === 'SURTARIFICATION' ? surcout : 0,
      declarantNom: anonyme ? 'Citoyen Anonyme' : (declarantNom || 'Citoyen Usager'),
      declarantTel: anonyme ? '+241 ** ** **' : (declarantTel || '+241 77 00 00 00'),
      anonyme,
      statut: 'ENQUETE_EN_COURS',
      statutLabel: 'Enregistré & Transmis à l\'Inspection OPN',
      statutColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: description || 'Signalement transmis par l\'usager concernant un manquement constaté dans la structure de dispensation.',
      preuveFournie: preuveNom,
      decisionInspection: 'Dossier transmis au Pôle Enquêtes & Répression des Fraudes de l\'OPN. Vérification des stocks et convocation du gestionnaire.',
      reponduPar: 'Direction de l\'Inspection Pharmaceutique OPN'
    };

    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-300 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Déposer un Signalement Citoyen</h3>
              <p className="text-xs text-rose-200">Guichet Officiel de Protection des Usagers — OPN Gabon</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-950 text-rose-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Bandeau d'information */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p>
              Votre signalement est transmis directement à l'<strong>Inspection Pharmaceutique de l'OPN</strong>. 
              Vous bénéficiez de la protection légale de confidentialité et pouvez choisir l'anonymat total.
            </p>
          </div>

          {/* Localisation & Structure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Province Concernée *</label>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  const firstInProv = PUBLIC_HEALTH_FACILITIES_DIRECTORY.find(f => f.province === e.target.value);
                  if (firstInProv) setStructure(firstInProv.nom);
                }}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {GABON_PROVINCES.map(p => (
                  <option key={p.id} value={p.name}>{p.name} ({p.capital})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Établissement / Structure de Santé *</label>
              <select
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {filteredFacilities.map(f => (
                  <option key={f.id} value={f.nom}>{f.nom} ({f.ville})</option>
                ))}
                <option value="Autre Dispensaire / Pharmacie d'Officine">Autre Dispensaire / Pharmacie Privée</option>
              </select>
            </div>
          </div>

          {/* Motif du Signalement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Motif du Signalement / Infraction *</label>
            <select
              value={motifId}
              onChange={(e) => setMotifId(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {CITIZEN_REPORT_MOTIFS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1 italic">{selectedMotif.desc}</p>
          </div>

          {/* Médicament Concerné */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Médicament Cible (DCI) *</label>
              <select
                value={medicamentId}
                onChange={(e) => setMedicamentId(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {ESSENTIAL_MEDICINES_CATALOG.map(m => (
                  <option key={m.id} value={m.id}>{m.dci} — {m.dosage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prix Public Plafonné (Légal OPN)</label>
              <div className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-xs font-mono font-bold text-emerald-700">
                {formatXAF(selectedMed?.prixPlafondXAF || 0)}
              </div>
            </div>
          </div>

          {/* Si surtarification : comparaison de prix */}
          {motifId === 'SURTARIFICATION' && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-amber-900">Montant Réclamé par la Structure (FCFA) *</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={prixFactureXAF}
                  onChange={(e) => setPrixFactureXAF(e.target.value)}
                  className="flex-1 text-sm font-mono font-bold px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="text-right">
                  <span className="text-[10px] text-amber-800 font-medium block">Surcoût Illégal :</span>
                  <span className="text-xs font-mono font-black text-rose-700">+{formatXAF(surcout)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Description Circonstanciée */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description des Faits & Circonstances *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez la date, l'heure, l'attitude du guichetier, le refus de reçu, ou toute information utile pour l'enquête..."
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Preuve / Justificatif */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Justificatif / Preuve (Ticket, Ordonnance, Reçu)</label>
            <div className="border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-xl p-3 text-center cursor-pointer transition-colors bg-slate-50 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600 font-medium">{preuveNom} (Cliquer pour changer)</span>
            </div>
          </div>

          {/* Identité du déclarant & Option Anonymat */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-600" /> Informations Déclarant
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonyme}
                  onChange={(e) => setAnonyme(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-rose-700">Déposer sous anonymat protégé</span>
              </label>
            </div>

            {!anonyme ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nom & Prénom (Optionnel)"
                  value={declarantNom}
                  onChange={(e) => setDeclarantNom(e.target.value)}
                  className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800"
                />
                <input
                  type="tel"
                  placeholder="N° Téléphone pour suivi SMS (+241...)"
                  value={declarantTel}
                  onChange={(e) => setDeclarantTel(e.target.value)}
                  className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-slate-800"
                />
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                Votre identité ne sera jamais communiquée ni à la structure ni aux tiers. Vous pourrez suivre l'avancement avec votre identifiant unique de dossier.
              </p>
            )}
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
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Transmettre le Signalement Officiel</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
