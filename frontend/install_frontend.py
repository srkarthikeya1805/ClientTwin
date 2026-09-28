import subprocess
import os
import shutil
import sys
import time

FRONTEND_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(FRONTEND_DIR, "install_log.txt")

def log(msg):
    print(msg, flush=True)
    for _ in range(10):
        try:
            with open(LOG_FILE, "a", encoding="utf-8") as f:
                f.write(f"[{time.strftime('%H:%M:%S')}] {msg}\n")
            break
        except Exception:
            time.sleep(0.1)

try:
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write(f"Starting install in {FRONTEND_DIR}\n")
except Exception:
    pass

npm_cmd = shutil.which("npm.cmd") or shutil.which("npm") or "npm"
log(f"Using npm: {npm_cmd}")

# Do NOT delete node_modules — just run npm install to repair and install missing packages!
log("Running npm install to repair and install missing packages...")
proc = subprocess.run(
    f'"{npm_cmd}" install --no-audit --no-fund',
    shell=True,
    cwd=FRONTEND_DIR,
    capture_output=True,
    text=True
)
log(f"npm install returncode: {proc.returncode}")
if proc.stdout:
    log(f"STDOUT:\n{proc.stdout[-1500:]}")
if proc.stderr:
    log(f"STDERR:\n{proc.stderr[-1500:]}")

# Verify vite
node_modules = os.path.join(FRONTEND_DIR, "node_modules")
vite_bin = os.path.join(node_modules, "vite", "bin", "vite.js")
log(f"vite.js exists: {os.path.exists(vite_bin)}")
tw_pkg = os.path.join(node_modules, "tailwindcss", "package.json")
log(f"tailwindcss/package.json exists: {os.path.exists(tw_pkg)}")
