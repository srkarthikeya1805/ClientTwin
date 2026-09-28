import React, { useState } from 'react';
import {
  Users,
  Search,
  Building2,
  BrainCircuit,
  PenTool,
  PhoneCall,
  FilePlus,
  ArrowRight,
  Shield,
  Tag,
  Activity,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Client } from '../types';
import { NavTab } from './Sidebar';

interface ClientsViewProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onSelectClient,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const industries = ['all', ...Array.from(new Set(clients.map(c => c.industry)))];

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              ENTERPRISE DIRECTORY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Users className="h-6 w-6 text-cyan-400" />
            <span>Institutional Client Portfolio</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enterprise client accounts equipped with living memory layers and real-time policy tracking
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search clients or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl bg-slate-900/90 border border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-52 sm:w-64 backdrop-blur-md shadow-sm"
            />
          </div>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 backdrop-blur-md cursor-pointer"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>
                {ind === 'all' ? 'All Industries' : ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.map((client) => {
          const isAcme = client.id === 'client-acme-corp';

          return (
            <div
              key={client.id}
              className={`rounded-3xl border p-6 backdrop-blur-xl transition-all flex flex-col justify-between relative group ${
                isAcme
                  ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-cyan-500/40 shadow-xl shadow-cyan-500/5 hover:border-cyan-400'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 shadow-lg'
              }`}
            >
              <div className="space-y-4">
                {/* Account Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                        {client.industry}
                      </span>
                      {isAcme && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-300 border border-amber-500/30">
                          DEMO HERO ACCOUNT
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{client.name}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{client.active_rules_count} rules</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {client.description}
                </p>

                {/* Key Account Metadata */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/70 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">COMMUNICATION STYLE:</span>
                    <span className="text-slate-200 font-medium text-[11px] truncate block">
                      {client.communication_style_summary}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LAST EVOLVED:</span>
                    <span className="text-slate-200 font-medium text-[11px] truncate block">
                      {client.last_updated}
                    </span>
                  </div>
                </div>

                {/* Account Tags */}
                {client.tags && client.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {client.tags.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 text-[10px] font-mono border border-slate-700/50"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => {
                    onSelectClient(client.id);
                    onNavigate('twin');
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition-all hover:scale-[1.02] shadow-sm shadow-cyan-500/20"
                >
                  <BrainCircuit className="h-3.5 w-3.5" />
                  <span>Launch 3D Twin</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectClient(client.id);
                      onNavigate('ingest');
                    }}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
                    title="Ingest raw notes"
                  >
                    <FilePlus className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectClient(client.id);
                      onNavigate('draft');
                    }}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
                    title="Draft Assistant"
                  >
                    <PenTool className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectClient(client.id);
                      onNavigate('call-brief');
                    }}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
                    title="Call Preparation Brief"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
