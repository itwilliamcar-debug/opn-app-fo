import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  KeyRound, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Headphones, 
  Building2,
  AlertTriangle,
  Lock,
  FileText
} from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { requestPasswordReset } from '../../services/api';

export default function HelpdeskModal({ 
  isOpen, 
  onClose, 
  activePersona, 
  onTicketSubmitted 
}) {
  const [motif, setMotif] = useState("Mot de passe oublié / Perte d'accès");
  const [details, setDetails] = useState('');
  const [telephoneContact, setTelephoneContact] = useState(activePersona?.telephone || '+241 074 00 00 00');
  const [ticketSent, setTicketSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultTicket, setResultTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (activePersona?.telephone) {
      setTelephoneContact(activePersona.telephone);
    }
  }, [activePersona]);

  if (!isOpen) return null;

  // Article 43 : Détermination automatique et verrouillée du pôle IT compétent
  const userProvId = activePersona?.provinceId || 'G1';
  const currentProv = GABON_PROVINCES.find(p => p.id === userProvId) || GABON_PROVINCES[0];

  const itDestinationLabel = userProvId === 'G1' 
    ? 'Pôle IT Siège Libreville & Hub Owendo (G1 Estuaire)' 
    : `Pôle IT ${currentProv.chefLieu} (${currentProv.nom} - ${currentProv.id})`;

  const itDestinationCode = `IT_${currentProv.chefLieu.toUpperCase().replace(/[^A-Z]/g, '_')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      email: activePersona?.email || 'agent@opn.ga',
      motif: motif,
      telephone_contact: telephoneContact,
      details: details,
      it_destination_code: itDestinationCode,
    };

    try {
      const res = await requestPasswordReset(payload);
      if (!res?.success || !res?.ticket) {
        setErrorMessage(res?.message || 'Le ticket Helpdesk n\'a pas ete cree cote API.');
        return;
      }
      setResultTicket(res.ticket);
      if (onTicketSubmitted) {
        onTicketSubmitted(res.ticket);
      }
      setTicketSent(true);
    } catch (err) {
      setErrorMessage(err?.message || 'API Helpdesk injoignable — aucun ticket invente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTicketSent(false);
    setResultTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Helpdesk IT — OPN
            </h3>
            <p className="text-xs text-slate-500">
              Canal officiel sécurisé de support technique pour les 9 Antennes Provinciales et le Siège.
            </p>
          </div>
        </div>

        {errorMessage && !ticketSent && (
          <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {ticketSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#00A651] flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Demande Transmise à l'Équipe IT</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Votre ticket N° <strong className="font-mono text-[#2E68B4]">{resultTicket?.id}</strong> a été verrouillé et transmis au <strong className="text-slate-900">{resultTicket?.it_destination_label}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs text-left space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Demandeur :</span>
                <span className="font-bold text-slate-900">{activePersona?.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Matricule :</span>
                <span className="font-mono font-bold text-slate-900">{activePersona?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Rappel :</span>
                <span className="font-bold text-[#00A651]">{telephoneContact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pôle IT Rattaché :</span>
                <span className="font-bold text-[#2E68B4]">{currentProv.chefLieu}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Délai de traitement :</span>
                <span className="font-bold text-amber-700">&lt; 15 minutes</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800 font-medium">
              Sécurité ANINF : Destination IT certifiée conforme selon votre rattachement provincial.
            </div>

            <button
              onClick={handleResetForm}
              className="px-6 py-2.5 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-md shadow-sm transition-all"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2E68B4]">
                <KeyRound className="w-3.5 h-3.5" />
                Procédure de Renouvellement de Mot de Passe (Article 43)
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Votre pôle IT de rattachement est déterminé automatiquement selon votre affectation organisationnelle et ne peut pas être modifié.
              </p>
            </div>

            {/* Identité de l'agent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-md border border-slate-200">
              <div>
                <span className="text-slate-500 text-[11px] block">Agent Demandeur :</span>
                <span className="font-bold text-slate-900 block truncate">{activePersona?.nom}</span>
                <span className="font-mono text-[10px] text-slate-500">{activePersona?.id}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Zone Provinciale :</span>
                <span className="font-bold text-[#2E68B4] block">
                  {currentProv.id} – {currentProv.nom} ({currentProv.chefLieu})
                </span>
              </div>
            </div>

            {/* Article 43 : Champ ZONE IT DESTINATAIRE verrouillé, grisé, prérempli et non modifiable */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Zone IT Destinataire (Imposée selon profil)</label>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  <Lock className="w-2.5 h-2.5" />
                  Verrouillé
                </span>
              </div>
              <input
                type="text"
                readOnly
                disabled
                value={itDestinationLabel}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 cursor-not-allowed select-none shadow-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                * Conforme à l'Article 43 : Le routage IT est scellé côté serveur selon votre province d'affectation.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Motif de la demande</label>
              <select
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
              >
                <option value="Mot de passe oublié / Perte d'accès">Mot de passe oublié / Perte d'accès</option>
                <option value="Renouvellement périodique de sécurité (90 jours)">Renouvellement périodique de sécurité (90 jours)</option>
                <option value="Suspicion de compromission de compte">Suspicion de compromission de compte (Priorité Haute)</option>
                <option value="Prise de poste / Nouvelle affectation provinciale">Prise de poste / Nouvelle affectation provinciale</option>
                <option value="Autre demande de support technique">Autre demande de support technique</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Numéro de téléphone direct pour réception du code temporaire</label>
              <input 
                type="text"
                value={telephoneContact}
                onChange={(e) => setTelephoneContact(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                placeholder="+241 074 XX XX XX"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Précisions supplémentaires (facultatif)</label>
              <textarea 
                rows="3"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                placeholder="Ex: Merci de m'envoyer le code temporaire par SMS car mon terminal a été réinitialisé..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Transmission sécurisée...' : 'Envoyer la demande Helpdesk'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
