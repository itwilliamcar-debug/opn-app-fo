import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Users,
  History,
  Download,
  Server,
  Lock,
  CheckCircle2,
  Database,
  UserPlus,
  KeyRound,
  Search,
  MapPin,
  Building2,
  X,
  Headphones,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Edit3,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { USERS_PERSONAS } from '../../data/usersPersonas';
import SpinnerPourcentage from '../common/SpinnerPourcentage';
import { GABON_PROVINCES } from '../../data/gabonProvinces';
import { fetchAuditLogs } from '../../services/api';
import { downloadCsv, downloadOfficialHtml } from '../../utils/downloadHelpers';
import {
  loadAllIamUsers,
  saveAllIamUsers,
  persistIamUser,
  updatePersistedIamUser,
  deletePersistedIamUser,
  persistPasswordReset,
} from '../../utils/localPersistence';

/** Rôles Métiers OPN disponibles pour l'attribution RBAC */
export const AVAILABLE_ROLES = [
  { code: 'SUPER_ADMIN', label: 'Super Administrateur National (SI)', scope: 'GLOBAL', badge: 'SI', badgeColor: 'bg-indigo-600 text-white' },
  { code: 'ADMIN_IT', label: 'Administrateur IT & Cyber-Sécurité', scope: 'SERVICE', badge: 'IAM', badgeColor: 'bg-cyan-600 text-white' },
  { code: 'DG', label: 'Directeur Général', scope: 'NATIONAL', badge: 'Cabinet', badgeColor: 'bg-emerald-600 text-white' },
  { code: 'DIR', label: 'Directeur des Opérations & Pilotage', scope: 'NATIONAL', badge: 'Direction', badgeColor: 'bg-emerald-600 text-white' },
  { code: 'DAF', label: 'Directeur Administratif & Financier', scope: 'NATIONAL', badge: 'Finance', badgeColor: 'bg-emerald-600 text-white' },
  { code: 'APPRO_NATIONAL', label: 'Directeur des Approvisionnements', scope: 'NATIONAL', badge: 'Appro', badgeColor: 'bg-blue-600 text-white' },
  { code: 'COLLABORATEUR_APPRO', label: 'Collaborateur Approvisionnements', scope: 'NATIONAL', badge: 'Instruction', badgeColor: 'bg-blue-600 text-white' },
  { code: 'ACHATS', label: 'Responsable Achats & Marchés', scope: 'NATIONAL', badge: 'Achats', badgeColor: 'bg-amber-600 text-white' },
  { code: 'PHARMACIEN_CHEF_NATIONAL', label: 'Pharmacien Chef National', scope: 'NATIONAL', badge: 'Qualité', badgeColor: 'bg-teal-600 text-white' },
  { code: 'CHEF_ANTENNE_PROVINCIALE', label: 'Chef d\'Antenne Provinciale', scope: 'PROVINCE', badge: 'Antenne', badgeColor: 'bg-emerald-600 text-white' },
  { code: 'PHARMACIEN_CHEF_ANTENNE', label: 'Pharmacien Chef d\'Antenne', scope: 'PROVINCE', badge: 'Pharma', badgeColor: 'bg-teal-600 text-white' },
  { code: 'COORDINATEUR_URGENCES', label: 'Coordonnateur Cellule Urgences (COD)', scope: 'NATIONAL', badge: 'COD', badgeColor: 'bg-rose-600 text-white' },
  { code: 'GESTIONNAIRE_LOGISTIQUE', label: 'Gestionnaire Logistique & Flotte', scope: 'GLOBAL', badge: 'Logistique', badgeColor: 'bg-emerald-600 text-white' },
  { code: 'CHEF_CONVOI_SECURITE', label: 'Chef de Convoi & Sécurité', scope: 'PROVINCE', badge: 'Sûreté', badgeColor: 'bg-slate-700 text-white' },
  { code: 'CONVOYEUR', label: 'Convoyeur / Chauffeur Livreur', scope: 'PROVINCE', badge: 'Dernier Km', badgeColor: 'bg-orange-600 text-white' },
  { code: 'DEMANDEUR_PHARMACIEN', label: 'Pharmacien Officine Privée', scope: 'STRUCTURE', badge: 'Officine', badgeColor: 'bg-teal-600 text-white' },
  { code: 'DEMANDEUR_STRUCTURE', label: 'Gestionnaire Pharmacie Hospitalière', scope: 'STRUCTURE', badge: 'Hôpital', badgeColor: 'bg-teal-600 text-white' },
  { code: 'COMMUNICATION', label: 'Responsable Communication & Marchés', scope: 'SERVICE', badge: 'Presse', badgeColor: 'bg-purple-600 text-white' },
  { code: 'AUDITEUR_INTERNE', label: 'Auditeur Interne & Contrôleur ANINF', scope: 'GLOBAL', badge: 'Audit', badgeColor: 'bg-slate-800 text-white' },
];

/** Registre historique des événements d'audit et de traçabilité de conformité RG-OPN. */
export const AUDIT_LOGS = [
  {
    id: 'LOG-0891',
    timestamp: '07/09/2026 à 12:45:10',
    auteur: 'M. Rodrigue MAVOUNGOU',
    role: 'Logisticien Convoi',
    action: 'ENREGISTREMENT_NOTE_VOCALE',
    details: "Transmission d'une note vocale de contrôle convoi Setrag depuis Lastourville (Ogooué-Lolo).",
    ip: '154.72.16.42 (Airtel Gabon)',
  },
  {
    id: 'LOG-0890',
    timestamp: '07/09/2026 à 11:30:22',
    auteur: 'Mme Sylvie NTSAME ONDO',
    role: 'Dir. Approvisionnements',
    action: 'VALIDATION_COMMANDE_CMM',
    details: "Validation technique de la commande OPN-CMD-2026-089 pour l'Antenne du Haut-Ogooué (18 450 000 FCFA).",
    ip: '41.243.2.18 (Fibre Owendo)',
  },
  {
    id: 'LOG-0889',
    timestamp: '07/09/2026 à 09:15:00',
    auteur: 'Dr. Jean-Bernard OBAME NDONG',
    role: 'Directeur Général',
    action: 'APPROBATION_FINANCIERE',
    details: 'Signature électronique du bon de commande interprovincial N°089.',
    ip: '41.243.2.10 (Siège Libreville)',
  },
  {
    id: 'LOG-0888',
    timestamp: '06/09/2026 à 16:15:40',
    auteur: 'Dr. Audrey MBOUMBA KOUMBA',
    role: 'Coordonnatrice Urgences',
    action: 'DECLENCHEMENT_ALERTE_ROUGE',
    details: "Émission d'alerte critique N°088 pour réassort d'urgence Sérum Antivenimeux CHR Makokou.",
    ip: '154.72.19.88 (Moov Africa)',
  },
];

export const INITIAL_HELPDESK_TICKETS = [
  {
    id: 'TICKET-IT-G3-1044',
    agentId: 'USER-ANT-03',
    agentNom: 'M. Brice ELLA MBA',
    provinceId: 'G3',
    provinceNom: 'Moyen-Ogooué',
    chefLieu: 'Lambaréné',
    motif: 'Mot de passe oublié / Réinitialisation terminal antenne Lambaréné',
    details: 'Impossible de me connecter suite à la mise à jour du navigateur sur le terminal pharmacie.',
    telephoneContact: '+241 066 45 88 12',
    timestamp: "Aujourd'hui à 14:20",
    statut: 'EN_ATTENTE',
  },
  {
    id: 'TICKET-IT-G2-1089',
    agentId: 'USER-ANT-02',
    agentNom: 'Dr. Patrick NDONG',
    provinceId: 'G2',
    provinceNom: 'Haut-Ogooué',
    chefLieu: 'Franceville',
    motif: 'Renouvellement périodique de sécurité (90 jours)',
    details: "Demande de génération d'un nouveau mot de passe conforme aux règles de sécurité 2026.",
    telephoneContact: '+241 074 12 34 56',
    timestamp: "Aujourd'hui à 11:05",
    statut: 'EN_ATTENTE',
  },
];

function mapAuditLog(log) {
  const created = log?.created_at ? new Date(log.created_at) : null;
  const timestamp =
    created && !Number.isNaN(created.getTime())
      ? created.toLocaleString('fr-GA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : log?.timestamp || '—';

  return {
    id: log.id,
    timestamp,
    auteur: log.auteur_nom || log.auteur || '—',
    role: log.role || '—',
    action: log.action || '—',
    details: log.details || '—',
    ip: log.ip_address || log.ip || '—',
  };
}

export default function AdminAudit({
  activePersona,
  initialSubTab = 'users',
  onSubTabChange,
  helpdeskTickets = [],
  onResolveTicket,
  sanctumReady = false,
}) {
  const [logs, setLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState(null);

  // Synchronisation de la liste des utilisateurs IAM
  const [usersList, setUsersList] = useState(() => loadAllIamUsers(USERS_PERSONAS));
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filtres et Recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvince, setFilterProvince] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'ACTIF' | 'SUSPENDU'

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Formulaire Création
  const [newUserNom, setNewUserNom] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserId, setNewUserId] = useState(`OPN-AGT-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newUserCodeRole, setNewUserCodeRole] = useState('PHARMACIEN_CHEF_ANTENNE');
  const [newUserRole, setNewUserRole] = useState("Pharmacien Chef d'Antenne Provinciale");
  const [newUserEntite, setNewUserEntite] = useState('Antenne Provinciale du Moyen-Ogooué - Lambaréné');
  const [newUserProvince, setNewUserProvince] = useState('G3');
  const [newUserTelephone, setNewUserTelephone] = useState('+241 074 ');
  const [newUserScope, setNewUserScope] = useState('PROVINCE');
  const [newUserStatut, setNewUserStatut] = useState('ACTIF');
  const [newUserMission, setNewUserMission] = useState('Gestion des stocks, réception convois et approvisionnement des structures de santé');
  const [newUserInitialPassword, setNewUserInitialPassword] = useState('OPN2026@Securite');

  // Formulaire Modification
  const [editFormData, setEditFormData] = useState({
    id: '',
    nom: '',
    email: '',
    role: '',
    codeRole: '',
    entite: '',
    provinceId: 'G1',
    telephone: '',
    scope: 'PROVINCE',
    statut: 'ACTIF',
    description: '',
    droits: [],
  });

  // Toasts / Notifications
  const [notification, setNotification] = useState(null);
  const [copiedPassId, setCopiedPassId] = useState(null);

  // Tickets Helpdesk
  const [tickets, setTickets] = useState(() => [...helpdeskTickets, ...INITIAL_HELPDESK_TICKETS]);
  const [passwordResetNotice, setPasswordResetNotice] = useState(null);

  // Synchroniser avec la prop initialSubTab
  useEffect(() => {
    if (initialSubTab && initialSubTab !== activeSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleTabChange = (newTab) => {
    setActiveSubTab(newTab);
    if (onSubTabChange) onSubTabChange(newTab);
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAuditLogs = useCallback(async () => {
    if (!sanctumReady) {
      setLogs([]);
      setAuditError(null);
      setAuditLoading(false);
      return;
    }
    setAuditLoading(true);
    setAuditError(null);
    try {
      const res = await fetchAuditLogs();
      const raw = Array.isArray(res?.logs) ? res.logs : [];
      setLogs(raw.map(mapAuditLog));
    } catch (err) {
      setLogs([]);
      if (err?.status === 403) {
        setAuditError('Accès refusé journal audit');
      } else {
        setAuditError(err?.message || "Impossible de charger le journal d'audit ANINF.");
      }
    } finally {
      setAuditLoading(false);
    }
  }, [sanctumReady]);

  useEffect(() => {
    if (activeSubTab === 'audit') {
      loadAuditLogs();
    }
  }, [activeSubTab, loadAuditLogs]);

  useEffect(() => {
    if (helpdeskTickets?.length) {
      setTickets((prev) => {
        const ids = new Set(prev.map((t) => t.id));
        const incoming = helpdeskTickets.filter((t) => !ids.has(t.id));
        return incoming.length ? [...incoming, ...prev] : prev;
      });
    }
  }, [helpdeskTickets]);

  // Utilisateurs Filtrés
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (u.nom || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.id || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q) ||
        (u.entite || '').toLowerCase().includes(q);

      const matchProv = filterProvince === 'ALL' || u.provinceId === filterProvince;
      const matchRole = filterRole === 'ALL' || u.codeRole === filterRole;
      const userStatut = u.statut || 'ACTIF';
      const matchStatus = filterStatus === 'ALL' || userStatut === filterStatus;

      return matchSearch && matchProv && matchRole && matchStatus;
    });
  }, [usersList, searchQuery, filterProvince, filterRole, filterStatus]);

  // Statistiques Répertoire IAM
  const stats = useMemo(() => {
    const total = usersList.length;
    const actifs = usersList.filter((u) => (u.statut || 'ACTIF') === 'ACTIF').length;
    const suspendus = usersList.filter((u) => u.statut === 'SUSPENDU' || u.statut === 'VERROUILLE').length;
    const provincesCovered = new Set(usersList.map((u) => u.provinceId)).size;
    return { total, actifs, suspendus, provincesCovered };
  }, [usersList]);

  // --- ACTIONS GESTION UTILISATEURS ---

  // 1. CRÉATION
  const handleCreateUser = (e) => {
    e.preventDefault();
    const initials =
      newUserNom
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 3) || 'OPN';

    const roleObj = AVAILABLE_ROLES.find((r) => r.code === newUserCodeRole);

    const createdUser = {
      id: newUserId,
      nom: newUserNom,
      role: newUserRole || roleObj?.label || "Agent OPN",
      codeRole: newUserCodeRole,
      entite: newUserEntite,
      provinceId: newUserProvince,
      email: newUserEmail || `${newUserNom.toLowerCase().replace(/\s+/g, '.')}@opn.ga`,
      telephone: newUserTelephone,
      avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces&auto=format&q=80',
      initiales: initials,
      badgeColor: roleObj?.badgeColor || 'bg-[#2E68B4] text-white',
      scope: newUserScope,
      statut: newUserStatut,
      droits: ['GESTION_STOCK_LOCAL', 'EMISSION_COMMANDES', 'RECEPTION_LOTS', 'CHAT_PROVINCIAL'],
      description: newUserMission,
      createdAt: new Date().toISOString(),
    };

    const updated = [createdUser, ...usersList.filter((u) => u.id !== createdUser.id)];
    setUsersList(updated);
    saveAllIamUsers(updated);
    persistIamUser({
      ...createdUser,
      initialPassword: newUserInitialPassword,
    });

    downloadOfficialHtml(`fiche-creation-compte-${createdUser.id}`, {
      title: `Fiche Compte IAM — ${createdUser.id}`,
      subtitle: createdUser.nom,
      bodyLines: [
        `<strong>Matricule / Identifiant :</strong> ${createdUser.id}`,
        `<strong>Nom et Prénom :</strong> ${createdUser.nom}`,
        `<strong>Rôle Métier RBAC :</strong> ${createdUser.role} (${createdUser.codeRole})`,
        `<strong>Périmètre :</strong> ${createdUser.scope} — Zone ${createdUser.provinceId}`,
        `<strong>Entité d'affectation :</strong> ${createdUser.entite}`,
        `<strong>Email :</strong> ${createdUser.email}`,
        `<strong>Téléphone :</strong> ${createdUser.telephone}`,
        `<strong>Mot de passe initial (session locale) :</strong> ${newUserInitialPassword}`,
        `<strong>Statut du Compte :</strong> ${createdUser.statut}`,
        `Document officiel de provisionnement généré par le Super Administrateur OPN.`,
      ],
    });

    showToast(`Compte ${createdUser.nom} créé avec succès (Matricule ${createdUser.id}) !`);
    setIsCreateModalOpen(false);
    setNewUserNom('');
    setNewUserId(`OPN-AGT-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  // 2. OUVRIR MODALE MODIFICATION
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      id: user.id,
      nom: user.nom || '',
      email: user.email || '',
      role: user.role || '',
      codeRole: user.codeRole || 'CHEF_ANTENNE_PROVINCIALE',
      entite: user.entite || '',
      provinceId: user.provinceId || 'G1',
      telephone: user.telephone || '',
      scope: user.scope || (user.provinceId === 'G1' ? 'GLOBAL' : 'PROVINCE'),
      statut: user.statut || 'ACTIF',
      description: user.description || '',
      droits: user.droits || [],
    });
    setIsEditModalOpen(true);
  };

  // 3. ENREGISTRER MODIFICATION
  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const roleObj = AVAILABLE_ROLES.find((r) => r.code === editFormData.codeRole);

    const updatedUser = {
      ...selectedUser,
      ...editFormData,
      role: editFormData.role || roleObj?.label || selectedUser.role,
      badgeColor: roleObj?.badgeColor || selectedUser.badgeColor,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = usersList.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsersList(updatedList);
    saveAllIamUsers(updatedList);
    updatePersistedIamUser(updatedUser);

    showToast(`Le profil de ${updatedUser.nom} (${updatedUser.id}) a été mis à jour.`);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // 4. OUVRIR MODALE SUPPRESSION
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // 5. CONFIRMER SUPPRESSION
  const handleConfirmDeleteUser = () => {
    if (!selectedUser) return;

    // Protection : Ne pas supprimer le Super Admin actif
    if (selectedUser.id === activePersona?.id || selectedUser.codeRole === 'SUPER_ADMIN' && usersList.filter(u => u.codeRole === 'SUPER_ADMIN').length <= 1) {
      showToast("Impossible de supprimer le compte Super Administrateur actif.", "error");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      return;
    }

    const updatedList = usersList.filter((u) => u.id !== selectedUser.id);
    setUsersList(updatedList);
    saveAllIamUsers(updatedList);
    deletePersistedIamUser(selectedUser.id);

    showToast(`Le compte de ${selectedUser.nom} (${selectedUser.id}) a été supprimé définitivement.`, "warning");
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // 6. BASCULER STATUT (ACTIF / SUSPENDU)
  const handleToggleUserStatus = (user) => {
    const nextStatut = (user.statut || 'ACTIF') === 'ACTIF' ? 'SUSPENDU' : 'ACTIF';
    const updatedUser = { ...user, statut: nextStatut, updatedAt: new Date().toISOString() };
    const updatedList = usersList.map((u) => (u.id === user.id ? updatedUser : u));
    setUsersList(updatedList);
    saveAllIamUsers(updatedList);
    updatePersistedIamUser(updatedUser);

    showToast(
      `Compte ${user.nom} marqué comme ${nextStatut === 'ACTIF' ? 'Actif' : 'Suspendu'}.`,
      nextStatut === 'ACTIF' ? 'success' : 'warning'
    );
  };

  // 7. RESET MOT DE PASSE PAR ADMIN
  const handleResetPasswordByAdmin = (userId, userNom) => {
    const tempPassword = `OPN-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    persistPasswordReset({ userId, userNom, tempPassword });

    downloadOfficialHtml(`reset-mdp-${userId}`, {
      title: `Réinitialisation Mot de Passe — ${userId}`,
      subtitle: userNom,
      bodyLines: [
        `Identifiant Agent : <strong>${userId}</strong>`,
        `Nom de l'Agent : <strong>${userNom}</strong>`,
        `Nouveau Mot de Passe Temporaire : <strong>${tempPassword}</strong>`,
        `Statut d'accès : <strong>Valide pour la prochaine session (Obligation de changer au 1er accès)</strong>`,
        `Généré sous habilitation Super Administrateur / DSI le ${new Date().toLocaleString('fr-FR')}.`,
      ],
    });

    setPasswordResetNotice({
      userId,
      userNom,
      tempPassword,
      message: `Mot de passe temporaire généré pour ${userNom} : ${tempPassword} (Fiche officielle téléchargée).`,
    });
  };

  // 8. RÉINITIALISER TOUT LE RÉPERTOIRE AUX VALEURS DÉFAUT
  const handleResetToDefaultPersonas = () => {
    if (window.confirm("Voulez-vous réinitialiser le répertoire aux 20 profils OPN initiaux certifiés ?")) {
      saveAllIamUsers(USERS_PERSONAS);
      setUsersList(USERS_PERSONAS);
      showToast("Répertoire réinitialisé aux profils institutionnels certifiés.");
    }
  };

  // 9. EXPORT ANNUAIRE CSV
  const handleExportUsersCsv = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`annuaire-agents-opn-${stamp}.csv`, [
      ['Matricule', 'Nom', 'Rôle', 'CodeRole', 'Entité', 'Province', 'Email', 'Téléphone', 'Scope', 'Statut'],
      ...filteredUsers.map((u) => [
        u.id,
        u.nom,
        u.role,
        u.codeRole,
        u.entite,
        u.provinceId,
        u.email,
        u.telephone || '',
        u.scope || '',
        u.statut || 'ACTIF',
      ]),
    ]);
    showToast(`Annuaire exporté (${filteredUsers.length} comptes).`);
  };

  // 10. TRAITEMENT TICKET HELPDESK
  const handleResolveTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            statut: 'TRAITE',
            resoluPar: activePersona?.nom,
            dateResolution: new Date().toLocaleTimeString(),
          };
        }
        return t;
      })
    );
    if (onResolveTicket) onResolveTicket(ticketId);
    showToast(`Ticket ${ticketId} marqué comme résolu.`);
  };

  // 11. EXPORT AUDIT TRAIL
  const handleExportAuditReport = () => {
    const source = logs.length ? logs : AUDIT_LOGS;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`journal-audit-opn-${stamp}.csv`, [
      ['Horodatage', 'Auteur', 'Rôle', 'Action', 'Détail', 'IP'],
      ...source.map((log) => [
        log.timestamp,
        log.auteur,
        log.role || '',
        log.action,
        log.details || '',
        log.ip || '',
      ]),
    ]);
    downloadOfficialHtml(`rapport-audit-opn-${stamp}`, {
      title: "Rapport d'Audit & Traçabilité ANINF — OPN Hub",
      subtitle: `${source.length} événement(s) — période exportée le ${new Date().toLocaleString('fr-FR')}`,
      bodyLines: source.slice(0, 40).map(
        (log) =>
          `<strong>${log.timestamp}</strong> — ${log.auteur} · <em>${log.action}</em>${
            log.details ? ` — ${log.details}` : ''
          }`
      ),
      footer: 'Export session OPN — conserver avec le CSV joint pour archivage DG / ANINF.',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-md border text-xs font-bold flex items-center justify-between shadow-md transition-all animate-in slide-in-from-top-2 ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            ) : notification.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#00A651]" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-500 hover:text-slate-800 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {!sanctumReady && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          Session Sanctum inactive — le journal d&apos;audit ANINF live nécessite Accès Intranet. La gestion locale des profils utilisateurs IAM reste 100% opérationnelle.
        </div>
      )}

      {/* Header Principal du Module Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A651] animate-pulse" />
            <span className="text-[11px] font-bold text-[#00A651] uppercase tracking-wider">
              ADMINISTRATION CENTRALE, IAM & AUDIT TRAIL SOUVERAIN
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2E68B4]">
            Gestion des Utilisateurs & Sécurité du Système
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Contrôle d&apos;accès RBAC, création, modification, réinitialisation et suppression des comptes des 9 Antennes Provinciales.
          </p>
        </div>

        {/* Navigation par Sous-Onglets */}
        <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('users')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'users'
                ? 'bg-white text-[#2E68B4] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gestion Utilisateurs ({usersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('helpdesk')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'helpdesk'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Helpdesk IT</span>
            {tickets.filter((t) => t.statut === 'EN_ATTENTE').length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {tickets.filter((t) => t.statut === 'EN_ATTENTE').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('audit')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'audit'
                ? 'bg-white text-[#2E68B4] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Journal d&apos;Audit ANINF</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('infrastructure')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'infrastructure'
                ? 'bg-white text-[#2E68B4] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Sécurité & Serveurs</span>
          </button>
        </div>
      </div>

      {/* Notice de Réinitialisation de Mot de Passe */}
      {passwordResetNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-md text-slate-800 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-[#00A651] shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900">{passwordResetNotice.message}</p>
              <p className="text-[11px] text-slate-600">
                Mot de passe temporaire à usage unique : <strong className="font-mono text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">{passwordResetNotice.tempPassword}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(passwordResetNotice.tempPassword);
                setCopiedPassId(passwordResetNotice.userId);
                setTimeout(() => setCopiedPassId(null), 2000);
              }}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 rounded text-xs font-bold text-emerald-800 flex items-center gap-1"
            >
              {copiedPassId === passwordResetNotice.userId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPassId === passwordResetNotice.userId ? 'Copié !' : 'Copier'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPasswordResetNotice(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1"
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ONGLET GESTION UTILISATEURS (IAM & PROFILES)                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'users' && (
        <div className="space-y-5">
          {/* KPI Cards Répertoire */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Comptes OPN</div>
              <div className="text-2xl font-black text-[#2E68B4] mt-1">{stats.total}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Siège & Réseau Décentralisé</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Comptes Actifs</div>
              <div className="text-2xl font-black text-[#00A651] mt-1">{stats.actifs}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Habilités & Connectables</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Suspendus / Inactifs</div>
              <div className="text-2xl font-black text-amber-600 mt-1">{stats.suspendus}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Accès révoqués temporairement</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Couverture Territoriale</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">{stats.provincesCovered}/9 Provinces</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Siège Central + 9 Antennes</p>
            </div>
          </div>

          {/* Barre d'outils, Recherche & Filtres */}
          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2.5 w-full flex-wrap">
                {/* Champ de recherche */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, matricule, email, rôle ou entité..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:border-[#2E68B4]"
                  />
                </div>

                {/* Filtre par Province */}
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#2E68B4]"
                >
                  <option value="ALL">Toutes les Zones (Siège + 9 Provinces)</option>
                  <option value="G1">Siège Libreville / Owendo (G1 Estuaire)</option>
                  {GABON_PROVINCES.filter((p) => p.id !== 'G1').map((p) => (
                    <option key={p.id} value={p.id}>
                      Antenne {p.id} – {p.nom} ({p.chefLieu})
                    </option>
                  ))}
                </select>

                {/* Filtre par Rôle */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#2E68B4]"
                >
                  <option value="ALL">Tous les Profils & Rôles</option>
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.label}
                    </option>
                  ))}
                </select>

                {/* Filtre par Statut */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#2E68B4]"
                >
                  <option value="ALL">Tous les Statuts</option>
                  <option value="ACTIF">Comptes Actifs</option>
                  <option value="SUSPENDU">Comptes Suspendus</option>
                  <option value="VERROUILLE">Comptes Verrouillés</option>
                </select>
              </div>

              {/* Boutons d'Action Principaux */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Switcher Vue Grille / Tableau */}
                <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${
                      viewMode === 'grid' ? 'bg-white text-[#2E68B4] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Affichage en Grille de Cartes"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded transition-all ${
                      viewMode === 'table' ? 'bg-white text-[#2E68B4] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Affichage en Tableau Détaillé"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportUsersCsv}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md border border-slate-200 transition-all flex items-center gap-1.5"
                  title="Exporter la liste au format CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Créer un Utilisateur</span>
                </button>
              </div>
            </div>

            {/* Barre d'état des résultats */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <div>
                Affichage de <strong className="text-slate-800">{filteredUsers.length}</strong> utilisateur(s) sur un total de {usersList.length}.
              </div>
              <button
                type="button"
                onClick={handleResetToDefaultPersonas}
                className="text-[11px] text-slate-500 hover:text-[#2E68B4] flex items-center gap-1 underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rétablir les 20 profils certifiés par défaut</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* AFFICHAGE GRILLE DE CARTES (GRID VIEW)                        */}
          {/* ------------------------------------------------------------- */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full py-12 bg-white rounded-md border border-slate-200 text-center text-slate-500 text-xs">
                  Aucun utilisateur ne correspond aux filtres sélectionnés.
                </div>
              ) : (
                filteredUsers.map((usr) => {
                  const isActif = (usr.statut || 'ACTIF') === 'ACTIF';
                  return (
                    <div
                      key={usr.id}
                      className={`bg-white rounded-md p-5 border shadow-sm space-y-3.5 flex flex-col justify-between hover:shadow-md transition-all ${
                        isActif ? 'border-slate-200' : 'border-amber-200 bg-amber-50/20'
                      }`}
                    >
                      <div>
                        {/* En-tête de la carte */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={
                                usr.avatar ||
                                'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces&auto=format&q=80'
                              }
                              alt={usr.nom}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">{usr.nom}</h4>
                              <p className="text-[11px] text-[#2E68B4] font-bold mt-0.5 truncate">{usr.role}</p>
                              <span className="inline-block mt-0.5 font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {usr.id}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 font-bold text-[10px] rounded border shrink-0 ${
                              isActif
                                ? 'bg-emerald-50 border-emerald-200 text-[#00A651]'
                                : 'bg-amber-100 border-amber-300 text-amber-800'
                            }`}
                          >
                            {isActif ? 'Actif' : usr.statut || 'Suspendu'}
                          </span>
                        </div>

                        {/* Informations d'affectation */}
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{usr.entite}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              Périmètre :{' '}
                              <strong className="text-slate-800">
                                {usr.provinceId === 'G1' ? 'G1 Estuaire (Siège/Owendo)' : `Province ${usr.provinceId}`}
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono text-[11px] text-slate-500 truncate">{usr.email}</span>
                          </div>
                          {usr.telephone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="text-[11px] text-slate-600">{usr.telephone}</span>
                            </div>
                          )}
                          {usr.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 italic">{usr.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Barre d'actions complètes (Modifier, Reset MDP, Statut, Supprimer) */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1">
                          {/* Modifier */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(usr)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#2E68B4] hover:text-white text-slate-700 rounded text-[11px] font-bold flex items-center gap-1 transition-all border border-slate-200"
                            title="Modifier ce profil utilisateur"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Modifier</span>
                          </button>

                          {/* Reset Mot de Passe */}
                          <button
                            type="button"
                            onClick={() => handleResetPasswordByAdmin(usr.id, usr.nom)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                            title="Générer un mot de passe temporaire"
                          >
                            <KeyRound className="w-3 h-3 text-amber-600" />
                            <span>Reset MDP</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Basculer Statut */}
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(usr)}
                            className={`p-1 rounded text-[11px] border transition-colors ${
                              isActif
                                ? 'bg-slate-50 hover:bg-amber-100 text-slate-600 hover:text-amber-800 border-slate-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                            title={isActif ? "Suspendre l'utilisateur" : "Réactiver l'utilisateur"}
                          >
                            {isActif ? <UserX className="w-3.5 h-3.5 text-amber-600" /> : <UserCheck className="w-3.5 h-3.5 text-[#00A651]" />}
                          </button>

                          {/* Supprimer */}
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(usr)}
                            className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] transition-colors"
                            title="Supprimer définitivement cet utilisateur"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* AFFICHAGE TABLEAU DÉTAILLÉ (TABLE VIEW)                       */}
          {/* ------------------------------------------------------------- */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Agent / Matricule</th>
                      <th className="p-3.5">Rôle Métier & Scope</th>
                      <th className="p-3.5">Entité & Province</th>
                      <th className="p-3.5">Email / Téléphone</th>
                      <th className="p-3.5">Statut</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          Aucun utilisateur trouvé.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((usr) => {
                        const isActif = (usr.statut || 'ACTIF') === 'ACTIF';
                        return (
                          <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={usr.avatar || 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop&crop=faces&auto=format&q=80'}
                                  alt={usr.nom}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">{usr.nom}</div>
                                  <span className="font-mono text-[10px] text-slate-500">{usr.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-slate-800">{usr.role}</div>
                              <span className="inline-block text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600 border border-slate-200 mt-0.5">
                                {usr.scope || 'PROVINCE'} • {usr.codeRole}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="text-slate-700 truncate max-w-[200px]">{usr.entite}</div>
                              <span className="text-[10px] text-[#2E68B4] font-bold">
                                {usr.provinceId === 'G1' ? 'G1 Estuaire' : `Province ${usr.provinceId}`}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-mono text-[11px] text-slate-600">{usr.email}</div>
                              <div className="text-[10px] text-slate-500">{usr.telephone || '—'}</div>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                                  isActif
                                    ? 'bg-emerald-50 border-emerald-200 text-[#00A651]'
                                    : 'bg-amber-100 border-amber-300 text-amber-800'
                                }`}
                              >
                                {isActif ? 'Actif' : usr.statut || 'Suspendu'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(usr)}
                                className="inline-flex p-1.5 rounded text-[#2E68B4] hover:bg-blue-50"
                                title="Modifier"
                                aria-label="Modifier"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleResetPasswordByAdmin(usr.id, usr.nom)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded text-[11px] font-bold border border-amber-200 transition-colors"
                                title="Reset mot de passe"
                              >
                                <KeyRound className="w-3 h-3 inline-block mr-1" />
                                <span>Reset</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(usr)}
                                className={`p-1 rounded text-[11px] border transition-colors inline-block ${
                                  isActif ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                                title={isActif ? 'Suspendre' : 'Activer'}
                              >
                                {isActif ? <UserX className="w-3 h-3 text-amber-600" /> : <UserCheck className="w-3 h-3 text-emerald-600" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(usr)}
                                className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] transition-colors inline-block"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ONGLET HELPDESK IT                                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'helpdesk' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-600" />
                Tickets d&apos;Assistance & Demandes de Réinitialisation de Mot de Passe
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Demandes transmises par les agents des 9 antennes provinciales et du siège Libreville.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              {tickets.filter((t) => t.statut === 'EN_ATTENTE').length} en attente
            </span>
          </div>

          <div className="space-y-3">
            {tickets.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">Aucun ticket d&apos;assistance en file.</p>
            )}
            {tickets.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-md border text-xs space-y-2 transition-all ${
                  t.statut === 'EN_ATTENTE'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-900">{t.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E68B4] text-white">
                        Province {t.provinceId} – {t.provinceNom} ({t.chefLieu})
                      </span>
                      <span className="text-slate-500">{t.timestamp}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mt-1">{t.motif}</h4>
                    <p className="text-slate-600 mt-0.5">{t.details}</p>
                  </div>

                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 ${
                      t.statut === 'EN_ATTENTE'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {t.statut === 'EN_ATTENTE' ? 'À Traiter' : 'Résolu'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-4 text-slate-600 flex-wrap">
                    <span>
                      Demandeur : <strong className="text-slate-900">{t.agentNom}</strong> ({t.agentId})
                    </span>
                    <span>
                      Tél. Rappel : <strong className="text-[#00A651]">{t.telephoneContact}</strong>
                    </span>
                  </div>

                  {t.statut === 'EN_ATTENTE' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleResetPasswordByAdmin(t.agentId, t.agentNom);
                        handleResolveTicket(t.id);
                      }}
                      className="px-3 py-1.5 bg-[#00A651] hover:bg-[#008742] text-white font-bold rounded text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Générer Nouveau Mot de Passe & Valider</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ONGLET JOURNAL D'AUDIT ANINF                                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-bold text-[#2E68B4] flex items-center gap-2">
              <History className="w-4 h-4 text-[#2E68B4]" />
              Journal des Événements Sensibles & Traçabilité (Audit Trail API)
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadAuditLogs}
                disabled={auditLoading || !sanctumReady}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <button
                type="button"
                onClick={handleExportAuditReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger Rapport
              </button>
            </div>
          </div>

          {auditError && (
            <div className="m-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{auditError}</span>
            </div>
          )}

          {!sanctumReady && (
            <div className="p-8 text-center text-xs text-slate-500">
              Authentifiez-vous via Accès Intranet pour consulter le journal d&apos;audit ANINF live.
            </div>
          )}

          {sanctumReady && auditLoading && (
            <SpinnerPourcentage libelle="Chargement du journal d'audit…" />
          )}

          {sanctumReady && !auditLoading && !auditError && logs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Aucun événement d&apos;audit renvoyé par l&apos;API.
            </div>
          )}

          {sanctumReady && !auditLoading && logs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Horodatage / IP</th>
                    <th className="p-3.5">Auteur / Rôle</th>
                    <th className="p-3.5">Type d&apos;Action</th>
                    <th className="p-3.5">Détails Opérationnels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-[11px]">{log.timestamp}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{log.ip}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{log.auteur}</div>
                        <div className="text-[10px] text-[#2E68B4]">{log.role}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-[#2E68B4] border border-blue-200 font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-md">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ONGLET INFRASTRUCTURE & SÉCURITÉ                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'infrastructure' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-md p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-md bg-emerald-50 text-[#00A651] flex items-center justify-center font-bold border border-emerald-200">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Chiffrement & Sécurité ANINF</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toutes les communications WebRTC et WebSocket sont chiffrées en TLS 1.3. Base de données Laravel chiffrée au repos.
            </p>
            <div className="pt-2 text-xs font-bold text-[#00A651]">
              ✓ Certificat SSL National Actif
            </div>
          </div>

          <div className="bg-white rounded-md p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-md bg-blue-50 text-[#2E68B4] flex items-center justify-center font-bold border border-blue-200">
              <Database className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Sauvegardes Quotidiennes & PRA</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sauvegardes automatiques quotidiennes à 02h00 vers stockage objet sécurisé. RPO &lt; 1 heure, RTO &lt; 2 heures.
            </p>
            <div className="pt-2 text-xs font-bold text-[#2E68B4]">
              ✓ Dernière sauvegarde : Aujourd&apos;hui à 02:00
            </div>
          </div>

          <div className="bg-white rounded-md p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
              <Server className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Cluster Haute Disponibilité</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Passerelle NGINX / PHP-FPM avec équilibrage de charge et flux SSE temps réel pour la distribution des événements.
            </p>
            <div className="pt-2 text-xs font-bold text-indigo-700">
              ✓ Disponibilité (SLA) : 99.98 %
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 1 : CRÉATION D'UN NOUVEL UTILISATEUR                               */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-md bg-[#00A651] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Création d&apos;un Nouvel Utilisateur Métier OPN
                </h3>
                <p className="text-xs text-slate-500">
                  Affectation pour le Siège Libreville/Owendo ou les 9 Antennes Provinciales.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom Complet & Titre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Marc ONDO"
                    value={newUserNom}
                    onChange={(e) => setNewUserNom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matricule OPN / ID (Généré)</label>
                  <input
                    type="text"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Zone / Affectation Provinciale</label>
                  <select
                    value={newUserProvince}
                    onChange={(e) => {
                      const pId = e.target.value;
                      setNewUserProvince(pId);
                      const p = GABON_PROVINCES.find((x) => x.id === pId);
                      if (pId === 'G1') {
                        setNewUserEntite('Direction Générale OPN / Hub Owendo - Libreville');
                        setNewUserScope('NATIONAL');
                      } else if (p) {
                        setNewUserEntite(`Antenne Provinciale ${p.nom} - ${p.chefLieu}`);
                        setNewUserScope('PROVINCE');
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    <option value="G1">Siège Central Libreville / Hub Owendo (G1 Estuaire)</option>
                    {GABON_PROVINCES.filter((p) => p.id !== 'G1').map((p) => (
                      <option key={p.id} value={p.id}>
                        Province {p.id} – {p.nom} ({p.chefLieu})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle Métier RBAC</label>
                  <select
                    value={newUserCodeRole}
                    onChange={(e) => {
                      const code = e.target.value;
                      setNewUserCodeRole(code);
                      const r = AVAILABLE_ROLES.find((x) => x.code === code);
                      if (r) {
                        setNewUserRole(r.label);
                        setNewUserScope(r.scope);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Entité / Direction d&apos;Affectation</label>
                <input
                  type="text"
                  value={newUserEntite}
                  onChange={(e) => setNewUserEntite(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email professionnel</label>
                  <input
                    type="email"
                    placeholder="m.ondo@opn.ga"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone Professionnel</label>
                  <input
                    type="text"
                    value={newUserTelephone}
                    onChange={(e) => setNewUserTelephone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Périmètre / Scope</label>
                  <select
                    value={newUserScope}
                    onChange={(e) => setNewUserScope(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    <option value="GLOBAL">GLOBAL — Accès Supervision Totale</option>
                    <option value="NATIONAL">NATIONAL — Gouvernance Centrale</option>
                    <option value="PROVINCE">PROVINCE — Antenne Locale</option>
                    <option value="SERVICE">SERVICE — Département Spécialisé</option>
                    <option value="STRUCTURE">STRUCTURE — Hôpital / Officine</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statut Initial du Compte</label>
                  <select
                    value={newUserStatut}
                    onChange={(e) => setNewUserStatut(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    <option value="ACTIF">ACTIF — Connexion Autorisée</option>
                    <option value="SUSPENDU">SUSPENDU — En Attente de Validation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Charge de Mission & Attributions</label>
                <textarea
                  rows="2"
                  value={newUserMission}
                  onChange={(e) => setNewUserMission(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <label className="block font-bold text-slate-800">Mot de Passe Initial Généré</label>
                    <span className="text-[11px] text-slate-500">
                      L&apos;agent recevra ce mot de passe initial avec obligation de renouvellement 2FA.
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newUserInitialPassword}
                    onChange={(e) => setNewUserInitialPassword(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs text-right"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A651] hover:bg-[#008742] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Créer et Activer le Compte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 2 : MODIFICATION D'UN UTILISATEUR EXISTANT                         */}
      {/* ========================================================================= */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-md bg-[#2E68B4] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Modifier le Profil Utilisateur IAM
                </h3>
                <p className="text-xs text-slate-500">
                  Matricule : <strong className="font-mono text-slate-800">{editFormData.id}</strong> — {editFormData.nom}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom Complet & Titre *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.nom}
                    onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matricule / Identifiant</label>
                  <input
                    type="text"
                    value={editFormData.id}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md font-mono font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle Métier RBAC</label>
                  <select
                    value={editFormData.codeRole}
                    onChange={(e) => {
                      const code = e.target.value;
                      const r = AVAILABLE_ROLES.find((x) => x.code === code);
                      setEditFormData({
                        ...editFormData,
                        codeRole: code,
                        role: r?.label || editFormData.role,
                        scope: r?.scope || editFormData.scope,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Zone / Province</label>
                  <select
                    value={editFormData.provinceId}
                    onChange={(e) => {
                      const pId = e.target.value;
                      const p = GABON_PROVINCES.find((x) => x.id === pId);
                      let entite = editFormData.entite;
                      if (pId === 'G1') {
                        entite = 'Direction Générale OPN / Hub Owendo - Libreville';
                      } else if (p) {
                        entite = `Antenne Provinciale ${p.nom} - ${p.chefLieu}`;
                      }
                      setEditFormData({
                        ...editFormData,
                        provinceId: pId,
                        entite,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    <option value="G1">Siège Central Libreville / Hub Owendo (G1 Estuaire)</option>
                    {GABON_PROVINCES.filter((p) => p.id !== 'G1').map((p) => (
                      <option key={p.id} value={p.id}>
                        Province {p.id} – {p.nom} ({p.chefLieu})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Entité / Direction d&apos;Affectation</label>
                <input
                  type="text"
                  value={editFormData.entite}
                  onChange={(e) => setEditFormData({ ...editFormData, entite: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone Professionnel</label>
                  <input
                    type="text"
                    value={editFormData.telephone}
                    onChange={(e) => setEditFormData({ ...editFormData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statut du Compte</label>
                  <select
                    value={editFormData.statut}
                    onChange={(e) => setEditFormData({ ...editFormData, statut: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    <option value="ACTIF">ACTIF — Plein accès opérationnel</option>
                    <option value="SUSPENDU">SUSPENDU — Accès temporairement bloqué</option>
                    <option value="EN_CONGE">EN CONGÉ — Remplacement temporaire</option>
                    <option value="VERROUILLE">VERROUILLÉ — Sécurité / Enquête</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Périmètre / Scope</label>
                  <select
                    value={editFormData.scope}
                    onChange={(e) => setEditFormData({ ...editFormData, scope: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                  >
                    <option value="GLOBAL">GLOBAL — Supervision Totale</option>
                    <option value="NATIONAL">NATIONAL — Direction Centrale</option>
                    <option value="PROVINCE">PROVINCE — Antenne Territoriale</option>
                    <option value="SERVICE">SERVICE — Pôle Spécialisé</option>
                    <option value="STRUCTURE">STRUCTURE — Hôpital / Officine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mission & Responsabilités</label>
                <textarea
                  rows="2"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:outline-none focus:border-[#2E68B4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2E68B4] hover:bg-[#215091] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer les Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 3 : SUPPRESSION D'UN UTILISATEUR (CONFIRMATION DESTRUCTIVE)        */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-rose-200 rounded-lg p-6 shadow-2xl space-y-4 relative">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Confirmer la Suppression de l&apos;Utilisateur ?
              </h3>
              <p className="text-xs text-slate-600">
                Vous êtes sur le point de révoquer et supprimer le compte de :
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs mt-2 text-left space-y-1">
                <div><strong>Nom :</strong> {selectedUser.nom}</div>
                <div><strong>Matricule :</strong> <span className="font-mono">{selectedUser.id}</span></div>
                <div><strong>Rôle :</strong> {selectedUser.role}</div>
                <div><strong>Affectation :</strong> {selectedUser.entite}</div>
              </div>
            </div>

            <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200 font-medium">
              ⚠️ Cette action supprimera définitivement les accès et désactivera la session de cet agent.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer Définitivement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
