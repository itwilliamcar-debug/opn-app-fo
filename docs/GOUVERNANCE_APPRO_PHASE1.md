# Gouvernance Approvisionnements — cadrage livraison

## Choix d’architecture (documenté)

Le cycle métier **Demande → Instruction → Validation nationale → Achats → Visas → Livraison** reste sur `demandes_approvisionnement` et `ApprovisionnementController`.

La **gouvernance** (Phase 1 livrée) est un **overlay** :
- tâches affectées ;
- soumission au contrôle ;
- décisions (validé / correction / rejeté / en attente) ;
- boucles de correction versionnées (itérations) ;
- timeline + `audit_logs` ;
- principe des **quatre yeux** (préparateur ≠ contrôleur).

Pas de second moteur de statuts parallèle : badge `gouvernance_flag` uniquement.

## Phase 1 — livré

| Couche | Contenu |
|--------|---------|
| DB | `appro_gouvernance_taches`, `appro_revues_controle`, `appro_boucles_correction`, `appro_gouvernance_evenements` |
| API | `/api/v1/supply/governance/*` (Sanctum + permissions) |
| UI | Onglet **À traiter aujourd'hui** dans `ApproNationalDesk` |
| Tests | `ApproGouvernanceWorkflowTest` (4 scénarios OK) |

## Phase 2 — GED versionnée (livré)

| Couche | Contenu |
|--------|---------|
| DB | `appro_documents`, `appro_document_versions` (stockage disque `local` privé) |
| API | `/api/v1/supply/documents` — upload, versions, download auth, archive |
| UI | Pièces jointes dans le tiroir dossier Appro National |
| Règles | MIME contrôlé, taille ≤ 15 Mo, pas de suppression silencieuse, version + motif |

## Circuit Suggestions → DG (livré)

| Couche | Contenu |
|--------|---------|
| DB | `appro_suggestions_dg`, `appro_suggestion_evenements` |
| API | `/api/v1/supply/suggestions-dg` — CRUD, submit, decide |
| UI Appro | Onglet **Suggestions DG** |
| UI DG | Onglet **Suggestions Appro** (à côté des visas) |
| Workflow | BROUILLON → SOUMISE → EN_ETUDE / ACCEPTEE / REFUSEE / CORRECTION_DEMANDEE → MISE_EN_OEUVRE → CLOTUREE |

## Activation locale

```bash
cd opn-backend
php artisan migrate
```

Comptes :
- Appro : `s.ntsame@opn.ga`
- DG : `jb.obame@opn.ga`
