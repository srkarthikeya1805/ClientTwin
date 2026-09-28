import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MemoryItem, Client } from '../types';
import { CheckCircle2, ShieldAlert, Clock, Activity, ChevronRight, RefreshCw } from 'lucide-react';

interface ClientTwin3DProps {
  client: Client | null;
  memories: MemoryItem[];
  selectedMemoryId?: string | null;
  onSelectMemory: (memory: MemoryItem | null) => void;
  timelineStep?: number; // 1: July, 2: Aug, 3: Sept
}

interface NodeData {
  id: string;
  statement: string;
  category: string;
  status: string;
  date: string;
  source_context?: string;
  superseded_by?: string | null;
  x: number; // 0–100 percent
  y: number; // 0–100 percent
  z: number; // depth scale 0.7–1.3
  color: string;
  size: number;
  item: MemoryItem;
}

const STATUS_COLOR: Record<string, string> = {
  active: '#22d3ee',       // cyan
  superseded: '#f59e0b',   // amber
  restriction: '#f43f5e',  // rose
  default: '#64748b',
};

const CATEGORY_ICON: Record<string, string> = {
  communication: '💬',
  reporting: '📊',
  relationship: '🤝',
  process: '⚙️',
  cultural: '🌐',
  preference: '⭐',
  default: '📌',
};

function getStatusColor(status: string, category?: string): string {
  if (status === 'superseded') return STATUS_COLOR.superseded;
  if (category === 'restrictions' || status === 'restriction') return STATUS_COLOR.restriction;
  return STATUS_COLOR[status] ?? STATUS_COLOR.active;
}

function goldenSpiralPos(index: number, total: number): { x: number; y: number; z: number } {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const theta = index * golden;
  const r = Math.sqrt(index / Math.max(1, total - 1));
  // Map to 10–90 % space with 3D-like z depth
  const rawX = r * Math.cos(theta);
  const rawY = r * Math.sin(theta);
  const x = 50 + rawX * 38;
  const y = 50 + rawY * 38;
  const z = 0.75 + r * 0.5; // depth perspective
  return { x, y, z };
}

function useAnimationFrame(callback: (t: number) => void, active: boolean) {
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    if (!active) return;
    const loop = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      callback(ts - startRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [active, callback]);
}

export function ClientTwin3D({
  client,
  memories,
  selectedMemoryId,
  onSelectMemory,
  timelineStep = 3,
}: ClientTwin3DProps) {
  const [hovered, setHovered] = useState<NodeData | null>(null);
  const [autoOrbit, setAutoOrbit] = useState(true);
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Slow orbit rotation
  useAnimationFrame(
    (t) => setOrbitAngle(t * 0.00012), // ~7 seconds per full orbit
    autoOrbit
  );

  // Build node list from memories
  const nodes: NodeData[] = useMemo(() => {
    const total = memories.length;
    return memories.map((mem, i) => {
      const base = goldenSpiralPos(i, total);
      // Apply slow orbit offset to x, keep y mostly stable (parallax feel)
      const orbitX = base.x + Math.cos(orbitAngle + i * 0.4) * 3;
      const orbitY = base.y + Math.sin(orbitAngle * 0.7 + i * 0.4) * 1.5;
      return {
        id: mem.id,
        statement: mem.statement,
        category: mem.category,
        status: mem.status,
        date: mem.date,
        source_context: mem.source_context,
        superseded_by: mem.superseded_by,
        x: orbitX,
        y: orbitY,
        z: base.z,
        color: getStatusColor(mem.status, mem.category),
        size: mem.category === 'restrictions' ? 10 : mem.status === 'active' ? 9 : 7,
        item: mem,
      };
    });
  }, [memories, orbitAngle]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-slate-500">
        <div className="text-center">
          <Activity className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm">No client selected</p>
        </div>
      </div>
    );
  }

  const selectedNode = nodes.find(n => n.id === selectedMemoryId) ?? null;

  return (
    <div className="relative w-full h-full min-h-[480px] overflow-hidden rounded-2xl border border-slate-800/60"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.07) 0%, rgba(15,23,42,0.98) 70%)' }}
    >
      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Core glow */}
        <ellipse cx="50%" cy="50%" rx="80" ry="80" fill="url(#coreGlow)" />
        {/* Lines from center to each node */}
        {nodes.map(node => (
          <line
            key={`line-${node.id}`}
            x1="50%"
            y1="50%"
            x2={`${node.x}%`}
            y2={`${node.y}%`}
            stroke={node.color}
            strokeOpacity={node.id === selectedMemoryId ? 0.6 : 0.15}
            strokeWidth={node.id === selectedMemoryId ? 1.5 : 0.8}
          />
        ))}
        {/* Superseded relationship arcs */}
        {nodes
          .filter(n => n.superseded_by)
          .map(n => {
            const target = nodes.find(t => t.id === n.superseded_by);
            if (!target) return null;
            return (
              <line
                key={`sup-${n.id}`}
                x1={`${n.x}%`}
                y1={`${n.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="#f59e0b"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="3 4"
              />
            );
          })}
      </svg>

      {/* Center core */}
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
        style={{ left: '50%', top: '50%' }}
      >
        <div
          className="rounded-full flex items-center justify-center text-xs font-bold text-cyan-300 border border-cyan-500/40 shadow-lg"
          style={{
            width: 64,
            height: 64,
            background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(15,23,42,0.9) 80%)',
            boxShadow: '0 0 32px 6px rgba(6,182,212,0.18)',
          }}
        >
          <span className="text-center leading-tight px-1" style={{ fontSize: 9 }}>
            {client.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
          </span>
        </div>
        <span className="mt-1 text-[9px] text-cyan-400/70 font-mono tracking-widest">TWIN CORE</span>
      </div>

      {/* Memory nodes */}
      {nodes.map(node => {
        const isSelected = node.id === selectedMemoryId;
        const isHovered = hovered?.id === node.id;
        const scale = node.z;
        const radius = node.size * scale;
        return (
          <button
            key={node.id}
            onClick={() => onSelectMemory(isSelected ? null : node.item)}
            onMouseEnter={() => setHovered(node)}
            onMouseLeave={() => setHovered(null)}
            title={node.statement}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 focus:outline-none"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: radius * 2,
              height: radius * 2,
              background: `radial-gradient(circle, ${node.color}33 0%, ${node.color}11 100%)`,
              borderColor: node.color,
              borderWidth: isSelected || isHovered ? 2 : 1,
              boxShadow: isSelected
                ? `0 0 18px 4px ${node.color}55`
                : isHovered
                ? `0 0 10px 2px ${node.color}44`
                : `0 0 4px 1px ${node.color}22`,
              opacity: node.status === 'superseded' ? 0.65 : 1,
              cursor: 'pointer',
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[9px]">
              {CATEGORY_ICON[node.category] ?? CATEGORY_ICON.default}
            </span>
          </button>
        );
      })}

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${Math.min(hovered.x + 2, 62)}%`,
            top: `${Math.max(hovered.y - 8, 4)}%`,
            maxWidth: 220,
          }}
        >
          <div className="glass-panel rounded-xl p-3 shadow-xl border-l-2"
            style={{ borderLeftColor: hovered.color }}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-semibold capitalize" style={{ color: hovered.color }}>
                {hovered.status}
              </span>
              <span className="text-[10px] text-slate-500">· {hovered.category}</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug line-clamp-3">
              {hovered.statement}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">{hovered.date}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={() => setAutoOrbit(!autoOrbit)}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 px-2.5 py-1 text-[10px] text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${autoOrbit ? 'text-cyan-400' : 'text-slate-500'}`} />
          {autoOrbit ? 'Pause' : 'Orbit'}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-30 flex items-center gap-3">
        {[
          { color: '#22d3ee', label: 'Active' },
          { color: '#f59e0b', label: 'Superseded' },
          { color: '#f43f5e', label: 'Restriction' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="rounded-full w-2 h-2" style={{ background: color }} />
            <span className="text-[10px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Node count badge */}
      <div className="absolute top-3 right-3 z-30">
        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 px-2.5 py-1 text-[10px] text-slate-400">
          <Activity className="h-3 w-3 text-cyan-400" />
          <span>{memories.length} memory nodes</span>
        </div>
      </div>

      {/* Timeline label */}
      <div className="absolute top-3 left-3 z-30">
        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 px-2.5 py-1 text-[10px]">
          <Clock className="h-3 w-3 text-brand-400" />
          <span className="text-slate-300">
            {timelineStep === 1 ? 'July Snapshot' : timelineStep === 2 ? 'August Snapshot' : 'Live (September)'}
          </span>
        </div>
      </div>
    </div>
  );
}
