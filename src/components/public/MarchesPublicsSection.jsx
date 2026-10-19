import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Calendar, Clock, ShieldCheck, AlertCircle, 
  Building2, Coins, Layers, Send, Eye, X, ExternalLink, 
  Briefcase, Award, HelpCircle, CheckCircle2, RefreshCw, Search,
  SlidersHorizontal, Check, ArrowRight, Phone, Mail, FileCheck
} from 'lucide-react';
import OpnLogo from '../common/OpnLogo';
import { downloadOfficialHtml } from '../../utils/downloadHelpers';
import { persistMarcheSubmission } from '../../utils/localPersistence';

// Base de données réaliste et complète des Marchés Publics OPN Gabon
export const MARCHES_PUBLICS_DATA = [
  {
    id: "MP-2026-001",
    ref: "Avis N° 001/OPN/DG/DMP/2026",
    titre: "Fourniture & Acheminement National de Médicaments Essentiels Génériques (DCI), Solutés Massifs et Formes Injectables Hospitalières",
    categorie: "MEDICAMENTS",
    categorieLabel: "Médicaments & Formes Orales/Injectables",
    type: "Appel d'Offres International (AOI)",
    typeCode: "AOI",
    datePublication: "10 Août 2026",
    dateLimite: "15 Octobre 2026 à 12h00",
    budget: 3850000000,
    caution: "77 000 000 FCFA (2%)",
    fraisDao: "500 000 FCFA",
    statut: "EN_COURS",
    statutLabel: "Soumissions Ouvertes",
    allotissement: [
      { num: "Lot 1", nom: "Antipaludiques ACT & Produits d'urgence vitale (Artesunate, Quinine, Artemether)", budget: "1 200 000 000 FCFA" },
      { num: "Lot 2", nom: "Antibiotiques majeurs, C3G et anti-infectieux injectables", budget: "1 150 000 000 FCFA" },
      { num: "Lot 3", nom: "Solutés massifs, électrolytes et perfusions hospitalières (Sérum physio, Glucose, Ringer)", budget: "950 000 000 FCFA" },
      { num: "Lot 4", nom: "Analgésiques, anti-inflammatoires et anesthésiques d'urgence", budget: "550 000 000 FCFA" }
    ],
    cahierCharges: "DAO_Medicaments_DCI_National_2026.pdf",
    description: "Accord-cadre d'approvisionnement national annuel pour le stock central de l'OPN et le réapprovisionnement programmé des 9 antennes provinciales du Gabon.",
    conditions: "Laboratoires titulaires d'une AMM valide, certifiés BPF/GMP par l'OMS ou autorités équivalentes. Échantillons obligatoires pour contrôle CQ au LNSP.",
    autorite: "Direction Générale de l'Office Pharmaceutique National • Direction des Marchés Publics"
  },
  {
    id: "MP-2026-002",
    ref: "Avis N° 002/OPN/DG/DMP/2026",
    titre: "Acquisition et Déploiement de Dispositifs Médico-Chirurgicaux, Matériel d'Anesthésie-Réanimation et Consommables de Bloc Opératoire",
    categorie: "DISPOSITIFS",
    categorieLabel: "Dispositifs Médicaux & Bloc",
    type: "Appel d'Offres National (AON)",
    typeCode: "AON",
    datePublication: "18 Août 2026",
    dateLimite: "28 Septembre 2026 à 15h00",
    budget: 920000000,
    caution: "18 400 000 FCFA (2%)",
    fraisDao: "250 000 FCFA",
    statut: "EN_COURS",
    statutLabel: "Soumissions Ouvertes",
    allotissement: [
      { num: "Lot 1", nom: "Sondes d'intubation endotrachéale, canules de Guedel et masques d'anesthésie", budget: "340 000 000 FCFA" },
      { num: "Lot 2", nom: "Cathéters, perfuseurs 3 voies, transfuseurs et aiguilles stériles", budget: "310 000 000 FCFA" },
      { num: "Lot 3", nom: "Sutures résorbables/non résorbables, compresses et pansements stériles", budget: "270 000 000 FCFA" }
    ],
    cahierCharges: "DAO_Consommables_Bloc_2026.pdf",
    description: "Fourniture de dispositifs médicaux certifiés CE / ISO 13485 destinés aux blocs opératoires des Centres Hospitaliers Universitaires (CHU) et Régionaux (CHR).",
    conditions: "Distributeurs et fabricants agréés par le Ministère de la Santé du Gabon. Fiches techniques complètes et certificats de stérilité exigés.",
    autorite: "Direction des Approvisionnements & Pharmacie Hospitalière OPN"
  },
  {
    id: "MP-2026-003",
    ref: "Avis N° 003/OPN/DG/DMP/2026",
    titre: "Fourniture, Installation et Qualification d'Équipements de Chaîne de Froid Médicale Solaire & Chambres Froides pour les 9 Antennes Provinciales",
    categorie: "EQUIPEMENTS",
    categorieLabel: "Équipements & Chaîne de Froid",
    type: "Appel d'Offres International (AOI)",
    typeCode: "AOI",
    datePublication: "25 Août 2026",
    dateLimite: "30 Octobre 2026 à 11h00",
    budget: 650000000,
    caution: "13 000 000 FCFA (2%)",
    fraisDao: "300 000 FCFA",
    statut: "EN_COURS",
    statutLabel: "Soumissions Ouvertes",
    allotissement: [
      { num: "Lot 1", nom: "9 Chambres froides modulaires solaires 2°C–8°C avec monitoring IoT télétransmis", budget: "420 000 000 FCFA" },
      { num: "Lot 2", nom: "Armoires frigorifiques négatives (-20°C à -80°C) pour vaccins complexes", budget: "140 000 000 FCFA" },
      { num: "Lot 3", nom: "Maintenance préventive triennale et formation des techniciens provinciaux", budget: "90 000 000 FCFA" }
    ],
    cahierCharges: "DAO_Equipements_Chaine_Froid_2026.pdf",
    description: "Modernisation intégrale de la chaîne de froid des dépôts pharmaceutiques régionaux pour garantir la stricte préservation des vaccins, insulines et sérums.",
    conditions: "Équipements préqualifiés OMS PQS (Performance, Quality and Safety). Garantie constructeur minimum de 36 mois avec disponibilité des pièces de rechange.",
    autorite: "Direction Technique & Logistique OPN Gabon"
  },
  {
    id: "MP-2026-004",
    ref: "Avis N° 004/OPN/DG/DMP/2026",
    titre: "Prestations de Transport Sécurisé & Distribution Multimodale Sous Température Dirigée (Hub Owendo vers les 9 Provinces)",
    categorie: "LOGISTIQUE",
    categorieLabel: "Logistique & Fret Sécurisé",
    type: "Appel d'Offres National (AON)",
    typeCode: "AON",
    datePublication: "01 Septembre 2026",
    dateLimite: "10 Octobre 2026 à 14h00",
    budget: 480000000,
    caution: "9 600 000 FCFA (2%)",
    fraisDao: "200 000 FCFA",
    statut: "EN_COURS",
    statutLabel: "Soumissions Ouvertes",
    allotissement: [
      { num: "Lot 1", nom: "Acheminement routier régulier vers l'axe Ouest-Sud (N1 : Lambaréné, Mouila, Tchibanga)", budget: "190 000 000 FCFA" },
      { num: "Lot 2", nom: "Acheminement ferroviaire et routier combiné vers le Centre-Est (SETRAG : Franceville, Koula-Moutou)", budget: "160 000 000 FCFA" },
      { num: "Lot 3", nom: "Acheminement Nord et Maritime (N2 : Makokou, Oyem & Fret Maritime Port-Gentil)", budget: "130 000 000 FCFA" }
    ],
    cahierCharges: "DAO_Logistique_Transport_Securise_2026.pdf",
    description: "Sélection de transporteurs logistiques professionnels équipés de camions frigorifiques étalonnés et de suivi GPS pour les tournées bimensuelles d'approvisionnement.",
    conditions: "Flotte de véhicules conformes aux Bonnes Pratiques de Distribution (BPD). Enregistreurs de température certifiés et assurance fret obligatoire.",
    autorite: "Direction Logistique & Chaîne d'Approvisionnement OPN"
  },
  {
    id: "MP-2026-005",
    ref: "Avis N° 005/OPN/DG/DMP/2026",
    titre: "Fourniture d'Urgence de Tests de Diagnostic Rapide (TDR Paludisme, VIH, Hépatite) et Réactifs de Dépistage Biologique",
    categorie: "DIAGNOSTIC",
    categorieLabel: "Diagnostic & Tests Rapides",
    type: "Demande de Renseignements de Prix (DRP)",
    typeCode: "DRP",
    datePublication: "03 Septembre 2026",
    dateLimite: "22 Septembre 2026 à 12h00",
    budget: 310000000,
    caution: "3 100 000 FCFA (1%)",
    fraisDao: "100 000 FCFA",
    statut: "EN_COURS",
    statutLabel: "Procédure Accélérée",
    allotissement: [
      { num: "Lot Unique", nom: "50 000 kits TDR Malaria Pf/Pan Ag et 25 000 tests combinés de dépistage", budget: "310 000 000 FCFA" }
    ],
    cahierCharges: "DAO_TDR_Diagnostic_Urgence_2026.pdf",
    description: "Réapprovisionnement stratégique des formations sanitaires publiques en tests de dépistage rapide du paludisme et pathologies prioritaires.",
    conditions: "Agrément OMS / CE-IVD. Délais de livraison stricts inférieurs à 20 jours à compter de la notification.",
    autorite: "Direction des Programmes Spéciaux & PNLT/PNLP OPN"
  },
  {
    id: "MP-2026-006",
    ref: "Avis N° 006/OPN/DG/DMP/2026",
    titre: "Recrutement d'un Cabinet Spécialisé pour l'Audit et l'Accompagnement à la Certification ISO 9001:2015 des Processus OPN Gabon",
    categorie: "SERVICES",
    categorieLabel: "Prestations Intellectuelles & Audit",
    type: "Appel à Manifestation d'Intérêt (AMI)",
    typeCode: "AMI",
    datePublication: "15 Août 2026",
    dateLimite: "05 Novembre 2026 à 16h00",
    budget: 75000000,
    caution: "1 500 000 FCFA (2%)",
    fraisDao: "50 000 FCFA",
    statut: "EN_COURS",
    statutLabel: "Soumissions Ouvertes",
    allotissement: [
      { num: "Lot Unique", nom: "Mission d'audit à blanc, optimisation du SMQ et préparation à l'audit de certification", budget: "75 000 000 FCFA" }
    ],
    cahierCharges: "TDR_Certification_ISO_OPN_2026.pdf",
    description: "Accompagnement méthodologique de la Direction Générale et des Directions Opérationnelles vers la certification internationale de gestion de la qualité.",
    conditions: "Cabinets ayant au moins 5 références probantes dans la certification d'organisations de santé publique ou centrales d'achat en Afrique centrale.",
    autorite: "Direction Générale • Cellule Qualité & Audit Interne"
  },
  {
    id: "MP-2026-007",
    ref: "Avis N° 007/OPN/DG/DMP/2026",
    titre: "Renforcement des Dispositifs de Sécurité Électronique, Vidéosurveillance IP et Contrôle d'Accès Biométrique des Magasins d'Oloumi et Owendo",
    categorie: "SERVICES",
    categorieLabel: "Infrastructures & Sécurité",
    type: "Appel d'Offres National (AON)",
    typeCode: "AON",
    datePublication: "28 Août 2026",
    dateLimite: "18 Octobre 2026 à 15h00",
    budget: 140000000,
    caution: "2 800 000 FCFA (2%)",
    fraisDao: "100 000 FCFA",
    statut: "EN_COURS",
    statutLabel: "Soumissions Ouvertes",
    allotissement: [
      { num: "Lot 1", nom: "Système de vidéosurveillance automatisée haute définition 4K et détection volumétrique avec enregistrement redondant 90 jours", budget: "85 000 000 FCFA" },
      { num: "Lot 2", nom: "Contrôle d'accès biométrique et gestion des zones de quarantaine pharmaceutique", budget: "55 000 000 FCFA" }
    ],
    cahierCharges: "DAO_Securite_Magasins_Centraux_2026.pdf",
    description: "Sécurisation physique et traçabilité des flux d'accès au niveau des zones de stockage stratégiques de médicaments de haute valeur.",
    conditions: "Entreprises spécialisées agréées au Gabon, disposant d'une expérience avérée en sécurité de sites industriels sensibles.",
    autorite: "Direction de la Sécurité & Patrimoine OPN"
  }
];

// Historique des Marchés Récemment Attribués (Transparence DGCPMP)
export const ATTRIBUTIONS_RECENTES = [
  {
    ref: "Avis N° 022/OPN/DG/DMP/2025",
    objet: "Fourniture de solutés massifs et électrolytes pour le semestre 1-2026",
    attributaire: "Laboratoires MEDIS S.A.",
    montant: 480000000,
    dateAttribution: "15 Janvier 2026",
    delaiExecution: "60 Jours",
    statutDgcpmp: "Approuvé par la DGCPMP (Visa N° 2026-084)"
  },
  {
    ref: "Avis N° 024/OPN/DG/DMP/2025",
    objet: "Acquisition de 4 véhicules utilitaires 4x4 de supervision sanitaire provinciale",
    attributaire: "SOGAFRIC MOTORS GABON",
    montant: 185000000,
    dateAttribution: "28 Février 2026",
    delaiExecution: "30 Jours",
    statutDgcpmp: "Approuvé par la DGCPMP (Visa N° 2026-119)"
  },
  {
    ref: "Avis N° 026/OPN/DG/DMP/2025",
    objet: "Mise à niveau et redondance électrique par onduleurs industriels du Hub Owendo",
    attributaire: "SCHNEIDER ELECTRIC GABON",
    montant: 92000000,
    dateAttribution: "12 Avril 2026",
    delaiExecution: "45 Jours",
    statutDgcpmp: "Approuvé par la DGCPMP (Visa N° 2026-204)"
  }
];

export function MarchesPublicsSection({
  formatXAF = (v) => `${(v || 0).toLocaleString('fr-FR')} FCFA`,
  marches = null,
  attributions = null,
  contact = null,
}) {
  const [activeTab, setActiveTab] = useState('tenders'); // 'tenders' | 'awarded' | 'guide'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedModalTender, setSelectedModalTender] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const sourceMarches = marches?.length ? marches : MARCHES_PUBLICS_DATA;
  const sourceAttributions = attributions?.length ? attributions : ATTRIBUTIONS_RECENTES;
  const hotlineEmail = contact?.marchesEmail || 'contact@opn-gabon.com';
  const hotlineTel = contact?.marchesTel || '+241 01 76 55 07';
  const hotlineHref = contact?.marchesTelHref || '+24101765507';

  const [submissionData, setSubmissionData] = useState({
    entreprise: '',
    rccm: '',
    contactNom: '',
    email: '',
    telephone: '',
    lots: '',
    commentaires: ''
  });

  // Calcul du budget total en consultation
  const totalBudgetEnConsultation = useMemo(() => {
    return sourceMarches.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  }, [sourceMarches]);

  // Filtrage des marchés
  const filteredMarches = useMemo(() => {
    return sourceMarches.filter((mp) => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = !q ||
        mp.titre.toLowerCase().includes(q) ||
        mp.ref.toLowerCase().includes(q) ||
        mp.description.toLowerCase().includes(q) ||
        mp.categorieLabel.toLowerCase().includes(q);

      const matchCategory = selectedCategory === 'ALL' || mp.categorie === selectedCategory;
      const matchType = selectedType === 'ALL' || mp.typeCode === selectedType;

      return matchSearch && matchCategory && matchType;
    });
  }, [searchTerm, selectedCategory, selectedType, sourceMarches]);

  const handleDownloadDao = (tender) => {
    const lots = (tender.allotissement || [])
      .map((l) => `${l.num} — ${l.nom} (${l.budget})`)
      .join('<br/>');
    downloadOfficialHtml(`DAO-${(tender.ref || tender.id || 'OPN').replace(/[^\w.-]+/g, '_')}`, {
      title: `Dossier d'Appel d'Offres — ${tender.ref}`,
      subtitle: tender.titre,
      bodyLines: [
        `<strong>Cahier des charges :</strong> ${tender.cahierCharges || 'Document technique OPN'}`,
        `<strong>Type :</strong> ${tender.type || tender.typeCode || '—'}`,
        `<strong>Catégorie :</strong> ${tender.categorieLabel || tender.categorie || '—'}`,
        `<strong>Budget estimatif :</strong> ${formatXAF(tender.budget)}`,
        `<strong>Caution :</strong> ${tender.caution || '—'}`,
        `<strong>Frais DAO :</strong> ${tender.fraisDao || '—'}`,
        `<strong>Publication :</strong> ${tender.datePublication || '—'}`,
        `<strong>Date limite :</strong> ${tender.dateLimite || '—'}`,
        lots ? `<strong>Allotissement :</strong><br/>${lots}` : '',
        tender.description || '',
        tender.conditions ? `<strong>Conditions :</strong> ${tender.conditions}` : '',
        `<strong>Autorité contractante :</strong> ${tender.autorite || 'Direction Générale OPN — Owendo'}`,
      ].filter(Boolean),
      footer: `DAO officiel OPN Gabon — généré le ${new Date().toLocaleString('fr-FR')}. Imprimez en PDF depuis le navigateur.`,
    });
  };

  const handleDownloadPvAttribution = (att) => {
    downloadOfficialHtml(`PV-Attribution-${(att.ref || 'OPN').replace(/[^\w.-]+/g, '_')}`, {
      title: `Procès-Verbal Officiel d'Attribution — ${att.ref}`,
      subtitle: att.objet,
      bodyLines: [
        `<strong>Attributaire :</strong> ${att.attributaire}`,
        `<strong>Montant attribué :</strong> ${formatXAF(att.montant)}`,
        `<strong>Date d'attribution :</strong> ${att.dateAttribution}`,
        `<strong>Délai d'exécution :</strong> ${att.delaiExecution || '—'}`,
        `<strong>Visa DGCPMP :</strong> ${att.statutDgcpmp || '—'}`,
        `Le présent PV constate l'attribution du marché public conformément au Code des Marchés Publics du Gabon et aux procédures de la Direction des Marchés Publics de l'OPN.`,
      ],
    });
  };

  const handleSubmissionSubmit = (e) => {
    e.preventDefault();
    if (!submissionData.entreprise?.trim() || !submissionData.email?.includes('@')) {
      return;
    }
    const tender = selectedModalTender;
    const saved = persistMarcheSubmission({
      ...submissionData,
      marcheRef: tender?.ref,
      marcheTitre: tender?.titre,
    });
    downloadOfficialHtml(`recepisse-soumission-${saved.id}`, {
      title: `Récépissé de pré-soumission — ${saved.id}`,
      subtitle: tender?.ref || 'Marché public OPN',
      bodyLines: [
        `<strong>Entreprise :</strong> ${submissionData.entreprise}`,
        `<strong>RCCM :</strong> ${submissionData.rccm || '—'}`,
        `<strong>Contact :</strong> ${submissionData.contactNom || '—'}`,
        `<strong>E-mail :</strong> ${submissionData.email}`,
        `<strong>Téléphone :</strong> ${submissionData.telephone || '—'}`,
        `<strong>Lots :</strong> ${submissionData.lots || '—'}`,
        submissionData.commentaires ? `<strong>Commentaires :</strong> ${submissionData.commentaires}` : '',
        `Pré-soumission enregistrée le ${new Date().toLocaleString('fr-FR')}. Conservez ce récépissé pour le dépôt physique du dossier.`,
      ].filter(Boolean),
    });
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setShowSubmissionForm(false);
      setSelectedModalTender(null);
      setSubmissionData({
        entreprise: '',
        rccm: '',
        contactNom: '',
        email: '',
        telephone: '',
        lots: '',
        commentaires: '',
      });
    }, 2800);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      
      {/* 1. Bannière d'en-tête Institutionnelle Commande Publique */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2E68B4] to-[#0f766e] rounded-xl p-6 sm:p-8 text-white shadow-md mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-end pointer-events-none pr-6">
          <OpnLogo className="h-64 w-auto" variant="symbol" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#00A651] animate-pulse" />
            COMMANDE PUBLIQUE & TRANSPARENCE • DIRECTION DES MARCHÉS PUBLICS
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            PORTAIL DES MARCHÉS PUBLICS & APPELS D'OFFRES
          </h1>

          <p className="text-sm sm:text-base text-blue-100 mt-2 leading-relaxed">
            Consultez les avis officiels de mise en concurrence, téléchargez les Dossiers d'Appel d'Offres (DAO) et soumettez vos candidatures conformément au Code des Marchés Publics de la République Gabonaise (DGCPMP).
          </p>

          {/* 4 Indicateurs Clés de la Commande Publique */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
              <div className="text-[11px] text-blue-200 uppercase font-semibold">Appels d'Offres Actifs</div>
              <div className="text-xl font-black text-white mt-0.5">{sourceMarches.length} Avis en cours</div>
              <div className="text-[10px] text-emerald-300 font-medium mt-0.5">✓ Procédures ouvertes</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
              <div className="text-[11px] text-blue-200 uppercase font-semibold">Budget Total Estimé</div>
              <div className="text-xl font-black text-white mt-0.5">{formatXAF(totalBudgetEnConsultation)}</div>
              <div className="text-[10px] text-blue-200 font-medium mt-0.5">Exercice Budgétaire 2026</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
              <div className="text-[11px] text-blue-200 uppercase font-semibold">Cadre Réglementaire</div>
              <div className="text-xl font-black text-white mt-0.5">Code DGCPMP</div>
              <div className="text-[10px] text-emerald-300 font-medium mt-0.5">✓ Décret n°00027/PR</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/15">
              <div className="text-[11px] text-blue-200 uppercase font-semibold">Transparence OPN</div>
              <div className="text-xl font-black text-white mt-0.5">100% Équitable</div>
              <div className="text-[10px] text-blue-200 font-medium mt-0.5">Ouverture publique des plis</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation par Onglets de la Commande Publique */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tenders')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tenders'
              ? 'bg-[#2E68B4] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Avis d'Appels d'Offres en Cours ({sourceMarches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('awarded')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'awarded'
              ? 'bg-[#2E68B4] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Résultats & Marchés Attribués ({sourceAttributions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'guide'
              ? 'bg-[#2E68B4] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Guide du Soumissionnaire & Pièces Requises</span>
        </button>
      </div>

      {/* =========================================================================
          ONGLET 1 : AVIS D'APPELS D'OFFRES EN COURS
      ========================================================================= */}
      {activeTab === 'tenders' && (
        <div className="space-y-6">
          
          {/* Barre de Filtres & Recherche */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Champ Recherche */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par référence, titre, produit ou mot-clé..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filtre Catégorie */}
              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2E68B4]"
                >
                  <option value="ALL">Toutes les Catégories</option>
                  <option value="MEDICAMENTS">Médicaments & DCI</option>
                  <option value="DISPOSITIFS">Dispositifs Médicaux & Bloc</option>
                  <option value="EQUIPEMENTS">Équipements & Froid</option>
                  <option value="LOGISTIQUE">Logistique & Transport</option>
                  <option value="DIAGNOSTIC">Diagnostic & Tests Rapides</option>
                  <option value="SERVICES">Services, Audit & IT</option>
                </select>
              </div>

              {/* Filtre Type Procédure */}
              <div className="md:col-span-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2E68B4]"
                >
                  <option value="ALL">Toutes les Procédures</option>
                  <option value="AOI">Appels d'Offres Internationaux (AOI)</option>
                  <option value="AON">Appels d'Offres Nationaux (AON)</option>
                  <option value="DRP">Demandes de Renseignements de Prix (DRP)</option>
                  <option value="AMI">Manifestations d'Intérêt (AMI)</option>
                </select>
              </div>

            </div>

            {/* Pastilles de filtres rapides */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                Catégories :
              </span>

              {[
                { key: 'ALL', label: 'Tous les Marchés' },
                { key: 'MEDICAMENTS', label: 'Médicaments (DCI)' },
                { key: 'DISPOSITIFS', label: 'Dispositifs Médicaux' },
                { key: 'EQUIPEMENTS', label: 'Chaîne de Froid' },
                { key: 'LOGISTIQUE', label: 'Logistique & Fret' },
                { key: 'DIAGNOSTIC', label: 'Tests Rapides' },
                { key: 'SERVICES', label: 'Prestations & Audit' }
              ].map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#2E68B4] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {cat.label}
                  </button>
                );
              })}

              {(selectedCategory !== 'ALL' || selectedType !== 'ALL' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedType('ALL');
                    setSearchTerm('');
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors whitespace-nowrap flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Grille des Appels d'Offres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarches.length === 0 ? (
              <div className="col-span-full py-12 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2 opacity-80" />
                <div className="font-bold text-sm text-slate-700">Aucun appel d'offres ne correspond à vos critères.</div>
                <div className="text-xs text-slate-500 mt-1">Modifiez vos critères de recherche ou réinitialisez les filtres.</div>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedType('ALL');
                    setSearchTerm('');
                  }}
                  className="mt-3 px-4 py-1.5 bg-[#2E68B4] text-white text-xs font-bold rounded-md hover:bg-[#215091] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              filteredMarches.map((mp) => (
                <div 
                  key={mp.id} 
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all shadow-xs group"
                >
                  <div className="space-y-3.5">
                    
                    {/* Header Carte : Type et Statut */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-[#2E68B4] text-white">
                        {mp.typeCode}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#00A651] bg-emerald-50 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] animate-pulse" />
                        {mp.statutLabel}
                      </span>
                    </div>

                    {/* Référence et Titre */}
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 block">
                        {mp.ref}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug group-hover:text-[#2E68B4] transition-colors line-clamp-2">
                        {mp.titre}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                        {mp.description}
                      </p>
                    </div>

                    {/* Badge Catégorie */}
                    <div className="pt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <Layers className="w-3 h-3 mr-1 text-[#2E68B4]" />
                        {mp.categorieLabel}
                      </span>
                    </div>

                    {/* Métriques Financières & Délais */}
                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs bg-slate-50/70 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-blue-600" />
                          Budget Prévisionnel :
                        </span>
                        <span className="font-black text-[#2E68B4] text-xs">
                          {formatXAF(mp.budget)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-rose-600" />
                          Date Limite :
                        </span>
                        <span className="font-bold text-rose-700 text-xs">
                          {mp.dateLimite}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Caution de Soumission :</span>
                        <span className="font-semibold text-slate-800">{mp.caution}</span>
                      </div>
                    </div>

                  </div>

                  {/* Boutons d'Action */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => handleDownloadDao(mp)}
                      className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                      title="Télécharger le Dossier d'Appel d'Offres"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>DAO (PDF)</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedModalTender(mp);
                        setShowSubmissionForm(false);
                      }}
                      className="py-2 px-2 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Détails & Dépôt</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Cartouche d'Assistance aux Soumissionnaires */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                Cellule d'Appui & Hotline des Marchés Publics
              </div>
              <h3 className="text-lg font-bold text-white">Besoin d'éclaircissements sur un Dossier d'Appel d'Offres ?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conformément à la réglementation DGCPMP, toute demande d'éclaircissement doit être adressée par écrit à la Direction des Marchés Publics au plus tard 10 jours avant la date limite de remise des offres.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a 
                href={`mailto:${hotlineEmail}?subject=Demande d'éclaircissement Marché Public OPN`}
                className="px-4 py-2.5 rounded-lg bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Écrire à la DMP</span>
              </a>
              <a 
                href={`tel:${hotlineHref}`}
                className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{hotlineTel}</span>
              </a>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          ONGLET 2 : MARCHÉS ATTRIBUÉS & TRANSPARENCE DGCPMP
      ========================================================================= */}
      {activeTab === 'awarded' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Procès-Verbaux d'Attribution & Transparence</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publication obligatoire des résultats d'attribution provisoire et définitive visés par la DGCPMP.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                100% Conforme Code DGCPMP
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Référence Marché</th>
                    <th className="py-3 px-4">Objet de la Consultation</th>
                    <th className="py-3 px-4">Entreprise Attributaire</th>
                    <th className="py-3 px-4 text-right">Montant Attribué</th>
                    <th className="py-3 px-4 text-center">Date & Visa DGCPMP</th>
                    <th className="py-3 px-3 text-center">PV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sourceAttributions.map((att, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {att.ref}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs">
                        {att.objet}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#2E68B4] flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {att.attributaire}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        {formatXAF(att.montant)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-semibold text-slate-800">{att.dateAttribution}</div>
                        <div className="text-[10px] text-emerald-600 font-medium">{att.statutDgcpmp}</div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadPvAttribution(att)}
                          className="p-1.5 rounded hover:bg-blue-100 text-slate-600 hover:text-[#2E68B4] transition-colors"
                          title="Télécharger le PV d'attribution"
                        >
                          <FileCheck className="w-4 h-4 text-[#2E68B4]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ONGLET 3 : GUIDE DU SOUMISSIONNAIRE & PIÈCES REQUISES
      ========================================================================= */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Dossier 1 : Pièces Administratives */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#2E68B4] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">1. Pièces Administratives Obligatoires</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toute soumission doit comprendre impérativement sous enveloppe cachetée A :
              </p>
              <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4">
                <li>Quitus fiscal de la DGI en cours de validité (Gabon) ou équivalent pays d'origine.</li>
                <li>Attestation de mise à jour des cotisations CNSS / CNAMGS.</li>
                <li>Extrait du Registre du Commerce et du Crédit Mobilier (RCCM).</li>
                <li>Attestation de non-faillite délivrée par le Tribunal compétent.</li>
                <li>Cautionnement bancaire de soumission conforme au modèle du DAO.</li>
              </ul>
            </div>

            {/* Dossier 2 : Offre Technique & Qualité */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#00A651] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">2. Offre Technique & Assurance Qualité</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exigences strictes pour les produits de santé sous enveloppe B :
              </p>
              <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4">
                <li>Autorisation de Mise sur le Marché (AMM) délivrée par la Direction du Médicament.</li>
                <li>Certificat de Bonnes Pratiques de Fabrication (BPF / GMP) préqualifié OMS.</li>
                <li>Certificat d'Analyse (COA) complet pour chaque lot proposé.</li>
                <li>Engagement ferme sur la durée de validité résiduelle (minimum 80% à la livraison).</li>
                <li>Échantillons conformes déposés au Laboratoire National de Contrôle.</li>
              </ul>
            </div>

            {/* Dossier 3 : Offre Financière & Dépôt */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">3. Offre Financière & Procédure de Dépôt</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modalités de chiffrage et transmission sous enveloppe C :
              </p>
              <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4">
                <li>Bordereau des Prix Unitaires (BPU) ferme et non révisable en Franc CFA (XAF) ou devises convertibles.</li>
                <li>Devis Quantitatif et Estimatif (DQE) par lot d'approvisionnement.</li>
                <li>Dépôt physique en 1 original + 3 copies à la Direction Générale de l'OPN à Oloumi.</li>
                <li>Possibilité de pré-enregistrement dématérialisé sur ce portail officiel.</li>
                <li>Séance publique d'ouverture des plis en présence des soumissionnaires.</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODALE DÉTAILLÉE : CONSULTATION DU DAO & SOUMISSION EN LIGNE
      ========================================================================= */}
      {selectedModalTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            
            {/* Header Modale */}
            <div className="bg-[#2E68B4] text-white p-6 sticky top-0 z-10 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#00A651]" />
                  {selectedModalTender.type}
                </div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug">
                  {selectedModalTender.titre}
                </h3>
                <div className="text-xs text-blue-100 font-mono mt-1">
                  Réf : {selectedModalTender.ref}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedModalTender(null);
                  setShowSubmissionForm(false);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps de la Modale */}
            <div className="p-6 space-y-6">
              
              {!showSubmissionForm ? (
                <>
                  {/* Résumé des Modalités Clés */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Budget Prévisionnel</span>
                      <strong className="text-slate-900 text-sm font-black text-[#2E68B4]">{formatXAF(selectedModalTender.budget)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Date Limite de Dépôt</span>
                      <strong className="text-rose-700 text-xs font-bold">{selectedModalTender.dateLimite}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Caution de Soumission</span>
                      <strong className="text-slate-900 text-xs font-semibold">{selectedModalTender.caution}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Frais d'Achat du DAO</span>
                      <strong className="text-slate-900 text-xs font-semibold">{selectedModalTender.fraisDao}</strong>
                    </div>
                  </div>

                  {/* Description & Objectif Sanitaire */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#2E68B4]" />
                      Objet & Contexte du Marché
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-3.5 rounded-lg border border-blue-100">
                      {selectedModalTender.description}
                    </p>
                  </div>

                  {/* Allotissement */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#2E68B4]" />
                      Composition des Lots du Marché ({selectedModalTender.allotissement.length} Lots)
                    </h4>
                    <div className="space-y-2">
                      {selectedModalTender.allotissement.map((lot, lIdx) => (
                        <div key={lIdx} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-[#2E68B4] mr-2">{lot.num} :</span>
                            <span className="text-slate-800 font-medium">{lot.nom}</span>
                          </div>
                          <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded shrink-0">
                            {lot.budget}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conditions & Exigences Techniques */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
                      Critères d'Éligibilité & Exigences Techniques
                    </h4>
                    <p className="text-xs text-slate-700 bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100 leading-relaxed">
                      {selectedModalTender.conditions}
                    </p>
                  </div>

                  {/* Boutons d'Action Principaux */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => handleDownloadDao(selectedModalTender)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-[#2E68B4]" />
                      <span>Télécharger le DAO Officiel (PDF)</span>
                    </button>

                    <button
                      onClick={() => setShowSubmissionForm(true)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Déposer une Pré-soumission en Ligne</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Formulaire de Soumission / Déclaration d'Intérêt en Ligne */
                <form onSubmit={handleSubmissionSubmit} className="space-y-4">
                  <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                    <div>
                      <strong>Pré-enregistrement de Soumission :</strong> {selectedModalTender.ref}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSubmissionForm(false)}
                      className="text-xs text-[#2E68B4] font-bold hover:underline"
                    >
                      ← Retour au descriptif
                    </button>
                  </div>

                  {submissionSuccess ? (
                    <div className="py-10 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-12 h-12 text-[#00A651] mx-auto animate-bounce" />
                      <h4 className="text-base font-bold text-emerald-900">Pré-soumission Enregistrée avec Succès !</h4>
                      <p className="text-xs text-emerald-700 max-w-md mx-auto">
                        Votre dossier a été enregistré sous la référence <strong>REC-2026-{Math.floor(100000 + Math.random() * 900000)}</strong>. Un récépissé officiel vous a été transmis par email.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Raison Sociale de l'Entreprise *</label>
                          <input
                            type="text"
                            required
                            value={submissionData.entreprise}
                            onChange={(e) => setSubmissionData({ ...submissionData, entreprise: e.target.value })}
                            placeholder="Ex: Laboratoires GABON PHARMA S.A."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Numéro RCCM / Identifiant Fiscal *</label>
                          <input
                            type="text"
                            required
                            value={submissionData.rccm}
                            onChange={(e) => setSubmissionData({ ...submissionData, rccm: e.target.value })}
                            placeholder="Ex: RG-LBV-2024-B-1402"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Nom & Prénom du Responsable Soumission *</label>
                          <input
                            type="text"
                            required
                            value={submissionData.contactNom}
                            onChange={(e) => setSubmissionData({ ...submissionData, contactNom: e.target.value })}
                            placeholder="Ex: Dr. Jean-Marc OBAME"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Email Professionnel pour Notification *</label>
                          <input
                            type="email"
                            required
                            value={submissionData.email}
                            onChange={(e) => setSubmissionData({ ...submissionData, email: e.target.value })}
                            placeholder="contact@entreprise.com"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Téléphone de Contact Direct *</label>
                          <input
                            type="tel"
                            required
                            value={submissionData.telephone}
                            onChange={(e) => setSubmissionData({ ...submissionData, telephone: e.target.value })}
                            placeholder="+241 74 00 00 00"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Lots Soumissionnés *</label>
                          <select
                            required
                            value={submissionData.lots}
                            onChange={(e) => setSubmissionData({ ...submissionData, lots: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                          >
                            <option value="">Sélectionner les lots...</option>
                            <option value="TOUS">Tous les Lots (Offre Globale)</option>
                            {selectedModalTender.allotissement.map((lot, idx) => (
                              <option key={idx} value={lot.num}>{lot.num} : {lot.nom}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="text-xs">
                        <label className="block font-bold text-slate-700 mb-1">Observations / Demande d'Éclaircissements Éventuelle</label>
                        <textarea
                          rows={3}
                          value={submissionData.commentaires}
                          onChange={(e) => setSubmissionData({ ...submissionData, commentaires: e.target.value })}
                          placeholder="Précisions sur vos agréments techniques, délais proposés ou questions relatives au DAO..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E68B4] focus:bg-white"
                        />
                      </div>

                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                        <strong>Rappel réglementaire :</strong> Ce pré-enregistrement électronique doit être confirmé par le dépôt physique du dossier complet (Offre technique, administrative et financière sous plis scellés) à la Direction Générale de l'OPN à Libreville (Oloumi) avant la date limite officielle.
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setShowSubmissionForm(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Annuler
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Valider la Pré-soumission</span>
                        </button>
                      </div>
                    </>
                  )}

                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
