import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Truck,
  Activity,
  Coins,
  Receipt,
  Landmark,
  FileText,
  Thermometer,
  QrCode,
  Users,
  Wrench,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
  Check,
  Layers,
  BarChart3,
  Cpu,
  Lock,
  HeartPulse,
  Pill,
  Search,
  Maximize2,
  Eye,
  Sliders,
  ExternalLink
} from 'lucide-react';
import OpnLogo from './OpnLogo';
import { downloadElementAsPdf, previewPrintDocument } from '../../utils/pdfExport';
import { formatXAF } from '../../utils/formatters';

export default function PlaquetteCommercialeModal({ isOpen, onClose }) {
  const deckRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [viewMode, setViewMode] = useState('slides'); // 'slides' | 'all'
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const totalSlides = 10;

  if (!isOpen) return null;

  const handlePrint = () => {
    previewPrintDocument();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // Pour une exportation complète de tout le deck, on bascule temporairement en vue complète
      const prevMode = viewMode;
      setViewMode('all');
      
      // Laisser le temps au DOM de rendre toutes les slides
      setTimeout(async () => {
        await downloadElementAsPdf(
          deckRef,
          'Plaquette-Commerciale-OPN-Digital-Hub-2026.pdf',
          {
            orientation: 'landscape',
            format: 'a4',
            margin: [0, 0, 0, 0],
            scale: 2
          }
        );
        setViewMode(prevMode);
        setIsGeneratingPdf(false);
      }, 350);
    } catch (err) {
      console.error('Erreur export plaquette PDF:', err);
      setIsGeneratingPdf(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-slate-900 text-slate-100 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-700">
        
        {/* ========================================================================= */}
        {/* 1. TOP BAR DE CONTRÔLE (Écran uniquement, masqué à l'impression) */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-white shrink-0 print:hidden gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00A651]/20 border border-[#00A651]/50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#00A651]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Catalogue & Plaquette Officielle</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-semibold border border-blue-700/50">Édition 2026</span>
              </div>
              <h2 className="text-sm font-bold text-slate-200">OPN DIGITAL HUB — Présentation Exécutive des Produits & Services</h2>
            </div>
          </div>

          {/* Contrôles de navigation et d'action */}
          <div className="flex items-center gap-2">
            {/* Sélecteur de mode d'affichage */}
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setViewMode('slides')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  viewMode === 'slides' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mode Slide ({currentSlide}/{totalSlides})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  viewMode === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Toutes les Slides (10)
              </button>
            </div>

            {/* Navigation Slides (si mode slide unique) */}
            {viewMode === 'slides' && (
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={prevSlide}
                  disabled={currentSlide === 1}
                  className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Slide précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-mono font-bold text-emerald-400">
                  {currentSlide} / {totalSlides}
                </span>
                <button
                  type="button"
                  onClick={nextSlide}
                  disabled={currentSlide === totalSlides}
                  className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Slide suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bouton Impression Aperçu */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              title="Aperçu avant impression"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            {/* Bouton Téléchargement Direct PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#00A651] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>

            {/* Lien Dédié Plein Écran Web */}
            <a
              href="/plaquette-commerciale-slides.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-slate-700 transition-all"
              title="Ouvrir la présentation dans un nouvel onglet plein écran"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFDE16]" />
              <span>Plein Écran HD</span>
            </a>

            {/* Fermer */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ZONE DE CONTENU DES SLIDES (Plaquette Format Paysage A4 / 16:9) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex flex-col items-center">
          <div ref={deckRef} className="w-full max-w-5xl space-y-8 print:space-y-0 print:w-full print:max-w-none">
            
            {/* =================================================================== */}
            {/* SLIDE 1 : PAGE DE GARDE (EXECUTIVE COVER) */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 1) && (
              <div className="slide-deck-page bg-gradient-to-br from-slate-900 via-[#0B1E38] to-slate-900 text-white rounded-xl border border-slate-800 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between relative overflow-hidden print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Ruban Tricolore Gabonais en tête */}
                <div className="absolute top-0 left-0 right-0 h-2.5 flex">
                  <div className="flex-1 bg-[#00A651]" />
                  <div className="flex-1 bg-[#FFDE16]" />
                  <div className="flex-1 bg-[#2E68B4]" />
                </div>

                {/* Arrière-plan graphique décoratif */}
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* En-tête officiel */}
                <div className="flex items-start justify-between border-b border-white/10 pb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <OpnLogo className="h-16 w-auto" theme="white" />
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-black tracking-widest text-[#FFDE16] uppercase">RÉPUBLIQUE GABONAISE</div>
                    <div className="text-[10px] font-semibold text-slate-300">Ministère de la Santé et des Affaires Sociales</div>
                    <div className="text-[10px] font-bold text-emerald-400 mt-0.5">Direction Générale de l'Office Pharmaceutique National</div>
                  </div>
                </div>

                {/* Corps de la Slide : Titre & Proposition de valeur */}
                <div className="my-auto py-8 relative z-10 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-[#00A651]" />
                    Plaquette de Présentation Exécutive & Catalogue de Solutions 2026
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    OPN DIGITAL HUB <span className="text-[#00A651]">2026</span>
                  </h1>

                  <p className="text-base sm:text-xl font-medium text-slate-200 max-w-3xl leading-relaxed">
                    Plateforme Numérique Souveraine de Gestion Intégrée, de Traçabilité IoT et de Sécurisation de la Chaîne d'Approvisionnement Pharmaceutique Nationale.
                  </p>

                  <div className="text-xs sm:text-sm text-slate-300 italic max-w-2xl bg-white/5 p-4 rounded-xl border border-white/10">
                    « Garantir la disponibilité continue, l'équité territoriale et la traçabilité infalsifiable des Médicaments Essentiels (DCI) pour l'ensemble des populations du Gabon. »
                  </div>
                </div>

                {/* Pied de slide : Badges & Métriques clés */}
                <div className="border-t border-white/10 pt-6 relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Volume Budgétaire PNA</div>
                    <div className="text-base font-black text-[#FFDE16] font-mono mt-0.5">18.5 Mrd FCFA</div>
                    <div className="text-[10px] text-slate-300">Sous contrôle prédictif</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Maillage Territorial</div>
                    <div className="text-base font-black text-emerald-400 font-mono mt-0.5">9 Provinces</div>
                    <div className="text-[10px] text-slate-300">Interconnectées en temps réel</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Conformité Qualité</div>
                    <div className="text-base font-black text-blue-400 font-mono mt-0.5">Normes OMS / CEMAC</div>
                    <div className="text-[10px] text-slate-300">Certificats COA & AMM vérifiés</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Sécurité Financière</div>
                    <div className="text-base font-black text-purple-400 font-mono mt-0.5">Trésor & CNAMGS</div>
                    <div className="text-[10px] text-slate-300">Rapprochement automatisé</div>
                  </div>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 2 : SOMMAIRE EXÉCUTIF & VISION STRATÉGIQUE */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 2) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cadre Directeur</span>
                      <h2 className="text-xl font-black text-slate-900">Sommaire Exécutif & Vision Souveraine</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 02 / 10</span>
                </div>

                {/* Corps de Slide : Grille des 6 Chapitres */}
                <div className="my-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-emerald-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                      01
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Vision & Enjeux Sanitaires</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Plan National d'Approvisionnement (PNA), sécurisation contre les ruptures et souveraineté d'État.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-blue-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                      02
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">WMS & Approvisionnements</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hub Central d'Owendo, gestion des racks FEFO, dédouanement BAE et achats internationaux.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-amber-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                      03
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Distribution & IoT Chaîne Froid</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Suivi GPS en temps réel des convois, balises thermiques +2°C/+8°C et résilience hors-ligne PWA.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-purple-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                      04
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Pharmacie, GMAO & Urgences</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Dispensation hospitalière, maintenance préventive du froid et réserves stratégiques d'État.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-teal-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-black text-sm">
                      05
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Finances, Trésor & CNAMGS</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Rapprochement DGCPT, facturation hospitalière dématérialisée et tiers-payant garanti.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-rose-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
                      06
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Portail Citoyen & Déploiement</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mercuriale publique des prix, disponibilité en direct, accompagnement et appel à l'action.
                    </p>
                  </div>

                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">Office Pharmaceutique National — République Gabonaise</span>
                  <span>Document à diffusion institutionnelle & stratégique</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 3 : DIAGNOSTIC NATIONAL & VALEUR AJOUTÉE */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 3) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Axe Stratégique 1</span>
                      <h2 className="text-xl font-black text-slate-900">Diagnostic Sanitaire & Proposition de Valeur</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 03 / 10</span>
                </div>

                {/* Corps de Slide : Tableau comparatif Avant / Avec OPN Digital Hub */}
                <div className="my-auto py-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Colonne Avant */}
                    <div className="p-5 bg-rose-50/70 rounded-xl border border-rose-200 space-y-4">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-sm border-b border-rose-200 pb-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Défis & Vulnérabilités Antérieures</span>
                      </div>
                      <ul className="space-y-3 text-xs text-rose-900">
                        <li className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold mt-0.5">✕</span>
                          <span><strong>Ruptures récurrentes :</strong> Taux de rupture jusqu'à 40% sur les antibiotiques et antipaludiques en région.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold mt-0.5">✕</span>
                          <span><strong>Angle mort logistique :</strong> Absence de traçabilité thermique des convois sur les axes provinciaux.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold mt-0.5">✕</span>
                          <span><strong>Délais de recouvrement :</strong> Facturation manuelle papier et retards de lettrage Trésor / CNAMGS.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold mt-0.5">✕</span>
                          <span><strong>Opacité des prix :</strong> Surtarification illicite observée sur les médicaments essentiels aux usagers.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Colonne Avec OPN Digital Hub */}
                    <div className="p-5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-4">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm border-b border-emerald-200 pb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Impacts Mesurables avec OPN Digital Hub</span>
                      </div>
                      <ul className="space-y-3 text-xs text-emerald-950">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-700 font-bold shrink-0 mt-0.5" />
                          <span><strong>Autonomie garantie :</strong> Maintien d'un stock de sécurité national minimum de 6 mois (RSSE).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-700 font-bold shrink-0 mt-0.5" />
                          <span><strong>Chaîne du froid 100% certifiée :</strong> Alertes automatiques IoT en cas d'excursion thermique &gt; +8°C.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-700 font-bold shrink-0 mt-0.5" />
                          <span><strong>Trésorerie assainie :</strong> Télétransmission instantanée et rapprochement bancaire avec la DGCPT.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-700 font-bold shrink-0 mt-0.5" />
                          <span><strong>Confiance citoyenne :</strong> Consultation publique de la mercuriale officielle et simulateur CNAMGS.</span>
                        </li>
                      </ul>
                    </div>

                  </div>
                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">Transformation Digitale de la Santé Publique au Gabon</span>
                  <span>Modèle conforme aux directives OMS sur l'accès universel</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 4 : CATALOGUE MODULE 1 - WMS & ACHATS INTERNATIONAUX */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 4) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">Catalogue Solution #1</span>
                      <h2 className="text-xl font-black text-slate-900">WMS Entrepôts Centraux & Achats Internationaux</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 04 / 10</span>
                </div>

                {/* Corps de Slide : 3 Piliers Fonctionnels */}
                <div className="my-auto py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Gestion d'Entrepôt WMS & Racks</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Adressage dynamique par allée/rack/niveau, politiques strictes FEFO/FIFO, gestion des zones de quarantaine pharmaceutique et inventaires tournants avec scan QR Code / GS1.
                    </p>
                    <div className="text-[11px] font-bold text-blue-700 bg-blue-50 p-2 rounded-md">
                      ✓ Hub Central Owendo + 9 Magasins Régionaux
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Achats Internationaux & Incoterms</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Passation de commandes auprès des laboratoires pré-qualifiés OMS (Europe, Inde, Afrique). Gestion multidevise (EUR fixe, USD, INR) et simulation d'Incoterms (CIF Owendo, FOB).
                    </p>
                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-md">
                      ✓ Suivi du fret maritime & aérien en direct
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Dédouanement & Contrôle Qualité</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Génération dématérialisée des déclarations d'importation, gestion du Bon à Enlever (BAE Douanes Gabon) et validation obligatoire des Certificats d'Analyse (COA) avant mise en stock.
                    </p>
                    <div className="text-[11px] font-bold text-purple-700 bg-purple-50 p-2 rounded-md">
                      ✓ Conformité DMP & Régulation Gabonaise
                    </div>
                  </div>

                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-blue-800">Traçabilité Totale du Fabricant International jusqu'au Magasin National</span>
                  <span>Module WMS-OPN v2.6</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 5 : CATALOGUE MODULE 2 - DISTRIBUTION & TÉLÉMÉTRIE IOT */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 5) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Catalogue Solution #2</span>
                      <h2 className="text-xl font-black text-slate-900">Distribution Multimodale & Télémétrie Chaîne du Froid IoT</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 05 / 10</span>
                </div>

                {/* Corps de Slide : Cartographie des flux & Télémétrie */}
                <div className="my-auto py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                      <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        Logistique Multimodale Souveraine
                      </h4>
                      <p className="text-xs text-emerald-950 leading-relaxed">
                        Planification des convois routiers (axes bitumés et pistes latéritiques), liaisons ferroviaires Setrag (Owendo-Franceville) et dessertes fluviales/maritimes (Port-Gentil, Gamba).
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                      <h4 className="font-bold text-sm text-blue-900 flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-blue-700" />
                        Sondes Connectées IoT & Alertes Live
                      </h4>
                      <p className="text-xs text-blue-950 leading-relaxed">
                        Surveillance en temps réel de la température (+2°C à +8°C pour vaccins, -20°C / -80°C pour sérums). Alerte immédiate transmise au Centre Opérationnel de Décision (COD) en cas de bris de froid.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                      <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-700" />
                        Application Chauffeur PWA Hors-Ligne
                      </h4>
                      <p className="text-xs text-amber-950 leading-relaxed">
                        Signature électronique des Bordereaux de Livraison (BL) même en zone blanche sans réseau GSM, avec resynchronisation automatique dès reconnexion.
                      </p>
                    </div>
                  </div>

                  {/* Panneau de Métriques & Télémétrie */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold text-emerald-400 uppercase">Télémétrie Flotte Live</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">100% Connecté</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Température Moyenne</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">+4.2°C</span>
                        <span className="text-[10px] text-emerald-300 block">Conforme (+2/+8)</span>
                      </div>
                      <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Convois Actifs</span>
                        <span className="text-lg font-black text-white font-mono">6 Convois</span>
                        <span className="text-[10px] text-blue-300 block">Sous escorte sécurisée</span>
                      </div>
                      <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Taux de Service</span>
                        <span className="text-lg font-black text-[#FFDE16] font-mono">98.4%</span>
                        <span className="text-[10px] text-slate-300 block">Livraisons conformes</span>
                      </div>
                      <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Temps Moyen Transit</span>
                        <span className="text-lg font-black text-purple-400 font-mono">24-48h</span>
                        <span className="text-[10px] text-slate-300 block">Vers toutes provinces</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
                      Garantie d'intégrité thérapeutique absolue lors des acheminements sensibles.
                    </div>
                  </div>

                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">Sécurité de la Chaîne du Froid Certifiée CEMAC / OMS</span>
                  <span>Module Distribution-IoT v2.6</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 6 : CATALOGUE MODULE 3 - PHARMACIE, GMAO & RSE */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 6) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest block">Catalogue Solution #3</span>
                      <h2 className="text-xl font-black text-slate-900">Pharmacie Hospitalière, GMAO & Réserves d'État</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 06 / 10</span>
                </div>

                {/* Corps de Slide : 3 Axes Hospitaliers */}
                <div className="my-auto py-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Pill className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Dispensation & Pharmacie Clinique</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Gestion des stocks des officines hospitalières (CHU, CHR, HGOPN). Délivrance nominative des ordonnances, traçabilité par patient et alertes automatiques de péremption imminente.
                    </p>
                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-md">
                      ✓ Zéro gaspillage de molécules sensibles
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">GMAO Maintenance Biomédicale</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Gestion de maintenance assistée par ordinateur des équipements critiques : groupes frigorifiques, chambres froides négatives, groupes électrogènes et autoclaves de stérilisation.
                    </p>
                    <div className="text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-md">
                      ✓ Bons d'intervention & traçabilité des pièces
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Réserves Stratégiques d'État (RSSE)</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sanctuarisation des stocks d'urgence nationale (antivenins, réactifs choléra, solutés massifs, anesthésiques). Déstockage sécurisé sur ordre exclusif de la Direction Générale / Ministère.
                    </p>
                    <div className="text-[11px] font-bold text-rose-800 bg-rose-50 p-2 rounded-md">
                      ✓ Réactivité immédiate en cas de crise sanitaire
                    </div>
                  </div>

                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-purple-800">Continuité des Soins & Sécurité Hospitalière</span>
                  <span>Module Hospitalier-GMAO v2.6</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 7 : CATALOGUE MODULE 4 - FINANCES, TRÉSOR & CNAMGS */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 7) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest block">Catalogue Solution #4</span>
                      <h2 className="text-xl font-black text-slate-900">Écosystème Financier : Trésor Public, DGCPT & CNAMGS</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 07 / 10</span>
                </div>

                {/* Corps de Slide : Workflow Financier Intégré */}
                <div className="my-auto py-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <Landmark className="w-4 h-4 text-emerald-600" />
                        <span>Rapprochement Trésor Public</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Émission automatique des ordres de recettes et titres de perception. Lettrage bancaire synchronisé avec la Direction Générale de la Comptabilité Publique et du Trésor (DGCPT).
                      </p>
                      <div className="text-[11px] font-mono font-bold text-emerald-700">
                        Écart de lettrage : 0 FCFA garanti
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <Receipt className="w-4 h-4 text-blue-600" />
                        <span>Tiers-Payant CNAMGS</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Télétransmission des feuilles de soins et bordereaux de facturation CNAMGS selon les 3 régimes (GEF, Secteur Privé, Indigents). Réduction des délais de paiement de 180 à 25 jours.
                      </p>
                      <div className="text-[11px] font-mono font-bold text-blue-700">
                        Prise en charge moyenne : 80% à 100%
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <Coins className="w-4 h-4 text-amber-600" />
                        <span>Marchés Publics & Fournisseurs</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Publication des DAO (Dossiers d'Appels d'Offres), gestion transparente des soumissions, des cautions bancaires et des ordres de service conformément au Code des Marchés Publics du Gabon.
                      </p>
                      <div className="text-[11px] font-mono font-bold text-amber-700">
                        Traçabilité 100% auditable
                      </div>
                    </div>

                  </div>

                  {/* Bilan Budgétaire PNA */}
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 block">Contrôle de Gestion & Engagement Budgétaire PNA 2026</span>
                      <span className="text-emerald-800">Toutes les dépenses sont adossées aux lignes budgétaires votées par le Conseil d'Administration.</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Taux d'Exécution</span>
                        <span className="text-base font-black text-emerald-700 font-mono">75.0%</span>
                      </div>
                      <div className="h-8 w-px bg-emerald-300" />
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Recouvrement</span>
                        <span className="text-base font-black text-blue-700 font-mono">92.8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-teal-800">Gouvernance Financière & Intégrité Comptable de l'État</span>
                  <span>Module Facturation-Trésor v2.6</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 8 : CATALOGUE MODULE 5 - PORTAIL PUBLIC & CITOYEN */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 8) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Catalogue Solution #5</span>
                      <h2 className="text-xl font-black text-slate-900">Portail Public Citoyen & Transparence Républicaine</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 08 / 10</span>
                </div>

                {/* Corps de Slide : 4 Services aux Usagers */}
                <div className="my-auto py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Search className="w-4 h-4 text-emerald-600" />
                      <span>1. Recherche & Disponibilité Nationale</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Recherche instantanée par DCI, marque ou code CIP. Affichage en direct du stock disponible dans les CHU, CHR et pharmacies hospitalières de chaque province.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Coins className="w-4 h-4 text-blue-600" />
                      <span>2. Mercuriale Officielle & Simulateur CNAMGS</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Publication des prix publics plafonnés. Simulateur interactif calculant le ticket modérateur exact exigible selon le statut d'assuré (GEF, Travailleur, Indigent).
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span>3. Pharmacies de Garde Géolocalisées</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cartographie dynamique des officines et pharmacies de garde 24h/24 et 7j/7 sur Libreville, Port-Gentil, Franceville, Oyem et l'ensemble du territoire national.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      <span>4. Signalement Citoyen & Anti-Fraude</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Canal sécurisé permettant aux citoyens de signaler les surtarifications illicites, les refus de prise en charge ou les suspicions de médicaments contrefaits.
                    </p>
                  </div>

                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">Transparence Totale & Service Public d'Accès aux Médicaments</span>
                  <span>Portail Citoyen Libre d'Accès</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 9 : ARCHITECTURE TECHNIQUE & SÉCURITÉ MILITAIRE */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 9) && (
              <div className="slide-deck-page bg-white text-slate-900 rounded-xl border border-slate-200 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">Socle Technologique</span>
                      <h2 className="text-xl font-black text-slate-900">Architecture Souveraine, Sécurité & Haute Résilience</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 09 / 10</span>
                </div>

                {/* Corps de Slide : Grille des Atouts Techniques */}
                <div className="my-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900">Chiffrement de Bout en Bout</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Chiffrement AES-256 au repos et TLS 1.3 en transit. Horodatage légal SHA-256 sur toutes les signatures d'affectation et de validation.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900">Matrice RBAC Granulaire</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Gestion stricte des habilitations pour 14 profils institutionnels (DG, DAF, Pharmacien, Logisticien, Trésor, Douanes, Gouvernance).
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900">Cluster Haute Disponibilité</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Architecture API multi-processus avec répartition de charge, réplication synchrone et bascule automatique 99.98% SLA.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900">Offline-First Résilient</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Application PWA garantissant la saisie des opérations de stock et livraisons même en cas de coupure réseau prolongée.
                    </p>
                  </div>

                </div>

                {/* Footer de Slide */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">Hébergement Souverain Gabonais — Datacenter National ANINF</span>
                  <span>Conformité RGPD & Règlementation Nationale</span>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* SLIDE 10 : APPEL À L'ACTION & CONTACTS OFFICIELS (CTA FINAL) */}
            {/* =================================================================== */}
            {(viewMode === 'all' || currentSlide === 10) && (
              <div className="slide-deck-page bg-gradient-to-br from-slate-950 via-slate-900 to-[#0B1E38] text-white rounded-xl border border-slate-800 p-8 sm:p-12 shadow-2xl min-h-[580px] flex flex-col justify-between relative overflow-hidden print:rounded-none print:border-none print:shadow-none print:break-after-page print:min-h-[210mm] print:h-[210mm]">
                
                {/* Ruban Tricolore Gabonais */}
                <div className="absolute top-0 left-0 right-0 h-2.5 flex">
                  <div className="flex-1 bg-[#00A651]" />
                  <div className="flex-1 bg-[#FFDE16]" />
                  <div className="flex-1 bg-[#2E68B4]" />
                </div>

                {/* Header de Slide */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <OpnLogo className="h-10 w-auto" theme="white" />
                    <div>
                      <span className="text-[10px] font-bold text-[#FFDE16] uppercase tracking-widest block">Phase d'Engagement</span>
                      <h2 className="text-xl font-black text-white">Déploiement, Partenariats & Appel à l'Action</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Slide 10 / 10</span>
                </div>

                {/* Corps de Slide : 3 Étapes de Déploiement & CTA Principal */}
                <div className="my-auto py-6 space-y-6 relative z-10">
                  
                  {/* Les 3 Étapes d'Intégration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                      <div className="text-[#FFDE16] font-black text-sm">Étape 1 : Cadrage & Audit</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Audit des infrastructures hospitalières, inventaire physique initial et paramétrage des catalogues DCI provinciaux.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                      <div className="text-emerald-400 font-black text-sm">Étape 2 : Déploiement & IoT</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Installation des balises thermiques, interconnexion Trésor/CNAMGS et formation des pharmaciens et logisticiens.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
                      <div className="text-blue-400 font-black text-sm">Étape 3 : Pilotage National</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Supervision live par le COD Central, rapports d'audit mensuels et infogérance haute disponibilité 24/7.
                      </p>
                    </div>
                  </div>

                  {/* Bloc Call to Action VIP */}
                  <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 rounded-2xl border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 max-w-xl text-center md:text-left">
                      <h3 className="text-lg font-black text-white">
                        Prêt à Transformer la Chaîne Pharmaceutique Nationale ?
                      </h3>
                      <p className="text-xs text-slate-300">
                        Prenez contact avec la Direction Générale de l'OPN pour planifier une démonstration exécutive ou lancer un audit pilote sur votre structure sanitaire.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          alert("Votre demande de démonstration exécutive a été enregistrée auprès du Cabinet de la Direction Générale de l'OPN.");
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#00A651] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer"
                      >
                        Demander une Démo Exécutive
                      </button>
                    </div>
                  </div>

                </div>

                {/* Coordonnées Officielles OPN */}
                <div className="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-300 relative z-10">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Siège Social OPN, Zone Industrielle d'Oloumi, B.P. 518 Libreville, Gabon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Ligne Verte & Standard : +241 11 72 00 00 / 074 00 00 00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#FFDE16] shrink-0" />
                    <span>Portail Officiel : https://hub.opn.ga | contact@opn.ga</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
