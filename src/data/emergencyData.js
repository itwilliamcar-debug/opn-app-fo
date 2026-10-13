// Données du Centre Opérationnel des Urgences Sanitaires (COD Libreville OPN)

export const EMERGENCY_INCIDENTS = [
  {
    id: "URG-2026-088",
    titre: "Rupture Imminente Sérum Antivenimeux Polyvalent",
    provinceId: "G6", // Ogooué-Ivindo
    provinceNom: "Ogooué-Ivindo",
    lieuPrecis: "Centre Hospitalier Régional (CHR) de Makokou",
    typeUrgence: "PHARMACEUTIQUE", // 'PHARMACEUTIQUE', 'LOGISTIQUE', 'TERRAIN_EPIDEMIQUE'
    gravite: "CRITIQUE", // 'INFO', 'VIGILANCE', 'CRITIQUE', 'URGENCE_ABSOLUE'
    statut: "EN_COURS", // 'NOUVEAU', 'PRISE_EN_CHARGE', 'EN_COURS', 'RESOLU'
    dateDeclaration: "07/09/2026 à 07h45",
    declarantNom: "Dr. Serge MEZUI M'ELLA (Pharmacien Chef)",
    description: "Stock local réduit à 4 flacons suite à 3 cas d'envenimations graves dans les plantations de Koumameyong. Risque de rupture sous 48h.",
    produitsConcernes: [
      { produitId: "MED-SER-004", designation: "Sérum Polyvalent Antivenimeux", quantiteDemandee: 30 }
    ],
    equipeAffectee: "Équipe Convoi Rapide 4x4 OPN Owendo - Chauffeur: M. Rodrigue MAVOUNGOU",
    actionEngagee: "Convoi spécial parti d'Owendo le 07/09 à 09h00 avec glacières autonomes à température contrôlée.",
    tempsPriseEnChargeMinutes: 18,
    coordonnees: { lat: 0.5667, lng: 12.8667 }
  },
  {
    id: "URG-2026-087",
    titre: "Tension Stock Critique Insuline Actrapid",
    provinceId: "G2", // Haut-Ogooué
    provinceNom: "Haut-Ogooué",
    lieuPrecis: "CHR Amissa Bongo de Franceville",
    typeUrgence: "PHARMACEUTIQUE",
    gravite: "VIGILANCE",
    statut: "PRISE_EN_CHARGE",
    dateDeclaration: "06/09/2026 à 15h20",
    declarantNom: "M. Brice ELLA MBA",
    description: "Hausse soudaine des admissions diabétiques. Stock restant : 210 flacons (couverture estimée à 5 jours).",
    produitsConcernes: [
      { produitId: "MED-INS-005", designation: "Insuline Humaine Rapide 100 UI/ml", quantiteDemandee: 500 }
    ],
    equipeAffectee: "Wagon Frigo Setrag N°884 en transit ferroviaire",
    actionEngagee: "Intégré en urgence dans le wagon Setrag parti le 05/09. Arrivée prévue le 09/09.",
    tempsPriseEnChargeMinutes: 24,
    coordonnees: { lat: -1.6333, lng: 13.5833 }
  },
  {
    id: "URG-2026-085",
    titre: "Panne Camion Convoi Logistique RN1 près de Bifoun",
    provinceId: "G3", // Moyen-Ogooué
    provinceNom: "Moyen-Ogooué",
    lieuPrecis: "Route Nationale 1, PK 142 (Axe Kango-Bifoun)",
    typeUrgence: "LOGISTIQUE",
    gravite: "CRITIQUE",
    statut: "RESOLU",
    dateDeclaration: "04/09/2026 à 14h10",
    declarantNom: "M. Rodrigue MAVOUNGOU",
    description: "Crevaison multiple et surchauffe moteur sur le camion frigorifique OPN transportant les solutés de réanimation.",
    produitsConcernes: [],
    equipeAffectee: "Véhicule atelier de dépannage OPN Owendo",
    actionEngagee: "Dépannage d'urgence effectué en 3h15. Température de la cargaison préservée à 18°C. Convoi reparti vers Lambaréné.",
    tempsPriseEnChargeMinutes: 12,
    coordonnees: { lat: -0.2500, lng: 10.1500 }
  }
];
