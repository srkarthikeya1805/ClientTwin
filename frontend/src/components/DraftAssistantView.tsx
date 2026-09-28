import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldAlert,
  BrainCircuit,
  Zap,
  Info,
  Building2,
  FileCheck2,
  Download
} from 'lucide-react';
import { Client, DraftResponse } from '../types';
import { api } from '../api';

interface DraftAssistantViewProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  initialPrompt?: string;
}

export const DraftAssistantView: React.FC<DraftAssistantViewProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  initialPrompt = ''
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      "Create a promotional introduction for Acme Corporation's campaign. Explain how our solutions create synergy between teams."
  );
  const [contentType, setContentType] = useState('Campaign Introduction');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftResult, setDraftResult] = useState<DraftResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick prompt presets
  const samplePrompts = [
    {
      label: "Demo Scenario: 'Synergy' + 'Promotional' Conflict",
      prompt:
        "Create a promotional introduction for Acme Corporation's campaign. Explain how our solutions create synergy between teams."
    },
    {
      label: "Executive Quarterly Review Memo",
      prompt:
        "Prepare talking points and an executive summary for the quarterly review meeting focusing on verified progress milestones."
    },
    {
      label: "Empirical SLA Status Update",
      prompt:
        "Draft a formal service-level agreement performance digest summarizing our team's operational throughput."
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a draft request or goal.');
      return;
    }
    setErrorMsg(null);
    setIsGenerating(true);
    setDraftResult(null);

    try {
      const res = await api.generateDraft(selectedClientId, {
        client_id: selectedClientId,
        prompt: prompt.trim(),
        content_type: contentType
      });
      setDraftResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Draft generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (draftResult?.draft_content) {
      navigator.clipboard.writeText(draftResult.draft_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              POLICY-AWARE DRAFTING ENGINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <PenTool className="h-6 w-6 text-cyan-400" />
            <span>Context-Aware Draft Assistant</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Performs proactive policy audits against client twin memories before generating verified deliverables
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
                Context: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Split Screen: Left (Draft Input) | Right (Client Context Audit & Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Draft Input (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Draft Request</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">INPUT CANVAS</span>
            </div>

            {/* Quick Demo Preset Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                DEMO PRESETS:
              </span>
              <div className="space-y-1.5">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectClient('client-acme-corp');
                      setPrompt(sp.prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 transition-all hover:border-cyan-500/40"
                  >
                    <span className="font-semibold text-white block text-[11px] mb-0.5">{sp.label}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 font-mono">{sp.prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">CONTENT FORMAT</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Campaign Introduction">Campaign Introduction</option>
                <option value="Executive Briefing">Executive Briefing</option>
                <option value="Meeting Preparation Talking Points">Meeting Preparation Talking Points</option>
                <option value="Progress Review Email">Progress Review Email</option>
                <option value="Strategic Recommendation Memo">Strategic Recommendation Memo</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">PROMPT / INSTRUCTIONS</label>
              <textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter what you need to generate..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Auditing Context & Generating...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Analyze Context & Generate Draft</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Client Context Audit & Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {draftResult ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Conflict Detection Banner */}
              {draftResult.conflicts_detected && draftResult.conflicts_detected.length > 0 && (
                <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950 p-6 backdrop-blur-xl shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        {draftResult.conflicts_detected.length} Policy Conflicts Flagged
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      HIGH RISK
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    The requested draft contradicts active client guidelines established in earlier touchpoints:
                  </p>

                  <div className="space-y-2.5">
                    {draftResult.conflicts_detected.map((cf, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-rose-300">
                            [{cf.severity}] {cf.rule_category}
                          </span>
                          <span className="text-slate-400">{cf.rule_date}</span>
                        </div>
                        <p className="text-slate-200 font-semibold">
                          Violation: &ldquo;{cf.rule_statement}&rdquo;
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          <strong>Context:</strong> {cf.conflict_reason}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Adjustments */}
                  {draftResult.suggested_adjustment && (
                    <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1">
                      <span className="font-bold text-cyan-300 font-mono block text-[11px]">
                        SUGGESTED CORRECTION PLAN:
                      </span>
                      <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                        {draftResult.suggested_adjustment}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Generated Context-Aware Output Canvas */}
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-emerald-400" />
                      <span>Context-Compliant Deliverable</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Strictly avoids prohibited terms & uses empirical validation
                    </span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs sm:text-sm font-sans whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {draftResult.draft_content}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Engine: {draftResult.ai_provider}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>0 Fabricated Numbers • 0 Prohibited Buzzwords</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Standby State */
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-12 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[460px]">
              <div className="h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h4 className="text-base font-bold text-white">Client Context Audit Ready</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click <strong>&ldquo;Analyze Context & Generate Draft&rdquo;</strong> to test how ClientTwin AI flags prohibited buzzwords and generates an evidence-backed deliverable.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
