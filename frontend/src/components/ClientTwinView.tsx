import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  History,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  PenTool,
  PhoneCall,
  FilePlus,
  Info,
  Layers,
  Flame,
  Check,
  ChevronRight,
  Eye,
  Activity,
  GitBranch,
  X
} from 'lucide-react';
import { ClientTwinOverview, MemoryItem, TimelineEvent } from '../types';
import { NavTab } from './Sidebar';
import { ClientTwin3D } from './ClientTwin3D';

interface ClientTwinViewProps {
  twin: ClientTwinOverview | null;
  isLoading: boolean;
  onNavigate: (tab: NavTab) => void;
}

export const ClientTwinView: React.FC<ClientTwinViewProps> = ({
  twin,
  isLoading,
  onNavigate
}) => {
  const [selectedTimelineMonth, setSelectedTimelineMonth] = useState<'all' | 'july' | 'august' | 'september'>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Collect all memories
  const allMemories = useMemo(() => {
    if (!twin) return [];
    return [
      ...twin.preferences,
      ...twin.restrictions,
      ...twin.communication_style,
      ...twin.requirements,
      ...twin.brand_guidelines,
      ...twin.decisions,
      ...twin.priorities,
      ...twin.feedback,
      ...twin.important_facts,
      ...twin.superseded_memories,
    ];
  }, [twin]);

  // Filter memories based on timeline step selected
  const displayedMemories = useMemo(() => {
    if (selectedTimelineMonth === 'july') {
      return allMemories.filter(m =>
        m.date.toLowerCase().includes('july') ||
        m.source_context.toLowerCase().includes('july') ||
        (m.status === 'superseded' && m.statement.toLowerCase().includes('concise'))
      ).map(m => {
        // In July, concise was ACTIVE
        if (m.statement.toLowerCase().includes('concise')) {
          return { ...m, status: 'active' as const };
        }
        return m;
      }).filter(m => !m.statement.toLowerCase().includes('data-driven') && !m.statement.toLowerCase().includes('promotional') && !m.statement.toLowerCase().includes('evidence'));
    } else if (selectedTimelineMonth === 'august') {
      return allMemories.filter(m =>
        !m.statement.toLowerCase().includes('promotional') && !m.statement.toLowerCase().includes('evidence')
      );
    }
    // September / All: complete state
    return allMemories;
  }, [allMemories, selectedTimelineMonth]);

  if (isLoading || !twin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
        <p className="text-sm font-mono text-cyan-400">Loading Client Twin Neural Context...</p>
      </div>
    );
  }

  const { client, timeline } = twin;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-mono font-bold text-cyan-400 border border-cyan-500/30">
                INSTITUTIONAL CLIENT TWIN
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                {twin.total_active_rules} ACTIVE RULES
              </span>
              {twin.total_superseded_rules > 0 && (
                <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-mono font-bold text-amber-400 border border-amber-500/30">
                  {twin.total_superseded_rules} SUPERSEDED (EVOLVED)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {client.name}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {client.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span><strong>Industry:</strong> {client.industry}</span>
              <span><strong>Primary Contact:</strong> {client.primary_contact || 'Enterprise Team'}</span>
              <span><strong>Last Evolved:</strong> {client.last_updated}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => onNavigate('draft')}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <PenTool className="h-4 w-4" />
              <span>Draft Content</span>
            </button>

            <button
              onClick={() => onNavigate('call-brief')}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
              <span>Call Prep Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive 3D Client Twin & Timeline Stepper */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-cyan-400" />
              <span>Interactive 3D Client Memory Network</span>
            </h2>
            <p className="text-xs text-slate-400">
              Orbital constellation of active constraints, historical evolutions, and policy restrictions
            </p>
          </div>

          {/* Interactive Timeline Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="px-2 text-slate-400 text-[11px] font-bold">TIMELINE:</span>
            <button
              onClick={() => setSelectedTimelineMonth('july')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimelineMonth === 'july'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JUL 2026
            </button>
            <button
              onClick={() => setSelectedTimelineMonth('august')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimelineMonth === 'august'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AUG 2026
            </button>
            <button
              onClick={() => setSelectedTimelineMonth('september')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimelineMonth === 'september'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEP 2026
            </button>
            <button
              onClick={() => setSelectedTimelineMonth('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimelineMonth === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL
            </button>
          </div>
        </div>

        {/* 3D Visualizer Canvas */}
        <ClientTwin3D
          client={client}
          memories={displayedMemories}
          selectedMemoryId={selectedMemory?.id}
          onSelectMemory={setSelectedMemory}
          timelineStep={selectedTimelineMonth === 'july' ? 1 : selectedTimelineMonth === 'august' ? 2 : 3}
        />
      </div>

      {/* 3. Memory Inspector Panel (When node is clicked) */}
      {selectedMemory && (
        <div className="rounded-2xl border border-cyan-500/50 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 backdrop-blur-xl shadow-2xl relative animate-fadeIn">
          <button
            onClick={() => setSelectedMemory(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              MEMORY INSPECTOR
            </span>
            <span
              className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold ${
                selectedMemory.status === 'superseded'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              STATUS: {selectedMemory.status.toUpperCase()}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            &ldquo;{selectedMemory.statement}&rdquo;
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 block mb-1">DATE ESTABLISHED:</span>
              <strong className="text-slate-200">{selectedMemory.date}</strong>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">SOURCE CONTEXT:</span>
              <strong className="text-slate-200">{selectedMemory.source_type}</strong>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">CATEGORY:</span>
              <strong className="text-cyan-400 capitalize">{selectedMemory.category.replace('_', ' ')}</strong>
            </div>
          </div>

          {/* Temporal Evolution / Why it changed provenance */}
          {selectedMemory.status === 'superseded' && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 font-mono">
                <Clock className="w-4 h-4" />
                <span>EVOLUTION DETAILS:</span>
              </span>
              <p className="text-slate-300">
                <strong>Changed because:</strong> In August 2026, client leadership revised this preference to mandate <em>&ldquo;detailed, data-driven reports containing measurable results and statistics.&rdquo;</em>
              </p>
            </div>
          )}

          {selectedMemory.supersedes && (
            <div className="mt-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1 font-mono">
                <GitBranch className="w-4 h-4" />
                <span>SUPERSEDING PROVENANCE:</span>
              </span>
              <p className="text-slate-300">
                This rule actively replaced earlier July 2026 instruction regarding high-level concise summaries.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. Structured Memory Rules Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Structured Context Repository</span>
            </h3>
            <p className="text-xs text-slate-400">
              Categorized memory inventory with active status and historical provenance
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            {[
              { id: 'all', label: `All (${displayedMemories.length})` },
              { id: 'restrictions', label: `Restrictions (${displayedMemories.filter(m => m.category === 'restrictions').length})` },
              { id: 'preferences', label: `Preferences (${displayedMemories.filter(m => m.category === 'preferences').length})` },
              { id: 'communication_style', label: `Communication (${displayedMemories.filter(m => m.category === 'communication_style').length})` },
              { id: 'superseded', label: `Superseded (${displayedMemories.filter(m => m.status === 'superseded').length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveCategoryFilter(f.id)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  activeCategoryFilter === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMemories
            .filter(m => {
              if (activeCategoryFilter === 'all') return true;
              if (activeCategoryFilter === 'superseded') return m.status === 'superseded';
              return m.category === activeCategoryFilter;
            })
            .map(m => {
              const isSuperseded = m.status === 'superseded';
              const isRestriction = m.category === 'restrictions';
              const isSelected = selectedMemory?.id === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMemory(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : isSuperseded
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100 hover:border-amber-500/50'
                      : isRestriction
                      ? 'bg-slate-900/50 border-rose-500/30 hover:border-rose-400/60'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-cyan-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                          isSuperseded
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isRestriction
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {m.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{m.date}</span>
                    </div>

                    <p className={`text-xs font-medium leading-relaxed mb-3 ${
                      isSuperseded ? 'text-slate-400 line-through' : 'text-slate-200'
                    }`}>
                      {m.statement}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="capitalize">{m.category.replace('_', ' ')}</span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
