import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle,
  Users,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Package,
  Landmark,
  Truck,
  Award,
  Globe,
  UserCheck,
  Megaphone,
  MapPin,
  Wrench,
  ShieldAlert,
  Shield,
  ChevronRight,
  Activity,
  FileText,
  BarChart3,
  Layers,
  CheckCircle2,
  Calculator,
  FileSpreadsheet,
  Gavel,
  Ship,
  Briefcase,
  UserPlus,
  GraduationCap,
  Newspaper,
  Scroll,
  Mail,
  Video,
  ClipboardCheck,
  MessageSquare,
  Zap,
  Clipboard,
  Ruler,
  Command,
  List,
  Crosshair,
  Eye,
  Server,
  Headphones,
  Thermometer,
} from 'lucide-react';
import { getAllDirections } from '../../data/directionsStructure';

const DIRECTION_ICONS = {
  DG: Crown,
  APPRO: Package,
  DAF: Landmark,
  LOGISTIQUE: Truck,
  QUALITE: Award,
  ACHATS: Globe,
  RH: UserCheck,
  COMMUNICATION: Megaphone,
  ANTENNES: MapPin,
  GMAO: Wrench,
  URGENCES: AlertTriangle,
  PORTAIL: Globe,
  SUPERADMIN: ShieldAlert,
};

const DIRECTION_GRADIENTS = {
  DG: 'from-blue-900 to-blue-700',
  APPRO: 'from-emerald-700 to-emerald-500',
  DAF: 'from-purple-700 to-purple-500',
  LOGISTIQUE: 'from-orange-600 to-orange-400',
  QUALITE: 'from-cyan-700 to-cyan-500',
  ACHATS: 'from-yellow-700 to-yellow-500',
  RH: 'from-pink-700 to-pink-500',
  COMMUNICATION: 'from-indigo-700 to-indigo-500',
  ANTENNES: 'from-green-700 to-green-500',
  GMAO: 'from-cyan-800 to-cyan-600',
  URGENCES: 'from-red-700 to-red-500',
  PORTAIL: 'from-orange-500 to-orange-300',
  SUPERADMIN: 'from-gray-800 to-gray-600',
};

export default function DirectionHome({ 
  currentUser, 
  onDirectionSelect, 
  onOpenProfile,
  onOpenHelpdesk,
  onLogout 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const directions = getAllDirections();
  
  const filteredDirections = directions.filter(dir =>
    dir.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dir.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userDirection = currentUser?.direction ? 
    directions.find(d => d.id === currentUser.direction) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00A651] to-[#008f45] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">OPN</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">OPN Digital Hub</h1>
                <p className="text-xs text-slate-500">Office Pharmaceutique National</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une direction, un module..."
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Bienvenue, {currentUser?.nom || 'Utilisateur'}
          </h2>
          <p className="text-slate-600">
            {userDirection 
              ? `Accédez aux modules de la ${userDirection.nom}`
              : 'Sélectionnez votre direction pour accéder à vos modules'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Taux de Service</p>
                <p className="text-2xl font-bold text-slate-900">98.4%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Demandes en Cours</p>
                <p className="text-2xl font-bold text-slate-900">127</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Alertes Actives</p>
                <p className="text-2xl font-bold text-slate-900">3</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Budget Engagé</p>
                <p className="text-2xl font-bold text-slate-900">8.2M</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* User's Direction (if assigned) */}
        {userDirection && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Ma Direction</h3>
            <DirectionCard
              direction={userDirection}
              isPrimary
              onSelect={() => onDirectionSelect(userDirection.id)}
            />
          </div>
        )}

        {/* All Directions */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {userDirection ? 'Autres Directions' : 'Toutes les Directions'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirections
              .filter(dir => userDirection ? dir.id !== userDirection.id : true)
              .map((direction) => (
                <DirectionCard
                  key={direction.id}
                  direction={direction}
                  onSelect={() => onDirectionSelect(direction.id)}
                />
              ))}
          </div>
        </div>

        {filteredDirections.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucune direction trouvée pour "{searchQuery}"</p>
          </div>
        )}
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
              <span className="text-xs text-slate-400">|</span>
              <button className="text-sm text-slate-500 hover:text-slate-700">Aide</button>
              <span className="text-xs text-slate-400">|</span>
              <button className="text-sm text-slate-500 hover:text-slate-700">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DirectionCard({ direction, isPrimary = false, onSelect }) {
  const Icon = DIRECTION_ICONS[direction.id] || Building2;
  const gradient = DIRECTION_GRADIENTS[direction.id] || 'from-slate-700 to-slate-500';

  return (
    <button
      onClick={onSelect}
      className={`group relative bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
        isPrimary ? 'border-[#00A651] shadow-md' : 'border-slate-200 hover:border-[#00A651]'
      }`}
    >
      {isPrimary && (
        <div className="absolute -top-2 -right-2 bg-[#00A651] text-white text-xs px-2 py-1 rounded-full font-medium">
          Ma Direction
        </div>
      )}
      
      <div className="p-5">
        {/* Icon Header */}
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-900 mb-1">{direction.nom}</h4>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{direction.description}</p>

        {/* Modules Count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {direction.modules.length} module{direction.modules.length > 1 ? 's' : ''}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00A651] group-hover:translate-x-1 transition-all" />
        </div>

        {/* Module Preview */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-1">
            {direction.modules.slice(0, 3).map((module) => (
              <span
                key={module.id}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded"
              >
                {module.label}
              </span>
            ))}
            {direction.modules.length > 3 && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                +{direction.modules.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
