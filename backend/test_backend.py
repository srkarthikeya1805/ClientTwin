import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import asyncio
from app.database import init_db
from app.demo_data import seed_demo_data
from app.memory_engine import MemoryEngine
from app.models import IngestRequest
from app.ai_service import AIService

async def run_tests():
    log_lines = []
    log_lines.append("=== STARTING CLIENTTWIN AI BACKEND VERIFICATION ===")
    
    init_db()
    seed_demo_data()
    log_lines.append("1. Seeded demo data successfully.")

    # 1. Inspect Acme Corp Twin Overview
    twin = MemoryEngine.get_client_twin("client-acme-corp")
    assert twin is not None, "Acme Corp twin not found"
    log_lines.append(f"2. Verified Acme Corp Twin: {twin.total_active_rules} active rules, {twin.total_superseded_rules} superseded rules.")
    log_lines.append(f"   Timeline events: {len(twin.timeline)} (July, August, September)")

    # 2. Test Ingestion & Superseding
    ingest_req = IngestRequest(
        client_id="client-acme-corp",
        source_type="Slack / Chat",
        date="October 2026",
        content="Quick note from client: All weekly updates must now be submitted by Thursday 5 PM EST instead of Friday.",
        title="Weekly Deadline Adjustment"
    )
    res = await MemoryEngine.process_ingestion(ingest_req)
    log_lines.append(f"3. Ingestion Result: {len(res.new_memories)} new rule(s), {len(res.superseded_memories)} superseded.")
    log_lines.append(f"   AI Provider: {res.ai_provider}")

    # 3. Test Draft Assistant with Prohibited 'Synergy' Conflict
    active_mems = [m.model_dump() for m in (twin.preferences + twin.restrictions + twin.communication_style)]
    
    draft_res = await AIService.analyze_conflicts_and_draft(
        client_name="Acme Corporation",
        active_memories=active_mems,
        user_prompt="Create a promotional introduction for Acme Corporation's campaign. Explain how our solutions create synergy between teams."
    )
    log_lines.append(f"4. Draft Conflicts Detected: {len(draft_res.get('conflicts_detected', []))}")
    for c in draft_res.get('conflicts_detected', []):
        log_lines.append(f"   ⚠ Flagged: {c['rule_statement']} (Source: {c['rule_source']})")
    log_lines.append(f"   Corrected draft generated ({len(draft_res.get('draft_content', ''))} chars).")
    assert "synergy" not in draft_res["draft_content"].lower(), "Draft must not contain prohibited word 'synergy'!"

    # 4. Test Call Brief
    brief_res = await AIService.generate_call_brief(
        client_name="Acme Corporation",
        active_memories=active_mems,
        timeline_events=[t.model_dump() for t in twin.timeline],
        objective="Q4 Strategy Review"
    )
    log_lines.append(f"5. Call Brief Generated: {len(brief_res.get('mistakes_to_avoid', []))} pitfalls to avoid, {len(brief_res.get('suggested_talking_points', []))} talking points.")
    log_lines.append("=== ALL BACKEND VERIFICATIONS PASSED SUCCESSFULLY! ===")

    output_str = "\n".join(log_lines)
    print(output_str, flush=True)

    log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_log.txt")
    with open(log_path, "w", encoding="utf-8") as f:
        f.write(output_str)

if __name__ == "__main__":
    asyncio.run(run_tests())
