import React, { useState } from 'react';
import {
  PhoneCall,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ListOrdered,
  FileCheck2,
  RefreshCw,
  Copy,
  Check,
  Printer,
  Building2,
  Target,
  Zap,
  ShieldCheck,
  GitBranch,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Client, CallBriefResponse } from '../types';
import { api } from '../api';

interface CallBriefViewProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
}

export const CallBriefView: React.FC<CallBriefViewProps> = ({
  clients,
  selectedClientId,
  onSelectClient
}) => {
  const [objective, setObjective] = useState('Q4 Strategic Roadmap & Executive Review');
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefResult, setBriefResult] = useState<CallBriefResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setErrorMsg(null);
    setIsGenerating(true);
    setBriefResult(null);

    try {
      const res = await api.generateCallBrief(selectedClientId, {
        client_id: selectedClientId,
        call_objective: objective.trim()
      });
      setBriefResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate call brief');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!briefResult) return;
    const text = `
EXECUTIVE INTELLIGENCE BRIEF: ${briefResult.client_name}
Objective: ${briefResult.objective}

CURRENT PRIORITIES:
${briefResult.current_priorities.map(p => `• ${p}`).join('\n')}

ACTIVE RESTRICTIONS (DO NOT VIOLATE):
${briefResult.active_restrictions.map(r => `• ${r}`).join('\n')}

RECENT MEMORY EVOLUTIONS:
${briefResult.recent_changes.map(c => `• ${c}`).join('\n')}

MISTAKES TO AVOID ON THE CALL:
${briefResult.mistakes_to_avoid.map(m => `• ${m}`).join('\n')}

RECOMMENDED TALKING POINTS:
${briefResult.suggested_talking_points.map(t => `• ${t}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              PRE-CALL INTELLIGENCE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <PhoneCall className="h-6 w-6 text-emerald-400" />
            <span>Executive Meeting Preparation Dossier</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Synthesizes living client context into a high-impact briefing dossier with pitfalls to avoid
          </p>
        </div>

        {/* Client Selector Dropdown */}
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2">
          <Building2 className="h-4 w-4 text-emerald-400" />
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

      {/* 2. Objective Configuration Bar */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              CALL / MEETING OBJECTIVE
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. Q4 Strategic Roadmap & Executive Review"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="md:col-span-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Dossier...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate Call Brief</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* 3. Executive Intelligence Dossier Result */}
      {briefResult ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8 animate-fadeIn">
          {/* Dossier Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  EXECUTIVE DOSSIER READY
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Target Account: <strong className="text-white">{briefResult.client_name}</strong>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {briefResult.objective}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy Dossier</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <Printer className="h-3.5 w-3.5 text-slate-400" />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Dossier Body Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: CLIENT SNAPSHOT */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>1. CLIENT SNAPSHOT</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedClient?.description || 'Enterprise Client Portfolio Account.'}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Industry: <strong className="text-slate-200">{selectedClient?.industry}</strong></span>
                <span>Active Rules: <strong className="text-cyan-400">{selectedClient?.active_rules_count}</strong></span>
              </div>
            </div>

            {/* Section 2: CURRENT PRIORITIES */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono uppercase text-blue-400 font-bold flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>2. CURRENT PRIORITIES</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {briefResult.current_priorities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: ACTIVE RESTRICTIONS (NEVER VIOLATE) */}
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3">
              <h4 className="text-xs font-mono uppercase text-rose-400 font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>3. ACTIVE RESTRICTIONS (DO NOT VIOLATE)</span>
              </h4>
              <ul className="space-y-2 text-xs text-rose-200">
                {briefResult.active_restrictions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                    <span className="leading-snug font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4: RECENT EVOLUTIONS */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3">
              <h4 className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span>4. RECENT EVOLUTIONS (SUPERSEDING)</span>
              </h4>
              <ul className="space-y-2 text-xs text-amber-200">
                {briefResult.recent_changes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-0.5">➔</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 5: MISTAKES TO AVOID (HIGH PRIORITY) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-3 md:col-span-2">
              <h4 className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>5. MISTAKES TO AVOID ON THE CALL</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {briefResult.mistakes_to_avoid.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                    <span className="font-bold text-rose-400 font-mono">0{idx + 1}.</span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: SUGGESTED TALKING POINTS */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3 md:col-span-2">
              <h4 className="text-xs font-mono uppercase text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>6. RECOMMENDED TALKING POINTS</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {briefResult.suggested_talking_points.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                    <span className="font-bold text-emerald-400 font-mono">0{idx + 1}.</span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standby */
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-12 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <PhoneCall className="h-8 w-8" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h4 className="text-base font-bold text-white">Call Brief Dossier Engine Ready</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your meeting objective above and click <strong>&ldquo;Generate Call Brief&rdquo;</strong> to assemble the 6-point presentation dossier.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
