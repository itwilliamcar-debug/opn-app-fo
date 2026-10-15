import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldAlert, 
  Lock, 
  LayoutDashboard, 
  ChevronDown,
  Facebook,
  Linkedin,
  User,
  Settings,
  Headphones,
  LogOut,
  Users,
  Search,
  Command,
  PlayCircle,
  FileText,
  PanelLeftOpen,
  Menu,
} from 'lucide-react';
import { PROFILS_DEFAUT } from '../../data/usersPersonas';
import { getCodeRole } from '../../data/rbacMatrix';
import OpnLogo from './OpnLogo';

export default function Header({ 
  currentView, 
  setCurrentView, 
  currentUser,
  onTriggerEmergency,
  onOpenAuth,
  onOpenProfile,
  onOpenHelpdesk,
  onOpenColleagues,
  onOpenSpotlight,
  onOpenDemoTour,
  onOpenPlaquette,
  onLogout,
  onDirectDemoLogin,
  demoConnectingId = null,
  emergencyCount = 1,
  activeNavTab = 'accueil',
  setActiveNavTab,
  chrome = 'full',
  sidebarHidden = false,
  onShowSidebar,
}) {
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [accessMenuOpen, setAccessMenuOpen] = useState(false);
  const demoMenuRef = useRef(null);
  const accountMenuRef = useRef(null);
  const accountPanelRef = useRef(null);
  const accessMenuRef = useRef(null);
  const [accountMenuPos, setAccountMenuPos] = useState(null);

  useEffect(() => {
    if (!demoMenuOpen && !accountMenuOpen && !accessMenuOpen) return undefined;
    const onDoc = (e) => {
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target)) {
        setDemoMenuOpen(false);
      }
      const inAccountButton = accountMenuRef.current && accountMenuRef.current.contains(e.target);
      const inAccountPanel = accountPanelRef.current && accountPanelRef.current.contains(e.target);
      if (!inAccountButton && !inAccountPanel) {
        setAccountMenuOpen(false);
      }
      if (accessMenuRef.current && !accessMenuRef.current.contains(e.target)) {
        setAccessMenuOpen(false);
        setDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [demoMenuOpen, accountMenuOpen, accessMenuOpen]);

  useLayoutEffect(() => {
    if (!accountMenuOpen) {
      setAccountMenuPos(null);
      return undefined;
    }
    const place = () => {
      const button = accountMenuRef.current?.querySelector('button');
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const width = 224;
      const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
      setAccountMenuPos({ top: rect.bottom + 8, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [accountMenuOpen]);

  const navLinks = [
    { id: 'accueil', label: 'ACCUEIL' },
    { id: 'produits', label: 'PRODUITS (DCI)' },
    { id: 'antennes', label: 'NOS ANTENNES' },
    { id: 'actualites', label: 'ACTUALITÉS' },
    { id: 'marches', label: 'MARCHÉS PUBLICS' },
    { id: 'apropos', label: 'À PROPOS' },
    { id: 'contact', label: 'CONTACTEZ-NOUS' }
  ];

  const handleNavClick = (tabId) => {
    if (setActiveNavTab) setActiveNavTab(tabId);
    if (currentView !== 'public') {
      setCurrentView('public');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeUser = currentUser || null;
  const showBanner = chrome !== 'actions' && !activeUser;
  const showToolbar = chrome !== 'banner';
  const showLogo = chrome === 'full';

  const closeAccessMenu = () => {
    setAccessMenuOpen(false);
    setDemoMenuOpen(false);
  };

  const openDemoPersona = (persona) => {
    setDemoMenuOpen(false);
    setAccessMenuOpen(false);
    if (onDirectDemoLogin) onDirectDemoLogin(persona);
    else onOpenAuth?.();
  };

  const renderAccessMenu = () => (
    <div className="relative shrink-0" ref={accessMenuRef}>
      <button
        type="button"
        onClick={() => setAccessMenuOpen((open) => !open)}
        className="h-9 flex items-center gap-1.5 px-3 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
        aria-expanded={accessMenuOpen}
        aria-haspopup="menu"
      >
        <Menu className="w-3.5 h-3.5 text-slate-500" />
        <span>Menu</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${accessMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {accessMenuOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 z-50" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => { closeAccessMenu(); onOpenSpotlight?.(); }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1">Recherche...</span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9.5px] font-mono font-medium text-slate-500">
              Ctrl K
            </kbd>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => { closeAccessMenu(); onOpenDemoTour?.(); }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Visite Guidée</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => { closeAccessMenu(); onOpenAuth?.(); }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs font-semibold text-white bg-[#00A651] hover:bg-[#008742]"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Connexion</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => { closeAccessMenu(); onOpenAuth?.(); }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs font-semibold text-[#2E68B4] hover:bg-blue-50"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Espace Métier (ERP)</span>
          </button>
          <div className="mt-1 pt-1 border-t border-slate-100" ref={demoMenuRef}>
            <button
              type="button"
              onClick={() => setDemoMenuOpen((open) => !open)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="flex-1">Profils Démo</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${demoMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {demoMenuOpen && (
              <div className="px-1 pb-1">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sélectionner un profil de démonstration :
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {PROFILS_DEFAUT.map((p) => {
                    const isConnecting = demoConnectingId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => openDemoPersona(p)}
                        className={`w-full flex items-start gap-2 p-1.5 rounded-md text-left transition-all text-xs text-slate-700 group/item ${
                          isConnecting
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'hover:bg-blue-50 border border-transparent'
                        }`}
                      >
                        <img
                          src={p.avatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`font-bold truncate text-[11px] ${isConnecting ? 'text-emerald-800' : 'text-slate-900 group-hover/item:text-[#2E68B4]'}`}>
                            {isConnecting ? `Connexion — ${p.nom}` : p.nom}
                          </p>
                          <p className="text-[10px] text-[#00A651] truncate">{p.role}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderUrgences = () => (
    <button
      type="button"
      onClick={onTriggerEmergency}
      className="h-9 flex items-center gap-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
      title="Centre Opérationnel des Urgences Sanitaires"
    >
      <ShieldAlert className="w-3.5 h-3.5" />
      <span>Urgences</span>
      {emergencyCount > 0 && (
        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono font-bold text-[10.5px]">
          {emergencyCount}
        </span>
      )}
    </button>
  );

  return (
    <header className={`relative z-[60] shrink-0 bg-white border-b border-slate-200 ${chrome === 'full' ? 'sticky top-0 shadow-sm' : ''}`}>
      {showBanner && <div className="gabon-flag-strip" />}

      {showBanner && (
      <div className="bg-[#F4F5F7] border-b border-slate-200 py-1 px-4 sm:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-700">
            <span className="flex items-center gap-1.5 font-bold text-[#2E68B4]">
              <span className="w-2 h-2 rounded-full bg-[#00A651]" />
              RÉPUBLIQUE GABONAISE
            </span>
            <span className="text-slate-300">|</span>
            <span>Ministère de la Santé • Centrale Nationale d&apos;Achat</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline font-bold text-[#00A651]">Hub Central Owendo</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-bold text-[#2E68B4] text-[11px]">
              Devise : FCFA (XAF)
            </span>
            <div className="flex items-center gap-2 text-slate-500">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-slate-200 hover:bg-[#2E68B4] hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-slate-200 hover:bg-[#2E68B4] hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      )}

      {showToolbar && (
      <div className={chrome === 'actions' ? 'h-16 px-3 sm:px-4 flex items-center' : 'max-w-7xl mx-auto px-4 sm:px-8'}>
        <div className={`flex items-center ${chrome === 'actions' ? 'w-full gap-2' : 'gap-4 sm:gap-6 min-h-[4.25rem]'}`}>
          {showLogo && (
          <div onClick={() => handleNavClick('accueil')} className="cursor-pointer shrink-0 py-2">
            <OpnLogo className="h-11 sm:h-12" />
          </div>
          )}
          {chrome === 'full' && currentView === 'public' && (
            <nav className="flex-1 min-w-0 self-stretch flex items-center gap-4 sm:gap-5 overflow-x-auto text-xs font-bold">
              {navLinks.map((tab) => {
                const isActive = (activeNavTab || 'accueil') === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavClick(tab.id)}
                    className={`h-full flex items-center whitespace-nowrap transition-all border-b-2 font-semibold tracking-wide ${
                      isActive
                        ? 'border-[#00A651] text-[#2E68B4] font-bold'
                        : 'border-transparent text-slate-700 hover:text-[#2E68B4] hover:border-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}
          {chrome === 'actions' && sidebarHidden && (
            <button
              type="button"
              onClick={onShowSidebar}
              className="h-10 flex items-center gap-2 px-2 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors shrink-0"
              title="Afficher la barre latérale"
            >
              <OpnLogo variant="symbol" className="h-8 w-8" />
              <PanelLeftOpen className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Afficher le menu</span>
            </button>
          )}

          <div className={`flex items-center gap-2 py-0.5 shrink-0 ${chrome === 'actions' || chrome === 'full' ? 'ml-auto overflow-visible' : 'overflow-x-auto'}`}>
            {chrome === 'actions' && activeUser ? (
              <>
              {renderAccessMenu()}
              {renderUrgences()}
              <div className="relative shrink-0" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="h-9 flex items-center gap-2 px-2.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 cursor-pointer transition-colors"
                >
                  <img
                    src={activeUser.avatar || 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces&auto=format&q=80'}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[220px] truncate">
                    {activeUser.nom || activeUser.name || 'Utilisateur'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountMenuOpen && accountMenuPos && createPortal(
                  <div
                    ref={accountPanelRef}
                    className="fixed z-[80] w-56 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5"
                    style={{ top: accountMenuPos.top, left: accountMenuPos.left }}
                  >
                    <button type="button" onClick={() => { setAccountMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs font-medium text-slate-700 hover:bg-slate-100">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Mon profil
                    </button>
                    <button type="button" onClick={() => { setAccountMenuOpen(false); onOpenHelpdesk?.(activeUser); }} className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs font-medium text-slate-700 hover:bg-slate-100">
                      <Headphones className="w-3.5 h-3.5 text-slate-500" />
                      Aide
                    </button>
                    <button type="button" onClick={() => { setAccountMenuOpen(false); onOpenProfile?.(); }} className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs font-medium text-slate-700 hover:bg-slate-100">
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      Paramètres
                    </button>
                    <button type="button" onClick={() => { setAccountMenuOpen(false); onLogout?.(); }} className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs font-medium text-rose-700 hover:bg-rose-50 border-t border-slate-100 mt-1">
                      <LogOut className="w-3.5 h-3.5" />
                      Déconnexion
                    </button>
                  </div>,
                  document.body
                )}
              </div>
              </>
            ) : chrome === 'full' && !activeUser ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="h-9 flex items-center gap-1.5 px-3.5 rounded-lg bg-[#00A651] hover:bg-[#008742] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Connexion</span>
              </button>
            ) : (
            <>
            {/* Recherche universelle Spotlight */}
            <button
              type="button"
              onClick={onOpenSpotlight}
              className="h-9 flex items-center gap-2 px-3 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shadow-2xs group shrink-0"
              title="Recherche universelle dans tout le système (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2E68B4] transition-colors" />
              <span className="hidden md:inline text-slate-600">Recherche...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-white border border-slate-300/80 rounded text-[9.5px] font-mono font-medium text-slate-500 shadow-2xs">
                Ctrl K
              </kbd>
            </button>

            {/* Visite Guidée (Neutre & Épuré) */}
            <button
              type="button"
              onClick={onOpenDemoTour}
              className="h-9 flex items-center gap-1.5 px-3 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shadow-2xs shrink-0"
              title="Lancer une visite guidée automatique du logiciel"
            >
              <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Visite Guidée</span>
            </button>

            {!activeUser ? (
              <>
                {/* Connexion */}
                <button
                  onClick={onOpenAuth}
                  className="h-9 flex items-center gap-1.5 px-3.5 rounded-lg bg-[#00A651] hover:bg-[#008742] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </button>

                {/* Espace Métier (ERP) */}
                <button
                  onClick={() => onOpenAuth?.()}
                  className="hidden sm:flex h-9 items-center gap-1.5 px-3.5 rounded-lg bg-white hover:bg-slate-50 text-[#2E68B4] border border-[#2E68B4]/40 hover:border-[#2E68B4] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-2xs shrink-0"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#2E68B4]" />
                  <span>Espace Métier (ERP)</span>
                </button>

                {/* Profils Démo Dropdown */}
                <div className="relative shrink-0" ref={demoMenuRef}>
                  <button
                    type="button"
                    onClick={() => setDemoMenuOpen((o) => !o)}
                    className="h-9 flex items-center gap-1.5 px-3 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Profils Démo</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${demoMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-50 animate-in fade-in duration-150 ${
                      demoMenuOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Sélectionner un profil de démonstration :
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {PROFILS_DEFAUT.map((p) => {
                        const isConnecting = demoConnectingId === p.id;
                        return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setDemoMenuOpen(false);
                            if (onDirectDemoLogin) onDirectDemoLogin(p);
                            else onOpenAuth?.();
                          }}
                          className={`w-full flex items-start gap-2 p-1.5 rounded-md text-left transition-all text-xs text-slate-700 group/item ${
                            isConnecting
                              ? 'bg-emerald-50 border border-emerald-200'
                              : 'hover:bg-blue-50 border border-transparent'
                          }`}
                        >
                          <img
                            src={p.avatar}
                            alt={p.nom}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <p className={`font-bold truncate text-[11px] ${isConnecting ? 'text-emerald-800' : 'text-slate-900 group-hover/item:text-[#2E68B4]'}`}>
                              {isConnecting ? `Connexion — ${p.nom}` : p.nom}
                            </p>
                            <p className="text-[10px] text-[#00A651] truncate">{p.role}</p>
                          </div>
                        </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Switch Vue Métier / Portail */}
                <button
                  onClick={() => {
                    if (currentView === 'public') {
                      const role = getCodeRole(currentUser);
                      setCurrentView(role === 'SUPER_ADMIN' ? 'admin' : 'flux_appro');
                    } else {
                      setCurrentView('public');
                    }
                  }}
                  className={`h-9 flex items-center gap-1.5 px-3.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentView !== 'public'
                      ? 'bg-[#2E68B4] hover:bg-[#245494] text-white'
                      : 'bg-white hover:bg-slate-50 text-[#2E68B4] border border-[#2E68B4]/40 hover:border-[#2E68B4]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{currentView === 'public' ? 'Mon Espace Métier' : 'Portail Public'}</span>
                </button>

                {/* Collègues en ligne */}
                <button
                  type="button"
                  onClick={onOpenColleagues}
                  className="h-9 flex items-center gap-1.5 px-2.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shadow-2xs shrink-0"
                  title="Collègues en ligne dans votre province"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden lg:inline">En ligne</span>
                </button>

                {/* Déconnexion rapide */}
                <button
                  onClick={onLogout}
                  className="h-9 flex items-center gap-1.5 px-2.5 rounded-lg bg-slate-100/80 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-semibold text-slate-600 hover:text-rose-700 transition-colors shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
                  title="Se déconnecter de la session"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                  <span className="hidden lg:inline">Déconnexion</span>
                </button>

                {/* Profil Utilisateur */}
                <div className="relative group ml-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenProfile}
                    className="h-9 flex items-center gap-2 px-2 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 cursor-pointer transition-colors whitespace-nowrap"
                    title="Mon profil"
                  >
                    <img
                      src={activeUser.avatar || 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces&auto=format&q=80'}
                      alt={activeUser.nom}
                      className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
                    />
                    <div className="text-left hidden xl:block pr-1">
                      <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                        {activeUser.nom?.split(' ')[1] || activeUser.nom}
                      </div>
                      <div className="text-[10px] text-[#00A651] font-semibold truncate max-w-[130px]">
                        {activeUser.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2E68B4]" />
                  </button>

                  <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl p-2 hidden group-hover:block z-50 animate-in fade-in duration-150">
                    <div className="p-2 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Connecté — {activeUser.nom}
                      </p>
                      <p className="text-[10px] text-slate-500 px-1 pb-1 truncate">
                        {activeUser.entite || activeUser.ville || 'OPN Gabon'}
                      </p>

                      <button
                        onClick={onOpenProfile}
                        className="w-full flex items-center gap-2 p-1.5 rounded-md text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-[#2E68B4] transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Paramètres du Profil & Photo</span>
                      </button>

                      <button
                        onClick={() => onOpenColleagues?.()}
                        className="w-full flex items-center gap-2 p-1.5 rounded-md text-left text-xs font-medium text-emerald-800 hover:bg-emerald-50 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Collègues en ligne (ma province)</span>
                      </button>

                      <button
                        onClick={() => onOpenHelpdesk?.(activeUser)}
                        className="w-full flex items-center gap-2 p-1.5 rounded-md text-left text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Headphones className="w-3.5 h-3.5 text-amber-600" />
                        <span>Helpdesk IT & Reset Mot de Passe</span>
                      </button>

                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 p-1.5 rounded-md text-left text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors pt-1 border-t border-slate-100"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Se Déconnecter de la session</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            </>
            )}
          </div>
        </div>
      </div>
      )}

    </header>
  );
}
