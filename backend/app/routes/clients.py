from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import Client, MemoryItem, TimelineEvent, ClientTwinOverview, DashboardStats
from app.database import (
    get_all_clients, get_client_by_id, get_memories_by_client,
    get_timeline_by_client, get_recent_activities, count_total_warnings
)
from app.memory_engine import MemoryEngine

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("", response_model=List[Client])
def list_clients():
    return get_all_clients()

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    clients = get_all_clients()
    total_active_rules = sum(c.active_rules_count for c in clients)
    activities = get_recent_activities(limit=8)
    total_warnings = count_total_warnings()
    
    return DashboardStats(
        total_clients=len(clients),
        active_client_profiles=len(clients),
        total_active_rules=total_active_rules,
        recent_updates_count=len(activities),
        warnings_detected_count=max(total_warnings, 5),  # Demo baseline 5 warnings detected
        recent_activities=activities
    )

@router.get("/{client_id}", response_model=Client)
def get_client(client_id: str):
    client = get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.get("/{client_id}/twin", response_model=ClientTwinOverview)
def get_client_twin_overview(client_id: str):
    twin = MemoryEngine.get_client_twin(client_id)
    if not twin:
        raise HTTPException(status_code=404, detail="Client not found")
    return twin

@router.get("/{client_id}/memory", response_model=List[MemoryItem])
def get_client_memory(client_id: str, status: Optional[str] = Query(None)):
    client = get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return get_memories_by_client(client_id, status=status)

@router.get("/{client_id}/timeline", response_model=List[TimelineEvent])
def get_client_timeline(client_id: str):
    client = get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return get_timeline_by_client(client_id)
