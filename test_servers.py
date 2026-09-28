import httpx
import sys
import time

report = []

def check(url, name):
    for attempt in range(10):
        try:
            r = httpx.get(url, timeout=3.0, follow_redirects=True)
            report.append(f"[SUCCESS] {name} ({url}) returned HTTP {r.status_code}")
            return r
        except Exception as e:
            if attempt == 9:
                report.append(f"[FAILURE] {name} ({url}) failed: {e}")
            time.sleep(1)
    return None

# 1. Backend root
r_back = check("http://127.0.0.1:8000/", "Backend Root")
if r_back:
    report.append(f"  Backend Data: {r_back.json()}")

# 2. Swagger docs
r_docs = check("http://127.0.0.1:8000/docs", "Swagger Docs")

# 3. Frontend dev server
r_front = check("http://127.0.0.1:5173/", "Frontend Vite Server")
if r_front:
    report.append(f"  Frontend HTML snippet: {r_front.text[:300]}")

output_text = "\n".join(report)
print(output_text)
with open("verify_both_servers.txt", "w", encoding="utf-8") as f:
    f.write(output_text)
