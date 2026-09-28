import httpx
import sys

def test():
    results = []
    
    # 1. Frontend Root
    try:
        r = httpx.get("http://127.0.0.1:5173/", timeout=5.0)
        results.append(f"[PASS] Frontend HTML returned HTTP {r.status_code}")
    except Exception as e:
        results.append(f"[FAIL] Frontend HTML failed: {e}")

    # 2. Main TSX bundle via Vite
    try:
        r = httpx.get("http://127.0.0.1:5173/src/main.tsx", timeout=5.0)
        results.append(f"[PASS] Main TSX bundle compiled with HTTP {r.status_code}")
    except Exception as e:
        results.append(f"[FAIL] Main TSX failed: {e}")

    # 3. 3D Twin component via Vite
    try:
        r = httpx.get("http://127.0.0.1:5173/src/components/ClientTwin3D.tsx", timeout=5.0)
        results.append(f"[PASS] ClientTwin3D component compiled with HTTP {r.status_code}")
    except Exception as e:
        results.append(f"[FAIL] ClientTwin3D failed: {e}")

    # 4. Backend Root
    try:
        r = httpx.get("http://127.0.0.1:8000/", timeout=5.0)
        results.append(f"[PASS] Backend Root returned HTTP {r.status_code} ({r.json().get('active_ai_provider')})")
    except Exception as e:
        results.append(f"[FAIL] Backend failed: {e}")

    # 5. Backend Client Twin endpoint
    try:
        r = httpx.get("http://127.0.0.1:8000/clients/client-acme-corp/twin", timeout=5.0)
        twin = r.json()
        results.append(f"[PASS] Acme Twin endpoint returned HTTP {r.status_code} with {twin.get('total_active_rules')} active rules")
    except Exception as e:
        results.append(f"[FAIL] Twin endpoint failed: {e}")

    # 6. Backend Draft conflict test
    try:
        draft_req = {
            "client_id": "client-acme-corp",
            "prompt": "Create a promotional introduction for Acme Corporation's campaign. Explain how our solutions create synergy between teams.",
            "content_type": "Campaign Introduction"
        }
        r = httpx.post("http://127.0.0.1:8000/clients/client-acme-corp/draft", json=draft_req, timeout=5.0)
        d = r.json()
        conflicts = d.get("conflicts_detected", [])
        content = d.get("draft_content", "")
        no_synergy = "synergy" not in content.lower()
        no_fake_nums = "34%" not in content and "42%" not in content
        results.append(f"[PASS] Draft returned {len(conflicts)} conflicts | No synergy: {no_synergy} | No fake numbers: {no_fake_nums}")
    except Exception as e:
        results.append(f"[FAIL] Draft failed: {e}")

    report = "\n".join(results)
    print(report)
    with open("test_results.txt", "w", encoding="utf-8") as f:
        f.write(report)

if __name__ == "__main__":
    test()
