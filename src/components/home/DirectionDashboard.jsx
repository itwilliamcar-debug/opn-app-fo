import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Package, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  DollarSign,
  Truck,
  Shield,
  FileText,
  Calendar,
  MoreHorizontal,
  RefreshCw,
  Briefcase,
  GraduationCap,
  Globe,
  Mail,
  Megaphone,
  MapPin,
  Search,
  Bell,
} from 'lucide-react';
import { getDirectionById } from '../../data/directionsStructure';

const DIRECTION_KPIS = {
  DG: [
    { label: 'Budget Engagé', value: '8.2 Mrd FCFA', change: '+12%', icon: DollarSign, color: 'emerald' },
    { label: 'Taux de Service National', value: '98.4%', change: '+2.1%', icon: CheckCircle, color: 'blue' },
    { label: 'Alertes Actives', value: '3', change: '-1', icon: AlertTriangle, color: 'amber' },
    { label: 'Projets en Cours', value: '12', change: '+2', icon: Activity, color: 'purple' },
  ],
  APPRO: [
    { label: 'Stock Central', value: '12,500 palettes', change: '+5%', icon: Package, color: 'emerald' },
    { label: 'Demandes en Attente', value: '47', change: '-8', icon: Clock, color: 'amber' },
    { label: 'Taux de Rupture', value: '1.8%', change: '-0.5%', icon: TrendingUp, color: 'green' },
    { label: 'Livraisons du Jour', value: '23', change: '+4', icon: Truck, color: 'blue' },
  ],
  DAF: [
    { label: 'Recouvrement du Mois', value: '2.8 Mrd FCFA', change: '+15%', icon: DollarSign, color: 'emerald' },
    { label: 'Factures en Attente', value: '156', change: '-12', icon: FileText, color: 'amber' },
    { label: 'Délai Moyen Paiement', value: '28 jours', change: '-3j', icon: Clock, color: 'green' },
    { label: 'Budget Consommé', value: '67%', change: '+5%', icon: BarChart3, color: 'purple' },
  ],
  LOGISTIQUE: [
    { label: 'Convois en Cours', value: '8', change: '+2', icon: Truck, color: 'emerald' },
    { label: 'Flotte Disponible', value: '94%', change: '+3%', icon: CheckCircle, color: 'green' },
    { label: 'Incidents Route', value: '0', change: '-2', icon: Shield, color: 'blue' },
    { label: 'Livraisons Réalisées', value: '156', change: '+12', icon: Package, color: 'purple' },
  ],
  QUALITE: [
    { label: 'Lots Contrôlés', value: '234', change: '+18', icon: CheckCircle, color: 'emerald' },
    { label: 'Alertes Vigilance', value: '2', change: '0', icon: AlertTriangle, color: 'amber' },
    { label: 'Taux Conformité', value: '99.2%', change: '+0.3%', icon: Shield, color: 'green' },
    { label: 'Analyses en Cours', value: '15', change: '+3', icon: Activity, color: 'purple' },
  ],
  ACHATS: [
    { label: 'Commandes Fournisseurs', value: '34', change: '+5', icon: Package, color: 'emerald' },
    { label: 'Appels d\'Offres', value: '7', change: '+2', icon: FileText, color: 'blue' },
    { label: 'Délai Livraison Moyen', value: '45 jours', change: '-5j', icon: Clock, color: 'green' },
    { label: 'Budget Engagé', value: '4.5 Mrd FCFA', change: '+8%', icon: DollarSign, color: 'purple' },
  ],
  RH: [
    { label: 'Effectif Total', value: '1,245', change: '+12', icon: Users, color: 'emerald' },
    { label: 'Postes Vacants', value: '23', change: '-5', icon: Briefcase, color: 'amber' },
    { label: 'Formations en Cours', value: '8', change: '+2', icon: GraduationCap, color: 'blue' },
    { label: 'Taux Absentéisme', value: '3.2%', change: '-0.5%', icon: TrendingUp, color: 'green' },
  ],
  COMMUNICATION: [
    { label: 'Articles Publiés', value: '45', change: '+8', icon: FileText, color: 'emerald' },
    { label: 'Visites Portail', value: '12,450', change: '+23%', icon: Globe, color: 'blue' },
    { label: 'Abonnés Newsletter', value: '3,420', change: '+156', icon: Mail, color: 'purple' },
    { label: 'Demandes Presse', value: '7', change: '+2', icon: Megaphone, color: 'amber' },
  ],
  ANTENNES: [
    { label: 'Antennes Actives', value: '9/9', change: '100%', icon: MapPin, color: 'emerald' },
    { label: 'Stocks Antennes', value: '8,450 unités', change: '+120', icon: Package, color: 'blue' },
    { label: 'Demandes en Cours', value: '34', change: '-6', icon: Clock, color: 'amber' },
    { label: 'Livraisons du Mois', value: '89', change: '+15', icon: Truck, color: 'purple' },
  ],
  GMAO: [
    { label: 'Interventions Planifiées', value: '23', change: '+3', icon: Calendar, color: 'emerald' },
    { label: 'Équipements Opérationnels', value: '96%', change: '+2%', icon: CheckCircle, color: 'green' },
    { label: 'Interventions Urgentes', value: '2', change: '-1', icon: AlertTriangle, color: 'amber' },
    { label: 'Temps Moyen Réparation', value: '4.2h', change: '-0.5h', icon: Clock, color: 'blue' },
  ],
  URGENCES: [
    { label: 'Alertes Actives', value: '1', change: '0', icon: AlertTriangle, color: 'red' },
    { label: 'Réserves Stratégiques', value: '100%', change: 'OK', icon: Shield, color: 'emerald' },
    { label: 'Kits Prêts', value: '45', change: '+5', icon: Package, color: 'blue' },
    { label: 'Équipe COD Disponible', value: '8/8', change: '100%', icon: Users, color: 'green' },
  ],
  PORTAIL: [
    { label: 'Visites Journalières', value: '2,450', change: '+18%', icon: Globe, color: 'emerald' },
    { label: 'Recherches Mercuriale', value: '1,234', change: '+156', icon: Search, color: 'blue' },
    { label: 'Signalements Reçus', value: '12', change: '+3', icon: Shield, color: 'amber' },
    { label: 'Pharmacies de Garde', value: '45', change: '100%', icon: MapPin, color: 'green' },
  ],
  SUPERADMIN: [
    { label: 'Utilisateurs Actifs', value: '1,245', change: '+23', icon: Users, color: 'emerald' },
    { label: 'Sessions Actives', value: '89', change: '+12', icon: Activity, color: 'blue' },
    { label: 'Tickets Helpdesk', value: '7', change: '-3', icon: Bell, color: 'amber' },
    { label: 'Uptime Système', value: '99.98%', change: '+0.01%', icon: CheckCircle, color: 'green' },
  ],
};

const DIRECTION_TASKS = {
  DG: [
    { id: 1, title: 'Valider le budget Q4 2026', priority: 'high', due: '2026-10-15' },
    { id: 2, title: 'Réunion du Conseil d\'Administration', priority: 'high', due: '2026-10-20' },
    { id: 3, title: 'Approuver le rapport mensuel APPRO', priority: 'medium', due: '2026-10-12' },
  ],
  APPRO: [
    { id: 1, title: 'Valider la demande d\'approvisionnement #452', priority: 'high', due: '2026-10-11' },
    { id: 2, title: 'Allocation FEFO pour l\'antenne de Franceville', priority: 'high', due: '2026-10-12' },
    { id: 3, title: 'Réunion de planification CMM', priority: 'medium', due: '2026-10-15' },
  ],
  DAF: [
    { id: 1, title: 'Valider l\'engagement budgétaire #892', priority: 'high', due: '2026-10-11' },
    { id: 2, title: 'Lettrage bancaire quotidien', priority: 'high', due: '2026-10-10' },
    { id: 3, title: 'Préparer le rapport financier mensuel', priority: 'medium', due: '2026-10-15' },
  ],
};

export default function DirectionDashboard({ 
  directionId, 
  onBack, 
  currentUser,
  onOpenProfile,
  onOpenHelpdesk,
  onLogout 
}) {
  const [refreshing, setRefreshing] = useState(false);
  const direction = getDirectionById(directionId);
  const kpis = DIRECTION_KPIS[directionId] || [];
  const tasks = DIRECTION_TASKS[directionId] || [];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  if (!direction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Direction non trouvée</p>
          <button onClick={onBack} className="px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const getColorClass = (color) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-600',
      blue: 'bg-blue-100 text-blue-600',
      amber: 'bg-amber-100 text-amber-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
    };
    return colors[color] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                  <span className="text-white font-bold text-lg">{direction.nom.charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{direction.nom}</h1>
                  <p className="text-xs text-slate-500">Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className={`p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ${refreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-5 h-5" />
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
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change.toString().includes('+') || kpi.change.toString().includes('-');
            return (
              <div key={index} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClass(kpi.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</p>
                <p className="text-sm text-slate-500">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
          {tasks.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Tâches Prioritaires</h3>
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{task.title}</p>
                          <p className="text-xs text-slate-500">Échéance: {task.due}</p>
                        </div>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Actions Rapides</h3>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">Créer un rapport</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">Voir l'équipe</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">Planifier une réunion</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">Voir l'activité</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Activité Récente</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-500 text-center py-8">
              Aucune activité récente à afficher
            </p>
          </div>
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
