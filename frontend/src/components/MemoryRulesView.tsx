import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  Tag,
  GitBranch,
  ShieldAlert,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { Client, MemoryItem, MemoryCategory } from '../types';

interface MemoryRulesViewProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  memories: MemoryItem[];
}

export const MemoryRulesView: React.FC<MemoryRulesViewProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  memories
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'active' | 'superseded' | 'restrictions'>('all');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'restrictions', label: 'Language Restrictions' },
    { id: 'communication_style', label: 'Communication Style' },
    { id: 'preferences', label: 'Reporting & Preferences' },
    { id: 'requirements', label: 'Requirements & Standards' },
    { id: 'brand_guidelines', label: 'Brand Guidelines' },
    { id: 'priorities', label: 'Business Priorities' },
  ];

  const activeCount = memories.filter(m => m.status === 'active').length;
  const supersededCount = memories.filter(m => m.status === 'superseded').length;
  const restrictionCount = memories.filter(m => m.category === 'restrictions').length;

  const filteredMemories = memories.filter(m => {
    const matchesSearch =
      m.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.source_context.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;

    let matchesStatus = true;
    if (selectedStatusTab === 'active') matchesStatus = m.status === 'active';
    else if (selectedStatusTab === 'superseded') matchesStatus = m.status === 'superseded';
    else if (selectedStatusTab === 'restrictions') matchesStatus = m.category === 'restrictions';

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              KNOWLEDGE REPOSITORY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-cyan-400" />
            <span>Institutional Memory & Rules Bank</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Searchable policy inventory with active rules, historical superseding links, and provenance audit trails
          </p>
        </div>

        {/* Client Selector Dropdown */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2">
          <Building2 className="h-4 w-4 text-cyan-400" />
          <select
            value={selectedClientId}
            onChange={(e) => onSelectClient(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                Target: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Status Segments & Search/Filter Controls */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSelectedStatusTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedStatusTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({memories.length})
            </button>
            <button
              onClick={() => setSelectedStatusTab('active')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedStatusTab === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setSelectedStatusTab('superseded')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedStatusTab === 'superseded'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Superseded ({supersededCount})
            </button>
            <button
              onClick={() => setSelectedStatusTab('restrictions')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedStatusTab === 'restrictions'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Restrictions ({restrictionCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search statements or context..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80 text-xs font-mono">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800 font-bold'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Memory Rules List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map(m => {
          const isSuperseded = m.status === 'superseded';
          const isRestriction = m.category === 'restrictions';

          return (
            <div
              key={m.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isSuperseded
                  ? 'bg-slate-950/40 border-slate-800/70 opacity-60 hover:opacity-100 hover:border-amber-500/50'
                  : isRestriction
                  ? 'bg-slate-900/60 border-rose-500/30 hover:border-rose-400/60'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                      isSuperseded
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isRestriction
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {m.status.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{m.date}</span>
                </div>

                <p className={`text-sm font-semibold leading-relaxed ${
                  isSuperseded ? 'text-slate-400 line-through' : 'text-slate-100'
                }`}>
                  &ldquo;{m.statement}&rdquo;
                </p>

                <div className="text-xs text-slate-400 font-mono">
                  Context: <span className="text-slate-300">{m.source_context}</span> ({m.source_type})
                </div>

                {isSuperseded && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Superseded by subsequent data-driven directive in August.</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="capitalize">{m.category.replace('_', ' ')}</span>
                <span className="text-cyan-400">Confidence: {m.confidence}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
