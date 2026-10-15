import React from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  Truck, 
  MessageSquare, 
  AlertTriangle, 
  FolderOpen, 
  ShieldCheck,
  Settings, 
  Briefcase, 
  QrCode, 
  ShoppingCart, 
  FileCheck, 
  Video, 
  Navigation,
  Building2,
  Globe,
  Award,
  Receipt,
  Warehouse,
  Compass,
  TrendingUp,
  HeartHandshake,
  UserCheck,
  Wrench,
  Users,
  ClipboardCheck,
  Landmark,
  Sparkles,
  Route,
  Boxes,
  LifeBuoy,
  Database,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose
} from 'lucide-react';
import { getCodeRole, getVisibleModules } from '../../data/rbacMatrix';
import OpnLogo from './OpnLogo';

const ICON_BY_MODULE = {
  admin: ShieldCheck,
  admin_helpdesk: ShieldCheck,
  admin_users: ShieldCheck,
  dashboard: LayoutDashboard,
  prospection: Users,
  gross_margin: TrendingUp,
  debt_public: Landmark,
  inventory_waste: ClipboardCheck,
  planning: TrendingUp,
  distribution: Compass,
  citizen: HeartHandshake,
  hr: UserCheck,
  gmao: Wrench,
  wms: Warehouse,
  billing: Receipt,
  workspace: Briefcase,
  pharmacy: Pill,
  supply: Truck,
  purchases: Globe,
  quality: Award,
  logistics: Navigation,
  antenna: Building2,
  emergency: AlertTriangle,
  collaborative: Video,
  documents: FolderOpen,
  flux_appro: Route,
  referentiel: Database,
  patrimoine: Boxes,
  centre_services: LifeBuoy,
  parametrage: Settings,
};

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  currentUser,
  activePersona,
  collapsed = false,
  onCollapse,
  onExpand,
  onHide,
}) {
  const user = currentUser || activePersona;
  const codeRole = getCodeRole(user);
  const menuItems = getVisibleModules(user).map((item) => ({
    ...item,
    icon: codeRole === 'CONVOYEUR' && item.id === 'workspace'
      ? QrCode
      : codeRole === 'ACHATS' && item.id === 'workspace'
      ? ShoppingCart
      : (codeRole === 'DG' || codeRole === 'DIR' || codeRole === 'DAF') && item.id === 'workspace'
      ? FileCheck
      : ICON_BY_MODULE[item.id] || Briefcase,
  }));

  return (
    <aside className={`${collapsed ? 'w-[4.75rem]' : 'w-64'} bg-[#0E2A4F] border-r border-[#0A1F3C] flex flex-col shrink-0 h-full min-h-0 overflow-hidden shadow-sm transition-[width] duration-200`}>
      <div className={`h-16 shrink-0 border-b border-white/10 flex items-center ${collapsed ? 'justify-center px-1' : 'justify-between gap-2 px-3'}`}>
        <button
          type="button"
          onClick={() => setCurrentView(menuItems[0]?.id || 'flux_appro')}
          className="min-w-0"
          title="Office Pharmaceutique National"
        >
          {collapsed ? (
            <OpnLogo variant="symbol" className="h-9 w-9" />
          ) : (
            <OpnLogo theme="white" className="h-11 max-w-[11.5rem]" />
          )}
        </button>
        {!collapsed && (
          <div className="flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={onCollapse}
              className="p-1 rounded border border-white/15 bg-white/10 hover:bg-white/20 text-white"
              title="Réduire la barre latérale"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onHide}
              className="p-1 rounded border border-white/15 bg-white/10 hover:bg-white/20 text-white"
              title="Cacher la barre latérale"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {collapsed && (
        <div className="shrink-0 flex items-center justify-center gap-1 py-1.5 border-b border-white/10">
          <button
            type="button"
            onClick={onExpand}
            className="p-1 rounded border border-white/15 bg-white/10 hover:bg-white/20 text-white"
            title="Agrandir la barre latérale"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onHide}
            className="p-1 rounded border border-white/15 bg-white/10 hover:bg-white/20 text-white"
            title="Cacher la barre latérale"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <nav className={`flex-1 min-h-0 overflow-y-auto space-y-1 ${collapsed ? 'p-2' : 'p-3'}`}>
          {!collapsed && (
          <div className="px-3 py-1.5 text-[10px] font-bold text-blue-200/70 uppercase tracking-wider flex items-center justify-between">
            <span>Modules Autorisés</span>
            <span className="text-[9px] font-mono bg-white/10 text-blue-100 px-1 py-0.5 rounded">
              {user.scope || 'PROVINCE'}
            </span>
          </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={`${item.id}-${item.label}`}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2E68B4] text-white shadow-sm font-bold'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className={`flex items-center min-w-0 ${collapsed ? '' : 'gap-2.5'}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-200'}`} />
                  {!collapsed && <span className="truncate text-left">{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border shrink-0 ml-1 ${isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      {!collapsed && (
      <div className="shrink-0 border-t border-white/10 bg-transparent space-y-2 p-3">
        <div className="bg-white/10 rounded-md p-2.5 border border-white/10 text-xs">
          <div className="flex items-center justify-between text-blue-100/70 mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-[11px] text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Réseau National
            </span>
            <span className="font-bold text-emerald-300 text-[11px]">9/9 Antennes</span>
          </div>
          <p className="text-[10px] text-blue-100/70">
            {user.provinceId === 'G1' || user.scope === 'GLOBAL' || user.scope === 'NATIONAL' 
              ? (codeRole === 'SUPER_ADMIN' ? 'Supervision SI — hors exécution Appro' : 'Vision Nationale Centrale OPN')
              : `Périmètre : Zone Provinciale ${user.provinceId}`}
          </p>
        </div>
      </div>
      )}

    </aside>
  );
}
