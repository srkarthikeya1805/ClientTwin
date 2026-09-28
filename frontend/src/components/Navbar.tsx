import React from 'react';
import {
  Layers,
  Building2,
  Cpu,
  ChevronDown,
  Wifi,
  BrainCircuit,
} from 'lucide-react';
import { Client } from '../types';

interface NavbarProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  aiProvider: string;
  onLoadFullDemo: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  aiProvider,
}) => {
  const currentClient = clients.find(c => c.id === selectedClientId);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">

        {/* ── Brand ─────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 via-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20">
            <Layers className="h-4 w-4 text-white" />
            {/* Live pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-[1.5px] border-slate-950" />
            </span>
          </div>

          {/* Wordmark */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-white font-mono">
              ClientTwin
            </span>
            <span className="text-base font-light text-cyan-400 font-mono">AI</span>
            <span className="ml-1 rounded bg-brand-500/10 px-1 py-0.5 text-[9px] font-bold uppercase tracking-widest text-brand-400 border border-brand-500/20">
              Agent
            </span>
          </div>
        </div>

        {/* ── Center: Active Client Selector ─────────────── */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900/60 border border-white/[0.07] px-3 py-1.5">
          <Building2 className="h-3.5 w-3.5 text-brand-400 shrink-0" />
          <select
            value={selectedClientId}
            onChange={e => onSelectClient(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none cursor-pointer min-w-0"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                {c.name}
              </option>
            ))}
          </select>
          {currentClient && (
            <span className="ml-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              {currentClient.active_rules_count} rules
            </span>
          )}
          <ChevronDown className="h-3 w-3 text-slate-600 shrink-0" />
        </div>

        {/* ── Right: Status Badges ───────────────────────── */}
        <div className="flex items-center gap-2">
          {/* AI Engine badge */}
          <div className="hidden md:flex items-center gap-1.5 rounded-xl bg-slate-900/60 border border-white/[0.07] px-2.5 py-1.5 text-[11px]">
            <Cpu className="h-3 w-3 text-cyan-400" />
            <span className="text-slate-500">Engine:</span>
            <span className="font-semibold text-slate-200">{aiProvider}</span>
          </div>

          {/* Memory agent live status */}
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-1.5 text-[11px]">
            <BrainCircuit className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-300 font-semibold hidden sm:inline">Memory Agent</span>
            <Wifi className="h-2.5 w-2.5 text-emerald-400" />
          </div>

          {/* Demo mode pill */}
          <div className="flex items-center gap-1 rounded-xl bg-amber-500/5 border border-amber-500/20 px-2.5 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Demo
          </div>
        </div>
      </div>
    </header>
  );
};
