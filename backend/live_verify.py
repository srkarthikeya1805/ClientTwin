import httpx
import json
import time
import os
import sys

BASE_URL = "http://127.0.0.1:8000"
LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "live_verify_output.txt")

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

client = httpx.Client(base_url=BASE_URL, trust_env=False, timeout=5.0)

def log(msg):
    try:
        print(msg, flush=True)
    except Exception:
        safe_msg = msg.encode("ascii", errors="replace").decode("ascii")
        print(safe_msg, flush=True)
    for _ in range(5):
        try:
            with open(LOG_FILE, "a", encoding="utf-8") as f:
                f.write(msg + "\n")
            break
        except Exception:
            time.sleep(0.05)

def run():
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("")

    log("=" * 60)
    log("  CLIENTTWIN AI - REAL END-TO-END VERIFICATION SUITE")
    log("=" * 60)

    # 1. Health check & status
    log("\n[1] Checking Server Health & Status...")
    resp = client.get("/")
    health = resp.json()
    log(f"    ✓ Status: {health.get('status')} | Active AI Provider: {health.get('active_ai_provider')}")
    sys_status = client.get("/system/status").json()
    log(f"    ✓ System status: {sys_status}")

    # 2. Reset & Load Demo
    log("\n[2] Loading Demo Scenario...")
    demo_load = client.post("/demo/load").json()
    log(f"    ✓ Demo loaded: {demo_load.get('message')}")
    clients = client.get("/clients").json()
    log(f"    ✓ Clients count: {len(clients)} -> {[c['name'] for c in clients]}")

    # 3. STEP 1 — JULY (Kickoff)
    log("\n[3] Testing Step 1 — July Kickoff...")
    client.post("/demo/set-acme-step?step=1")
    twin_july = client.get("/clients/client-acme-corp/twin").json()
    active_mems_july = twin_july["preferences"] + twin_july["restrictions"] + twin_july["communication_style"]
    active_stmts_july = [m["statement"] for m in active_mems_july]
    log(f"    ✓ Total active rules: {twin_july['total_active_rules']}")
    log(f"    ✓ Active statements: {active_stmts_july}")
    assert any("concise" in s.lower() for s in active_stmts_july), "Concise reports must be ACTIVE in July"
    assert any("synergy" in s.lower() for s in active_stmts_july), "Synergy prohibition must be ACTIVE in July"
    assert any("straightforward" in s.lower() for s in active_stmts_july), "Clear communication must be ACTIVE in July"
    assert twin_july["total_superseded_rules"] == 0, "No superseded rules in July"

    # 4. STEP 2 — AUGUST (Evolved)
    log("\n[4] Testing Step 2 — August Evolution...")
    client.post("/demo/set-acme-step?step=2")
    twin_aug = client.get("/clients/client-acme-corp/twin").json()
    log(f"    ✓ Total active rules: {twin_aug['total_active_rules']}")
    log(f"    ✓ Total superseded rules: {twin_aug['total_superseded_rules']}")
    superseded_aug = [m["statement"] for m in twin_aug["superseded_memories"]]
    active_mems_aug = twin_aug["preferences"] + twin_aug["restrictions"] + twin_aug["communication_style"]
    active_stmts_aug = [m["statement"] for m in active_mems_aug]
    log(f"    ✓ Superseded memories: {superseded_aug}")
    log(f"    ✓ Active memories: {active_stmts_aug}")
    assert any("concise" in s.lower() for s in superseded_aug), "Concise reports must be SUPERSEDED in August"
    assert any("data-driven" in s.lower() or "detailed" in s.lower() for s in active_stmts_aug), "Data-driven reports must be ACTIVE in August"
    assert any("straightforward" in s.lower() for s in active_stmts_aug), "Clear communication must remain ACTIVE"

    # 5. STEP 3 — SEPTEMBER (Complete State)
    log("\n[5] Testing Step 3 — September Complete State...")
    client.post("/demo/set-acme-step?step=3")
    twin_sep = client.get("/clients/client-acme-corp/twin").json()
    log(f"    ✓ Total active rules: {twin_sep['total_active_rules']}")
    log(f"    ✓ Total superseded rules: {twin_sep['total_superseded_rules']}")
    active_mems_sep = (
        twin_sep["preferences"] +
        twin_sep["restrictions"] +
        twin_sep["communication_style"] +
        twin_sep["requirements"]
    )
    active_stmts_sep = [m["statement"] for m in active_mems_sep]
    superseded_sep = [m["statement"] for m in twin_sep["superseded_memories"]]
    log(f"    ✓ Active rules: {active_stmts_sep}")
    log(f"    ✓ Superseded: {superseded_sep}")
    assert any("promotional" in s.lower() for s in active_stmts_sep), "Avoid promotional language must be ACTIVE in Sept"
    assert any("measurable evidence" in s.lower() or "claims" in s.lower() for s in active_stmts_sep), "Support claims with measurable evidence must be ACTIVE in Sept"
    assert any("synergy" in s.lower() for s in active_stmts_sep), "Synergy prohibition must remain ACTIVE"
    assert any("concise" in s.lower() for s in superseded_sep), "Concise reports must remain SUPERSEDED"

    # 6. TEST CONFLICT DETECTION & DRAFT
    log("\n[6] Testing Conflict Detection & Context-Aware Drafting...")
    draft_req = {
        "client_id": "client-acme-corp",
        "prompt": "Create a promotional introduction for Acme Corporation's campaign. Explain how our solutions create synergy between teams.",
        "content_type": "Campaign Introduction"
    }
    draft_res = client.post("/clients/client-acme-corp/draft", json=draft_req).json()
    conflicts = draft_res.get("conflicts_detected", [])
    log(f"    ✓ Conflicts detected: {len(conflicts)}")
    for c in conflicts:
        log(f"      - [{c['severity']}] {c['rule_statement']} -> {c['conflict_reason']}")
    assert len(conflicts) >= 2, "Expected at least 2 conflicts (synergy + promotional language)"
    
    draft_content = draft_res.get("draft_content", "")
    log(f"    ✓ Generated draft length: {len(draft_content)} characters")
    assert "synergy" not in draft_content.lower(), "Draft must NOT contain prohibited word 'synergy'!"
    assert "34%" not in draft_content and "42%" not in draft_content, "Draft must NOT contain fabricated statistics like 34% or 42%!"
    log("    ✓ Verified: No fabricated numbers, no prohibited buzzwords.")

    # 7. TEST ADD CONTEXT (NEW INTERACTION)
    log("\n[7] Testing Ingest / Add Context (New Interaction)...")
    ingest_req1 = {
        "client_id": "client-acme-corp",
        "source_type": "Meeting Transcript",
        "date": "October 2026",
        "title": "Executive Summary Formatting Review",
        "content": "Acme would like future executive summaries to begin with key findings before detailed analysis."
    }
    ingest_res1 = client.post("/clients/client-acme-corp/ingest", json=ingest_req1).json()
    log(f"    ✓ Ingest 1 Result: {ingest_res1['summary']}")
    twin_after_ingest1 = client.get("/clients/client-acme-corp/twin").json()
    active_after1 = [m["statement"] for m in twin_after_ingest1["preferences"]]
    log(f"    ✓ Updated Preferences: {active_after1}")
    assert any("key findings" in s.lower() for s in active_after1), "Key findings preference must be added to active rules"

    # 8. TEST TEMPORAL EVOLUTION / SUPERSEDING
    log("\n[8] Testing Temporal Evolution (Superseding via Ingestion)...")
    ingest_req2 = {
        "client_id": "client-acme-corp",
        "source_type": "Meeting Transcript",
        "date": "November 2026",
        "title": "Q4 Format Revision",
        "content": "Acme now wants executive summaries to be concise again, but detailed supporting analysis should remain available."
    }
    ingest_res2 = client.post("/clients/client-acme-corp/ingest", json=ingest_req2).json()
    log(f"    ✓ Ingest 2 Result: {ingest_res2['summary']}")
    twin_after_ingest2 = client.get("/clients/client-acme-corp/twin").json()
    superseded_after2 = [m["statement"] for m in twin_after_ingest2["superseded_memories"]]
    active_after2 = [m["statement"] for m in twin_after_ingest2["preferences"]]
    log(f"    ✓ Updated Superseded: {superseded_after2}")
    log(f"    ✓ Updated Active: {active_after2}")
    assert any("concise" in s.lower() and "available" in s.lower() for s in active_after2), "New concise preference must be active"

    # 9. TEST CALL PREPARATION BRIEF
    log("\n[9] Testing Call Preparation Brief Generation...")
    brief_req = {
        "client_id": "client-acme-corp",
        "call_objective": "Q4 Strategic Roadmap & Executive Review"
    }
    brief_res = client.post("/clients/client-acme-corp/call-brief", json=brief_req).json()
    log(f"    ✓ Brief Objective: {brief_res['objective']}")
    log(f"    ✓ Active Restrictions: {brief_res['active_restrictions']}")
    log(f"    ✓ Recent Changes: {brief_res['recent_changes']}")
    log(f"    ✓ Mistakes to Avoid: {brief_res['mistakes_to_avoid']}")
    log(f"    ✓ Suggested Talking Points: {brief_res['suggested_talking_points']}")
    assert len(brief_res['mistakes_to_avoid']) > 0, "Mistakes to avoid must be populated"
    assert len(brief_res['suggested_talking_points']) > 0, "Talking points must be populated"

    # 10. TEST ERROR HANDLING
    log("\n[10] Testing Error Handling & Validation...")
    # Empty prompt
    resp_empty = client.post("/clients/client-acme-corp/draft", json={"client_id": "client-acme-corp", "prompt": "   "})
    assert resp_empty.status_code == 400, "Expected 400 for empty prompt"
    log(f"    ✓ Correctly rejected empty prompt with HTTP {resp_empty.status_code}")

    # Invalid client
    resp_invalid = client.get("/clients/non-existent-client/twin")
    assert resp_invalid.status_code == 404, "Expected 404 for invalid client"
    log(f"    ✓ Correctly rejected invalid client with HTTP {resp_invalid.status_code}")

    # Empty ingest content
    resp_empty_ingest = client.post("/clients/client-acme-corp/ingest", json={"client_id": "client-acme-corp", "content": "   ", "date": "2026-10-01"})
    assert resp_empty_ingest.status_code == 400, "Expected 400 for empty ingest content"
    log(f"    ✓ Correctly rejected empty ingest content with HTTP {resp_empty_ingest.status_code}")

    log("\n" + "=" * 60)
    log("  ALL 10 VERIFICATION CATEGORIES PASSED WITH ZERO ERRORS!")
    log("=" * 60)

if __name__ == "__main__":
    for _ in range(10):
        try:
            client.get("/")
            break
        except Exception:
            time.sleep(1)
    run()
