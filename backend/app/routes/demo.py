from fastapi import APIRouter, Query
from typing import Dict, Any
from app.demo_data import seed_demo_data
from app.models import Client, MemoryItem, TimelineEvent
from app.database import (
    clear_all_data, save_client, save_memory_item,
    save_timeline_event, log_activity, get_all_clients
)

router = APIRouter(prefix="/demo", tags=["Demo Controller"])

@router.post("/load")
def load_full_demo():
    seed_demo_data()
    return {
        "status": "success",
        "message": "Full demo scenario loaded successfully with Acme Corp, TechNova, Vertex, and GlobalHealth.",
        "clients_count": len(get_all_clients())
    }

@router.post("/set-acme-step")
def set_acme_step(step: int = Query(3, ge=1, le=3)):
    """
    Step 1: July 2026 only (Initial baseline)
    Step 2: July + August 2026 (Evolution: Concise -> Detailed data-driven)
    Step 3: July + August + September 2026 (Full demo)
    """
    # Initialize basic clients
    seed_demo_data()
    
    if step < 3:
        # Rebuild Acme for step 1 or 2
        import sqlite3
        from app.database import get_db_connection
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("DELETE FROM memory_items WHERE client_id = 'client-acme-corp'")
        c.execute("DELETE FROM timeline_events WHERE client_id = 'client-acme-corp'")
        conn.commit()
        conn.close()

        if step == 1:
            # July only
            acme = Client(
                id="client-acme-corp",
                name="Acme Corporation",
                industry="Enterprise Technology & Logistics",
                description="Global supply chain optimization platform and enterprise infrastructure vendor.",
                primary_contact="Sarah Jenkins (VP Global Marketing & Strategy)",
                last_updated="July 2026",
                active_rules_count=3,
                communication_style_summary="Clear, straightforward, concise",
                recent_activity="Initial client meeting completed",
                tags=["Tier 1", "Strategic Enterprise"]
            )
            save_client(acme)

            save_memory_item(MemoryItem(
                id="mem-acme-july-1",
                client_id="client-acme-corp",
                statement="Client prefers concise reports and high-level summaries.",
                category="preferences",
                status="active",
                confidence="High",
                source_type="Meeting Transcript",
                source_context="Initial Client Strategy Alignment (July 15, 2026)",
                date="July 2026"
            ))
            save_memory_item(MemoryItem(
                id="mem-acme-july-2",
                client_id="client-acme-corp",
                statement="Do not use the word 'synergy' in any marketing or campaign materials.",
                category="restrictions",
                status="active",
                confidence="High",
                source_type="Meeting Transcript",
                source_context="Initial Client Strategy Alignment (July 15, 2026)",
                date="July 2026"
            ))
            save_memory_item(MemoryItem(
                id="mem-acme-july-3",
                client_id="client-acme-corp",
                statement="Maintain clear, straightforward, and transparent communication across all touchpoints.",
                category="communication_style",
                status="active",
                confidence="High",
                source_type="Meeting Transcript",
                source_context="Initial Client Strategy Alignment (July 15, 2026)",
                date="July 2026"
            ))
            save_timeline_event(TimelineEvent(
                id="evt-acme-july",
                client_id="client-acme-corp",
                title="July 2026 — Initial Client Meeting",
                date="July 2026",
                source_type="Meeting Transcript",
                summary="Initial kickoff establishing concise reporting and prohibited buzzword 'synergy'.",
                changes_summary=["Defined concise reports", "Prohibited 'synergy'", "Set clear tone"],
                raw_content="The client wants concise reports and does not want the word 'synergy' used in marketing materials. They prefer clear and straightforward communication."
            ))

        elif step == 2:
            # July + August
            acme = Client(
                id="client-acme-corp",
                name="Acme Corporation",
                industry="Enterprise Technology & Logistics",
                description="Global supply chain optimization platform and enterprise infrastructure vendor.",
                primary_contact="Sarah Jenkins (VP Global Marketing & Strategy)",
                last_updated="August 2026",
                active_rules_count=3,
                communication_style_summary="Clear, straightforward, data-driven",
                recent_activity="August meeting: Evolved reporting to detailed data-driven format",
                tags=["Tier 1", "Strategic Enterprise"]
            )
            save_client(acme)

            save_memory_item(MemoryItem(
                id="mem-acme-july-1",
                client_id="client-acme-corp",
                statement="Client prefers concise reports and high-level summaries.",
                category="preferences",
                status="superseded",
                confidence="High",
                source_type="Meeting Transcript",
                source_context="Initial Client Strategy Alignment (July 15, 2026)",
                date="July 2026",
                superseded_by="mem-acme-aug-1"
            ))
            save_memory_item(MemoryItem(
                id="mem-acme-july-2",
                client_id="client-acme-corp",
                statement="Do not use the word 'synergy' in any marketing or campaign materials.",
                category="restrictions",
                status="active",
                confidence="High",
                source_type="Meeting Transcript",
                source_context="Initial Client Strategy Alignment (July 15, 2026)",
                date="July 2026"
            ))
            save_memory_item(MemoryItem(
                id="mem-acme-july-3",
                client_id="client-acme-corp",
                statement="Maintain clear, straightforward, and transparent communication across all touchpoints.",
                category="communication_style",
                status="active",
                confidence="High",
                source_type="Meeting Transcript",
                source_context="Initial Client Strategy Alignment (July 15, 2026)",
                date="July 2026"
            ))
            save_memory_item(MemoryItem(
                id="mem-acme-aug-1",
                client_id="client-acme-corp",
                statement="Client now requires detailed, data-driven reports containing measurable results and statistics.",
                category="preferences",
                status="active",
                confidence="High",
                source_type="Meeting Transcript",
                source_context="Follow-up Strategy Review (August 12, 2026)",
                date="August 2026",
                supersedes="mem-acme-july-1"
            ))
            save_timeline_event(TimelineEvent(
                id="evt-acme-july",
                client_id="client-acme-corp",
                title="July 2026 — Initial Client Meeting",
                date="July 2026",
                source_type="Meeting Transcript",
                summary="Kickoff establishing baseline reporting preferences.",
                changes_summary=["Defined concise reports", "Prohibited 'synergy'"],
                raw_content="The client wants concise reports and does not want the word 'synergy' used in marketing materials."
            ))
            save_timeline_event(TimelineEvent(
                id="evt-acme-aug",
                client_id="client-acme-corp",
                title="August 2026 — Follow-up Strategy Meeting",
                date="August 2026",
                source_type="Meeting Transcript",
                summary="Shifted reporting preference to detailed data-driven format.",
                changes_summary=["SUPERSEDED concise reports with detailed data-driven reports"],
                raw_content="Acme Corporation has changed its reporting preference. They now want more detailed, data-driven reports containing measurable results and statistics. The client still wants clear communication."
            ))

    return {
        "status": "success",
        "step": step,
        "message": f"Acme Corporation configured to Step {step}."
    }
