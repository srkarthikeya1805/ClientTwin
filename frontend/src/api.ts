import {
  Client,
  ClientTwinOverview,
  MemoryItem,
  TimelineEvent,
  IngestRequest,
  ExtractionResult,
  DraftRequest,
  DraftResponse,
  CallBriefRequest,
  CallBriefResponse,
  DashboardStats,
} from './types';

const BASE_URL = '/api';

export const api = {
  // Health / Status
  async getSystemStatus(): Promise<{ status: string; ai_provider: string; database: string }> {
    const res = await fetch(`${BASE_URL}/system/status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  // Clients
  async getClients(): Promise<Client[]> {
    const res = await fetch(`${BASE_URL}/clients`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${BASE_URL}/clients/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getClientTwin(clientId: string): Promise<ClientTwinOverview> {
    const res = await fetch(`${BASE_URL}/clients/${clientId}/twin`);
    if (!res.ok) throw new Error('Failed to fetch client twin profile');
    return res.json();
  },

  async getClientMemories(clientId: string, status?: string): Promise<MemoryItem[]> {
    const url = status
      ? `${BASE_URL}/clients/${clientId}/memory?status=${encodeURIComponent(status)}`
      : `${BASE_URL}/clients/${clientId}/memory`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch client memories');
    return res.json();
  },

  async getClientTimeline(clientId: string): Promise<TimelineEvent[]> {
    const res = await fetch(`${BASE_URL}/clients/${clientId}/timeline`);
    if (!res.ok) throw new Error('Failed to fetch client timeline');
    return res.json();
  },

  // Ingestion & AI Context Extraction
  async ingestContext(clientId: string, data: IngestRequest): Promise<ExtractionResult> {
    const res = await fetch(`${BASE_URL}/clients/${clientId}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Ingestion failed');
    }
    return res.json();
  },

  // Draft Assistant with Conflict Warning
  async generateDraft(clientId: string, data: DraftRequest): Promise<DraftResponse> {
    const res = await fetch(`${BASE_URL}/clients/${clientId}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Draft generation failed');
    }
    return res.json();
  },

  // Executive Call Brief
  async generateCallBrief(clientId: string, data: CallBriefRequest): Promise<CallBriefResponse> {
    const res = await fetch(`${BASE_URL}/clients/${clientId}/call-brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Call brief generation failed');
    }
    return res.json();
  },

  // Demo Presets
  async loadFullDemo(): Promise<{ status: string; message: string; clients_count: number }> {
    const res = await fetch(`${BASE_URL}/demo/load`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to load demo scenario');
    return res.json();
  },

  async setAcmeStep(step: number): Promise<{ status: string; step: number; message: string }> {
    const res = await fetch(`${BASE_URL}/demo/set-acme-step?step=${step}`, { method: 'POST' });
    if (!res.ok) throw new Error(`Failed to set Acme demo step ${step}`);
    return res.json();
  },
};
