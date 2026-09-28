import React, { useState } from 'react';
import {
  FilePlus,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Zap,
  Tag,
  PenTool,
  Upload,
  Workflow,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { Client, SourceType, ExtractionResult } from '../types';
import { api } from '../api';
import { NavTab } from './Sidebar';

interface IngestViewProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onNavigate: (tab: NavTab) => void;
  onRefreshData: () => void;
}

export const IngestView: React.FC<IngestViewProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onNavigate,
  onRefreshData
}) => {
  const [sourceType, setSourceType] = useState<SourceType>('Meeting Transcript');
  const [dateStr, setDateStr] = useState('October 2026');
  const [title, setTitle] = useState('Executive Formatting & Delivery Review');
  const [content, setContent] = useState(
    'Acme Corporation would like future executive summaries to begin with key findings before detailed analysis.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preset demo snippets
  const loadDemoPreset = (preset: 'october' | 'november' | 'august') => {
    onSelectClient('client-acme-corp');
    if (preset === 'october') {
      setSourceType('Meeting Transcript');
      setDateStr('October 2026');
      setTitle('Executive Formatting Review');
      setContent('Acme would like future executive summaries to begin with key findings before detailed analysis.');
    } else if (preset === 'november') {
      setSourceType('Meeting Transcript');
      setDateStr('November 2026');
      setTitle('Q4 Format Revision');
      setContent('Acme now wants executive summaries to be concise again, but detailed supporting analysis should remain available.');
    } else if (preset === 'august') {
      setSourceType('Meeting Transcript');
      setDateStr('August 2026');
      setTitle('Mid-Year Review');
      setContent('Acme Corporation has changed its reporting preference. They now want more detailed, data-driven reports containing measurable results and statistics.');
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setErrorMsg('Please enter or paste client communication text.');
      return;
    }
    setErrorMsg(null);
    setIsAnalyzing(true);
    setExtractionResult(null);

    try {
      const res = await api.ingestContext(selectedClientId, {
        client_id: selectedClientId,
        source_type: sourceType,
        date: dateStr,
        content: content.trim(),
        title: title || `${sourceType} - ${dateStr}`
      });
      setExtractionResult(res);
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze client communication');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Workflow Diagram */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              INGESTION PIPELINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <FilePlus className="h-6 w-6 text-cyan-400" />
            <span>Ingest Raw Communication</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Process transcripts, emails, and Slack notes into evolving, structured client context
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

      {/* 3-Step Visual Workflow Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold font-mono text-sm">
            01
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">RAW INPUT</h4>
            <p className="text-[11px] text-slate-400">Paste unformatted transcripts, emails, or notes</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold font-mono text-sm">
            02
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">EXTRACT CONTEXT</h4>
            <p className="text-[11px] text-slate-400">Classify into 9 categories & check contradiction</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono text-sm">
            03
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">UPDATE CLIENT TWIN</h4>
            <p className="text-[11px] text-slate-400">Mark superseded rules & activate new constraints</p>
          </div>
        </div>
      </div>

      {/* 2. Ingest Input Form & Rapid Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white">Touchpoint Details</h3>

            {/* Quick Demo Preset Chips */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400 text-[10px]">PRESETS:</span>
              <button
                onClick={() => loadDemoPreset('october')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
              >
                Oct: Key Findings
              </button>
              <button
                onClick={() => loadDemoPreset('november')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
              >
                Nov: Supersede
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">SOURCE CHANNEL</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Meeting Transcript">Meeting Transcript</option>
                <option value="Email">Email</option>
                <option value="Slack / Chat">Slack / Chat</option>
                <option value="Revision Notes">Revision Notes</option>
                <option value="Other">Other Communication</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">INTERACTION DATE</label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="e.g. October 2026"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">TITLE / SUBJECT</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Executive Summary Format Alignment"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">RAW COMMUNICATION BODY</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste transcript excerpt, client email, or revision note..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Extracting Institutional Context...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Process & Update Client Twin</span>
              </>
            )}
          </button>
        </div>

        {/* Guidance & Target Account Sidebar */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-cyan-400" />
              <span>Target Account Snapshot</span>
            </h3>

            {selectedClient && (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-white font-bold text-sm">{selectedClient.name}</div>
                <div className="text-cyan-400">{selectedClient.industry}</div>
                <div className="pt-2 border-t border-slate-800 text-slate-400">
                  Active Rules: <strong className="text-white">{selectedClient.active_rules_count} rules</strong>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-cyan-400 font-mono block text-[10px]">EXTRACTION BEHAVIOR</span>
              <p className="text-[11px] leading-relaxed">
                The engine checks newly extracted instructions against all existing memories in the database. When an explicit contradiction or revision is found, the previous rule is preserved with status <strong>SUPERSEDED</strong> and provenance backward links.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('twin')}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            <span>View 3D Memory Matrix</span>
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* 3. Live Extraction Results Card (When Available) */}
      {extractionResult && (
        <div className="rounded-3xl border border-cyan-500/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  EXTRACTION COMPLETE
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Engine: {extractionResult.ai_provider}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {extractionResult.summary}
              </h3>
            </div>

            <button
              onClick={() => onNavigate('twin')}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20"
            >
              <span>See in 3D Twin</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* New Memory Detected Card */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>NEW ACTIVE MEMORY EXTRACTED</span>
            </h4>

            {extractionResult.new_memories.map((mem, i) => (
              <div key={i} className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {mem.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-slate-400">{mem.date}</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  &ldquo;{mem.statement}&rdquo;
                </p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Confidence: <span className="text-emerald-400 font-bold">{mem.confidence}</span> • Source: {mem.source_type}
                </div>
              </div>
            ))}
          </div>

          {/* Superseded Rule Alert (If evolution occurred) */}
          {extractionResult.superseded_memories && extractionResult.superseded_memories.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span>TEMPORAL EVOLUTION: PREVIOUS RULE SUPERSEDED</span>
              </h4>

              {extractionResult.superseded_memories.map((sm, i) => (
                <div key={i} className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold line-through">
                      SUPERSEDED
                    </span>
                    <span className="text-slate-400">{sm.date}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-300 line-through">
                    &ldquo;{sm.statement}&rdquo;
                  </p>
                  <p className="text-xs text-amber-300 font-mono">
                    ↳ Automatically marked superseded by newly ingested client preference.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
