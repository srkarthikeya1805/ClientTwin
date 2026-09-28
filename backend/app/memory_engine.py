import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from app.models import (
    Client, MemoryItem, TimelineEvent, IngestRequest,
    ExtractionResult, MemoryDiffItem, ClientTwinOverview
)
from app.database import (
    get_client_by_id, save_client, get_memories_by_client,
    save_memory_item, get_timeline_by_client, save_timeline_event,
    log_activity
)
from app.ai_service import AIService

class MemoryEngine:
    @classmethod
    async def process_ingestion(cls, req: IngestRequest) -> ExtractionResult:
        client = get_client_by_id(req.client_id)
        if not client:
            raise ValueError(f"Client '{req.client_id}' not found.")

        existing_memories = get_memories_by_client(req.client_id)
        existing_dicts = [m.model_dump() for m in existing_memories]

        # 1. Run AI extraction and contradiction detection
        ai_res = await AIService.extract_client_context(
            client_name=client.name,
            existing_memories=existing_dicts,
            new_content=req.content,
            source_type=req.source_type,
            date_str=req.date
        )

        extracted_items_raw = ai_res.get("extracted_items", [])
        superseded_ids = ai_res.get("superseded_existing_ids", [])
        changes_summary = ai_res.get("changes_summary", [])
        summary = ai_res.get("summary", f"Processed {req.source_type} on {req.date}")
        provider_name = ai_res.get("ai_provider", "Demo AI Mode")

        new_saved_memories: List[MemoryItem] = []
        superseded_saved_memories: List[MemoryItem] = []
        diffs: List[MemoryDiffItem] = []

        now_str = datetime.now().isoformat()

        # 2. Process extracted items
        for item_data in extracted_items_raw:
            mem_id = f"mem-{uuid.uuid4().hex[:8]}"
            supersedes_text = item_data.get("supersedes_statement")
            
            # Find if this supersedes any existing memory item by text matching or explicit id
            superseded_match: Optional[MemoryItem] = None
            if supersedes_text:
                for m in existing_memories:
                    if m.status == "active" and (supersedes_text.lower() in m.statement.lower() or m.statement.lower() in supersedes_text.lower()):
                        superseded_match = m
                        break

            # Check if any ID was matched in superseded_ids
            if not superseded_match and superseded_ids:
                for sid in superseded_ids:
                    m = next((em for em in existing_memories if em.id == sid and em.status == "active"), None)
                    if m:
                        superseded_match = m
                        break

            # Create new memory item
            new_mem = MemoryItem(
                id=mem_id,
                client_id=client.id,
                statement=item_data.get("statement", ""),
                category=item_data.get("category", "preferences"),
                status="active",
                confidence=item_data.get("confidence", "High"),
                source_type=req.source_type,
                source_context=f"{req.source_type} ({req.date})",
                date=req.date,
                supersedes=superseded_match.id if superseded_match else None,
                created_at=now_str,
                last_updated=now_str,
                tags=[req.source_type, req.date]
            )

            # If it supersedes an existing active memory, update old memory status
            if superseded_match:
                superseded_match.status = "superseded"
                superseded_match.superseded_by = new_mem.id
                superseded_match.last_updated = now_str
                save_memory_item(superseded_match)
                superseded_saved_memories.append(superseded_match)
                
                diffs.append(MemoryDiffItem(
                    statement=new_mem.statement,
                    category=new_mem.category,
                    status="active",
                    superseded_statement=superseded_match.statement,
                    reason=item_data.get("reason", f"Supersedes older rule from {superseded_match.date}")
                ))
            else:
                diffs.append(MemoryDiffItem(
                    statement=new_mem.statement,
                    category=new_mem.category,
                    status="active",
                    superseded_statement=None,
                    reason=item_data.get("reason", "Newly discovered client requirement")
                ))

            save_memory_item(new_mem)
            new_saved_memories.append(new_mem)

        # 3. Create Timeline Event
        event_id = f"evt-{uuid.uuid4().hex[:8]}"
        title = req.title or f"{req.source_type} - {req.date}"
        timeline_event = TimelineEvent(
            id=event_id,
            client_id=client.id,
            title=title,
            date=req.date,
            source_type=req.source_type,
            summary=summary,
            changes_summary=changes_summary,
            raw_content=req.content,
            created_at=now_str
        )
        save_timeline_event(timeline_event)

        # 4. Update Client metadata
        all_active_now = get_memories_by_client(client.id, status="active")
        client.active_rules_count = len(all_active_now)
        client.last_updated = req.date
        client.recent_activity = summary
        
        # Update communication style summary if relevant
        active_styles = [m.statement for m in all_active_now if m.category == "communication_style"]
        if active_styles:
            client.communication_style_summary = "; ".join(active_styles[:2])
        
        save_client(client)

        # 5. Log activity
        log_activity(
            client_id=client.id,
            client_name=client.name,
            action=f"Ingested {req.source_type}",
            details=f"Added {len(new_saved_memories)} rules, superseded {len(superseded_saved_memories)} rules.",
            timestamp=now_str
        )

        return ExtractionResult(
            client_id=client.id,
            summary=summary,
            date=req.date,
            source_type=req.source_type,
            new_memories=new_saved_memories,
            superseded_memories=superseded_saved_memories,
            diffs=diffs,
            raw_extraction=ai_res,
            ai_provider=provider_name
        )

    @classmethod
    def get_client_twin(cls, client_id: str) -> Optional[ClientTwinOverview]:
        client = get_client_by_id(client_id)
        if not client:
            return None

        all_memories = get_memories_by_client(client_id)
        timeline = get_timeline_by_client(client_id)

        active = [m for m in all_memories if m.status == "active"]
        superseded = [m for m in all_memories if m.status == "superseded"]

        return ClientTwinOverview(
            client=client,
            communication_style=[m for m in active if m.category == "communication_style"],
            preferences=[m for m in active if m.category == "preferences"],
            restrictions=[m for m in active if m.category == "restrictions"],
            brand_guidelines=[m for m in active if m.category == "brand_guidelines"],
            decisions=[m for m in active if m.category == "decisions"],
            priorities=[m for m in active if m.category == "priorities"],
            requirements=[m for m in active if m.category == "requirements"],
            feedback=[m for m in active if m.category == "feedback"],
            important_facts=[m for m in active if m.category == "important_facts"],
            superseded_memories=superseded,
            timeline=timeline,
            total_active_rules=len(active),
            total_superseded_rules=len(superseded)
        )
