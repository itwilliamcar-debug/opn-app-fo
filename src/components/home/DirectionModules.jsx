import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Package, 
  Truck, 
  Award, 
  Globe, 
  Users, 
  Megaphone, 
  MapPin, 
  Wrench, 
  AlertTriangle, 
  Shield, 
  Landmark, 
  Building2,
  ChevronRight,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { getDirectionById, getDirectionModules } from '../../data/directionsStructure';

const MODULE_ICONS = {
  dashboard_strategique: LayoutDashboard,
  supervision_directions: Building2,
  visas_dg: CheckCircle2,
  centre_decision: AlertTriangle,
  rapports_audit: Settings,
  superadmin: Shield,
  planification_cmm: LayoutDashboard,
  wms_central: Package,
  allocation_fefo: Package,
  supervision_antennes: MapPin,
  reserves_strategiques: Shield,
  facturation: Landmark,
  tresor_public: Building2,
  budget_engagements: Landmark,
  comptabilite: Settings,
  paie_rh: Users,
  distribution: Truck,
  flotte: Truck,
  gmao: Wrench,
  chaine_froid: AlertTriangle,
  pistes: MapPin,
  qualite_conformite: Award,
  pharmacovigilance: Award,
  controle_qualite: Award,
  dmp: Users,
  homologations: Shield,
  marches: Globe,
  fournisseurs: Users,
  incoterms: Globe,
  contrats: Settings,
  commandes: Package,
  postes: Users,
  recrutement: Users,
  formation: LayoutDashboard,
  evaluation: LayoutDashboard,
  admin_personnel: Users,
  portail_cms: Globe,
  presse: Megaphone,
  appels_offres: Globe,
  newsletter: Megaphone,
  multimedia: Megaphone,
  commandes_antenne: Package,
  distribution_locale: Truck,
  facturation_regionale: Landmark,
  inventaires: Settings,
  liaison_siege: Megaphone,
  gmao_main: Wrench,
  chaine_froid_gmao: AlertTriangle,
  groupes_electrogenes: AlertTriangle,
  bons_intervention: Settings,
  metrologie: Settings,
  centre_decision_cod: AlertTriangle,
  reserves_urgence: Shield,
  deploiement: Package,
  alertes: Bell,
  coordination: Users,
  portail_public: Globe,
  mercuriale: Settings,
  pharmacies_garde: MapPin,
  signalement: Shield,
  transparence: LayoutDashboard,
  admin_system: Settings,
  gestion_users: Users,
  securite: Shield,
  helpdesk: Bell,
  configuration: Settings,
};

export default function DirectionModules({ 
  directionId, 
  onBack, 
  onModuleSelect,
  currentUser,
  onOpenProfile,
  onOpenHelpdesk,
  onLogout 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const direction = getDirectionById(directionId);
  const allModules = direction ? getDirectionModules(directionId) : [];

  const filteredModules = allModules.filter(module =>
    module.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!direction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Direction non trouvée</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const Icon = MODULE_ICONS[allModules[0]?.id] || LayoutDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: direction.couleur }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{direction.nom}</h1>
                  <p className="text-xs text-slate-500">{direction.description}</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un module..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces&auto=format&q=80"}
                  alt={currentUser?.nom}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{currentUser?.nom}</p>
                  <p className="text-xs text-[#00A651] font-medium">{currentUser?.role}</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white py-4 px-4">
            <div className="space-y-2">
              <button
                onClick={onOpenProfile}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-3"
              >
                <Settings className="w-4 h-4" />
                Mon Profil
              </button>
              <button
                onClick={onOpenHelpdesk}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-3"
              >
                <Bell className="w-4 h-4" />
                Aide & Support
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Direction Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: direction.couleur }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{direction.nom}</h2>
              <p className="text-slate-600">{direction.description}</p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Modules disponibles ({filteredModules.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => {
              const ModuleIcon = MODULE_ICONS[module.id] || LayoutDashboard;
              return (
                <button
                  key={module.id}
                  onClick={() => onModuleSelect(module.id)}
                  className="group bg-white rounded-xl border-2 border-slate-200 hover:border-[#00A651] transition-all duration-200 hover:shadow-lg p-6 text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: direction.couleur + '20' }}
                    >
                      <ModuleIcon 
                        className="w-6 h-6"
                        style={{ color: direction.couleur }}
                      />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#00A651] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{module.label}</h4>
                  <p className="text-sm text-slate-500">Accéder au module {module.label.toLowerCase()}</p>
                </button>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucun module trouvé pour "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Office Pharmaceutique National (OPN) - République Gabonaise
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">Version 2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
