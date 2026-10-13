# Architecture OPN Digital Hub - Organisation par Directions

## Vue d'ensemble

Le système est organisé par **Directions** métiers, chaque direction ayant ses propres modules, fonctionnalités et utilisateurs avec des niveaux d'accès granulaires.

---

## 1. Direction Générale (DG)

**Modules:**
- Dashboard Stratégique National
- Supervision Toutes Directions
- Visas & Signatures DG
- Centre de Décision (COD)
- Rapports & Audit
- Gestion SuperAdmin

**Niveaux d'accès:**
- **Directeur Général** - Accès total, visas finaux
- **Cabinet DG** - Lecture et préparation de dossiers
- **Assistant DG** - Agenda et correspondances

---

## 2. Direction des Approvisionnements (APPRO)

**Modules:**
- Planification & CMM Nationale
- Hub Central WMS Owendo
- Allocation FEFO
- Supervision 9 Antennes
- Réserves Stratégiques (RSSE)

**Niveaux d'accès:**
- **Directeur Appro** - Validation nationale, transfert achats
- **Collaborateur Appro** - Instruction, traitement dossiers
- **Planificateur** - CMM et simulations
- **Gestionnaire Stock** - WMS et inventaires

---

## 3. Direction Administrative et Financière (DAF)

**Modules:**
- Facturation & Recouvrement
- Intégration Trésor Public (DGCPT)
- Budget & Engagements
- Comptabilité Fournisseurs
- Paie & RH

**Niveaux d'accès:**
- **Directeur Financier (DAF)** - Visa engagement budgétaire
- **Comptable Principal** - Lettrage et rapprochements
- **Gestionnaire Paie** - Salaires et primes
- **Agent Recouvrement** - Factures et relances

---

## 4. Direction de la Logistique

**Modules:**
- Distribution Dernier Kilomètre
- Flotte & Convois
- GMAO Maintenance
- Chaîne du Froid IoT
- Pistes & Transport

**Niveaux d'accès:**
- **Directeur Logistique** - Supervision globale
- **Gestionnaire Flotte** - Planification tournées
- **Chef Convoi** - Escortes et sécurité
- **Convoyeur** - Exécution terrain, QR codes

---

## 5. Direction de la Qualité Pharmaceutique

**Modules:**
- Qualité & Conformité LNCM
- Pharmacovigilance
- Contrôle Qualité COA
- Dossier Médical Patient (DMP)
- Homologations & Retraits

**Niveaux d'accès:**
- **Pharmacien Chef National** - Supervision qualité
- **Responsable Qualité** - Contrôle et vigilance
- **Technicien Labo** - Analyses et tests
- **Inspecteur** - Audits et conformité

---

## 6. Direction des Achats Internationaux

**Modules:**
- Marchés & Appels d'Offres
- Panel Fournisseurs
- Incoterms & Douanes (BAE)
- Contrats & Négociation
- Suivi Commandes Fournisseurs

**Niveaux d'accès:**
- **Directeur Achats** - Décision marchés
- **Chargé Achats** - Gestion fournisseurs
- **Juridique Marchés** - Contrats et AOI
- **Assistant Achats** - Saisie et suivi

---

## 7. Direction des Ressources Humaines

**Modules:**
- Gestion des Postes
- Recrutement & Intégration
- Formation & Certification
- Évaluation Performance
- Administration Personnel

**Niveaux d'accès:**
- **DRH** - Décisions RH
- **Gestionnaire Carrières** - Postes et recrutement
- **Responsable Formation** - Programmes certifiants
- **Assistant RH** - Administration quotidienne

---

## 8. Direction de la Communication

**Modules:**
- Portail Public CMS
- Relations Presse
- Appels d'Offres Publics
- Newsletter & Alertes
- Gestion Contenu Multimédia

**Niveaux d'accès:**
- **Directeur Communication** - Stratégie média
- **Responsable Editorial** - Contenu et publications
- **Webmaster** - Portail et CMS
- **Chargé Presse** - Relations médias

---

## 9. Direction des Antennes Provinciales (9 Provinces)

**Modules:**
- Commandes & Stocks Antenne
- Distribution Locale
- Facturation Régionale
- Inventaires Provinciaux
- Liaison avec Siège

**Niveaux d'accès:**
- **Chef Antenne** - Validation locale, envoi siège
- **Pharmacien Chef Antenne** - Avis pharmaceutique
- **Gestionnaire Stock** - Réception et gestion
- **Agent Facturation** - Factures locales

---

## 10. Direction de la Maintenance Biomédicale (GMAO)

**Modules:**
- GMAO & Maintenance
- Chaîne du Froid
- Groupes Électrogènes
- Bons d'Intervention
- Métrologie

**Niveaux d'accès:**
- **Responsable Maintenance** - Supervision GMAO
- **Technicien Frigoriste** - Chambres froides
- **Technicien Biomédical** - Équipements
- **Électricien** - Groupes et inverseurs

---

## 11. Direction des Urgences Sanitaires (COD)

**Modules:**
- Centre Opérationnel Décision
- Réserves Stratégiques
- Déploiement Kits Urgence
- Alertes Sanitaires
- Coordination Crise

**Niveaux d'accès:**
- **Coordinateur Urgences** - Décision déploiement
- **Officier COD** - Suivi opérations
- **Médecin Urgentiste** - Avis médical
- **Logisticien Urgence** - Kits et convois

---

## 12. Direction du Portail Citoyen

**Modules:**
- Portail Public
- Mercuriale Officielle
- Pharmacies de Garde
- Signalement Anti-Fraude
- Transparence Tarifs

**Niveaux d'accès:**
- **Directeur Portail** - Supervision publique
- **Modérateur** - Signalements et contenu
- **Support Citoyen** - Assistance usagers
- **Data Manager** - Données publiques

---

## 13. SuperAdmin (SI)

**Modules:**
- Administration Système
- Gestion Utilisateurs Globale
- Sécurité & Audit
- Helpdesk IT
- Configuration Globale

**Niveaux d'accès:**
- **SuperAdmin** - Accès total système
- **Admin IT** - Support technique
- **Admin Sécurité** - Audit et conformité
- **Helpdesk** - Support niveau 1

---

## Matrice des Permissions

### Actions par niveau

| Niveau | Lecture | Création | Modification | Validation | Suppression | Export |
|--------|---------|----------|--------------|------------|-------------|--------|
| Direction | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manager | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| Opérationnel | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| Lecture Seule | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Assistant | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## Page d'Accueil Structure

La page d'accueil sera organisée par:
1. **Bannière** - Logo OPN, recherche globale, notifications
2. **Cartes Directions** - Accès rapide aux 13 directions
3. **KPIs Globaux** - Indicateurs nationaux en temps réel
4. **Tâches Prioritaires** - Selon le rôle de l'utilisateur
5. **Alertes Actives** - Urgences et ruptures
6. **Accès Rapides** - Fonctionnalités fréquentes
