from fastapi import APIRouter, HTTPException
from app.models import CallBriefRequest, CallBriefResponse
from app.database import get_client_by_id, get_memories_by_client, get_timeline_by_client, log_activity
from app.ai_service import AIService
from datetime import datetime

router = APIRouter(prefix="/clients", tags=["Call Brief Preparation"])

@router.post("/{client_id}/call-brief", response_model=CallBriefResponse)
async def generate_call_brief(client_id: str, payload: CallBriefRequest):
    client = get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    active_memories = get_memories_by_client(client_id, status="active")
    timeline = get_timeline_by_client(client_id)

    active_dicts = [m.model_dump() for m in active_memories]
    timeline_dicts = [t.model_dump() for t in timeline]

    brief_data = await AIService.generate_call_brief(
        client_name=client.name,
        active_memories=active_dicts,
        timeline_events=timeline_dicts,
        objective=payload.call_objective or "Strategic Account Alignment"
    )

    now_str = datetime.now().isoformat()
    log_activity(
        client_id=client.id,
        client_name=client.name,
        action="Generated Call Preparation Dossier",
        details=f"Generated executive cheat-sheet for objective: {payload.call_objective}",
        timestamp=now_str
    )

    return CallBriefResponse(
        client_id=client.id,
        client_name=client.name,
        generated_at=now_str,
        objective=payload.call_objective or "Strategic Account Alignment",
        current_priorities=brief_data.get("current_priorities", []),
        communication_preferences=brief_data.get("communication_preferences", []),
        active_restrictions=brief_data.get("active_restrictions", []),
        recent_changes=brief_data.get("recent_changes", []),
        recent_feedback=brief_data.get("recent_feedback", []),
        open_items=brief_data.get("open_items", []),
        mistakes_to_avoid=brief_data.get("mistakes_to_avoid", []),
        suggested_talking_points=brief_data.get("suggested_talking_points", []),
        ai_provider=brief_data.get("ai_provider", "Demo AI Mode")
    )
