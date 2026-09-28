import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DemoWalkthroughBar } from './components/DemoWalkthroughBar';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { ClientTwinView } from './components/ClientTwinView';
import { IngestView } from './components/IngestView';
import { DraftAssistantView } from './components/DraftAssistantView';
import { CallBriefView } from './components/CallBriefView';
import { MemoryRulesView } from './components/MemoryRulesView';
import { Client, ClientTwinOverview, DashboardStats, MemoryItem } from './types';
import { api } from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('client-acme-corp');
  const [twinOverview, setTwinOverview] = useState<ClientTwinOverview | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [clientMemories, setClientMemories] = useState<MemoryItem[]>([]);
  const [aiProvider, setAiProvider] = useState<string>('Demo AI Mode');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoStep, setDemoStep] = useState<number>(3);
  const [draftInitialPrompt, setDraftInitialPrompt] = useState<string>('');

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [sysStatus, cls, stats] = await Promise.all([
        api.getSystemStatus().catch(() => ({ status: 'ok', ai_provider: 'Demo AI Mode', database: 'SQLite' })),
        api.getClients(),
        api.getDashboardStats()
      ]);

      setAiProvider(sysStatus.ai_provider);
      setClients(cls);
      setDashboardStats(stats);

      const targetClient = cls.find(c => c.id === selectedClientId) || cls[0];
      if (targetClient) {
        setSelectedClientId(targetClient.id);
        const [twin, mems] = await Promise.all([
          api.getClientTwin(targetClient.id),
          api.getClientMemories(targetClient.id)
        ]);
        setTwinOverview(twin);
        setClientMemories(mems);
      }
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch client — update twin, memories, and dashboard stats
  const handleSelectClient = async (clientId: string) => {
    setSelectedClientId(clientId);
    setIsLoading(true);
    try {
      const [twin, mems] = await Promise.all([
        api.getClientTwin(clientId),
        api.getClientMemories(clientId)
      ]);
      setTwinOverview(twin);
      setClientMemories(mems);
    } catch (err) {
      console.error('Client switch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Demo step switcher (Step 1: July, Step 2: August, Step 3: Sept)
  const handleSetDemoStep = async (step: number) => {
    setDemoStep(step);
    setIsLoading(true);
    try {
      await api.setAcmeStep(step);
      setSelectedClientId('client-acme-corp');
      await fetchData();
    } catch (err) {
      console.error('Error switching demo step:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFullDemo = async () => {
    setDemoStep(3);
    setIsLoading(true);
    try {
      await api.loadFullDemo();
      setSelectedClientId('client-acme-corp');
      await fetchData();
    } catch (err) {
      console.error('Error loading demo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToDraft = (prefillPrompt?: string) => {
    setSelectedClientId('client-acme-corp');
    if (prefillPrompt) {
      setDraftInitialPrompt(prefillPrompt);
    }
    setActiveTab('draft');
  };

  const currentClient = clients.find(c => c.id === selectedClientId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={handleSelectClient}
        aiProvider={aiProvider}
        onLoadFullDemo={handleLoadFullDemo}
        isLoading={isLoading}
      />

      {/* Interactive Demo Scenario Stepper */}
      <DemoWalkthroughBar
        currentStep={demoStep}
        onSetStep={handleSetDemoStep}
        onNavigateToDraft={handleNavigateToDraft}
        onNavigateToIngest={(preset) => {
          setSelectedClientId('client-acme-corp');
          setActiveTab('ingest');
        }}
        onSelectTab={setActiveTab}
        onResetDemo={handleLoadFullDemo}
      />

      {/* Main App Layout with Sidebar and Content View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeClient={currentClient}
          activeRulesCount={twinOverview?.total_active_rules || 0}
        />

        <main className={`flex-1 overflow-y-auto w-full ${activeTab === 'twin' ? 'p-3 sm:p-4' : 'p-4 sm:p-6 lg:p-8'}`}>
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={dashboardStats}
              clients={clients}
              onSelectClient={(id) => {
                handleSelectClient(id);
                setActiveTab('twin');
              }}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              clients={clients}
              onSelectClient={handleSelectClient}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'twin' && (
            <ClientTwinView
              twin={twinOverview}
              isLoading={isLoading}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'ingest' && (
            <IngestView
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={handleSelectClient}
              onNavigate={setActiveTab}
              onRefreshData={fetchData}
            />
          )}

          {activeTab === 'draft' && (
            <DraftAssistantView
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={handleSelectClient}
              initialPrompt={draftInitialPrompt}
            />
          )}

          {activeTab === 'call-brief' && (
            <CallBriefView
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={handleSelectClient}
            />
          )}

          {activeTab === 'memory' && (
            <MemoryRulesView
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={handleSelectClient}
              memories={clientMemories}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
