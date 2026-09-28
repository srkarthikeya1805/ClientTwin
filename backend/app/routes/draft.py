import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.models import DraftRequest, DraftResponse, ConflictItem
from app.database import get_client_by_id, get_memories_by_client, log_draft, log_activity
from app.ai_service import AIService

router = APIRouter(prefix="/clients", tags=["Draft Assistant"])

@router.post("/{client_id}/draft", response_model=DraftResponse)
async def create_draft(client_id: str, payload: DraftRequest):
    client = get_client_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    if not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    active_memories = get_memories_by_client(client_id, status="active")
    active_dicts = [m.model_dump() for m in active_memories]

    # Call AI service for conflict detection & context-aware draft generation
    ai_result = await AIService.analyze_conflicts_and_draft(
        client_name=client.name,
        active_memories=active_dicts,
        user_prompt=payload.prompt,
        content_type=payload.content_type or "Draft"
    )

    conflicts_raw = ai_result.get("conflicts_detected", [])
    conflicts = [ConflictItem(**c) for c in conflicts_raw]
    draft_id = f"draft-{uuid.uuid4().hex[:8]}"
    now_str = datetime.now().isoformat()

    # Log draft and conflicts in database
    log_draft(
        draft_id=draft_id,
        client_id=client.id,
        prompt=payload.prompt,
        conflicts_count=len(conflicts),
        draft_content=ai_result.get("draft_content", ""),
        created_at=now_str
    )

    if conflicts:
        log_activity(
            client_id=client.id,
            client_name=client.name,
            action="Draft Assistant Flagged Conflict",
            details=f"Detected {len(conflicts)} rule conflict(s) for prompt: '{payload.prompt[:50]}...'",
            timestamp=now_str
        )

    return DraftResponse(
        client_id=client.id,
        client_name=client.name,
        prompt=payload.prompt,
        context_used=ai_result.get("context_used", []),
        conflicts_detected=conflicts,
        suggested_adjustment=ai_result.get("suggested_adjustment"),
        original_risks=ai_result.get("original_risks", []),
        draft_content=ai_result.get("draft_content", ""),
        ai_provider=ai_result.get("ai_provider", "Demo AI Mode"),
        generated_at=now_str
    )
