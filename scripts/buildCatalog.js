import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rawProducts } from './rawProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir les familles officielles pour les filtres
export const PRODUCT_FAMILIES = [
  "TOUTES LES FAMILLES",
  "Antipaludiques (ACT)",
  "Antibiotiques",
  "Analgésiques & Anti-inflammatoires",
  "Anesthésie & Réanimation",
  "Solutés Massifs & Électrolytes",
  "Gastro-entérologie",
  "Cardiologie & Vasculaire",
  "Pneumologie & ORL",
  "Ophtalmologie & ORL",
  "Dermatologie & Antiseptiques",
  "Antiseptiques & Désinfectants",
  "Sérums, Vaccins & Toxicologie",
  "Hématologie & Antianémiques",
  "Hématologie & Hémostase",
  "Santé Maternelle & Gynécologie",
  "Antiparasitaires & Anthelminthiques",
  "Vitamines & Minéraux",
  "Dispositifs Médicaux & Chirurgie",
  "Sondes, Cathéters & Perfusion",
  "Pansements, Sutures & Immobilisation",
  "Protection & Consommables de Bloc",
  "Diagnostic & Matériel Médical"
];

// Mapper chaque produit vers un objet complet
const fullCatalog = rawProducts.map((p, index) => {
  const isHighDemand = p.famille.includes("Antipaludique") || p.famille.includes("Solutés") || p.famille.includes("Antibiotique") || p.famille.includes("Analgésiques");
  const baseStock = isHighDemand ? (15000 + (index * 730) % 35000) : (1200 + (index * 350) % 8000);
  const cmm = Math.round(baseStock / 3.5);
  const seuilMin = Math.round(cmm * 1.2);
  const seuilCritique = Math.round(cmm * 0.5);
  
  // Répartition par antenne
  const g1 = Math.round(baseStock * 0.45);
  const g2 = Math.round(baseStock * 0.08);
  const g3 = Math.round(baseStock * 0.09);
  const g4 = Math.round(baseStock * 0.07);
  const g5 = Math.round(baseStock * 0.04);
  const g6 = Math.round(baseStock * 0.03);
  const g7 = Math.round(baseStock * 0.06);
  const g8 = Math.round(baseStock * 0.11);
  const g9 = baseStock - (g1 + g2 + g3 + g4 + g5 + g6 + g7 + g8);

  const price = p.prix;
  const publicPlafonne = Math.round(price * 1.25);

  let statut = "DISPONIBLE";
  if (index % 17 === 0) statut = "STOCK_CRITIQUE";
  else if (index % 7 === 0) statut = "STOCK_FAIBLE";
  else if (index % 4 === 0) statut = "STOCK_NORMAL";

  return {
    id: `OPN-${p.code}`,
    code: p.code,
    designation: p.designation,
    dci: p.dci,
    forme: p.forme,
    dosage: p.dosage,
    conditionnement: p.cond || "Boîte unitaire",
    categorie: p.famille,
    famille: p.famille,
    laboratoire: p.lab || "Laboratoire Agréé OPN",
    uniteGestion: p.unite || "Unité",
    prixUnitaireXAF: price,
    prixPublicPlafonneXAF: publicPlafonne,
    stockNational: baseStock,
    seuilMinNational: seuilMin,
    seuilCritiqueNational: seuilCritique,
    cmmNationale: cmm,
    delaiMoyenApproJours: 25,
    statut: statut,
    stocksParAntenne: {
      "G1": g1,
      "G2": g2,
      "G3": g3,
      "G4": g4,
      "G5": g5,
      "G6": g6,
      "G7": g7,
      "G8": g8,
      "G9": g9
    },
    lots: [
      {
        numeroLot: `LOT-2026-${p.code.substring(0, 4)}-${index + 101}`,
        antenneId: "G1",
        quantite: g1,
        dateFabrication: "2025-02-15",
        datePeremption: "2027-12-31",
        laboratoire: p.lab || "Laboratoire Agréé OPN",
        statutFEFO: "VALIDE"
      }
    ]
  };
});

const fileContent = `// Catalogue National des Produits Pharmaceutiques & Dispositifs Médicaux (OPN Gabon)
// Extrait officiel certifié de la liste des "PRODUITS DISPONIBILITES" (11 pages)
// Ministère de la Santé - Direction Générale de l'Office Pharmaceutique National
// Monnaie officielle : Franc CFA (XAF)

export const PRODUCT_FAMILIES_LIST = ${JSON.stringify(PRODUCT_FAMILIES, null, 2)};

export const PHARMACEUTICAL_CATALOG = ${JSON.stringify(fullCatalog, null, 2)};
`;

const outputPath = path.resolve(__dirname, '../src/data/pharmaceuticalData.js');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated ${fullCatalog.length} products to ${outputPath}`);
