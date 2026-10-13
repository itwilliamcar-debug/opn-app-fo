import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Pill, 
  Truck, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  Bell,
  Lock,
  ChevronRight,
  Download,
  Search,
  AlertTriangle,
  Award,
  Layers,
  Send,
  Calendar,
  Briefcase,
  HelpCircle,
  ExternalLink,
  X,
  Globe,
  Radio,
  HeartPulse,
  Printer,
  Filter,
  Check,
  FileSpreadsheet,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { PHARMACEUTICAL_CATALOG, PRODUCT_FAMILIES_LIST } from '../../data/pharmaceuticalData';
import { formatXAF } from '../../utils/formatters';
import { exportProductsToCSV, openOfficialPrintableCatalog } from '../../utils/exportCatalog';
import { downloadOfficialHtml } from '../../utils/downloadHelpers';
import { persistContactMessage } from '../../utils/localPersistence';
import OpnLogo from '../common/OpnLogo';
import GabonOfficialInteractiveMap from '../common/GabonOfficialInteractiveMap';
import CatalogPdfModal from './CatalogPdfModal';
import NewsletterEmailModal from './NewsletterEmailModal';
import { MarchesPublicsSection } from './MarchesPublicsSection';
import { API_BASE_URL } from '../../services/apiOrigin';

export default function PublicPortal({ 
  onAccessWorkspace, 
  activeNavTab = 'accueil', 
  setActiveNavTab,
  onOpenPlaquette
}) {
  const [selectedProvinceId, setSelectedProvinceId] = useState('G1');
  const [searchDci, setSearchDci] = useState('');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState('TOUTES LES FAMILLES');
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedArticleModal, setSelectedArticleModal] = useState(null);
  const [selectedTenderModal, setSelectedTenderModal] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    objet: 'Demande d\'information générale',
    message: ''
  });

  // États pour l'Automatisation de la Newsletter OPN
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [newsletterDispatchedArticle, setNewsletterDispatchedArticle] = useState(null);
  const [isFirstNewsletter, setIsFirstNewsletter] = useState(true);
  const [subscribersCount, setSubscribersCount] = useState(() => {
    const saved = localStorage.getItem('opn_newsletter_subscribers_count');
    return saved ? parseInt(saved, 10) : 156;
  });
  const [newsletterToast, setNewsletterToast] = useState(null);

  const selectedProvince = GABON_PROVINCES.find(p => p.id === selectedProvinceId) || GABON_PROVINCES[0];

  // 4 Grandes Missions Stratégiques
  const statutoryMissions = [
    {
      title: "Approvisionnement Centralisé",
      desc: "Achat groupé et négociation de prix préférentiels auprès des laboratoires internationaux pour garantir les meilleurs tarifs.",
      icon: Building2,
      accent: "border-l-4 border-l-[#2E68B4]"
    },
    {
      title: "Traçabilité & Qualité FEFO",
      desc: "Contrôle strict des lots, surveillance de la chaîne du froid 2°C–8°C et conformité aux standards de l'OMS.",
      icon: ShieldCheck,
      accent: "border-l-4 border-l-[#00A651]"
    },
    {
      title: "Distribution 9 Provinces",
      desc: "Logistique multimodale (Route RN1/RN2, Rail Setrag, Maritime) reliant le Hub d'Owendo aux 9 antennes provinciales.",
      icon: Truck,
      accent: "border-l-4 border-l-[#FFDE16]"
    },
    {
      title: "Tarifs Réglementés & Accessibilité",
      desc: "Application stricte des prix encadrés en FCFA pour que chaque citoyen gabonais accède aux soins essentiels.",
      icon: Pill,
      accent: "border-l-4 border-l-[#2E68B4]"
    }
  ];

  // 4 Actualités Officielles
  const articles = [
    {
      id: "ACT-01",
      title: "Réception de 45 tonnes de solutés massifs au Hub Central d'Owendo",
      date: "06 Septembre 2026",
      tag: "Logistique & Approvisionnement",
      tagColor: "bg-[#2E68B4] text-white",
      summary: "Arrivée au port d'Owendo d'un convoi maritime prioritaire composé de chlorure de sodium, glucose et solutés de réanimation destinés aux CHU et hôpitaux régionaux.",
      content: "La Direction Générale de l'OPN a supervisé la réception de 45 tonnes métriques de solutés massifs. Ce lot stratégique permet de sécuriser 90 jours d'autonomie pour les 9 provinces du Gabon. Le dispatching vers les antennes de l'intérieur du pays a débuté ce matin via le convoi ferroviaire Setrag et des camions sécurisés climatisés."
    },
    {
      id: "ACT-02",
      title: "Déploiement du système de traçabilité numérique dans la Ngounié et la Nyanga",
      date: "02 Septembre 2026",
      tag: "Transformation Digitale",
      tagColor: "bg-[#00A651] text-white",
      summary: "Les antennes de Mouila et Tchibanga sont désormais interconnectées en temps réel avec le Hub Central d'Owendo pour le suivi FEFO des stocks.",
      content: "Dans le cadre du plan de modernisation souverain, les pharmaciens des antennes provinciales de Mouila et Tchibanga ont été dotés de terminaux durcis connectés. Ce système permet la télétransmission instantanée des bordereaux de livraison et la détection prédictive des tensions de stock."
    },
    {
      id: "ACT-03",
      title: "Homologation de la nouvelle grille tarifaire des antipaludiques et antibiotiques",
      date: "28 Août 2026",
      tag: "Réglementation & Tarifs",
      tagColor: "bg-[#2E68B4] text-white",
      summary: "Publication officielle du catalogue des prix plafonds garantis par l'État pour protéger le pouvoir d'achat des populations.",
      content: "En concertation avec le Ministère de la Santé et les partenaires institutionnels, l'OPN a harmonisé les prix de 120 molécules prioritaires. Les tarifs sont affichés de manière transparente dans l'ensemble des pharmacies hospitalières et officines agréées."
    },
    {
      id: "ACT-04",
      title: "Audit de sécurité de la chaîne du froid dans les 9 antennes provinciales",
      date: "20 Août 2026",
      tag: "Qualité & Sécurité",
      tagColor: "bg-[#00A651] text-white",
      summary: "Certification de conformité des chambres froides solaires 2°C–8°C garantissant l'intégrité des vaccins et insulines.",
      content: "Une mission conjointe de la Direction Technique et d'experts biomédicaux a audité les installations de stockage des 9 chefs-lieux de province. Toutes les chambres froides équipées d'onduleurs solaires sont certifiées conformes aux normes OMS."
    }
  ];

  // Marchés Publics & Appels d'Offres (AAON / AAOI)
  const marchesPublics = [
    {
      id: "MP-2026-014",
      ref: "Avis N° 014/OPN/DG/DMP/2026",
      titre: "Fourniture & Acheminement de solutés massifs, insulines et antibiotiques hospitaliers",
      type: "Appel d'Offres International (AOI)",
      dateLimite: "28 Octobre 2026 à 12h00",
      budget: 850000000,
      statut: "EN_COURS",
      caution: "17 000 000 FCFA (2%)",
      cahierCharges: "DAO_Solutes_Massifs_2026.pdf",
      description: "Acquisition de consommables hospitaliers et solutés injectables pour le compte des hôpitaux publics des 9 provinces du Gabon."
    },
    {
      id: "MP-2026-015",
      ref: "Avis N° 015/OPN/DG/DMP/2026",
      titre: "Acquisition de 9 conteneurs isothermes solaires 2°C–8°C pour les Antennes Provinciales",
      type: "Appel d'Offres National (AON)",
      dateLimite: "15 Novembre 2026 à 15h30",
      budget: 320000000,
      statut: "EN_COURS",
      caution: "6 400 000 FCFA (2%)",
      cahierCharges: "DAO_Chaine_Froid_Antennes.pdf",
      description: "Installation et maintenance de conteneurs autonomes à énergie solaire pour la sécurisation des vaccins et produits thermosensibles."
    },
    {
      id: "MP-2026-016",
      ref: "Avis N° 016/OPN/DG/DMP/2026",
      titre: "Maintenance préventive et curative des groupes électrogènes et chambres froides du Hub Owendo",
      type: "Appel d'Offres National (AON)",
      dateLimite: "05 Novembre 2026 à 11h00",
      budget: 115000000,
      statut: "EN_COURS",
      caution: "2 300 000 FCFA (2%)",
      cahierCharges: "DAO_Maintenance_Owendo.pdf",
      description: "Contrat de maintenance triennal pour les infrastructures critiques de stockage pharmaceutique d'Owendo."
    }
  ];

  // Filtrage Dynamique Avancé du Catalogue National OPN
  const filteredMedicaments = PHARMACEUTICAL_CATALOG.filter(m => {
    const q = searchDci.trim().toLowerCase();
    const matchSearch = !q || 
      (m.dci || '').toLowerCase().includes(q) ||
      (m.designation || '').toLowerCase().includes(q) ||
      (m.dosage || '').toLowerCase().includes(q) ||
      (m.code || '').toLowerCase().includes(q) ||
      (m.forme || '').toLowerCase().includes(q) ||
      (m.famille || m.categorie || '').toLowerCase().includes(q) ||
      (m.laboratoire || '').toLowerCase().includes(q);

    const matchFamily = selectedFamilyFilter === 'TOUTES LES FAMILLES' || 
      (m.famille || m.categorie || '').toLowerCase().includes(selectedFamilyFilter.toLowerCase());

    const matchAvailability = selectedAvailabilityFilter === 'ALL' ||
      (selectedAvailabilityFilter === 'DISPONIBLE' && (m.statut === 'DISPONIBLE' || m.statut === 'STOCK_NORMAL')) ||
      (selectedAvailabilityFilter === 'VIGILANCE' && (m.statut === 'STOCK_FAIBLE' || m.statut === 'STOCK_CRITIQUE'));

    return matchSearch && matchFamily && matchAvailability;
  });

  // Calculs de pagination
  const totalItems = filteredMedicaments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedMedicaments = itemsPerPage === 'ALL' 
    ? filteredMedicaments 
    : filteredMedicaments.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);

  const handleExportCSV = () => {
    exportProductsToCSV(filteredMedicaments, selectedFamilyFilter);
  };

  const handlePrint = () => {
    openOfficialPrintableCatalog(filteredMedicaments, selectedFamilyFilter, searchDci, 'print');
  };

  const handleSavePDF = () => {
    openOfficialPrintableCatalog(filteredMedicaments, selectedFamilyFilter, searchDci, 'save_pdf');
  };

  const handleNewsletterSubscribe = async (e) => {
    if (e) e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@') || !newsletterEmail.includes('.')) {
      setNewsletterToast('Indiquez une adresse e-mail valide (ex. jean.obiang@sante.ga).');
      setTimeout(() => setNewsletterToast(null), 4000);
      return;
    }

    const emailTrimmed = newsletterEmail.trim();
    const savedList = JSON.parse(localStorage.getItem('opn_newsletter_subscribers') || '[]');
    const isNew = !savedList.includes(emailTrimmed);
    if (isNew) {
      savedList.push(emailTrimmed);
      localStorage.setItem('opn_newsletter_subscribers', JSON.stringify(savedList));
      const newCount = subscribersCount + 1;
      setSubscribersCount(newCount);
      localStorage.setItem('opn_newsletter_subscribers_count', newCount.toString());
    }

    let apiOk = false;
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: emailTrimmed }),
      });
      apiOk = res.ok;
    } catch {
      apiOk = false;
    }

    setIsFirstNewsletter(true);
    setNewsletterDispatchedArticle(articles[0]);
    setIsNewsletterModalOpen(true);
    setNewsletterToast(
      apiOk
        ? `Abonnement enregistré pour ${emailTrimmed} (serveur OPN + local).`
        : `Abonnement enregistré localement pour ${emailTrimmed}. Aperçu de la newsletter ouvert.`
    );
    setTimeout(() => setNewsletterToast(null), 5000);
  };

  const handleBroadcastArticle = async (articleToBroadcast) => {
    const targetArticle = articleToBroadcast || articles[0];
    let apiOk = false;
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          article_id: targetArticle.id,
          title: targetArticle.title,
          summary: targetArticle.summary,
          content: targetArticle.content,
          date: targetArticle.date,
          tag: targetArticle.tag,
        }),
      });
      apiOk = res.ok;
    } catch {
      apiOk = false;
    }

    setIsFirstNewsletter(false);
    setNewsletterDispatchedArticle(targetArticle);
    setIsNewsletterModalOpen(true);
    setNewsletterToast(
      apiOk
        ? `Article « ${targetArticle.title} » diffusé aux abonnés enregistrés (${subscribersCount}).`
        : `Aperçu préparé pour « ${targetArticle.title} » — diffusion serveur indisponible, ${subscribersCount} abonné(s) en local.`
    );
    setTimeout(() => setNewsletterToast(null), 6000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.nom?.trim() || !contactForm.email?.includes('@') || !contactForm.message?.trim()) {
      setNewsletterToast('Complétez nom, e-mail et message avant l’envoi.');
      setTimeout(() => setNewsletterToast(null), 4000);
      return;
    }
    const saved = persistContactMessage(contactForm);
    downloadOfficialHtml(`recepisse-contact-${saved.id}`, {
      title: `Récépissé de message — ${saved.id}`,
      subtitle: contactForm.objet,
      bodyLines: [
        `<strong>Expéditeur :</strong> ${contactForm.nom}`,
        `<strong>E-mail :</strong> ${contactForm.email}`,
        `<strong>Téléphone :</strong> ${contactForm.telephone || '—'}`,
        `<strong>Message :</strong> ${contactForm.message}`,
        `Votre demande a été enregistrée auprès de l’OPN (référence ${saved.id}). Un agent du secrétariat vous répondra sous 48 h ouvrées.`,
      ],
    });
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        nom: '',
        email: '',
        telephone: '',
        objet: "Demande d'information générale",
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#00A651] selection:text-white flex flex-col justify-between">
      
      <div>
        {/* =========================================================================
            VUE 1 : ACCUEIL
        ========================================================================= */}
        {activeNavTab === 'accueil' && (
          <div className="animate-in fade-in duration-200">
            
            {/* HERO BANNER PRINCIPAL */}
            <section className="relative bg-gradient-to-br from-[#163E75] via-[#235BA8] to-[#0F2B52] text-white py-14 lg:py-18 overflow-hidden border-b border-blue-900/40">
              
              {/* Animation d'Arrière-Plan Santé Épurée & Neutre (Sans flou - Fond net & pro) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* 1. Grille de points subtile et nette */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* 2. Ligne d'Onde Santé / ECG Fluide & Nette */}
                <svg 
                  className="absolute inset-x-0 bottom-0 w-full h-36 opacity-25 stroke-cyan-300"
                  viewBox="0 0 1200 120" 
                  fill="none" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M0,60 L200,60 L220,60 L230,20 L240,100 L250,40 L260,75 L270,60 L500,60 L520,60 L530,15 L540,105 L550,35 L560,80 L570,60 L800,60 L820,60 L830,25 L840,95 L850,45 L860,70 L870,60 L1200,60" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-ecg"
                  />
                </svg>

                {/* 3. Particules Flottantes Médicales Épurées */}
                <div className="absolute top-16 left-[15%] text-emerald-300/30 text-xl font-bold select-none animate-float-slow">
                  +
                </div>
                <div className="absolute top-32 right-[20%] text-cyan-200/30 text-2xl font-bold select-none animate-float-reverse">
                  +
                </div>
                <div className="absolute bottom-20 left-[45%] text-white/20 text-lg font-bold select-none animate-float-slow">
                  +
                </div>
                <div className="absolute top-12 right-[40%] w-7 h-7 rounded-full border border-emerald-300/25 animate-float-reverse" />
                <div className="absolute bottom-16 right-[12%] w-10 h-10 rounded-full border border-cyan-300/25 animate-float-slow" />
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Colonne Gauche */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white shadow-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_8px_#00FF87]" />
                      <span className="text-white font-semibold tracking-wide uppercase text-[11px]">CENTRALE D'ACHAT DU MÉDICAMENT</span>
                    </div>

                    {/* Titre : Office (Blanc), Pharmaceutique (Jaune Or), National (Blanc) */}
                    <h1 className="text-3xl sm:text-5xl lg:text-[44px] font-black tracking-tight leading-[1.12]">
                      <span className="text-white">Office </span>
                      <span className="text-[#FFDE16]">Pharmaceutique </span>
                      <span className="text-white">National</span>
                    </h1>

                    {/* Paragraphe avec disponibilité en blanc */}
                    <p className="text-sm sm:text-base text-blue-100/95 max-w-2xl leading-relaxed font-normal">
                      Garantir la <span className="text-white font-semibold">disponibilité permanente</span>, la <span className="text-[#FFDE16] font-semibold">qualité certifiée</span> et l'<span className="text-white font-semibold">accessibilité tarifaire</span> des médicaments essentiels pour toutes les structures sanitaires du Gabon.
                    </p>

                    {/* Chiffres clés : 9 en Blanc, 100% en Blanc, 350+ en Blanc */}
                    <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                      <div className="bg-white/10 border border-white/15 p-3.5 rounded-lg hover:bg-white/15 transition-all shadow-sm">
                        <p className="text-2xl sm:text-3xl font-black text-white">9</p>
                        <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mt-0.5">Antennes Provinciales</p>
                      </div>
                      <div className="bg-white/10 border border-white/15 p-3.5 rounded-lg hover:bg-white/15 transition-all shadow-sm">
                        <p className="text-2xl sm:text-3xl font-black text-white">100 %</p>
                        <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mt-0.5">Chaîne du Froid</p>
                      </div>
                      <div className="bg-white/10 border border-white/15 p-3.5 rounded-lg hover:bg-white/15 transition-all shadow-sm">
                        <p className="text-2xl sm:text-3xl font-black text-white">350+</p>
                        <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mt-0.5">Médicaments DCI</p>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <button
                        onClick={onAccessWorkspace}
                        className="px-5 py-2.5 rounded-lg bg-[#00A651] hover:bg-[#008742] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 hover:shadow-[0_4px_16px_rgba(0,166,81,0.35)] cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Accéder à l'Espace Métier (ERP)</span>
                      </button>

                      <button
                        onClick={() => setActiveNavTab('produits')}
                        className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#2E68B4] font-semibold text-xs shadow-xs transition-colors cursor-pointer border border-white/40"
                      >
                        Consulter les Tarifs DCI
                      </button>
                    </div>

                  </div>

                  {/* Colonne Droite : Suivi Logistique avec Voyant Étincelant */}
                  <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/15 pb-3">
                      
                      {/* Voyant Étincelant & Titre */}
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center w-3 h-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75" />
                          <span className="animate-twinkle absolute inline-flex h-3 w-3 rounded-full bg-[#00FF87]/40 shadow-[0_0_12px_#00FF87]" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87] shadow-[0_0_8px_#00FF87]" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          Suivi Logistique en Direct
                        </span>
                      </div>

                      {/* Badge Hub Owendo avec halo doux */}
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#00FF87] border border-emerald-400/30 backdrop-blur-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,135,0.15)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
                        Hub Owendo Opérationnel
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-blue-100">
                      <div className="flex items-center justify-between p-2.5 bg-black/25 rounded-md border border-white/10 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-[#00A651] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            G2
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Wagon Setrag N°884</p>
                            <p className="text-[10px] text-blue-200">Owendo ➔ Franceville (36h)</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#00FF87] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">En Transit</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-black/25 rounded-md border border-white/10 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-[#2E68B4] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            G8
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Convoi Maritime N°12</p>
                            <p className="text-[10px] text-blue-200">Port-Gentil (12h)</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">À Quai</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-black/25 rounded-md border border-white/10 hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-[#DC143C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            G4
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Chaîne du Froid 2°C–8°C</p>
                            <p className="text-[10px] text-blue-200">Mouila & Ndendé</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#FFDE16] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">Contrôle OK</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200">
                      <span>Régulation : <strong className="text-white">ANINF / CNPDCP</strong></span>
                      <span>Devise : <strong className="text-white font-bold">Franc CFA (FCFA XAF)</strong></span>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* LES 4 MISSIONS STRATÉGIQUES */}
            <section className="py-8 -mt-5 relative z-20 max-w-7xl mx-auto px-4 sm:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statutoryMissions.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div 
                      key={idx} 
                      className={`bg-white rounded-md p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all ${m.accent}`}
                    >
                      <div className="w-9 h-9 rounded-md bg-slate-100 text-[#2E68B4] flex items-center justify-center mb-2.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* MOT DU DIRECTEUR GÉNÉRAL COLONEL ANNIE JOSETTE POATY */}
            <section className="py-12 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  
                  {/* Portrait Plein Cadre */}
                  <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[420px] bg-slate-900 flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
                    <img 
                      src="/dg-annie-josette-poaty.jpg" 
                      alt="Colonel Annie Josette POATY - Directeur Général OPN" 
                      className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.98]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3B] via-[#0A1E3B]/30 to-transparent z-10" />

                    <div className="relative z-20 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[#00A651] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Direction Générale
                      </span>
                      <span className="text-[10px] text-white font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs border border-white/20">
                        République Gabonaise
                      </span>
                    </div>

                    <div className="relative z-20 text-white space-y-1">
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                        Directeur Général de l'OPN
                      </p>
                      <h4 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
                        Colonel Annie Josette POATY
                      </h4>
                      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                        <span>Centrale Nationale d'Achat du Médicament</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Institutionnel */}
                  <div className="lg:col-span-7 bg-[#2E68B4] text-white p-7 sm:p-9 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Engagements & Vision Stratégique
                      </div>

                      <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                        « Le médicament pour tous, partout au Gabon »
                      </h3>

                      <blockquote className="text-xs sm:text-sm text-blue-100 leading-relaxed italic space-y-3">
                        <p>
                          « L'Office Pharmaceutique National s'engage résolument dans la refondation de notre chaîne logistique de santé. Notre mission régalienne est de faire en sorte qu'aucun centre de santé, de Libreville à Makokou, de Port-Gentil à Tchibanga, ne connaisse de rupture sur les molécules vitales. »
                        </p>
                        <p>
                          « Grâce à la numérisation des approvisionnements, au calcul rigoureux de la CMM et à la rigueur militaire de notre gestion, nous garantissons l'intégrité de la chaîne du froid, la traçabilité par lot (FEFO) et la stricte application des prix réglementés en Franc CFA. »
                        </p>
                      </blockquote>
                    </div>

                    <div className="pt-4 border-t border-blue-400/30 flex items-center justify-between">
                      <div className="text-xs text-blue-100">
                        <strong className="text-white block font-bold">Colonel Annie Josette POATY</strong>
                        <span className="text-[11px] text-emerald-300">Directeur Général de l'Office Pharmaceutique National</span>
                      </div>

                      <button 
                        onClick={() => setActiveNavTab('antennes')}
                        className="px-4 py-2 rounded bg-[#00A651] hover:bg-[#008742] text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5"
                      >
                        <span>Voir les 9 Antennes Provinciales</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* MAILLAGE TERRITORIAL : LES 9 ANTENNES PROVINCIALES AVEC CARTE SVG INTERACTIVE */}
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#00A651] text-xs font-bold uppercase tracking-wider mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                      Maillage territorial
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E68B4] tracking-tight">
                      Nos 9 Antennes Provinciales
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                    Distribution continue et coordination logistique depuis le Hub Central d'Owendo vers chaque chef-lieu de province.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Colonne Gauche : Fiche de l'antenne sélectionnée */}
                  <div className="lg:col-span-6 bg-slate-50 p-5 sm:p-7 rounded-md border border-slate-200 space-y-3.5 flex flex-col justify-between h-full shadow-xs">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded bg-[#2E68B4] text-white font-bold text-xs">
                          Province {selectedProvince.id} – {selectedProvince.nom}
                        </span>
                        <span className="text-xs font-bold text-[#00A651] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Délai Owendo : {selectedProvince.leadTimeJours} Jours
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#2E68B4]">
                          Antenne de {selectedProvince.chefLieu} ({selectedProvince.villeAntenne})
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">{selectedProvince.description}</p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-200 space-y-2 text-xs text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Pharmacien Responsable :</span>
                          <span className="font-bold text-slate-900">{selectedProvince.responsable}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Mode de Transit Principal :</span>
                          <span className="font-semibold text-[#2E68B4]">{selectedProvince.modeTransport}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Ligne Directe Antenne :</span>
                          <span className="font-bold text-[#00A651]">{selectedProvince.contact}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Stock Local Estimé :</span>
                          <span className="font-bold text-[#2E68B4]">{formatXAF(selectedProvince.stockValeurXAF)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Autonomie de Couverture :</span>
                          <span className="font-bold text-slate-900">{selectedProvince.couvertureJours} Jours d'autonomie</span>
                        </div>
                      </div>
                    </div>

                    {/* Sélecteur Rapide */}
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Choisir une Province :</p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                        {GABON_PROVINCES.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedProvinceId(p.id)}
                            className={`p-1.5 rounded text-center text-xs transition-all ${
                              p.id === selectedProvinceId
                                ? 'bg-[#2E68B4] text-white font-bold shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="font-bold text-[11px]">{p.id}</div>
                            <div className="text-[9px] truncate">{p.chefLieu}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Colonne Droite : Carte Interactive SVG Officielle */}
                  <div className="lg:col-span-6 bg-white p-5 sm:p-7 rounded-md border border-slate-200 shadow-sm flex flex-col justify-between h-full relative">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#00A651]" />
                        <span className="text-xs font-bold text-slate-800">
                          Cartographie Officielle Interactive
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#2E68B4] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        9 Provinces Actives
                      </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center py-2 w-full">
                      <GabonOfficialInteractiveMap
                        selectedProvinceId={selectedProvinceId}
                        onSelectProvince={(pId) => setSelectedProvinceId(pId)}
                        className="w-full h-full max-h-[360px]"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-center">
                      <p className="text-[11px] text-slate-500">
                        Cliquez sur n'importe quelle province sur la carte pour inspecter ses indicateurs logistiques.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* APERÇU ACTUALITÉS & MARCHÉS PUBLICS EN ACCUEIL */}
            <section className="py-12 bg-[#F4F5F7] border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
                
                {/* 1. Actualités Récentes */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#00A651] text-xs font-bold uppercase tracking-wider mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                        Communiqués & Événements
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#2E68B4] tracking-tight">
                        Dernières Actualités de l'OPN
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveNavTab('actualites')}
                      className="px-4 py-2 bg-white hover:bg-slate-50 text-[#2E68B4] border border-[#2E68B4] text-xs font-bold rounded shadow-xs flex items-center gap-1"
                    >
                      <span>Toutes les actualités</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {articles.slice(0, 4).map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                            {item.tag}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">{item.date}</span>
                        </div>
                        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-[#2E68B4] transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {item.summary}
                            </p>
                          </div>
                          <button 
                            onClick={() => setSelectedArticleModal(item)}
                            className="text-xs font-bold text-[#00A651] hover:text-[#008742] flex items-center gap-1 pt-2 border-t border-slate-100 w-full justify-between"
                          >
                            <span>Lire l'article</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Marchés Publics Récents */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#00A651] text-xs font-bold uppercase tracking-wider mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                        Commande Publique
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#2E68B4] tracking-tight">
                        Appels d'Offres & Marchés Publics en Cours
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveNavTab('marches')}
                      className="px-4 py-2 bg-white hover:bg-slate-50 text-[#2E68B4] border border-[#2E68B4] text-xs font-bold rounded shadow-xs flex items-center gap-1"
                    >
                      <span>Tous les marchés publics</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {marchesPublics.slice(0, 3).map((mp) => (
                      <div 
                        key={mp.id} 
                        className="bg-white rounded-md border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-all shadow-xs"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E68B4] text-white">
                              {mp.type}
                            </span>
                            <span className="text-[10px] font-bold text-[#00A651] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              En cours
                            </span>
                          </div>

                          <div>
                            <span className="font-mono text-[10px] text-slate-500 block">{mp.ref}</span>
                            <h4 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">{mp.titre}</h4>
                          </div>

                          <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Budget :</span>
                              <span className="font-bold text-[#2E68B4]">{formatXAF(mp.budget)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Limite :</span>
                              <span className="font-bold text-rose-600">{mp.dateLimite}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200">
                          <button
                            onClick={() => setSelectedTenderModal(mp)}
                            className="w-full py-1.5 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Consulter & Soumettre</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* =========================================================================
            VUE 2 : PRODUITS (DCI) - CATALOGUE NATIONAL OFFICIEL OPN
        ========================================================================= */}
        {activeNavTab === 'produits' && (
          <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
            
            {/* Bannière d'en-tête Institutionnelle */}
            <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2E68B4] to-[#0f766e] rounded-xl p-6 sm:p-8 text-white shadow-md mb-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-end pointer-events-none pr-6">
                <OpnLogo className="h-64 w-auto" variant="symbol" />
              </div>

              <div className="relative z-10 max-w-3xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  PRODUITS DISPONIBILITÉS — CATALOGUE OFFICIEL (DCI)
                </h1>
                
                <p className="text-sm sm:text-base text-blue-100 mt-2 leading-relaxed">
                  Centrale Nationale d'Achat du Médicament. Consultez l'ensemble des médicaments essentiels, solutés massifs, produits d'urgence vitale et dispositifs médico-chirurgicaux homologués avec tarifs plafonnés en Franc CFA (XAF).
                </p>

                {/* 4 Indicateurs Clés Métier */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
                    <div className="text-[11px] text-blue-200 uppercase font-semibold">Références Totales</div>
                    <div className="text-xl font-black text-white mt-0.5">{PHARMACEUTICAL_CATALOG.length} Produits</div>
                    <div className="text-[10px] text-emerald-300 font-medium mt-0.5">✓ Conforme LNME / OMS</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
                    <div className="text-[11px] text-blue-200 uppercase font-semibold">Familles Métier</div>
                    <div className="text-xl font-black text-white mt-0.5">{PRODUCT_FAMILIES_LIST.length - 1} Catégories</div>
                    <div className="text-[10px] text-blue-200 font-medium mt-0.5">ACT, Solutés, Urgences...</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
                    <div className="text-[11px] text-blue-200 uppercase font-semibold">Tarifs Plafonnés</div>
                    <div className="text-xl font-black text-amber-300 mt-0.5">100% Homologués</div>
                    <div className="text-[10px] text-blue-200 font-medium mt-0.5">Prix régulés en FCFA</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
                    <div className="text-[11px] text-blue-200 uppercase font-semibold">Réseau Logistique</div>
                    <div className="text-xl font-black text-emerald-400 mt-0.5">9 Provinces</div>
                    <div className="text-[10px] text-emerald-200 font-medium mt-0.5">Hub Central Owendo</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Barre de Recherche, Filtres de Famille et Actions de Téléchargement */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
              
              {/* Ligne 1 : Recherche + Sélecteur Famille + Boutons Télécharger CSV & PDF */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                
                {/* Champ de recherche */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Rechercher par Code CIP/Produit (ex: 012901002, 010901001), DCI, dosage, forme..."
                    value={searchDci}
                    onChange={(e) => {
                      setSearchDci(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2E68B4] focus:bg-white transition-all shadow-xs"
                  />
                  {searchDci && (
                    <button 
                      onClick={() => setSearchDci('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Menu déroulant de toutes les Familles */}
                <div className="w-full sm:w-auto min-w-[240px]">
                  <select
                    value={selectedFamilyFilter}
                    onChange={(e) => {
                      setSelectedFamilyFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2E68B4] focus:bg-white shadow-xs"
                  >
                    {PRODUCT_FAMILIES_LIST.map((fam) => (
                      <option key={fam} value={fam}>
                        {fam === 'TOUTES LES FAMILLES' ? 'Toutes les familles thérapeutiques' : fam}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre de Disponibilité */}
                <div className="w-full sm:w-auto">
                  <select
                    value={selectedAvailabilityFilter}
                    onChange={(e) => {
                      setSelectedAvailabilityFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2E68B4] shadow-xs"
                  >
                    <option value="ALL">Tous les statuts</option>
                    <option value="DISPONIBLE">Stock disponible / Normal</option>
                    <option value="VIGILANCE">Stock faible / Critique</option>
                  </select>
                </div>

                {/* Boutons d'action : Télécharger CSV, Imprimer, Enregistrer PDF, Aperçu */}
                <div className="flex items-center flex-wrap gap-2 pt-2 lg:pt-0 shrink-0">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow"
                    title="Télécharger la liste au format CSV compatible Excel avec en-tête officiel OPN"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                    <span>Télécharger CSV</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow"
                    title="Imprimer directement la liste officielle des produits"
                  >
                    <Printer className="w-4 h-4 text-slate-200" />
                    <span>Imprimer</span>
                  </button>

                  <button
                    onClick={handleSavePDF}
                    className="px-3.5 py-2.5 bg-[#2E68B4] hover:bg-[#215091] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow"
                    title="Enregistrer la liste officielle au format PDF avec logo et en-tête OPN"
                  >
                    <Download className="w-4 h-4 text-blue-200" />
                    <span>Enregistrer PDF</span>
                  </button>

                  <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors shadow-xs"
                    title="Aperçu interactif du document officiel PDF"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

              </div>

              {/* Ligne 2 : Pastilles de filtrage rapide des grandes catégories */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" />
                  Filtres rapides :
                </span>

                {[
                  'TOUTES LES FAMILLES',
                  'Antipaludiques (ACT)',
                  'Antibiotiques',
                  'Programme National Tuberculose',
                  'Analgésiques & Anti-inflammatoires',
                  'Anesthésie & Réanimation',
                  'Solutés Massifs & Électrolytes',
                  'Sérums, Vaccins & Toxicologie',
                  'Gastro-entérologie',
                  'Cardiologie & Vasculaire',
                  'Dispositifs Médicaux & Chirurgie',
                  'Sondes, Cathéters & Perfusion',
                  'Diagnostic & Tests Rapides',
                  'Équipements & Petit Matériel'
                ].map((fam) => {
                  const isSelected = selectedFamilyFilter === fam;
                  return (
                    <button
                      key={fam}
                      onClick={() => {
                        setSelectedFamilyFilter(fam);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#2E68B4] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {fam === 'TOUTES LES FAMILLES' ? 'Tous les Produits' : fam}
                    </button>
                  );
                })}

                {(selectedFamilyFilter !== 'TOUTES LES FAMILLES' || searchDci || selectedAvailabilityFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSelectedFamilyFilter('TOUTES LES FAMILLES');
                      setSearchDci('');
                      setSelectedAvailabilityFilter('ALL');
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors whitespace-nowrap flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Réinitialiser
                  </button>
                )}
              </div>

            </div>

            {/* Tableau Officiel des Produits & Médicaments */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              
              {/* En-tête du tableau avec compteur */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    {filteredMedicaments.length} {filteredMedicaments.length > 1 ? 'produits trouvés' : 'produit trouvé'}
                  </span>
                  {selectedFamilyFilter !== 'TOUTES LES FAMILLES' && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]">
                      {selectedFamilyFilter}
                    </span>
                  )}
                  {searchDci && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px]">
                      Mot-clé : "{searchDci}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px]">Afficher :</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 font-medium focus:ring-1 focus:ring-[#2E68B4]"
                  >
                    <option value={25}>25 par page</option>
                    <option value={50}>50 par page</option>
                    <option value={100}>100 par page</option>
                    <option value={1000}>Tous ({filteredMedicaments.length})</option>
                  </select>
                </div>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4 text-center w-28">Code OPN</th>
                      <th className="py-3 px-4">Désignation Officielle (DCI)</th>
                      <th className="py-3 px-4">Famille Thérapeutique</th>
                      <th className="py-3 px-4">Forme & Dosage</th>
                      <th className="py-3 px-4">Conditionnement</th>
                      <th className="py-3 px-4 text-center">Disponibilité</th>
                      <th className="py-3 px-4 text-right">Prix Homologué OPN</th>
                      <th className="py-3 px-3 text-center w-16">Fiche</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedMedicaments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
                          <div className="font-bold text-sm text-slate-700">Aucun produit ne correspond à vos critères.</div>
                          <div className="text-xs text-slate-500 mt-1">Essayez d'élargir votre recherche ou de réinitialiser les filtres.</div>
                          <button
                            onClick={() => {
                              setSelectedFamilyFilter('TOUTES LES FAMILLES');
                              setSearchDci('');
                              setSelectedAvailabilityFilter('ALL');
                            }}
                            className="mt-3 px-4 py-1.5 bg-[#2E68B4] text-white text-xs font-bold rounded-md hover:bg-[#215091] transition-colors"
                          >
                            Réinitialiser tous les filtres
                          </button>
                        </td>
                      </tr>
                    ) : (
                      paginatedMedicaments.map((med, index) => {
                        const isCrit = med.statut === 'STOCK_CRITIQUE';
                        const isFaible = med.statut === 'STOCK_FAIBLE';
                        return (
                          <tr 
                            key={med.id || med.code + index} 
                            className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                            onClick={() => setSelectedProductModal(med)}
                          >
                            {/* Code CIP/Produit */}
                            <td className="py-3 px-4 font-mono font-bold text-slate-800 text-center bg-slate-50/50 group-hover:bg-blue-50/80">
                              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 text-[11px]">
                                {med.code}
                              </span>
                            </td>

                            {/* Désignation & DCI */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 group-hover:text-[#2E68B4] transition-colors">
                                {med.designation}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 font-medium flex items-center gap-1.5">
                                <span className="text-slate-400">DCI :</span>
                                <span className="text-slate-700">{med.dci}</span>
                              </div>
                            </td>

                            {/* Famille Thérapeutique */}
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                {med.famille || med.categorie}
                              </span>
                            </td>

                            {/* Forme & Dosage */}
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-800">{med.forme}</div>
                              {med.dosage && (
                                <div className="text-[11px] text-slate-500 font-semibold">{med.dosage}</div>
                              )}
                            </td>

                            {/* Conditionnement */}
                            <td className="py-3 px-4 text-slate-600 text-xs">
                              {med.conditionnement || 'Boîte unitaire'}
                            </td>

                            {/* Statut Disponibilité */}
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                isCrit
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : isFaible
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-[#00A651] border-emerald-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isCrit ? 'bg-rose-600' : isFaible ? 'bg-amber-500' : 'bg-[#00A651]'
                                }`} />
                                {isCrit ? 'Critique' : isFaible ? 'Vigilance' : 'Disponible'}
                              </span>
                            </td>

                            {/* Prix Homologué OPN */}
                            <td className="py-3 px-4 text-right">
                              {med.gratuit || med.prixUnitaireXAF === 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  GRATUIT (PNLT)
                                </span>
                              ) : (
                                <>
                                  <div className="font-bold text-[#2E68B4] text-xs">
                                    {formatXAF(med.prixUnitaireXAF)}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    Public : {formatXAF(med.prixPublicPlafonneXAF)}
                                  </div>
                                </>
                              )}
                            </td>

                            {/* Bouton Action rapide */}
                            <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedProductModal(med)}
                                className="p-1.5 rounded hover:bg-blue-100 text-slate-500 hover:text-[#2E68B4] transition-colors"
                                title="Voir la fiche détaillée du produit"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Barre de Pagination et Téléchargements Inférieurs */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div>
                  Affichage de <span className="font-bold text-slate-900">{paginatedMedicaments.length}</span> sur <span className="font-bold text-slate-900">{filteredMedicaments.length}</span> références homologuées.
                </div>

                {/* Contrôles de pagination */}
                {itemsPerPage !== 'ALL' && totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={validCurrentPage === 1}
                      className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Précédent
                    </button>

                    <span className="px-3 py-1 font-bold text-slate-800 bg-slate-200/80 rounded">
                      Page {validCurrentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={validCurrentPage === totalPages}
                      className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1"
                    >
                      Suivant
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Boutons exports rapides de bas de page */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Télécharger la liste au format CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exporter CSV</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Lancer l'impression directe"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-200" />
                    <span>Imprimer</span>
                  </button>
                  <button
                    onClick={handleSavePDF}
                    className="px-3 py-1.5 bg-[#2E68B4] hover:bg-[#215091] text-white font-bold rounded flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Enregistrer la liste au format PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-200" />
                    <span>Enregistrer PDF</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Note d'information réglementaire OPN */}
            <div className="p-4 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2E68B4] shrink-0 mt-0.5" />
              <div>
                <strong>Avis officiel de l'Office Pharmaceutique National :</strong> Les tarifs mentionnés dans le présent catalogue constituent les prix plafonds applicables dans l'ensemble des pharmacies hospitalières publiques et officines privées conventionnées de la République Gabonaise. Tout dépassement de tarif est prohibé conformément à la réglementation en vigueur.
              </div>
            </div>

          </div>
        )}


        {/* =========================================================================
            VUE 3 : NOS ANTENNES
        ========================================================================= */}
        {activeNavTab === 'antennes' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-8 animate-in fade-in duration-200">
            
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 text-[#00A651] text-xs font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                Maillage Territorial
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E68B4] tracking-tight">
                Nos 9 Antennes Provinciales
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Distribution continue et coordination logistique depuis le Hub Central d'Owendo
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Colonne Gauche : Fiche de l'antenne sélectionnée */}
              <div className="lg:col-span-6 bg-slate-50 p-5 sm:p-7 rounded-md border border-slate-200 space-y-3.5 flex flex-col justify-between h-full shadow-xs">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#2E68B4] text-white font-bold text-xs">
                      Province {selectedProvince.id} – {selectedProvince.nom}
                    </span>
                    <span className="text-xs font-bold text-[#00A651] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Délai Owendo : {selectedProvince.leadTimeJours} Jours
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#2E68B4]">
                      Antenne de {selectedProvince.chefLieu} ({selectedProvince.villeAntenne})
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{selectedProvince.description}</p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Pharmacien Responsable :</span>
                      <span className="font-bold text-slate-900">{selectedProvince.responsable}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Mode de Transit Principal :</span>
                      <span className="font-semibold text-[#2E68B4]">{selectedProvince.modeTransport}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Ligne Directe Antenne :</span>
                      <span className="font-bold text-[#00A651]">{selectedProvince.contact}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Stock Local Estimé :</span>
                      <span className="font-bold text-[#2E68B4]">{formatXAF(selectedProvince.stockValeurXAF)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Autonomie de Couverture :</span>
                      <span className="font-bold text-slate-900">{selectedProvince.couvertureJours} Jours d'autonomie</span>
                    </div>
                  </div>
                </div>

                {/* Sélecteur Rapide */}
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Choisir une Province :</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                    {GABON_PROVINCES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvinceId(p.id)}
                        className={`p-1.5 rounded text-center text-xs transition-all ${
                          p.id === selectedProvinceId
                            ? 'bg-[#2E68B4] text-white font-bold shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold text-[11px]">{p.id}</div>
                        <div className="text-[9px] truncate">{p.chefLieu}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Colonne Droite : Carte Interactive SVG Officielle */}
              <div className="lg:col-span-6 bg-white p-5 sm:p-7 rounded-md border border-slate-200 shadow-sm flex flex-col justify-between h-full relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00A651]" />
                    <span className="text-xs font-bold text-slate-800">
                      Cartographie Officielle Interactive
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#2E68B4] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    9 Provinces Actives
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center py-2 w-full">
                  <GabonOfficialInteractiveMap
                    selectedProvinceId={selectedProvinceId}
                    onSelectProvince={(pId) => setSelectedProvinceId(pId)}
                    className="w-full h-full max-h-[360px]"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500">
                    Cliquez sur n'importe quelle province sur la carte pour inspecter ses indicateurs logistiques.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            VUE 4 : ACTUALITÉS (AVEC ARTICLE EN POSTER & DIFFUSION AUTOMATIQUE NEWSLETTER)
        ========================================================================= */}
        {activeNavTab === 'actualites' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-8 animate-in fade-in duration-200 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[#00A651] text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                  Informations & Communiqués Officiels
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E68B4] tracking-tight">
                  Actualités & Alertes Sanitaires
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full font-bold border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                  <Mail className="w-3.5 h-3.5 text-[#00A651]" />
                  {subscribersCount} Abonnés à la Newsletter
                </span>
              </div>
            </div>

            {/* GRAND POSTER À LA UNE / ARTICLE EN PREMIER PLAN */}
            <div className="rounded-2xl border-2 border-[#2E68B4]/30 overflow-hidden shadow-md bg-white">
              <div className="bg-gradient-to-r from-[#183B68] via-[#235BA8] to-[#163E75] text-white px-6 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/50">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#FFDE16] text-slate-900 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                    ARTICLE EN POSTER • MIS EN PREMIER PLAN
                  </span>
                  <span className="text-xs text-blue-200 font-medium">
                    (Première newsletter envoyée automatiquement aux nouveaux abonnés)
                  </span>
                </div>
                <span className="text-xs text-blue-100 font-semibold">{articles[0].date}</span>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-[#2E68B4]">
                    {articles[0].tag}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {articles[0].title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {articles[0].summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button 
                      onClick={() => setSelectedArticleModal(articles[0])}
                      className="px-5 py-2.5 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5"
                    >
                      <span>Lire l'article complet</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => handleBroadcastArticle(articles[0])}
                      className="px-5 py-2.5 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5"
                      title="Envoyer immédiatement cet article à tous les abonnés de la newsletter"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Diffuser cette Actualité aux Abonnés ({subscribersCount})</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-gradient-to-br from-blue-50 to-slate-100 p-5 rounded-xl border border-blue-200/70 space-y-3">
                  <h4 className="text-xs font-black text-[#2E68B4] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                    Automatisation Newsletter OPN
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    À chaque nouvelle parution, le portail envoie automatiquement l'article publié du jour ou du mois à tous les abonnés inscrits.
                  </p>
                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Abonnés Actifs :</span>
                      <strong className="text-emerald-700">{subscribersCount} destinataires</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Statut Envoi :</span>
                      <strong className="text-[#2E68B4]">Automatisé en temps réel</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRILLE DES AUTRES ACTUALITÉS */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>Tous les Communiqués & Publications Récentes</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {articles.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                        {item.tag}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{item.date}</span>
                    </div>
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#2E68B4] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <button 
                          onClick={() => setSelectedArticleModal(item)}
                          className="text-xs font-bold text-[#00A651] hover:text-[#008742] flex items-center gap-1 w-full justify-between"
                        >
                          <span>Lire l'article</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleBroadcastArticle(item)}
                          className="text-[11px] font-semibold text-[#2E68B4] hover:text-[#183B68] flex items-center gap-1 w-full"
                          title="Diffuser cet article aux abonnés"
                        >
                          <Send className="w-3 h-3 text-[#2E68B4]" />
                          <span>Envoyer aux abonnés</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            VUE 5 : MARCHÉS PUBLICS (COMMANDE PUBLIQUE & TRANSPARENCE DGCPMP)
        ========================================================================= */}
        {activeNavTab === 'marches' && (
          <MarchesPublicsSection formatXAF={formatXAF} />
        )}

        {/* =========================================================================
            VUE 6 : À PROPOS (SYNTHÈSE OFFICIELLE STRUCTURÉE & ILLUSTRÉE)
        ========================================================================= */}
        {activeNavTab === 'apropos' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-8 animate-in fade-in duration-200 space-y-8">
            
            {/* 1. En-tête Institutionnel & Cadre Juridique */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[#00A651] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                Centrale Nationale d'Achat • République Gabonaise
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E68B4] tracking-tight">
                À Propos de l'Office Pharmaceutique National (OPN)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Société d'État investie d'une mission de service public à caractère sanitaire et social, sous la tutelle du Ministre en charge de la Santé.
              </p>
            </div>

            {/* 2. Cartouche Statut Légal & Siège Social */}
            <div className="bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase flex items-center gap-1.5 text-[#2E68B4]">
                  <FileText className="w-3.5 h-3.5" />
                  Fondement Légal & Création
                </span>
                <p className="text-slate-800 font-semibold leading-relaxed">
                  Créé par l'Ordonnance n°1/95 du 14 janvier 1995, modifiée par l'Ordonnance n°008/PR/2021 (art. 76) et ratifiée par la Loi n°007/2021 du 12 juillet 2021.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase flex items-center gap-1.5 text-[#00A651]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Statut Juridique & Gouvernance
                </span>
                <p className="text-slate-800 font-semibold leading-relaxed">
                  Société d'État (Loi n°20/2005, art. 44) dotée de l'autonomie financière et administrative, régie par la comptabilité publique et l'Acte Uniforme OHADA.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase flex items-center gap-1.5 text-[#2E68B4]">
                  <MapPin className="w-3.5 h-3.5" />
                  Siège Social Officiel
                </span>
                <p className="text-slate-800 font-semibold leading-relaxed">
                  Zone Industrielle d'Oloumi, Libreville • Boîte Postale 295 • Hub Logistique et Magasins Centraux.
                </p>
              </div>
            </div>

            {/* 3. Triptyque : Vision 2030, Ambition & Mission Principale */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Vision 2030 */}
              <div className="bg-[#00A651] text-white p-6 rounded-md shadow-sm space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded text-white">
                    <Activity className="w-3 h-3" />
                    Vision Stratégique 2030
                  </div>
                  <h3 className="text-base font-bold mt-2">Zéro Rupture Médicamenteuse</h3>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    « Mettre fin aux manques de médicaments et autres produits de santé essentiels dans toutes les formations sanitaires du Gabon d’ici à 2030. »
                  </p>
                </div>
                <span className="text-[10px] text-emerald-200 font-mono">Horizon Gabon 2030</span>
              </div>

              {/* Ambition */}
              <div className="bg-[#2E68B4] text-white p-6 rounded-md shadow-sm space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded text-white">
                    <Award className="w-3 h-3" />
                    Ambition d'Excellence
                  </div>
                  <h3 className="text-base font-bold mt-2">Référence Panafricaine</h3>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    « Se hisser aux standards des meilleures centrales d'achat africaines et faire de l'OPN un véritable pôle d'excellence en approvisionnement au Gabon. »
                  </p>
                </div>
                <span className="text-[10px] text-blue-200 font-mono">Standards Internationaux</span>
              </div>

              {/* Mission Principale */}
              <div className="bg-[#183B68] text-white p-6 rounded-md shadow-sm space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded text-white">
                    <Building2 className="w-3 h-3" />
                    Mission de Service Public
                  </div>
                  <h3 className="text-base font-bold mt-2">Accessibilité & Moindre Coût</h3>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    « Assurer l’approvisionnement des MAPS sur toute l'étendue du territoire national et garantir leur accessibilité à moindre coût aux populations. »
                  </p>
                </div>
                <span className="text-[10px] text-blue-200 font-mono">9 Provinces Couvertes</span>
              </div>

            </div>

            {/* 4. Les 4 Objectifs Stratégiques */}
            <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A651]" />
                <h3 className="text-base font-bold text-[#2E68B4]">Les 4 Objectifs Stratégiques Majeurs</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="w-8 h-8 rounded bg-emerald-100 text-[#00A651] font-bold flex items-center justify-center text-xs">
                    01
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Qualité & Moindre Coût</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Médicament de qualité, au bon endroit, au bon moment et au juste prix, dans le respect de la Liste Nationale des Médicaments Essentiels (MEG).
                  </p>
                </div>

                <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="w-8 h-8 rounded bg-blue-100 text-[#2E68B4] font-bold flex items-center justify-center text-xs">
                    02
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Chaîne d'Approvisionnement</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Développement et fiabilisation d'un réseau logistique national sécurisé reliant Libreville/Owendo aux 9 antennes régionales.
                  </p>
                </div>

                <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="w-8 h-8 rounded bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                    03
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Renforcement des Capacités</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Formation continue et accompagnement technique des gestionnaires hospitaliers de médicaments dans toutes les formations sanitaires.
                  </p>
                </div>

                <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    04
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Conseil au Gouvernement</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Assistance de l'État dans la formulation des orientations et la prise de décisions pour la politique pharmaceutique nationale.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Les 5 Activités Métiers de l'OPN (Synthèse Structurée & Illustrée) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#2E68B4]" />
                  <h3 className="text-lg font-extrabold text-slate-900">Les 5 Activités Métiers de l'OPN</h3>
                </div>
                <span className="text-xs text-[#00A651] font-bold uppercase">Cycle Complet de la Santé</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                
                {/* 1. L'Achat */}
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2E68B4] font-bold text-[10px] border border-blue-200">
                        Activité 1
                      </span>
                      <Building2 className="w-4 h-4 text-[#2E68B4]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">L'Achat Stratégique & Marchés Publics</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Sélection rigoureuse selon le rapport Qualité/Prix : collecte des besoins des structures, quantification CMM, passation conforme au Code des Marchés Publics (<strong>AOIO, AOR, Gré à Gré, Demande de cotations</strong>), attribution et suivi d'acheminement.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-[#2E68B4] font-semibold">
                    ✓ Respect strict du Code des Marchés Publics
                  </div>
                </div>

                {/* 2. Le Stockage */}
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#00A651] font-bold text-[10px] border border-emerald-200">
                        Activité 2
                      </span>
                      <Layers className="w-4 h-4 text-[#00A651]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Stockage Sécurisé & Logiciel SAGE X3</h4>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>4 magasins de gros + 1 magasin dédié aux programmes VIH/Sida et Tuberculose</strong>. Gestion informatisée par lot et emplacement sous <strong>SAGE X3</strong>, contrôle de conformité à réception, respect de la chaîne du froid et inventaires contradictoires.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-[#00A651] font-semibold">
                    ✓ Traçabilité FEFO informatisée SAGE X3
                  </div>
                </div>

                {/* 3. La Distribution */}
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                        Activité 3
                      </span>
                      <Truck className="w-4 h-4 text-amber-700" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Distribution aux 9 Antennes Provinciales</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Réseau de <strong>9 antennes régionales</strong> approvisionnées semestriellement. Clients publics (CHU, CHR, HD, Hôpitaux spécialisés, Dispensaires) et privés (Cliniques, grossistes, pharmacies publiques, monopole réserve hospitalière).
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-800 font-semibold">
                    ✓ Processus cadencé : devis ➔ colisage ➔ livraison
                  </div>
                </div>

                {/* 4. La Démarche Qualité */}
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                        Activité 4
                      </span>
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Démarche Qualité & Contrôle ANMAPS</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Conformité permanente aux normes OMS. Préqualification continue des couples produit/fabricant et contrôles qualité au laboratoire menés en amont avec l'<strong>Agence Nationale du Médicament et Autres Produits de Santé (ANMAPS)</strong>.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-rose-700 font-semibold">
                    ✓ Préqualification & Normes OMS certifiées
                  </div>
                </div>

                {/* 5. Appui aux Structures Sanitaires */}
                <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between md:col-span-2 lg:col-span-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                        Activité 5
                      </span>
                      <HeartPulse className="w-4 h-4 text-indigo-700" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Appui & Accompagnement des Formations Sanitaires</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 text-[11px] pt-1">
                      <p>• <strong>Assistance technique & Planification :</strong> Prévision des besoins en MAPS et optimisation des réapprovisionnements.</p>
                      <p>• <strong>Substitution DCI équivalente :</strong> Proposition d'alternatives thérapeutiques de même substance active pour éviter toute rupture.</p>
                      <p>• <strong>Sensibilisation à la conservation :</strong> Rationalisation des ressources et maintien des conditions optimales de stockage.</p>
                      <p>• <strong>Coordination & Partenariat :</strong> Fluidification continue du circuit de dispensation avec les équipes médicales.</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-700 font-semibold">
                    ✓ Disponibilité continue & équitable sur l'ensemble du territoire
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            VUE 7 : CONTACTEZ-NOUS
        ========================================================================= */}
        {activeNavTab === 'contact' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-8 animate-in fade-in duration-200">
            
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 text-[#00A651] text-xs font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                Standard & Relations Extérieures
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E68B4] tracking-tight">
                Contactez l'Office Pharmaceutique National
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Notre équipe est à votre disposition pour toute demande d'information, partenariat laboratoire ou commande hospitalière.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Colonne Coordonnées */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-5 rounded-md border border-slate-200 space-y-3.5 text-xs text-slate-700 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2E68B4]" />
                    Siège National & Hub Central
                  </h4>
                  <p className="text-slate-600">
                    Office Pharmaceutique National (OPN)<br />
                    Zone Portuaire & Logistique d'Owendo / Libreville<br />
                    BP 3838 – République Gabonaise
                  </p>

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>Standard : <strong>(+241) 074 35 79 29 / 011 70 20 00</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>Courriel officiel : <strong>contact@opn-gabon.com</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>Horaires : <strong>Lun - Ven : 07h30 – 15h30</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#00A651]" />
                    Ligne d'Urgence Sanitaire 24h/24
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    En cas de rupture critique dans un hôpital provincial ou d'urgence épidémique, contactez immédiatement le Centre Opérationnel des Urgences au <strong>1411</strong> ou <strong>(+241) 077 92 11 05</strong>.
                  </p>
                </div>
              </div>

              {/* Colonne Formulaire */}
              <div className="lg:col-span-7 bg-white p-6 rounded-md border border-slate-200 shadow-xs">
                {contactSubmitted ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#00A651] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Message enregistré</h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Récépissé téléchargé. Le secrétariat OPN traitera votre demande sous 48 h ouvrées.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <h4 className="text-sm font-bold text-slate-900">Formulaire de Contact Officiel</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nom & Prénom / Structure</label>
                        <input 
                          type="text"
                          required
                          value={contactForm.nom}
                          onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                          placeholder="Ex: Dr. Ondo / Clinique Ogooué"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#2E68B4]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Adresse Courriel</label>
                        <input 
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="votre.email@domaine.ga"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#2E68B4]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Téléphone de Contact</label>
                        <input 
                          type="text"
                          value={contactForm.telephone}
                          onChange={(e) => setContactForm({ ...contactForm, telephone: e.target.value })}
                          placeholder="+241 074 XX XX XX"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#2E68B4]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Objet du Message</label>
                        <select 
                          value={contactForm.objet}
                          onChange={(e) => setContactForm({ ...contactForm, objet: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#2E68B4]"
                        >
                          <option value="Demande d'information générale">Demande d'information générale</option>
                          <option value="Partenariat Laboratoire / Fournisseur">Partenariat Laboratoire / Fournisseur</option>
                          <option value="Commande Hospitalière / Approvisionnement">Commande Hospitalière / Approvisionnement</option>
                          <option value="Réclamation / Qualité produit">Réclamation / Qualité produit</option>
                          <option value="Marchés Publics & Appels d'Offres">Marchés Publics & Appels d'Offres</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Votre Message</label>
                      <textarea 
                        rows="3"
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Détaillez votre demande..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#2E68B4]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer le Message à l'OPN</span>
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* PIED DE PAGE OFFICIEL OPN */}
      <footer className="mt-16 text-white bg-[#102A4D] border-t-4 border-[#2E68B4]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 pt-10 pb-8 space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 rounded-md bg-white/5 border border-white/10">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/10">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white uppercase tracking-wide">
                    Urgence sanitaire — COD Libreville
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Disponible 24h/24 pour les structures sanitaires des 9 provinces.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 md:pl-4">
                <a
                  href="tel:1411"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#2E68B4] hover:bg-[#245794] text-white text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  1411
                </a>
                <a
                  href="tel:+241077921105"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-colors"
                >
                  (+241) 077 92 11 05
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

              <div className="space-y-3.5 pr-0 md:pr-2">
                <img
                  src="/logo-opn-white-footer.png"
                  alt="Office Pharmaceutique National"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                  Centrale nationale d&apos;achat pharmaceutique : disponibilité, qualité et accessibilité des médicaments essentiels.
                </p>
                <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Hub Owendo · B.P. 3838 — Libreville</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Lun–Ven 07h30 – 15h30</span>
                </div>
              </div>

              <div className="space-y-3.5 px-0 md:px-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-white border-b border-white/15 pb-2">
                  Contacts officiels
                </h4>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-start gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Standard</span>
                      <a href="tel:+241074357929" className="font-bold text-white hover:opacity-80 transition-opacity">
                        (+241) 074 35 79 29
                      </a>
                      <span className="block text-slate-400 mt-0.5">ou 011 70 20 00</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Courriel</span>
                      <a href="mailto:contact@opn-gabon.com" className="font-semibold text-white hover:opacity-80 break-all">
                        contact@opn-gabon.com
                      </a>
                    </div>
                  </li>
                  <li className="pt-2.5 border-t border-white/10">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      Direction commerciale
                    </p>
                    <span className="block text-[10px] text-slate-400 font-semibold mb-0.5">Lignes commerciales :</span>
                    <p className="font-semibold text-white leading-relaxed">
                      062 26 17 32 · 062 26 14 75 · 062 26 30 39
                    </p>
                    <div className="mt-1 space-y-0.5 text-[11px]">
                      <div>
                        <span className="text-slate-400">E-mail : </span>
                        <a href="mailto:commercial@opn-gabon.com" className="text-white hover:opacity-80 font-medium">
                          commercial@opn-gabon.com
                        </a>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Zone Industrielle d&apos;Oloumi · B.P. 295
                    </p>
                  </li>
                </ul>
              </div>

              <div className="space-y-3.5 pl-0 md:pl-2">
                <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                    Alertes OPN
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold tabular-nums">
                    {subscribersCount} abonnés
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Communiqués, avis de marchés et alertes de rupture par e-mail.
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="space-y-2.5 max-w-sm">
                  <label htmlFor="footer-newsletter-email" className="sr-only">Adresse e-mail</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="votre.email@domaine.ga"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/5 border border-white/15 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2E68B4] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-3 py-2.5 bg-[#2E68B4] hover:bg-[#245794] text-white text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>S&apos;abonner</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setIsFirstNewsletter(true);
                    setNewsletterDispatchedArticle(articles[0]);
                    setIsNewsletterModalOpen(true);
                  }}
                  className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2 flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Aperçu newsletter
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <a
                href="https://www.opn-gabon.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-white hover:opacity-80 transition-opacity"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                www.opn-gabon.com
              </a>
              <p className="text-[10px] text-slate-400 leading-relaxed sm:text-right">
                © {new Date().getFullYear()} Office Pharmaceutique National (OPN) — Tous droits réservés.
              </p>
            </div>
        </div>
      </footer>

      {/* MODALE DÉTAIL ACTUALITÉ */}
      {selectedArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedArticleModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider inline-block ${selectedArticleModal.tagColor}`}>
              {selectedArticleModal.tag}
            </span>
            <span className="text-xs text-slate-400 block font-medium">{selectedArticleModal.date}</span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">{selectedArticleModal.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{selectedArticleModal.content}</p>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticleModal(null)}
                className="px-4 py-2 rounded bg-[#2E68B4] text-white text-xs font-bold hover:bg-[#215091] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DÉTAIL MARCHÉ PUBLIC */}
      {selectedTenderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-lg p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedTenderModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#2E68B4] text-white">
                {selectedTenderModal.type}
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">{selectedTenderModal.ref}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedTenderModal.titre}</h3>
            
            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Budget Prévisionnel Alloué :</span>
                <span className="font-bold text-[#2E68B4]">{formatXAF(selectedTenderModal.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Caution de Soumission :</span>
                <span className="font-bold text-slate-900">{selectedTenderModal.caution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Heure Limite :</span>
                <span className="font-bold text-rose-600">{selectedTenderModal.dateLimite}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedTenderModal.description}
            </p>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
              <strong>Conditions de soumission :</strong> Entreprises et laboratoires agréés par le Ministère de la Santé du Gabon. Dépôt des offres au Secrétariat de la Direction Générale de l'OPN à Owendo ou par voie électronique cryptée.
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const t = selectedTenderModal;
                  downloadOfficialHtml(`DAO-${(t.ref || t.id || 'OPN').replace(/[^\w.-]+/g, '_')}`, {
                    title: `Dossier d'Appel d'Offres — ${t.ref}`,
                    subtitle: t.titre,
                    bodyLines: [
                      `<strong>Cahier des charges :</strong> ${t.cahierCharges || 'Document technique OPN'}`,
                      `<strong>Budget estimatif :</strong> ${formatXAF(t.budget)}`,
                      `<strong>Date limite :</strong> ${t.dateLimite || '—'}`,
                      t.description || '',
                      'Conditions : entreprises et laboratoires agréés par le Ministère de la Santé du Gabon. Dépôt au Secrétariat DG OPN Owendo ou voie électronique sécurisée.',
                    ].filter(Boolean),
                  });
                }}
                className="px-4 py-2 rounded bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le DAO (PDF)</span>
              </button>
              <button
                onClick={() => setSelectedTenderModal(null)}
                className="px-4 py-2 rounded bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE OFFICIELLE PDF CATALOGUE (AVEC LOGO & EN-TÊTE) */}
      <CatalogPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        products={filteredMedicaments}
        selectedFamily={selectedFamilyFilter}
        searchKeyword={searchDci}
      />

      {/* MODALE FICHE DÉTAILLÉE PRODUIT PHARMACEUTIQUE */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#2E68B4] text-white font-mono text-xs font-bold">
                Code : {selectedProductModal.code}
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                {selectedProductModal.famille || selectedProductModal.categorie}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {selectedProductModal.designation}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                DCI : <span className="text-slate-900 font-bold">{selectedProductModal.dci}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Forme & Dosage</span>
                <span className="font-bold text-slate-800">{selectedProductModal.forme} – {selectedProductModal.dosage}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Conditionnement</span>
                <span className="font-bold text-slate-800">{selectedProductModal.conditionnement || 'Boîte'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Laboratoire Titulaire</span>
                <span className="font-bold text-slate-800">{selectedProductModal.laboratoire || 'Agréé OPN'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Prix Homologué OPN</span>
                <span className="font-black text-[#2E68B4] text-sm">{formatXAF(selectedProductModal.prixUnitaireXAF)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tarif Public Plafonné</span>
                <span className="font-bold text-slate-700">{formatXAF(selectedProductModal.prixPublicPlafonneXAF)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Stock National</span>
                <span className="font-bold text-emerald-600">{selectedProductModal.stockNational?.toLocaleString() || 'Disponible'} {selectedProductModal.uniteGestion}s</span>
              </div>
            </div>

            {/* Répartition par Antenne */}
            {selectedProductModal.stocksParAntenne && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#2E68B4]" />
                  Disponibilité dans les 9 Antennes Provinciales :
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(selectedProductModal.stocksParAntenne).map(([antId, qty]) => {
                    const prov = GABON_PROVINCES.find(p => p.id === antId);
                    return (
                      <div key={antId} className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                        <span className="text-slate-600 font-medium truncate">{prov ? prov.chefLieu : antId} :</span>
                        <span className="font-bold text-slate-900">{qty?.toLocaleString() || 0}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedProductModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setSelectedProductModal(null);
                  openOfficialPrintableCatalog([selectedProductModal], selectedProductModal.famille, selectedProductModal.code);
                }}
                className="px-4 py-2 rounded-lg bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Fiche Produit (PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODALE AUTOMATISÉE NEWSLETTER OPN (SIMULATION BOÎTE DE RÉCEPTION & ARTICLE EN PREMIER PLAN) */}
      <NewsletterEmailModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
        subscriberEmail={newsletterEmail || 'abonne@citoyen.ga'}
        article={newsletterDispatchedArticle || articles[0]}
        isFirstSubscription={isFirstNewsletter}
      />

      {/* TOAST DE CONFIRMATION D'ENVOI AUTOMATIQUE */}
      {newsletterToast && (
        <div className="fixed bottom-5 right-5 z-[120] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-[#00A651] flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">{newsletterToast}</p>
            <p className="text-[10px] text-slate-400">Notification en temps réel • OPN Newsletter Engine</p>
          </div>
          <button 
            onClick={() => setNewsletterToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}

