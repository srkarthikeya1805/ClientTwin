export type MemoryCategory =
  | 'communication_style'
  | 'preferences'
  | 'restrictions'
  | 'brand_guidelines'
  | 'decisions'
  | 'priorities'
  | 'requirements'
  | 'feedback'
  | 'important_facts';

export type MemoryStatus = 'active' | 'superseded' | 'conflicting' | 'unknown';

export type SourceType =
  | 'Meeting Transcript'
  | 'Email'
  | 'Slack / Chat'
  | 'Revision Notes'
  | 'Other';

export interface MemoryItem {
  id: string;
  client_id: string;
  statement: string;
  category: MemoryCategory;
  status: MemoryStatus;
  confidence: 'High' | 'Medium' | 'Low';
  source_type: SourceType;
  source_context: string;
  date: string;
  superseded_by?: string | null;
  supersedes?: string | null;
  created_at: string;
  last_updated: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  client_id: string;
  title: string;
  date: string;
  source_type: SourceType;
  summary: string;
  changes_summary: string[];
  raw_content?: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  description: string;
  primary_contact?: string;
  last_updated: string;
  active_rules_count: number;
  communication_style_summary: string;
  recent_activity: string;
  tags: string[];
}

export interface ClientTwinOverview {
  client: Client;
  communication_style: MemoryItem[];
  preferences: MemoryItem[];
  restrictions: MemoryItem[];
  brand_guidelines: MemoryItem[];
  decisions: MemoryItem[];
  priorities: MemoryItem[];
  requirements: MemoryItem[];
  feedback: MemoryItem[];
  important_facts: MemoryItem[];
  superseded_memories: MemoryItem[];
  timeline: TimelineEvent[];
  total_active_rules: number;
  total_superseded_rules: number;
}

export interface IngestRequest {
  client_id: string;
  source_type: SourceType;
  date: string;
  content: string;
  title?: string;
}

export interface MemoryDiffItem {
  statement: string;
  category: MemoryCategory;
  status: MemoryStatus;
  superseded_statement?: string | null;
  reason: string;
}

export interface ExtractionResult {
  client_id: string;
  summary: string;
  date: string;
  source_type: SourceType;
  new_memories: MemoryItem[];
  superseded_memories: MemoryItem[];
  diffs: MemoryDiffItem[];
  raw_extraction: Record<string, any>;
  ai_provider: string;
}

export interface ConflictItem {
  rule_statement: string;
  rule_category: string;
  rule_source: string;
  rule_date: string;
  conflict_reason: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DraftRequest {
  client_id: string;
  prompt: string;
  content_type?: string;
}

export interface DraftResponse {
  client_id: string;
  client_name: string;
  prompt: string;
  context_used: Array<{
    statement: string;
    category: string;
    source_date: string;
    status: string;
    relevance: string;
  }>;
  conflicts_detected: ConflictItem[];
  suggested_adjustment?: string | null;
  original_risks: string[];
  draft_content: string;
  ai_provider: string;
  generated_at: string;
}

export interface CallBriefRequest {
  client_id: string;
  call_objective?: string;
}

export interface CallBriefResponse {
  client_id: string;
  client_name: string;
  generated_at: string;
  objective: string;
  current_priorities: string[];
  communication_preferences: string[];
  active_restrictions: string[];
  recent_changes: string[];
  recent_feedback: string[];
  open_items: string[];
  mistakes_to_avoid: string[];
  suggested_talking_points: string[];
  ai_provider: string;
}

export interface DashboardStats {
  total_clients: number;
  active_client_profiles: number;
  total_active_rules: number;
  recent_updates_count: number;
  warnings_detected_count: number;
  recent_activities: Array<{
    id: number;
    client_id: string;
    client_name: string;
    action: string;
    details: string;
    timestamp: string;
  }>;
}
