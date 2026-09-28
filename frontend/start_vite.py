import subprocess
import os
import sys

FRONTEND_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(FRONTEND_DIR)

vite_bin = os.path.join(FRONTEND_DIR, "node_modules", "vite", "bin", "vite.js")
cmd = [sys.executable.replace("python.exe", "node.exe") if os.path.exists(sys.executable.replace("python.exe", "node.exe")) else "node", vite_bin, "--port", "5173", "--host", "127.0.0.1"]

print(f"Launching Vite: {' '.join(cmd)}", flush=True)
proc = subprocess.Popen(
    cmd,
    cwd=FRONTEND_DIR,
    stdout=sys.stdout,
    stderr=sys.stderr
)
proc.wait()
