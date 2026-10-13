import React, { useState } from 'react';
import { 
  X, 
  User, 
  Camera, 
  Lock, 
  ShieldAlert, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  HelpCircle,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  activePersona, 
  onUpdatePersona,
  onOpenHelpdesk 
}) {
  const [nom, setNom] = useState(activePersona?.nom || '');
  const [telephone, setTelephone] = useState(activePersona?.telephone || '+241 074 00 00 00');
  const [selectedAvatar, setSelectedAvatar] = useState(activePersona?.avatar || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !activePersona) return null;

  const defaultAvatars = [
    { url: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces&auto=format&q=80", label: "Cadre Homme" },
    { url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=faces&auto=format&q=80", label: "Directrice" },
    { url: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=faces&auto=format&q=80", label: "Pharmacien" },
    { url: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop&crop=faces&auto=format&q=80", label: "Médecin Femme" },
    { url: "https://images.unsplash.com/photo-1654155427842-a4a249bf693e?w=150&h=150&fit=crop&crop=faces&auto=format&q=80", label: "Logisticien" },
    { url: "https://images.unsplash.com/photo-1755705098259-172041d16a1a?w=150&h=150&fit=crop&crop=faces&auto=format&q=80", label: "Responsable Femme" },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdatePersona) {
      onUpdatePersona({
        ...activePersona,
        nom,
        telephone,
        avatar: selectedAvatar
      });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleCustomPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedAvatar(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-md bg-[#2E68B4] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Paramètres & Profil Utilisateur OPN
            </h3>
            <p className="text-xs text-slate-500">
              Mise à jour des coordonnées et photo de profil de l'agent.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
            <span>Profil mis à jour avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Section Photo de Profil */}
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Photo de Profil / Avatar
            </label>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={selectedAvatar || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=faces&auto=format&q=80"} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#2E68B4] shadow-sm"
                />
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1 rounded-full bg-[#00A651] text-white cursor-pointer hover:bg-[#008742] shadow-sm"
                  title="Téléverser une photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleCustomPhotoUpload}
                  />
                </label>
              </div>

              <div className="flex-1 space-y-1.5">
                <p className="text-xs font-semibold text-slate-800">Sélectionner un avatar officiel :</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {defaultAvatars.map((av, idx) => (
                    <img 
                      key={idx}
                      src={av.url}
                      alt={av.label}
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`w-8 h-8 rounded-full object-cover cursor-pointer border-2 transition-all ${
                        selectedAvatar === av.url ? 'border-[#00A651] scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Informations Modifiables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom & Prénom</label>
              <input 
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone Professionnel</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>
            </div>
          </div>

          {/* Informations non modifiables (lecture seule) */}
          <div className="p-4 bg-slate-100 rounded-md border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Paramètres d'Identité & Rôle (Verrouillés)
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                Sécurité SuperAdmin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Matricule / Identifiant Unique (ID) :</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block mt-0.5">
                  {activePersona.id}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Courriel Professionnel OPN :</span>
                <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block mt-0.5 truncate max-w-full">
                  {activePersona.email}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Affectation Territoriale :</span>
                <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block mt-0.5">
                  {activePersona.entite}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Rôle / Charge de Mission :</span>
                <span className="font-bold text-[#2E68B4] bg-white px-2.5 py-1 rounded border border-slate-200 inline-block mt-0.5">
                  {activePersona.role}
                </span>
              </div>
            </div>

            {/* Mot de Passe Verrouillé & Helpdesk Notice */}
            <div className="mt-3 p-3 bg-white rounded border border-amber-200/80 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Mot de passe de session</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Conformément aux protocoles ANINF et CNPDCP, <strong>l'ID et le mot de passe ne sont pas modifiables directement</strong> par l'utilisateur. Seul le SuperAdmin National ou le pôle IT Provincial est habilité à réinitialiser vos accès.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-slate-400">••••••••••••••••</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenHelpdesk) onOpenHelpdesk(activePersona);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Demander renouvellement au Helpdesk IT</span>
                </button>
              </div>
            </div>

          </div>

          {/* Boutons d'Action Modal */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer les modifications</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
