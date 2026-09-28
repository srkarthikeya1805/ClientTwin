import React from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  History,
  ArrowRight,
  Sparkles,
  Zap,
  Building2,
  FileCheck2,
  GitCommit,
  Bot,
  BrainCircuit,
  Clock,
  Layers,
  FilePlus,
  PenTool,
  PhoneCall,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Workflow
} from 'lucide-react';
import { Client, DashboardStats } from '../types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  stats: DashboardStats | null;
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  clients,
  onSelectClient,
  onNavigate
}) => {
  // Real values from database / seed data
  const totalClients = stats?.total_clients ?? clients.length;
  const activeRules = stats?.total_active_rules ?? (clients.reduce((acc, c) => acc + c.active_rules_count, 0) || 0);
  const memoriesTracked = stats ? (stats.total_active_rules + stats.recent_updates_count) : (clients.reduce((acc, c) => acc + c.active_rules_count, 0) || 0);
  const conflictsDetected = stats?.warnings_detected_count ?? 0;

  // The 8-stage core product story
  const pipelineStages = [
    { step: 1, title: 'Raw Communication', desc: 'Meetings, Slack, email threads' },
    { step: 2, title: 'Context Extraction', desc: 'Category & entity parsing' },
    { step: 3, title: 'Structured Memory', desc: 'Rules, prefs, restrictions' },
    { step: 4, title: 'Client Twin', desc: 'Unified living entity matrix' },
    { step: 5, title: 'Memory Evolution', desc: 'Superseding & versioning' },
    { step: 6, title: 'Current Context', desc: 'Active ground-truth state' },
    { step: 7, title: 'Conflict Detection', desc: 'Proactive policy audits' },
    { step: 8, title: 'Context-Aware Response', desc: 'Evidence-grounded output' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Glow Gradients */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 text-xs font-mono font-semibold text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>INSTITUTIONAL CLIENT-TWIN SYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            ClientTwin AI
          </h1>

          <p className="text-lg sm:text-xl font-medium text-cyan-300/90">
            &ldquo;Your client&apos;s institutional memory, continuously evolving.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Turn months of client communication into living context that your team can actually use. ClientTwin AI continuously retains raw touchpoints, detects shifting preferences across meetings, flags conflicts in real time, and synthesizes context-aware outputs.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('ingest')}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <FilePlus className="h-4 w-4" />
              <span>INGEST CONTEXT</span>
            </button>

            <button
              onClick={() => onNavigate('draft')}
              className="flex items-center gap-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-100 shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <PenTool className="h-4 w-4 text-cyan-400" />
              <span>DRAFT ASSISTANT</span>
            </button>

            <button
              onClick={() => onNavigate('call-brief')}
              className="flex items-center gap-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-100 shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <PhoneCall className="h-4 w-4 text-emerald-400" />
              <span>PREPARE FOR CALL</span>
            </button>

            <button
              onClick={() => onNavigate('twin')}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Explore 3D Twin</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Premium Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: ACTIVE CLIENTS */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex items-center justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              ACTIVE CLIENTS
            </p>
            <h3 className="text-3xl font-extrabold text-white mt-1.5">
              {totalClients}
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              4 Institutional Profiles
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2: MEMORIES TRACKED */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex items-center justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              MEMORIES TRACKED
            </p>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-1.5">
              {memoriesTracked}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
              Cumulative touchpoints
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3: ACTIVE RULES */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex items-center justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              ACTIVE RULES
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1.5">
              {activeRules}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
              Active policy constraints
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 4: CONFLICTS DETECTED */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex items-center justify-between hover:border-rose-500/40 transition-all">
          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              CONFLICTS DETECTED
            </p>
            <h3 className="text-3xl font-extrabold text-rose-400 mt-1.5">
              {conflictsDetected}
            </h3>
            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-1">
              High / Medium warnings
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. The Central Product Narrative Pipeline Diagram */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Workflow className="h-4 w-4 text-cyan-400" />
              <span>Institutional Memory Lifecycle</span>
            </h3>
            <p className="text-xs text-slate-400">
              How ClientTwin AI transforms unstructured communication into policy-compliant action
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
            8-STAGE PIPELINE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {pipelineStages.map((st, i) => (
            <div
              key={st.step}
              className="relative p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 hover:border-cyan-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">
                  0{st.step}
                </span>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white leading-tight mb-1">
                  {st.title}
                </h4>
                <p className="text-[10px] text-slate-400 leading-snug">
                  {st.desc}
                </p>
              </div>
              {i < 7 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 text-xs">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Split Section: Temporal Memory Evolution & 3D Twin Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: RECENT MEMORY EVOLUTION (JULY → AUGUST → SEPTEMBER) */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Recent Memory Evolution</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                Acme Corporation
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Memory does not simply accumulate; it evolves over time. When client preferences change, earlier instructions are marked superseded with provenance links.
            </p>

            <div className="space-y-4">
              {/* July State */}
              <div className="relative pl-6 pb-4 border-l-2 border-slate-700">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-400">
                  1
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300">July 2026: Kickoff Meeting</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 line-through">
                    SUPERSEDED
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  &ldquo;Client prefers concise reports and high-level executive summaries.&rdquo;
                </p>
              </div>

              {/* August State */}
              <div className="relative pl-6 pb-4 border-l-2 border-cyan-500">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-[9px] font-bold text-cyan-300">
                  2
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-cyan-300">August 2026: Mid-Year Review</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  &ldquo;Client now requires detailed, data-driven reports containing measurable results and statistics.&rdquo;
                </p>
                <div className="mt-1 text-[10px] text-amber-400/90 font-mono">
                  ↳ Superseded July concise preference
                </div>
              </div>

              {/* September State */}
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-[9px] font-bold text-emerald-300">
                  3
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-300">September 2026: Campaign Guidelines</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  &ldquo;Avoid overly promotional language; all assertions must be supported by empirical evidence. Strict prohibition on &apos;synergy&apos;.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Inspect full timeline & provenance graph:</span>
            <button
              onClick={() => onNavigate('twin')}
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              <span>Launch Twin View</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Interactive 3D Client Twin Preview Banner */}
        <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-7 backdrop-blur-md shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Interactive 3D Client Twin</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
                Constellation Graph
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Explore the client&apos;s living memory network in real-time 3D. Inspect connected policy nodes, temporal superseding transitions, and active restrictions in an interactive orbital graph.
            </p>

            {/* Visual Simulated Preview Graphic */}
            <div className="relative h-44 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Central Core Graphic */}
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 animate-pulse">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <div className="absolute -inset-3 rounded-full border border-dashed border-cyan-400/40 animate-spin-slow" />
                
                {/* Orbital satellite nodes */}
                <div className="absolute -top-7 -right-14 px-2 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-[9px] font-mono text-emerald-300">
                  Data-Driven (Active)
                </div>
                <div className="absolute -bottom-7 -left-14 px-2 py-1 rounded-md bg-rose-950/90 border border-rose-500/40 text-[9px] font-mono text-rose-300">
                  No Synergy (Restr.)
                </div>
                <div className="absolute -bottom-8 right-6 px-2 py-1 rounded-md bg-amber-950/90 border border-amber-500/40 text-[9px] font-mono text-amber-300 line-through">
                  Concise (Superseded)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Client: <strong className="text-white">Acme Corporation</strong>
            </div>
            <button
              onClick={() => onNavigate('twin')}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:scale-[1.02] shadow-md shadow-cyan-500/20"
            >
              <span>Open 3D Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
