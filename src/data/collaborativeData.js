// Données Collaboratives OPN Connect : Canaux Officiels, Salons de Crise, Réunions & Partage GED

export const COLLABORATIVE_CHANNELS = [
  {
    id: "CH-DIR-GEN",
    nom: "Direction Générale & Cabinet Ministériel",
    tag: "#direction-generale",
    type: "HIERARCHIE",
    description: "Canal hautement sécurisé pour les arbitrages stratégiques, visas budgétaires et suivi PNA 2026",
    membresCount: 12,
    isPrivate: true,
    unreadCount: 1,
    messages: [
      {
        id: "MSG-DIR-01",
        expediteurId: "USER-DG-01",
        expediteurNom: "Dr. Jude MBAKOMO",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=faces&auto=format&q=80",
        role: "Directeur Général",
        texte: "Rappel à tous les directeurs : le Bulletin mensuel pharmaceutique de Septembre 2026 est validé. L'exécution du PNA atteint 74,0% avec 14,24 Mrd FCFA de stock national consolidé.",
        date: "18/09/2026 à 08:30",
        type: "TEXTE",
        documentPartage: {
          id: "DOC-BULLETIN-09",
          titre: "Bulletin mensuel pharmaceutique — Sept 2026.pdf",
          typeDoc: "RAPPORT_STRATEGIQUE",
          badge: "Cabinet DG",
          taille: "3.4 Mo"
        },
        reactions: ["👏", "🇬🇦", "🏛️"]
      },
      {
        id: "MSG-DIR-02",
        expediteurId: "USER-DAF-01",
        expediteurNom: "M. Fabrice MENGUE",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&auto=format&q=80",
        role: "Directeur des Affaires Financières",
        texte: "Le rapprochement des encaissements CNAMGS affiche 2,15 Mrd FCFA (87,6%). Les 303,8 M FCFA de créances résiduelles font l'objet d'un mandatement auprès du Trésor Public.",
        date: "18/09/2026 à 09:15",
        type: "TEXTE",
        reactions: ["✅", "💳"]
      }
    ]
  },
  {
    id: "CH-ANT-9",
    nom: "Coordination des 9 Antennes Provinciales",
    tag: "#antennes-provinces-9",
    type: "PROVINCIAL",
    description: "Échanges opérationnels entre le Hub Central d'Owendo et les 9 Pharmaciens Chefs Provinciaux",
    membresCount: 34,
    isPrivate: false,
    unreadCount: 2,
    messages: [
      {
        id: "MSG-ANT-01",
        expediteurId: "USER-DG-02",
        expediteurNom: "Dr. Jean-Marc ONDO",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&auto=format&q=80",
        role: "Directeur du Hub d'Owendo",
        texte: "Bonjour aux 9 antennes. Le convoi ferroviaire SETRAG à destination de Franceville est chargé avec 24 tonnes de DCI essentiels. Le convoi routier RN1 Sud vers Mouila et Tchibanga a quitté Owendo à 06h00.",
        date: "18/09/2026 à 07:45",
        type: "TEXTE",
        documentPartage: {
          id: "DOC-BL-FRV-01",
          titre: "Bordereau_Livraison_BL-2026-FRV-001_SETRAG.pdf",
          typeDoc: "BORDEREAU_LIVRAISON",
          badge: "BL Officiel",
          taille: "1.8 Mo"
        },
        reactions: ["📦", "🚚", "👍"]
      },
      {
        id: "MSG-ANT-02",
        expediteurId: "USER-ANT-03",
        expediteurNom: "Dr. Sylvie MPIGA",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces&auto=format&q=80",
        role: "Pharmacienne Chef Franceville",
        texte: "Bien reçu Dr. ONDO. L'équipe de déchargement est mobilisée à la gare de Moanda. Les chambres froides de Franceville (+4.1°C) sont prêtes pour l'intégration FEFO des lots.",
        date: "18/09/2026 à 08:20",
        type: "TEXTE",
        reactions: ["❄️", "✅"]
      }
    ]
  },
  {
    id: "CH-FROID-GMAO",
    nom: "Cellule Métrologie Froid & Énergies (GMAO)",
    tag: "#cellule-froid-gmao",
    type: "TECHNIQUE",
    description: "Supervision IoT des 18 chambres froides (+2°C/+8°C / -80°C) et 14 groupes électrogènes",
    membresCount: 16,
    isPrivate: true,
    unreadCount: 0,
    messages: [
      {
        id: "MSG-GMAO-01",
        expediteurId: "USER-GMAO-01",
        expediteurNom: "Ing. Michel ESSONO",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces&auto=format&q=80",
        role: "Ingénieur Froid & GMAO",
        texte: "Point métrologie : Les 18 enceintes frigorifiques du territoire sont à 100% dans leur plage nominale (+4.2°C moyen). La qualification annuelle 24 sondes sur 72h de la chambre CFP-OW-01 est validée conforme OMS TRS 957.",
        date: "18/09/2026 à 09:00",
        type: "TEXTE",
        documentPartage: {
          id: "DOC-QUALIF-FROID-01",
          titre: "Rapport_Qualification_Thermique_CFP-OW-01_2026.pdf",
          typeDoc: "QUALIFICATION_FROID",
          badge: "Homologation OMS",
          taille: "4.2 Mo"
        },
        reactions: ["❄️", "⚡", "👏"]
      }
    ]
  },
  {
    id: "CH-CRISE-COUS",
    nom: "Cellule de Crise Sanitaire & Urgences (COD / COUS)",
    tag: "#crise-sanitaire-cous",
    type: "URGENCE",
    description: "Déclenchement des kits RSSE, ripostes épidémiques et régulation médicale sous haute priorité",
    membresCount: 18,
    isPrivate: true,
    unreadCount: 1,
    messages: [
      {
        id: "MSG-COUS-01",
        expediteurId: "USER-COUS-01",
        expediteurNom: "Dr. Martial NDOUTOUME",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&auto=format&q=80",
        role: "Coordinateur National COD",
        texte: "ALERTE NATIONALE URG-2026-088 : Morsures multiples de vipères du Gabon à Makokou. L'Arrêté de Réquisition Sanitaire a été signé par le DG. 40 flacons d'Antivipmyn déstockés depuis la RSSE Owendo et convoyés sous escorte.",
        date: "18/09/2026 à 07:15",
        type: "TEXTE",
        documentPartage: {
          id: "DOC-ARRETE-REQ-088",
          titre: "Arrete_Requisition_Sanitaire_URG-2026-088_Makokou.pdf",
          typeDoc: "ARRETE_REQUISITION",
          badge: "Acte d'Urgence Vitale",
          taille: "2.1 Mo"
        },
        reactions: ["👍", "🇬🇦", "⚡"]
      }
    ]
  },
  {
    id: "CH-ACHATS-MARCHES",
    nom: "Achats, Marchés Publics & Importations",
    tag: "#achats-marches-fournisseurs",
    type: "ACHATS",
    description: "Suivi des appels d'offres internationaux, dédouanement Owendo et relations laboratoires agréés",
    membresCount: 14,
    isPrivate: true,
    unreadCount: 0,
    messages: [
      {
        id: "MSG-ACH-01",
        expediteurId: "USER-ACH-01",
        expediteurNom: "Mme Gertrude NDZIÉ",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces&auto=format&q=80",
        role: "Chef du Service Achats",
        texte: "Le Bon de Commande BC-2026-004 pour les antipaludiques Guilin Pharma (485 000 EUR CIF Owendo) est confirmé. Les conteneurs arrivent au port d'Owendo par navire Maersk le 24 Septembre.",
        date: "17/09/2026 à 16:30",
        type: "TEXTE",
        documentPartage: {
          id: "DOC-BC-GUILIN-004",
          titre: "Bon_Commande_International_BC-2026-004_Guilin.pdf",
          typeDoc: "BON_COMMANDE",
          badge: "Marché Public",
          taille: "2.6 Mo"
        },
        reactions: ["🚢", "📦"]
      }
    ]
  }
];

export const VIRTUAL_MEETINGS = [
  {
    id: "MEET-01",
    titre: "Conférence Mensuelle des 9 Directeurs d'Antennes Provinciales",
    date: "Aujourd'hui",
    heure: "14h00 - 15h30 (Heure de Libreville)",
    hote: "Dr. Jude MBAKOMO (Directeur Général)",
    niveau: "Conseil National Exécutif",
    participants: ["DG", "DAF", "DIR", "Franceville (G2)", "Lambaréné (G3)", "Mouila (G4)", "Tchibanga (G5)", "Makokou (G6)", "Koula-Moutou (G7)", "Port-Gentil (G8)", "Oyem (G9)"],
    ordreDuJour: [
      "1. Bilan d'exécution du PNA 2026 (18,5 Mrd FCFA)",
      "2. Sécurisation de la chaîne du froid et maintenance GMAO",
      "3. État des pistes forestières et cadencement des convois",
      "4. Déploiement des kits d'urgence sanitaire RSSE"
    ],
    statut: "EN_DIRECT",
    jitsiRoom: "opn-conseil-9-provinces-2026",
    lienWebRTC: "opn-visio://opn-conseil-9-provinces-2026"
  },
  {
    id: "MEET-02",
    titre: "Cellule de Crise COD — Déploiement d'Urgence Makokou",
    date: "Sur alerte",
    heure: "En cours (Activation COD)",
    hote: "Dr. Martial NDOUTOUME (COUS)",
    niveau: "Crise Sanitaire COUS",
    participants: ["Coordinateur COD", "DG", "Pharmacien Chef National", "Chef d'Antenne Makokou", "Chef de Convoi"],
    ordreDuJour: [
      "1. Acheminement immédiat des 40 flacons Antivipmyn Afrique",
      "2. Coordination avec le médecin chef du CHR de Makokou",
      "3. Déblocage du vecteur d'intervention 4x4 tout-terrain"
    ],
    statut: "EN_DIRECT",
    jitsiRoom: "opn-cod-crise-nationale",
    lienWebRTC: "opn-visio://opn-cod-crise-nationale"
  },
  {
    id: "MEET-03",
    titre: "Comité Visas & Engagements Financiers DAF · DG",
    date: "Vendredi 25 Septembre 2026",
    heure: "10h00 - 11h30",
    hote: "M. Fabrice MENGUE (DAF)",
    niveau: "Hiérarchie visas",
    participants: ["DG", "DAF", "Dir. Opérations", "Contrôleur de Gestion"],
    ordreDuJour: [
      "1. Apurement des créances CNAMGS avec le Trésor Public",
      "2. Validation des appels d'offres internationaux PNA 2027"
    ],
    statut: "PROGRAMMEE",
    jitsiRoom: "opn-comite-visas-hierarchie",
    lienWebRTC: "opn-visio://opn-comite-visas-hierarchie"
  }
];

export const OFFICIAL_DOCUMENTS_GED = [
  {
    id: "DOC-01",
    titre: "Dossier d'Appel d'Offres International N°004/OPN/DGA/2026",
    categorie: "Marchés Publics",
    montantEstimeXAF: 18500000000,
    datePublication: "01/09/2026",
    format: "PDF",
    taille: "4.8 Mo",
    description: "Fourniture de médicaments essentiels génériques et consommables médico-chirurgicaux pour le compte des 9 antennes provinciales."
  },
  {
    id: "DOC-02",
    titre: "Guide Pratique National de Gestion des Stocks FEFO & Traçabilité",
    categorie: "Procédures & Qualité",
    datePublication: "15/08/2026",
    format: "PDF",
    taille: "3.2 Mo",
    description: "Manuel opérationnel destiné aux pharmaciens chefs et magasiniers provinciaux de l'OPN."
  },
  {
    id: "DOC-03",
    titre: "Arrêté de Réquisition Sanitaire & Déploiement d'Urgence RSSE",
    categorie: "Urgences & Crise",
    datePublication: "18/09/2026",
    format: "PDF",
    taille: "2.1 Mo",
    description: "Acte d'autorité publique portant mobilisation des sérums antivenimeux pour la province de l'Ogooué-Ivindo."
  },
  {
    id: "DOC-04",
    titre: "Rapport Officiel de Qualification Thermique 18 Chambres Froides",
    categorie: "GMAO & Froid",
    datePublication: "10/09/2026",
    format: "PDF",
    taille: "4.2 Mo",
    description: "Cartographie thermique 24 sondes sur 72h conforme aux normes OMS / PQS et Bonnes Pratiques de Distribution."
  }
];
