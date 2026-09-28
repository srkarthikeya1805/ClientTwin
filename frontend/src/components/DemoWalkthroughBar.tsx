import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Calendar,
  AlertTriangle,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Play
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface DemoWalkthroughBarProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onNavigateToDraft: (prefillPrompt?: string) => void;
  onNavigateToIngest: (preset: 'july' | 'august' | 'september') => void;
  onSelectTab: (tab: NavTab) => void;
  onResetDemo?: () => void;
}

export const DemoWalkthroughBar: React.FC<DemoWalkthroughBarProps> = ({
  currentStep,
  onSetStep,
  onNavigateToDraft,
  onNavigateToIngest,
  onSelectTab,
  onResetDemo
}) => {
  return (
    <div className="w-full border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl px-4 py-2.5 sm:px-6 shadow-lg z-30">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
        {/* Left: Narrative Timeline Tracker */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                TEMPORAL CONTROLLER
              </span>
              <span className="text-xs font-bold text-white tracking-wide">
                Acme Corporation Memory Evolution Sequence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              July (Concise reports) ➔ August (Superseded by Data-Driven) ➔ September (Evidence-backed communication)
            </p>
          </div>
        </div>

        {/* Right: High-Visibility Hackathon Demo Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reset Demo Button */}
          {onResetDemo && (
            <button
              onClick={onResetDemo}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:text-white"
              title="Reset all memories and clients to clean baseline"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>RESET DEMO</span>
            </button>
          )}

          {/* Step 1: July Kickoff */}
          <button
            onClick={() => onSetStep(1)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${
              currentStep === 1
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Step 1: July Kickoff — Initial concise reporting preference"
          >
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
              currentStep === 1 ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </span>
            <span>JULY: KICKOFF</span>
          </button>

          {/* Step 2: August Evolution */}
          <button
            onClick={() => onSetStep(2)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${
              currentStep === 2
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Step 2: August Evolution — Concise reports marked SUPERSEDED by detailed data-driven reports"
          >
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
              currentStep === 2 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </span>
            <span>AUG: EVOLVED</span>
          </button>

          {/* Step 3: September Complete */}
          <button
            onClick={() => onSetStep(3)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${
              currentStep === 3
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Step 3: September Complete — Full active memory profile with promotional restrictions"
          >
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
              currentStep === 3 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </span>
            <span>SEPT: COMPLETE</span>
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Test Conflict Draft Button */}
          <button
            onClick={() =>
              onNavigateToDraft(
                "Create a promotional introduction for Acme Corporation's campaign. Explain how our solutions create synergy between teams."
              )
            }
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 border border-rose-500/40 px-3 py-1.5 text-xs font-bold text-rose-300 shadow-md shadow-rose-500/10 transition-all hover:scale-[1.02] active:scale-95"
            title="Trigger real-time conflict detection: Flags prohibited 'synergy' and promotional hype"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
            <span>TEST CONFLICT DRAFT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
