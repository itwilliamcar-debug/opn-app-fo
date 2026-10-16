import React, { useState } from 'react';
import { 
  X, 
  User, 
  Camera, 
  Lock, 
  ShieldAlert, 
  Phone, 
  CheckCircle2, 
  KeyRound,
  Eye,
  Plus,
  Pencil,
  BadgeCheck,
  Package,
  LifeBuoy,
  Library,
  Building2,
  Inbox,
  Pill,
  Receipt,
  MessageCircle,
  LayoutGrid,
} from 'lucide-react';
import { pagesAutorisees } from '../../data/rbacMatrix';

const ICONES_PAGE = {
  flux_appro: Package,
  centre_services: LifeBuoy,
  referentiel: Library,
  patrimoine: Building2,
  parametrage: KeyRound,
  workspace: Inbox,
  pharmacy: Pill,
  billing: Receipt,
  collaborative: MessageCircle,
};

const SENS_ACTION = {
  Consulter: 'Ouvrir la page et lire les informations de votre périmètre.',
  Créer: 'Déposer un nouvel élément sur cette page.',
  Modifier: 'Corriger ou retirer un élément déjà enregistré.',
  Valider: 'Approuver ou rejeter une étape du circuit.',
};

const ICONES_ACTION = {
  Consulter: Eye,
  Créer: Plus,
  Modifier: Pencil,
  Valider: BadgeCheck,
};

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
  const [pageChoisie, setPageChoisie] = useState(null);

  if (!isOpen || !activePersona) return null;

  const pages = pagesAutorisees(activePersona);
  const pageCourante = pages.find((page) => page.id === pageChoisie) || pages[0] || null;
  const IconePage = ICONES_PAGE[pageCourante?.id] || LayoutGrid;

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
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="space-y-5">

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
                <span className="text-slate-500 text-[11px] block">Email professionnel OPN :</span>
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
          </div>

          <section className="rounded-2xl overflow-hidden border border-[#0E2A4F]/10 shadow-sm lg:sticky lg:top-0">
            <div className="bg-[#0E2A4F] px-4 py-3 text-white flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">Passeport d'accès</p>
                <p className="text-sm font-semibold mt-0.5">Pages ouvertes et actions autorisées</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold tracking-wide bg-white/10 border border-white/15 rounded-full px-3 py-1">
                {pages.length} page{pages.length > 1 ? 's' : ''}
              </span>
            </div>

            {pages.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500">Aucune page n'est ouverte pour ce profil.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-h-[280px]">
                <div className="bg-[#F6F8FB] border-b sm:border-b-0 sm:border-r border-slate-200 p-2 space-y-1">
                  {pages.map((page) => {
                    const active = page.id === pageCourante.id;
                    const Icone = ICONES_PAGE[page.id] || LayoutGrid;
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => setPageChoisie(page.id)}
                        className={`w-full text-left rounded-xl px-2.5 py-2 flex items-center gap-2.5 transition-colors ${
                          active ? 'bg-white shadow-sm text-[#0E2A4F]' : 'text-slate-600 hover:bg-white/80'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-[#0E2A4F] text-white' : 'bg-white text-[#2E68B4] border border-slate-200'}`}>
                          <Icone className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-semibold leading-snug">{page.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-[#0E2A4F] text-white flex items-center justify-center shrink-0">
                      <IconePage className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{pageCourante.badge}</p>
                      <h4 className="text-base font-semibold text-[#0E2A4F] leading-tight">{pageCourante.label}</h4>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {pageCourante.actions.map((action) => {
                      const IconeAction = ICONES_ACTION[action] || CheckCircle2;
                      return (
                        <li key={action} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                          <span className="mt-0.5 w-7 h-7 rounded-full bg-white border border-emerald-100 text-[#00A651] flex items-center justify-center shrink-0">
                            <IconeAction className="w-3.5 h-3.5" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-slate-900">{action}</span>
                            <span className="block text-[11px] leading-relaxed text-slate-500">{SENS_ACTION[action]}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </section>
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
