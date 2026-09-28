import React from 'react';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  FilePlus,
  PenTool,
  PhoneCall,
  BookOpen,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';
import { Client } from '../types';

export type NavTab =
  | 'dashboard'
  | 'clients'
  | 'twin'
  | 'ingest'
  | 'draft'
  | 'call-brief'
  | 'memory';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeClient: Client | null;
  activeRulesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeClient,
  activeRulesCount
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
    description: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Living context & KPIs'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      description: 'Enterprise client directory'
    },
    {
      id: 'twin',
      label: 'Client Twin',
      icon: BrainCircuit,
      badge: activeRulesCount ? `${activeRulesCount} rules` : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      description: 'Interactive 3D memory matrix'
    },
    {
      id: 'ingest',
      label: 'Ingest Context',
      icon: FilePlus,
      description: 'Process transcripts & notes'
    },
    {
      id: 'draft',
      label: 'Draft Assistant',
      icon: PenTool,
      badge: 'Conflict Audit',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Context-aware generation'
    },
    {
      id: 'call-brief',
      label: 'Call Preparation',
      icon: PhoneCall,
      description: 'Executive briefing dossier'
    },
    {
      id: 'memory',
      label: 'Memory Rules',
      icon: BookOpen,
      description: 'Institutional knowledge bank'
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation Header */}
        <div>
          <div className="px-3 pb-2.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>PLATFORM NAVIGATION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {/* Active Indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-cyan-400 shadow-sm shadow-cyan-400" />
                  )}

                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs tracking-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal leading-tight">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold border ${
                        item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Selected Client Living Twin Card */}
      {activeClient && (
        <div className="rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-3.5 space-y-3 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>ACTIVE TWIN</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-400 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white truncate tracking-tight">{activeClient.name}</h4>
            <p className="text-[10px] text-slate-400 truncate">{activeClient.industry}</p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Institutional Rules:</span>
            <span className="font-bold text-cyan-400">{activeRulesCount} active</span>
          </div>

          <button
            onClick={() => onSelectTab('twin')}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 py-2 text-xs font-semibold text-slate-200 transition-all hover:text-white"
          >
            <span>Launch 3D Twin</span>
            <ArrowRight className="h-3 w-3 text-cyan-400" />
          </button>
        </div>
      )}
    </aside>
  );
};
