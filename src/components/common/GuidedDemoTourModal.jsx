import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause,
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Truck, 
  Receipt, 
  Warehouse, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  ExternalLink,
  Siren,
  Globe,
  Compass,
  Zap,
  RotateCcw,
  Sparkles,
  FastForward,
  Clock,
  Gauge
} from 'lucide-react';

export const DEMO_SCENARIOS = [
  {
    id: 'SCENARIO_GRAND_TOUR_360',
    badge: 'Recommandé • Vue 360°',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    title: 'Grand Tour Automatique — Tous les Modules OPN',
    subtitle: 'Exploration complète et autonome : Cockpit DG ➔ COD Crise ➔ Achats ➔ WMS Owendo ➔ Convoi IoT ➔ Pharmacie ➔ Trésor',
    icon: Sparkles,
    themeColor: 'from-emerald-950 via-slate-900 to-slate-950',
    steps: [
      {
        stepNumber: 1,
        title: 'Tableau de Bord National & Pilotage Stratégique (DG)',
        targetModule: 'dashboard',
        targetPersonaId: 'dg',
        description: 'Supervision globale de la disponibilité nationale des 350+ DCI, du taux de couverture provincial (94.2%) et de l\'enveloppe budgétaire PNA de 18,50 Mrd FCFA.',
        kpiHighlight: 'Disponibilité 94.2% • 9 Régions interconnectées',
        actionLabel: 'Explorer le Cockpit',
        documentToPreview: 'Rapport Stratégique National'
      },
      {
        stepNumber: 2,
        title: 'Centre Opérationnel de Décision (COD) & Gestion des Urgences',
        targetModule: 'emergency',
        targetPersonaId: 'cod',
        description: 'Veille sanitaire en temps réel, déclaration d\'alertes régionales, réquisitions de médicaments d\'urgence et mobilisation des Réserves Stratégiques d\'État.',
        kpiHighlight: 'Alerte Sanitaire Active • Réquisition Immédiate',
        actionLabel: 'Centre de Crise COD',
        documentToPreview: 'Arrêté de Réquisition Sanitaire'
      },
      {
        stepNumber: 3,
        title: 'Achats Internationaux, Incoterms & Dédouanement BAE',
        targetModule: 'purchases',
        targetPersonaId: 'achats',
        description: 'Gestion des dossiers d\'importation maritime au Port d\'Owendo, calcul des coûts de revient (Landed Costs) et obtention du Bon à Enlever douanier sous franchise d\'État.',
        kpiHighlight: '45+ Fournisseurs OMS • Exonération Fiscale BAE',
        actionLabel: 'Module Achats & Douanes',
        documentToPreview: 'Déclaration d\'Importation OPN A4'
      },
      {
        stepNumber: 4,
        title: 'WMS Hub Central d\'Owendo & Traçabilité FEFO',
        targetModule: 'wms',
        targetPersonaId: 'wms',
        description: 'Gestion des 12 500 emplacements palettes, adressage tridimensionnel (Zone/Allée/Travée/Niveau), sas de quarantaine pharmaceutique et sorties selon la règle FEFO.',
        kpiHighlight: 'Inventaire 99.85% • 4 Chambres Froides',
        actionLabel: 'Magasins WMS Owendo',
        documentToPreview: 'PV d\'Inventaire Contradictoire A4'
      },
      {
        stepNumber: 5,
        title: 'Distribution Nationale & Télémétrie Chaîne du Froid IoT',
        targetModule: 'distribution',
        targetPersonaId: 'transp',
        description: 'Suivi par balises GSM/Satellite des convois frigorifiques terrestres (RN1, RN2) et fret Setrag avec maintien certifié de la température entre +2°C et +8°C.',
        kpiHighlight: 'Sonde IoT +4.2°C • Application Chauffeur PWA',
        actionLabel: 'Supervision Flotte & Froid',
        documentToPreview: 'Feuille de Route Convoi'
      },
      {
        stepNumber: 6,
        title: 'Pharmacie Hospitalière & Dispensation Nominative (PUI)',
        targetModule: 'pharmacy',
        targetPersonaId: 'pharma_chul',
        description: 'Délivrance informatisée des ordonnances aux services de soins, dotations des armoires de réanimation et prévention des péremptions à 90, 60 et 30 jours.',
        kpiHighlight: 'Déploiement CHUL / CHUO / CHR • Anti-Gaspillage',
        actionLabel: 'Pharmacie Hospitalière',
        documentToPreview: 'Bon de Délivrance Nominative'
      },
      {
        stepNumber: 7,
        title: 'GMAO Biomédicale & Maintenance Frigorifique',
        targetModule: 'gmao',
        targetPersonaId: 'tech_biomed',
        description: 'Suivi de la maintenance préventive des chambres froides, groupes électrogènes et autoclaves avec émission des Ordres de Travail (OT) numériques.',
        kpiHighlight: 'Disponibilité 99.4% • Astreinte 24h/24',
        actionLabel: 'GMAO Maintenance',
        documentToPreview: 'Ordre de Travail Numérique'
      },
      {
        stepNumber: 8,
        title: 'Finances, Rapprochement Trésor (DGCPT) & Tiers-Payant CNAMGS',
        targetModule: 'billing',
        targetPersonaId: 'daf',
        description: 'Génération des titres de perception, lettrage bancaire quotidien avec le Trésor Public (0 FCFA écart) et télétransmission des bordereaux CNAMGS (3 régimes).',
        kpiHighlight: 'Recouvrement Dématérialisé • LOLFID Conforme',
        actionLabel: 'Finances & Recouvrement',
        documentToPreview: 'État de Rapprochement DGCPT'
      }
    ]
  },
  {
    id: 'SCENARIO_CRISIS_COD',
    badge: 'Gestion de Crise',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    title: 'Alerte Sanitaire & Réquisition d\'Urgence COD',
    subtitle: 'Flambée de Paludisme à Makokou (Ogooué-Ivindo) • Déploiement Convoi Froid 4x4 en urgence',
    icon: Siren,
    themeColor: 'from-rose-950 via-slate-900 to-slate-950',
    steps: [
      {
        stepNumber: 1,
        title: 'Cockpit Stratégique : Détection de l\'alerte de stock critique',
        targetModule: 'dashboard',
        targetPersonaId: 'dg',
        description: 'Le Directeur Général identifie un stock d\'antipaludiques inférieur à 12 jours d\'autonomie dans l\'Ogooué-Ivindo (G6) suite à de fortes intempéries.',
        kpiHighlight: 'Tension sanitaire G6 • Stock < 12j CMM',
        actionLabel: 'Inspecter l\'alerte',
        documentToPreview: 'Bulletin Épidémique Mensuel'
      },
      {
        stepNumber: 2,
        title: 'COD : Déclenchement du Plan Blanc & Ordre de Réquisition',
        targetModule: 'emergency',
        targetPersonaId: 'cod',
        description: 'Le Centre d\'Opérations d\'Urgence mobilise la Réserve Stratégique d\'État. Un Arrêté de Réquisition Sanitaire d\'Urgence est signé électroniquement.',
        kpiHighlight: 'Réquisition : 15 000 cures Coartem & Solutés',
        actionLabel: 'Accéder au COD',
        documentToPreview: 'Arrêté de Réquisition Sanitaire'
      },
      {
        stepNumber: 3,
        title: 'Hub Central d\'Owendo : Préparation Prioritaire FEFO',
        targetModule: 'wms',
        targetPersonaId: 'wms',
        description: 'Le magasinier WMS prépare immédiatement les palettes réservées en appliquant la règle FEFO. Conditionnement en malles isothermes scellées +2°C / +8°C.',
        kpiHighlight: 'Allée A2 • Lots libérés LNCM',
        actionLabel: 'Contrôler la préparation WMS',
        documentToPreview: 'Bon de Mouvement & Transfert'
      },
      {
        stepNumber: 4,
        title: 'Distribution : Suivi GPS & Télémétrie du Convoi 4x4',
        targetModule: 'distribution',
        targetPersonaId: 'transp',
        description: 'Départ immédiat du convoi tout-terrain vers Makokou avec balise IoT active (+4.2°C) et émargement numérique sur terminal mobile PWA.',
        kpiHighlight: 'Trajet 580 km • Sonde IoT active 4.2°C',
        actionLabel: 'Visualiser le Convoi',
        documentToPreview: 'Feuille de Route Convoi'
      }
    ]
  },
  {
    id: 'SCENARIO_IMPORT_QUALITY',
    badge: 'Commerce Extérieur',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    title: 'Importation Maritime Port d\'Owendo & Contrôle LNCM',
    subtitle: 'Arrivage conteneur 40 pieds • Dédouanement BAE • Libération analytique COA',
    icon: Globe,
    themeColor: 'from-blue-950 via-slate-900 to-slate-950',
    steps: [
      {
        stepNumber: 1,
        title: 'Achats & Importations : Cotation devises & Dédouanement',
        targetModule: 'purchases',
        targetPersonaId: 'achats',
        description: 'Enregistrement du connaissement maritime (Bill of Lading). Calcul automatique du coût de revient rendu Owendo (Landed Cost).',
        kpiHighlight: 'Valeur CIF : 142,5 M FCFA • Exonération PNA',
        actionLabel: 'Dossier d\'importation',
        documentToPreview: 'Déclaration d\'Importation A4'
      },
      {
        stepNumber: 2,
        title: 'Laboratoire National (LNCM) : Contrôle et Libération de Lot',
        targetModule: 'quality',
        targetPersonaId: 'qualite',
        description: 'Prélèvement d\'échantillons sous sas de quarantaine. Examen des Certificats d\'Analyse (COA) et émission du visa sanitaire libératoire.',
        kpiHighlight: 'Conformité OMS 100% • Lot Libéré',
        actionLabel: 'Certificat LNCM',
        documentToPreview: 'Certificat de Libération de Lot'
      },
      {
        stepNumber: 3,
        title: 'Hub Central Owendo : Rangement sur racks & Mise en stock FEFO',
        targetModule: 'wms',
        targetPersonaId: 'wms',
        description: 'Mise en stock physique et informatique des palettes libérées dans les allées dédiées du Hub Central d\'Owendo.',
        kpiHighlight: 'Stock disponible mis à jour instantanément',
        actionLabel: 'Vérifier l\'entrée WMS',
        documentToPreview: 'PV d\'Inventaire Tournant A4'
      }
    ]
  },
  {
    id: 'SCENARIO_FINANCE_TREASURY',
    badge: 'Comptabilité Publique',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    title: 'Recouvrement Trésor (DGCPT) & Tiers-Payant CNAMGS',
    subtitle: 'Rapprochement des cessions hospitalières • Facturation dématérialisée • Rapprochement bancaire',
    icon: Receipt,
    themeColor: 'from-amber-950 via-slate-900 to-slate-950',
    steps: [
      {
        stepNumber: 1,
        title: 'Facturation & Recouvrement : Titres de perception dématérialisés',
        targetModule: 'billing',
        targetPersonaId: 'daf',
        description: 'Émission systématique des ordres de recettes vers les hôpitaux publics et télétransmission des bordereaux de tiers-payant CNAMGS.',
        kpiHighlight: 'Taux de lettrage 100% • Écart 0 FCFA Trésor',
        actionLabel: 'Module Facturation',
        documentToPreview: 'État de Rapprochement DGCPT'
      },
      {
        stepNumber: 2,
        title: 'Rapprochement Bancaire Quotidien & Conformité LOLFID',
        targetModule: 'billing',
        targetPersonaId: 'daf',
        description: 'Réconciliation automatique entre les encaissements du Trésor Public (DGCPT) et les factures hospitalières avec certification Cour des Comptes.',
        kpiHighlight: 'Conformité LOLFID • Pièces justificatives A4 PDF',
        actionLabel: 'Voir le rapprochement',
        documentToPreview: 'Facture Normalisée OPN'
      }
    ]
  }
];

export default function GuidedDemoTourModal({
  isOpen,
  onClose,
  onStartScenario,
  activeTourState,
  onNextStep,
  onPrevStep,
  onStopTour,
  onToggleAutoPlay,
  onChangeSpeed,
  onNavigateDirect
}) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(DEMO_SCENARIOS[0].id);
  const [selectedDuration, setSelectedDuration] = useState(7000); // 7s par défaut

  if (!isOpen && !activeTourState) return null;

  const currentScenario = DEMO_SCENARIOS.find(s => s.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  // =========================================================================
  // 1. HUD FLOTTANT QUAND LA VISITE GUIDÉE AUTOMATIQUE EST EN COURS
  // =========================================================================
  if (activeTourState) {
    const runningScenario = DEMO_SCENARIOS.find(s => s.id === activeTourState.scenarioId) || DEMO_SCENARIOS[0];
    const currentStep = runningScenario.steps[activeTourState.currentStepIndex] || runningScenario.steps[0];
    const isFirstStep = activeTourState.currentStepIndex === 0;
    const isLastStep = activeTourState.currentStepIndex === runningScenario.steps.length - 1;
    const progress = activeTourState.progress || 0;
    const isAutoPlaying = activeTourState.isAutoPlaying !== false;
    const stepDuration = activeTourState.stepDuration || 7000;
    const secondsRemaining = Math.max(1, Math.ceil((1 - progress / 100) * (stepDuration / 1000)));

    const nextStepPreview = !isLastStep
      ? runningScenario.steps[activeTourState.currentStepIndex + 1]
      : null;
    const nextDomainRevealed = Boolean(activeTourState.nextDomainRevealed);

    return (
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-3 sm:px-4 animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
        <div className="bg-slate-950/72 backdrop-blur-[2px] text-white rounded-2xl shadow-xl border border-emerald-500/35 p-4 sm:p-5 ring-2 ring-black/20 relative overflow-hidden pointer-events-auto">
          
          {/* Ligne de progression automatique animée */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800/80">
            <div 
              className="h-full bg-gradient-to-r from-[#00A651] via-[#FFDE16] to-[#38bdf8] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* En-tête HUD */}
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#00A651] text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                {isAutoPlaying ? (
                  <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
                ) : (
                  <Pause className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {isAutoPlaying ? 'Autopilot 100% Automatique' : 'En Pause'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[10px] font-mono text-slate-300 border border-slate-700">
                    Étape {activeTourState.currentStepIndex + 1} / {runningScenario.steps.length}
                  </span>
                  {isAutoPlaying && (
                    <span className="text-[10px] text-amber-400 font-mono font-bold hidden sm:inline">
                      ({Math.round(progress)}% · suite dans {secondsRemaining}s)
                    </span>
                  )}
                  {nextDomainRevealed && nextStepPreview && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[9.5px] font-bold uppercase tracking-wider">
                      Domaine suivant affiché
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                  {nextDomainRevealed && nextStepPreview ? nextStepPreview.title : currentStep.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Bouton Pause / Reprendre */}
              <button
                type="button"
                onClick={onToggleAutoPlay}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-white transition-colors cursor-pointer"
                title={isAutoPlaying ? 'Mettre en pause l\'avance automatique' : 'Reprendre le défilement automatique'}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
              </button>

              {/* Bouton Arrêt / Quitter */}
              <button
                type="button"
                onClick={onStopTour}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Quitter la visite guidée"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description de l'étape active */}
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {currentStep.description}
          </p>

          {/* Ligne d'actions et de navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10.5px] font-bold">
                {currentStep.kpiHighlight}
              </span>
              <span className="text-[10.5px] text-slate-400">
                Pièce générée : <strong className="text-slate-200">{currentStep.documentToPreview}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Vitesse */}
              <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => onChangeSpeed?.(4500)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${stepDuration === 4500 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Vitesse Rapide (4.5s)"
                >
                  Rapide
                </button>
                <button
                  type="button"
                  onClick={() => onChangeSpeed?.(7000)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${stepDuration === 7000 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Vitesse Normale (7s)"
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => onChangeSpeed?.(12000)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${stepDuration === 12000 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Vitesse Détente (12s)"
                >
                  Détaillé
                </button>
              </div>

              {!isFirstStep && (
                <button
                  type="button"
                  onClick={onPrevStep}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                  title="Revenir à l'étape précédente"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Précédent</span>
                </button>
              )}

              {isLastStep ? (
                <button
                  type="button"
                  onClick={onStopTour}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00A651] hover:bg-[#008742] text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terminer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNextStep}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00A651] hover:bg-[#008742] text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  title="Passer immédiatement à l'étape suivante"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MODAL DE SÉLECTION & LANCEMENT DE LA VISITE GUIDÉE AUTOMATIQUE
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* En-tête Institutionnel Souverain */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00A651] via-amber-400 to-[#2E68B4] p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                  <Play className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Mode Autonome 100% Automatique
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                    Sans clic requis
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                  Moteur de Démonstration Guidée Interactive OPN Gabon
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Une fois lancée, la visite guidée navigue seule à travers les écrans, change automatiquement de rôle utilisateur et explore les processus clés en direct.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Corps du modal */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-50">
          
          {/* Colonne Gauche : Sélection du scénario */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
              Choisir un Parcours Démo :
            </h3>

            {DEMO_SCENARIOS.map((sc) => {
              const Icon = sc.icon;
              const isSelected = sc.id === selectedScenarioId;

              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#00A651] shadow-md ring-2 ring-[#00A651]/20'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded border inline-block mb-1 ${sc.badgeColor}`}>
                        {sc.badge}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {sc.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {sc.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Colonne Droite : Détail & Grand Bouton de Lancement Automatique */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Carte de lancement principale */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-xl p-5 border border-emerald-600/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border inline-block mb-1.5 ${currentScenario.badgeColor}`}>
                    {currentScenario.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {currentScenario.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    {currentScenario.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onStartScenario(currentScenario.id, true, selectedDuration);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00A651] to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/40 transition-all active:scale-95 shrink-0 cursor-pointer border border-emerald-400/40 hover:shadow-[0_0_25px_rgba(0,166,81,0.5)]"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Lancer la Démo Automatique</span>
                </button>
              </div>

              {/* Vitesse par défaut */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Cadence de transition automatique :</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDuration(4500)}
                    className={`px-3 py-1 rounded-md font-bold transition-all text-xs cursor-pointer ${selectedDuration === 4500 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Rapide (4.5s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDuration(7000)}
                    className={`px-3 py-1 rounded-md font-bold transition-all text-xs cursor-pointer ${selectedDuration === 7000 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Normal (7s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDuration(12000)}
                    className={`px-3 py-1 rounded-md font-bold transition-all text-xs cursor-pointer ${selectedDuration === 12000 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Détaillé (12s)
                  </button>
                </div>
              </div>

              {/* Liste chronologique des étapes */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Déroulement automatique ({currentScenario.steps.length} étapes séquentielles) :
                </h4>

                <div className="relative border-l-2 border-slate-200 ml-3.5 pl-5 space-y-4">
                  {currentScenario.steps.map((st) => (
                    <div key={st.stepNumber} className="relative group">
                      <div className="absolute -left-[27px] top-0.5 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center ring-4 ring-white shadow">
                        {st.stepNumber}
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 group-hover:border-emerald-300 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h5 className="text-xs font-bold text-slate-900">
                            {st.title}
                          </h5>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 w-fit">
                            Module : {st.targetModule.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {st.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[10.5px]">
                          <span className="font-bold text-emerald-700">
                            {st.kpiHighlight}
                          </span>
                          <span className="text-slate-500">
                            Livrable : <strong className="text-slate-800">{st.documentToPreview}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
