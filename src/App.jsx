import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import AuthModal from './components/common/AuthModal';
import UserProfileModal from './components/common/UserProfileModal';
import HelpdeskModal from './components/common/HelpdeskModal';
import OnlineColleaguesPanel from './components/common/OnlineColleaguesPanel';
import PublicPortal from './components/public/PublicPortal';
import DirectionHome from './components/home/DirectionHome';
import DirectionModules from './components/home/DirectionModules';
import DirectionDashboard from './components/home/DirectionDashboard';
import NationalDashboard from './components/dashboard/NationalDashboard';
import ActorWorkspace from './components/workspace/ActorWorkspace';
import ApproReportsPanel from './components/workspace/ApproReportsPanel';
import DafNationalDesk from './components/workspace/DafNationalDesk';
import PharmacyStockManager from './components/pharmacy/PharmacyStockManager';
import SupplyPlanner from './components/supply/SupplyPlanner';
import OpnConnect from './components/collaborative/OpnConnect';
import IncomingVisioBanner from './components/collaborative/IncomingVisioBanner';
import EmergencyControlCenter from './components/emergency/EmergencyControlCenter';
import AdminAudit from './components/admin/AdminAudit';
import LogisticsManager from './components/logistics/LogisticsManager';
import ProvincialAntennaManager from './components/antenna/ProvincialAntennaManager';
import PurchasesManager from './components/purchases/PurchasesManager';
import QualityDmpManager from './components/quality/QualityDmpManager';
import BillingManager from './components/billing/BillingManager';
import WmsManager from './components/wms/WmsManager';
import DistributionManager from './components/distribution/DistributionManager';
import StrategicPlanningManager from './components/planning/StrategicPlanningManager';
import CitizenPortalManager from './components/citizen/CitizenPortalManager';
import HumanResourcesManager from './components/hr/HumanResourcesManager';
import GmaoMaintenanceManager from './components/gmao/GmaoMaintenanceManager';
import ProspectionCommercialeManager from './components/commercial/ProspectionCommercialeManager';
import InventoryAndWasteManager from './components/inventory/InventoryAndWasteManager';
import FluxApprovisionnement from './components/flux/FluxApprovisionnement';
import PatrimoineManager from './components/patrimoine/PatrimoineManager';
import CentreServices from './components/services/CentreServices';
import GrossMarginDashboard from './components/dashboard/GrossMarginDashboard';
import PublicSectorDebtManager from './components/billing/PublicSectorDebtManager';
import OpnSpotlightModal from './components/common/OpnSpotlightModal';
import GuidedDemoTourModal, { DEMO_SCENARIOS } from './components/common/GuidedDemoTourModal';
import PlaquetteCommercialeModal from './components/common/PlaquetteCommercialeModal';
import { USERS_PERSONAS } from './data/usersPersonas';
import { subscribeToRealtimeEvents, setAuthToken, getAuthToken, apiRequest } from './services/api';
import { ensureSanctumSessionForPersona, isRealSanctumToken } from './services/sanctumSession';
import { sendPresenceHeartbeat } from './services/presenceApi';
import { getCodeRole, getRoleCapabilities, canAccessModule } from './data/rbacMatrix';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('public');
  const [activeNavTab, setActiveNavTab] = useState('accueil');
  const [activePersona, setActivePersona] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [helpdeskModalOpen, setHelpdeskModalOpen] = useState(false);
  const [colleaguesOpen, setColleaguesOpen] = useState(false);
  const [realtimeNotification, setRealtimeNotification] = useState(null);
  const [helpdeskTickets, setHelpdeskTickets] = useState([]);
  const [sanctumReady, setSanctumReady] = useState(false);
  const [sanctumBusy, setSanctumBusy] = useState(false);
  const [demoConnectingId, setDemoConnectingId] = useState(null);
  const [pendingVisioJoin, setPendingVisioJoin] = useState(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [plaquetteModalOpen, setPlaquetteModalOpen] = useState(false);
  const [activeTourState, setActiveTourState] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [sidebarMode, setSidebarMode] = useState(() => {
    try {
      const saved = localStorage.getItem('opn-sidebar-mode');
      if (saved === 'collapsed' || saved === 'hidden' || saved === 'expanded') return saved;
    } catch {
      /* préférence locale indisponible */
    }
    return 'expanded';
  });

  useEffect(() => {
    try {
      localStorage.setItem('opn-sidebar-mode', sidebarMode);
    } catch {
      /* préférence locale indisponible */
    }
  }, [sidebarMode]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    // Valider le token stocké sans ouvrir le SSE tant que /auth/me n'a pas répondu.
    const token = getAuthToken();
    if (!isRealSanctumToken(token)) {
      setSanctumReady(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        await apiRequest('/auth/me', { timeoutMs: 8000 });
        if (!cancelled) setSanctumReady(true);
      } catch {
        if (!cancelled) {
          setAuthToken(null);
          setSanctumReady(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Temps réel = polling snapshot (pas de SSE) pour ne pas saturer l'API locale.
    if (!sanctumReady || !isRealSanctumToken(getAuthToken())) {
      return undefined;
    }

    const unsubscribe = subscribeToRealtimeEvents((event) => {
      if (event.type === 'NEW_EMERGENCY') {
        setRealtimeNotification(event.message || 'Nouvelle alerte sanitaire déclarée au COD Libreville.');
        setTimeout(() => setRealtimeNotification(null), 6000);
      } else if (event.type === 'CONNECTED') {
        console.log('Connecté au flux temps réel Laravel 11');
      }
    });

    return () => unsubscribe();
  }, [sanctumReady]);

  useEffect(() => {
    if (!currentUser || !sanctumReady || !isRealSanctumToken(getAuthToken())) {
      return undefined;
    }

    let cancelled = false;
    const beat = async () => {
      try {
        if (!cancelled) await sendPresenceHeartbeat();
      } catch {
        /* ignore */
      }
    };

    beat();
    const timer = setInterval(beat, 45000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [currentUser?.id, currentUser?.email, sanctumReady]);

  const activateSanctumForPersona = async (persona) => {
    if (!persona?.email) {
      setSanctumReady(false);
      return false;
    }
    setSanctumBusy(true);
    try {
      const res = await ensureSanctumSessionForPersona(persona, { preferQuick: true });
      const ok = Boolean(res?.success && isRealSanctumToken(res.token || getAuthToken()));
      setSanctumReady(ok);
      if (!ok) {
        console.warn('Sanctum non activé:', res?.message);
      }
      return ok;
    } catch (err) {
      console.warn('Erreur session Sanctum:', err);
      setSanctumReady(false);
      return false;
    } finally {
      setSanctumBusy(false);
    }
  };

  /** Reconnexion API si l'UI est ouverte sans token valide */
  const reconnectSanctum = async () => {
    const persona = currentUser || activePersona;
    if (!persona?.email) {
      setAuthModalOpen(true);
      return false;
    }
    setRealtimeNotification(`Activation session API — ${persona.nom}…`);
    const ok = await activateSanctumForPersona(persona);
    setRealtimeNotification(
      ok
        ? `Session Sanctum active — ${persona.nom}`
        : 'Échec Sanctum — vérifiez que l’API tourne (127.0.0.1:8002) puis réessayez.'
    );
    setTimeout(() => setRealtimeNotification(null), 4500);
    if (!ok) setAuthModalOpen(true);
    return ok;
  };

  const handleAuthSuccess = async (user, token) => {
    const authenticatedUser = user || null;
    if (!authenticatedUser) return;

    setCurrentUser(authenticatedUser);
    setActivePersona(authenticatedUser);
    setProfileModalOpen(false);
    setColleaguesOpen(false);
    const role = getCodeRole(authenticatedUser);
    const caps = getRoleCapabilities(role);
    setCurrentView(role === 'SUPER_ADMIN' ? (caps.defaultView || 'admin') : 'flux_appro');

    if (isRealSanctumToken(token)) {
      setAuthToken(token);
      setSanctumReady(true);
    } else {
      const ok = await activateSanctumForPersona(authenticatedUser);
      if (!ok) {
        setRealtimeNotification(
          'Profil ouvert sans API — cliquez « Activer session » ou Accès Intranet.'
        );
        setTimeout(() => setRealtimeNotification(null), 5000);
      }
    }

    setRealtimeNotification(`Session ouverte : Bienvenue ${authenticatedUser.nom} (${authenticatedUser.role}) !`);
    setTimeout(() => setRealtimeNotification(null), 4500);
  };

  /** Profils démo : 1 clic = 1 session rapide (sans griser les autres profils) */
  const handleDirectDemoLogin = async (persona) => {
    if (!persona?.email) return;
    setDemoConnectingId(persona.id);
    setRealtimeNotification(`Connexion — ${persona.nom}…`);
    try {
      const res = await ensureSanctumSessionForPersona(persona, { forceNew: true, preferQuick: true });
      if (res?.success && isRealSanctumToken(res.token)) {
        const apiUser = res.user || {};
        await handleAuthSuccess(
          {
            ...persona,
            ...apiUser,
            // Conserver l'identité démo UI, enrichir avec IDs API (antenne / structure)
            nom: persona.nom || apiUser.nom || apiUser.name,
            role: persona.role || apiUser.role,
            codeRole: persona.codeRole || apiUser.code_role || apiUser.codeRole,
            provinceId: persona.provinceId || apiUser.provinceId,
            antenneId: apiUser.province_id || apiUser.provinceId || apiUser.antenne_id,
            antenne_id: apiUser.province_id || apiUser.antenne_id,
            structureId: apiUser.structure_id || apiUser.structureId,
            structure_id: apiUser.structure_id || apiUser.structureId,
            email: persona.email || apiUser.email,
            avatar: persona.avatar,
          },
          res.token
        );
      } else {
        setRealtimeNotification(res?.message || 'Connexion API impossible.');
        setTimeout(() => setRealtimeNotification(null), 5000);
        setAuthModalOpen(true);
      }
    } catch (err) {
      setRealtimeNotification(err?.message || 'API Laravel injoignable.');
      setTimeout(() => setRealtimeNotification(null), 5000);
      setAuthModalOpen(true);
    } finally {
      setDemoConnectingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      if (isRealSanctumToken(getAuthToken())) {
        await apiRequest('/auth/logout', { method: 'POST', body: '{}' });
      }
    } catch {
      /* ignore */
    }

    setAuthToken(null);
    setSanctumReady(false);
    setCurrentUser(null);
    setActivePersona(null);
    setCurrentView('public');
    setActiveNavTab('accueil');
    setProfileModalOpen(false);
    setHelpdeskModalOpen(false);
    setColleaguesOpen(false);
    setAuthModalOpen(false);
    setRealtimeNotification('Session fermée. Vous avez été déconnecté avec succès.');
    setTimeout(() => setRealtimeNotification(null), 4000);
  };

  const handleUpdatePersona = (updatedData) => {
    setActivePersona(updatedData);
    setCurrentUser(updatedData);
  };

  const handlePersonaSwitch = async (persona) => {
    if (!persona) return;
    setActivePersona(persona);
    if (currentUser) {
      setCurrentUser(persona);
      const caps = getRoleCapabilities(getCodeRole(persona));
      setCurrentView(caps.defaultView || 'workspace');
      await activateSanctumForPersona(persona);
    }
  };

  const openEmergency = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      setRealtimeNotification('Connectez-vous pour accéder au Centre des Urgences.');
      setTimeout(() => setRealtimeNotification(null), 4000);
      return;
    }
    if (!canAccessModule(getCodeRole(currentUser), 'emergency')) {
      setRealtimeNotification('Votre profil n’a pas accès au module Urgences.');
      setTimeout(() => setRealtimeNotification(null), 4000);
      return;
    }
    setCurrentView('emergency');
  };

  useEffect(() => {
    if (!currentUser || currentView === 'public') return;
    const codeRole = getCodeRole(activePersona || currentUser);
    if (!canAccessModule(codeRole, currentView)) {
      setCurrentView(codeRole === 'SUPER_ADMIN' ? 'admin' : 'flux_appro');
    }
  }, [currentUser, activePersona, currentView]);

  useEffect(() => {
    if (!currentUser && currentView !== 'public') {
      setCurrentView('public');
      setActivePersona(null);
    }
  }, [currentUser, currentView]);

  const handleHelpdeskTicketSubmit = (ticketData) => {
    setHelpdeskTickets((prev) => [ticketData, ...prev]);
    setRealtimeNotification(`Ticket IT N° ${ticketData.id} créé et envoyé à la team de ${ticketData.chefLieu} !`);
    setTimeout(() => setRealtimeNotification(null), 5000);
  };

  // =========================================================================
  // MOTEUR DE DÉMONSTRATION GUIDÉE 100% AUTOMATIQUE (AUTOPILOT SANS CLIC)
  // =========================================================================
  useEffect(() => {
    if (!activeTourState || activeTourState.isAutoPlaying === false) return undefined;

    const intervalMs = 100;
    const duration = activeTourState.stepDuration || 7000;
    const increment = (intervalMs / duration) * 100;

    const timer = setInterval(() => {
      setActiveTourState((prev) => {
        if (!prev || prev.isAutoPlaying === false) return prev;
        const nextProgress = (prev.progress || 0) + increment;

        if (nextProgress >= 100) {
          // Étape terminée -> Passage automatique à la suivante
          const scenario = DEMO_SCENARIOS.find((s) => s.id === prev.scenarioId) || DEMO_SCENARIOS[0];
          const nextIdx = prev.currentStepIndex + 1;

          if (nextIdx < scenario.steps.length) {
            const nextStep = scenario.steps[nextIdx];
            if (nextStep.targetPersonaId) {
              const targetPersona = USERS_PERSONAS.find((p) => p.id === nextStep.targetPersonaId);
              if (targetPersona) {
                setActivePersona(targetPersona);
                setCurrentUser(targetPersona);
              }
            }
            setCurrentView(nextStep.targetModule);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            return {
              ...prev,
              currentStepIndex: nextIdx,
              progress: 0
            };
          } else {
            // Tour complet terminé
            setRealtimeNotification('Démonstration guidée 100% automatique terminée avec succès.');
            setTimeout(() => setRealtimeNotification(null), 5000);
            return null;
          }
        }

        return {
          ...prev,
          progress: nextProgress
        };
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeTourState?.scenarioId, activeTourState?.currentStepIndex, activeTourState?.isAutoPlaying, activeTourState?.stepDuration]);

  const handleStartScenario = (scenarioId, isAutoPlay = true, duration = 7000) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];
    const firstStep = scenario.steps[0];
    
    if (firstStep) {
      if (firstStep.targetPersonaId) {
        const targetPersona = USERS_PERSONAS.find((p) => p.id === firstStep.targetPersonaId) || USERS_PERSONAS[0];
        setActivePersona(targetPersona);
        setCurrentUser(targetPersona);
      }
      setCurrentView(firstStep.targetModule);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setActiveTourState({
      scenarioId: scenario.id,
      currentStepIndex: 0,
      isAutoPlaying: isAutoPlay,
      stepDuration: duration,
      progress: 0
    });

    setRealtimeNotification(`Mode Autonome actif : Démonstration « ${scenario.title} » en cours...`);
    setTimeout(() => setRealtimeNotification(null), 4000);
  };

  const handleNextTourStep = () => {
    setActiveTourState((prev) => {
      if (!prev) return null;
      const scenario = DEMO_SCENARIOS.find((s) => s.id === prev.scenarioId) || DEMO_SCENARIOS[0];
      const nextIdx = prev.currentStepIndex + 1;

      if (nextIdx < scenario.steps.length) {
        const nextStep = scenario.steps[nextIdx];
        if (nextStep.targetPersonaId) {
          const targetPersona = USERS_PERSONAS.find((p) => p.id === nextStep.targetPersonaId);
          if (targetPersona) {
            setActivePersona(targetPersona);
            setCurrentUser(targetPersona);
          }
        }
        setCurrentView(nextStep.targetModule);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return {
          ...prev,
          currentStepIndex: nextIdx,
          progress: 0
        };
      } else {
        setRealtimeNotification('Démonstration guidée terminée avec succès.');
        setTimeout(() => setRealtimeNotification(null), 5000);
        return null;
      }
    });
  };

  const handlePrevTourStep = () => {
    setActiveTourState((prev) => {
      if (!prev) return null;
      const scenario = DEMO_SCENARIOS.find((s) => s.id === prev.scenarioId) || DEMO_SCENARIOS[0];
      const prevIdx = Math.max(0, prev.currentStepIndex - 1);
      const prevStep = scenario.steps[prevIdx];
      
      if (prevStep.targetPersonaId) {
        const targetPersona = USERS_PERSONAS.find((p) => p.id === prevStep.targetPersonaId);
        if (targetPersona) {
          setActivePersona(targetPersona);
          setCurrentUser(targetPersona);
        }
      }
      setCurrentView(prevStep.targetModule);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      return {
        ...prev,
        currentStepIndex: prevIdx,
        progress: 0
      };
    });
  };

  const handleToggleTourAutoPlay = () => {
    setActiveTourState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isAutoPlaying: !prev.isAutoPlaying
      };
    });
  };

  const handleChangeTourSpeed = (newDuration) => {
    setActiveTourState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stepDuration: newDuration,
        progress: 0
      };
    });
  };

  const handleStopTour = () => {
    setActiveTourState(null);
  };

  const handleNavigateDirect = (targetModule, targetPersonaId) => {
    if (targetPersonaId) {
      const targetPersona = USERS_PERSONAS.find((p) => p.id === targetPersonaId);
      if (targetPersona) {
        setActivePersona(targetPersona);
        setCurrentUser(targetPersona);
      }
    }
    setCurrentView(targetModule);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectionSelect = (directionId) => {
    setSelectedDirection(directionId);
    setCurrentView('direction_modules');
  };

  const sessionPersona = activePersona || currentUser || null;

  const headerProps = {
    currentView,
    setCurrentView,
    currentUser,
    activePersona: sessionPersona,
    setActivePersona: handlePersonaSwitch,
    onTriggerEmergency: openEmergency,
    onOpenAuth: () => setAuthModalOpen(true),
    onOpenProfile: () => {
      if (!currentUser) {
        setAuthModalOpen(true);
        return;
      }
      setProfileModalOpen(true);
    },
    onOpenHelpdesk: () => setHelpdeskModalOpen(true),
    onOpenColleagues: () => {
      if (!currentUser) {
        setAuthModalOpen(true);
        return;
      }
      setColleaguesOpen(true);
    },
    onLogout: handleLogout,
    onDirectDemoLogin: handleDirectDemoLogin,
    onOpenSpotlight: () => setSpotlightOpen(true),
    onOpenDemoTour: () => setDemoTourOpen(true),
    onOpenPlaquette: () => setPlaquetteModalOpen(true),
    demoConnectingId,
    activeNavTab,
    setActiveNavTab,
  };

  if (currentView === 'public' || currentView === 'direction_home' || currentView === 'direction_modules' || currentView === 'direction_dashboard') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
        {realtimeNotification && (
          <div className="fixed top-20 right-6 z-50 bg-[#2E68B4] text-white px-4 py-3 rounded-md shadow-2xl border border-blue-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold">{realtimeNotification}</span>
            <button onClick={() => setRealtimeNotification(null)} className="ml-2 text-white/80 hover:text-white font-bold">✕</button>
          </div>
        )}

        {currentView === 'public' && <Header {...headerProps} />}

        {currentView === 'public' ? (
          <PublicPortal
            onAccessWorkspace={() => {
              if (currentUser) {
                setCurrentView('direction_home');
              } else {
                setAuthModalOpen(true);
              }
            }}
            activeNavTab={activeNavTab}
            setActiveNavTab={setActiveNavTab}
            onOpenPlaquette={() => setPlaquetteModalOpen(true)}
          />
        ) : currentView === 'direction_home' ? (
          <DirectionHome
            currentUser={currentUser}
            onDirectionSelect={handleDirectionSelect}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenHelpdesk={() => setHelpdeskModalOpen(true)}
            onLogout={handleLogout}
          />
        ) : currentView === 'direction_modules' ? (
          <DirectionModules
            directionId={selectedDirection}
            onBack={() => setCurrentView('direction_home')}
            onModuleSelect={(moduleId) => setCurrentView(moduleId)}
            currentUser={currentUser}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenHelpdesk={() => setHelpdeskModalOpen(true)}
            onLogout={handleLogout}
          />
        ) : (
          <DirectionDashboard
            directionId={selectedDirection}
            onBack={() => setCurrentView('direction_modules')}
            currentUser={currentUser}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenHelpdesk={() => setHelpdeskModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          currentPersona={sessionPersona}
        />

        <UserProfileModal
          isOpen={profileModalOpen && Boolean(currentUser)}
          onClose={() => setProfileModalOpen(false)}
          activePersona={sessionPersona}
          onUpdatePersona={handleUpdatePersona}
          onOpenHelpdesk={() => {
            setProfileModalOpen(false);
            setHelpdeskModalOpen(true);
          }}
        />

        <HelpdeskModal
          isOpen={helpdeskModalOpen}
          onClose={() => setHelpdeskModalOpen(false)}
          activePersona={sessionPersona}
          onTicketSubmitted={handleHelpdeskTicketSubmit}
        />

        <OnlineColleaguesPanel
          isOpen={colleaguesOpen && Boolean(currentUser)}
          onClose={() => setColleaguesOpen(false)}
          currentUser={currentUser}
          onOpenConnect={() => setCurrentView('collaborative')}
        />

        <OpnSpotlightModal
          isOpen={spotlightOpen}
          onClose={() => setSpotlightOpen(false)}
          onNavigateModule={(mod) => {
            setCurrentView(mod);
            setSpotlightOpen(false);
          }}
          activePersona={sessionPersona}
        />

        <GuidedDemoTourModal
          isOpen={demoTourOpen}
          onClose={() => setDemoTourOpen(false)}
          onStartScenario={handleStartScenario}
          activeTourState={activeTourState}
          onNextStep={handleNextTourStep}
          onPrevStep={handlePrevTourStep}
          onStopTour={handleStopTour}
          onToggleAutoPlay={handleToggleTourAutoPlay}
          onChangeSpeed={handleChangeTourSpeed}
          onNavigateDirect={handleNavigateDirect}
        />

        <PlaquetteCommercialeModal
          isOpen={plaquetteModalOpen}
          onClose={() => setPlaquetteModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F4F5F7] text-[#0F172A] flex flex-col font-sans relative">
      {realtimeNotification && (
        <div className="fixed top-20 right-6 z-50 bg-[#00A651] text-white px-4 py-3 rounded-md shadow-2xl border border-emerald-300 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{realtimeNotification}</span>
          <button onClick={() => setRealtimeNotification(null)} className="ml-2 text-white/80 hover:text-white font-bold">✕</button>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {sidebarMode !== 'hidden' && (
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            activePersona={sessionPersona}
            collapsed={sidebarMode === 'collapsed'}
            onCollapse={() => setSidebarMode('collapsed')}
            onExpand={() => setSidebarMode('expanded')}
            onHide={() => setSidebarMode('hidden')}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenHelpdesk={() => setHelpdeskModalOpen(true)}
          />
        )}

        <div className="flex flex-1 min-w-0 min-h-0 flex-col">
        <Header
          {...headerProps}
          chrome="actions"
          sidebarHidden={sidebarMode === 'hidden'}
          onShowSidebar={() => setSidebarMode('expanded')}
        />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
          {currentView === 'flux_appro' && (
            <FluxApprovisionnement activePersona={sessionPersona} />
          )}
          {currentView === 'patrimoine' && (
            <PatrimoineManager activePersona={sessionPersona} />
          )}
          {currentView === 'centre_services' && (
            <CentreServices
              onOpenSpotlight={() => setSpotlightOpen(true)}
              onOpenDemoTour={() => setDemoTourOpen(true)}
              onOpenPortal={() => setCurrentView('public')}
              onOpenColleagues={() => setColleaguesOpen(true)}
              onOpenEmergency={openEmergency}
            />
          )}
          {currentView === 'dashboard' &&
            (getCodeRole(sessionPersona) === 'DAF' ? (
              <DafNationalDesk
                activePersona={sessionPersona}
                sanctumReady={sanctumReady}
                sanctumBusy={sanctumBusy}
                onReconnectSanctum={reconnectSanctum}
                onNavigateModule={setCurrentView}
                initialTab="budget"
              />
            ) : (
              <NationalDashboard
                activePersona={sessionPersona}
                onNavigateModule={setCurrentView}
                sanctumReady={sanctumReady}
              />
            ))}
          {currentView === 'workspace' && (
            <ActorWorkspace
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              sanctumBusy={sanctumBusy}
              onReconnectSanctum={reconnectSanctum}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'pharmacy' && (
            <PharmacyStockManager activePersona={sessionPersona} sanctumReady={sanctumReady} />
          )}
          {currentView === 'supply' &&
            (getCodeRole(sessionPersona) === 'DAF' ? (
              <DafNationalDesk
                activePersona={sessionPersona}
                sanctumReady={sanctumReady}
                sanctumBusy={sanctumBusy}
                onReconnectSanctum={reconnectSanctum}
                onNavigateModule={setCurrentView}
                initialTab="engagements"
              />
            ) : (
              <SupplyPlanner activePersona={sessionPersona} sanctumReady={sanctumReady} />
            ))}
          {currentView === 'collaborative' && (
            <OpnConnect
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              initialTab={pendingVisioJoin ? 'reunions' : 'chat'}
              autoJoinVisio={pendingVisioJoin}
              onAutoJoinConsumed={() => setPendingVisioJoin(null)}
            />
          )}
          {currentView === 'emergency' && (
            <EmergencyControlCenter
              activePersona={sessionPersona}
              onOpenChat={() => {
                setPendingVisioJoin({
                  room: 'COD-CRISE-OPN',
                  title: 'Salle de crise COD / COUS',
                });
                setCurrentView('collaborative');
              }}
              sanctumReady={sanctumReady}
            />
          )}
          {currentView === 'documents' &&
            (getCodeRole(sessionPersona) === 'DAF' ? (
              <DafNationalDesk
                activePersona={sessionPersona}
                sanctumReady={sanctumReady}
                sanctumBusy={sanctumBusy}
                onReconnectSanctum={reconnectSanctum}
                onNavigateModule={setCurrentView}
                initialTab="rapports"
              />
            ) : getCodeRole(sessionPersona) === 'APPRO_NATIONAL' ? (
              <ApproReportsPanel
                activePersona={sessionPersona}
                sanctumReady={sanctumReady}
              />
            ) : (
              <OpnConnect
                activePersona={sessionPersona}
                sanctumReady={sanctumReady}
                initialTab="ged"
                autoJoinVisio={pendingVisioJoin}
                onAutoJoinConsumed={() => setPendingVisioJoin(null)}
              />
            ))}
          {currentView === 'logistics' && (
            <LogisticsManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'antenna' && (
            <ProvincialAntennaManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'purchases' && (
            <PurchasesManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'quality' && (
            <QualityDmpManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'billing' && (
            <BillingManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'wms' && (
            <WmsManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'distribution' && (
            <DistributionManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'planning' && (
            <StrategicPlanningManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'citizen' && (
            <CitizenPortalManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'hr' && (
            <HumanResourcesManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'gmao' && (
            <GmaoMaintenanceManager
              activePersona={sessionPersona}
              sanctumReady={sanctumReady}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'prospection' && (
            <ProspectionCommercialeManager
              activePersona={sessionPersona}
              onNavigateModule={setCurrentView}
            />
          )}
          {currentView === 'inventory_waste' && (
            <InventoryAndWasteManager />
          )}
          {currentView === 'gross_margin' && (
            <GrossMarginDashboard />
          )}
          {currentView === 'debt_public' && (
            <PublicSectorDebtManager />
          )}
          {(currentView === 'admin' || currentView === 'admin_users' || currentView === 'admin_helpdesk') && (
            <AdminAudit
              activePersona={sessionPersona}
              initialSubTab={
                currentView === 'admin_helpdesk'
                  ? 'helpdesk'
                  : currentView === 'admin_users'
                  ? 'users'
                  : 'users'
              }
              onSubTabChange={(tab) => {
                if (sessionPersona?.codeRole === 'ADMIN_IT') {
                  if (tab === 'helpdesk') setCurrentView('admin_helpdesk');
                  else if (tab === 'users') setCurrentView('admin_users');
                }
              }}
              helpdeskTickets={helpdeskTickets}
              onResolveTicket={(tId) => {
                setHelpdeskTickets((prev) =>
                  prev.map((t) =>
                    t.id === tId
                      ? {
                          ...t,
                          statut: 'TRAITE',
                          resoluPar: sessionPersona?.nom,
                          dateResolution: new Date().toLocaleTimeString('fr-FR'),
                        }
                      : t
                  )
                );
                setRealtimeNotification(`Ticket ${tId} marqué comme traité.`);
                setTimeout(() => setRealtimeNotification(null), 3500);
              }}
              sanctumReady={sanctumReady}
            />
          )}
        </main>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentPersona={sessionPersona}
      />

      <UserProfileModal
        isOpen={profileModalOpen && Boolean(currentUser)}
        onClose={() => setProfileModalOpen(false)}
        activePersona={sessionPersona}
        onUpdatePersona={handleUpdatePersona}
        onOpenHelpdesk={() => {
          setProfileModalOpen(false);
          setHelpdeskModalOpen(true);
        }}
      />

      <HelpdeskModal
        isOpen={helpdeskModalOpen}
        onClose={() => setHelpdeskModalOpen(false)}
        activePersona={sessionPersona}
        onTicketSubmitted={handleHelpdeskTicketSubmit}
      />

      <OnlineColleaguesPanel
        isOpen={colleaguesOpen && Boolean(currentUser)}
        onClose={() => setColleaguesOpen(false)}
        currentUser={currentUser}
        onOpenConnect={() => setCurrentView('collaborative')}
      />

      {Boolean(currentUser) && (
        <IncomingVisioBanner
          activePersona={sessionPersona}
          sanctumReady={sanctumReady || isRealSanctumToken(getAuthToken())}
          onJoin={(payload) => {
            setPendingVisioJoin(payload);
            setCurrentView('collaborative');
          }}
        />
      )}

      <OpnSpotlightModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onNavigateModule={(mod) => {
          setCurrentView(mod);
          setSpotlightOpen(false);
        }}
        activePersona={sessionPersona}
      />

      <GuidedDemoTourModal
        isOpen={demoTourOpen}
        onClose={() => setDemoTourOpen(false)}
        onStartScenario={handleStartScenario}
        activeTourState={activeTourState}
        onNextStep={handleNextTourStep}
        onPrevStep={handlePrevTourStep}
        onStopTour={handleStopTour}
        onToggleAutoPlay={handleToggleTourAutoPlay}
        onChangeSpeed={handleChangeTourSpeed}
        onNavigateDirect={handleNavigateDirect}
      />

      <PlaquetteCommercialeModal
        isOpen={plaquetteModalOpen}
        onClose={() => setPlaquetteModalOpen(false)}
      />
    </div>
  );
}
