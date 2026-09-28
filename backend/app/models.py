from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime

# Category enum
MemoryCategory = Literal[
    "communication_style",
    "preferences",
    "restrictions",
    "brand_guidelines",
    "decisions",
    "priorities",
    "requirements",
    "feedback",
    "important_facts"
]

MemoryStatus = Literal["active", "superseded", "conflicting", "unknown"]

SourceType = Literal[
    "Meeting Transcript",
    "Email",
    "Slack / Chat",
    "Revision Notes",
    "Other"
]

class MemoryItem(BaseModel):
    id: str
    client_id: str
    statement: str
    category: MemoryCategory
    status: MemoryStatus = "active"
    confidence: Literal["High", "Medium", "Low"] = "High"
    source_type: SourceType = "Meeting Transcript"
    source_context: str
    date: str  # e.g., "2026-07-15" or "July 2026"
    superseded_by: Optional[str] = None
    supersedes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    last_updated: str = Field(default_factory=lambda: datetime.now().isoformat())
    tags: List[str] = Field(default_factory=list)

class TimelineEvent(BaseModel):
    id: str
    client_id: str
    title: str
    date: str
    source_type: SourceType
    summary: str
    changes_summary: List[str] = Field(default_factory=list)
    raw_content: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class Client(BaseModel):
    id: str
    name: str
    industry: str
    description: str
    primary_contact: Optional[str] = None
    last_updated: str = Field(default_factory=lambda: datetime.now().isoformat())
    active_rules_count: int = 0
    communication_style_summary: str = "Standard Professional"
    recent_activity: str = "Client initialized"
    tags: List[str] = Field(default_factory=list)

class ClientTwinOverview(BaseModel):
    client: Client
    communication_style: List[MemoryItem]
    preferences: List[MemoryItem]
    restrictions: List[MemoryItem]
    brand_guidelines: List[MemoryItem]
    decisions: List[MemoryItem]
    priorities: List[MemoryItem]
    requirements: List[MemoryItem]
    feedback: List[MemoryItem]
    important_facts: List[MemoryItem]
    superseded_memories: List[MemoryItem]
    timeline: List[TimelineEvent]
    total_active_rules: int
    total_superseded_rules: int

class IngestRequest(BaseModel):
    client_id: str
    source_type: SourceType = "Meeting Transcript"
    date: str
    content: str
    title: Optional[str] = None

class MemoryDiffItem(BaseModel):
    statement: str
    category: MemoryCategory
    status: MemoryStatus
    superseded_statement: Optional[str] = None
    reason: str

class ExtractionResult(BaseModel):
    client_id: str
    summary: str
    date: str
    source_type: SourceType
    new_memories: List[MemoryItem] = Field(default_factory=list)
    superseded_memories: List[MemoryItem] = Field(default_factory=list)
    diffs: List[MemoryDiffItem] = Field(default_factory=list)
    raw_extraction: Dict[str, Any] = Field(default_factory=dict)
    ai_provider: str = "Demo AI Mode"

class ConflictItem(BaseModel):
    rule_statement: str
    rule_category: str
    rule_source: str
    rule_date: str
    conflict_reason: str
    severity: Literal["HIGH", "MEDIUM", "LOW"] = "HIGH"

class DraftRequest(BaseModel):
    client_id: str
    prompt: str
    content_type: Optional[str] = "Draft"

class DraftResponse(BaseModel):
    client_id: str
    client_name: str
    prompt: str
    context_used: List[Dict[str, Any]]
    conflicts_detected: List[ConflictItem]
    suggested_adjustment: Optional[str] = None
    original_risks: List[str] = Field(default_factory=list)
    draft_content: str
    ai_provider: str = "Demo AI Mode"
    generated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class CallBriefRequest(BaseModel):
    client_id: str
    call_objective: Optional[str] = "Regular Account Review & Strategy Alignment"

class CallBriefResponse(BaseModel):
    client_id: str
    client_name: str
    generated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    objective: str
    current_priorities: List[str]
    communication_preferences: List[str]
    active_restrictions: List[str]
    recent_changes: List[str]
    recent_feedback: List[str]
    open_items: List[str]
    mistakes_to_avoid: List[str]
    suggested_talking_points: List[str]
    ai_provider: str = "Demo AI Mode"

class DashboardStats(BaseModel):
    total_clients: int
    active_client_profiles: int
    total_active_rules: int
    recent_updates_count: int
    warnings_detected_count: int
    recent_activities: List[Dict[str, Any]]
