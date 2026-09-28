"""Fix frontend dependencies and start Vite dev server."""
import subprocess
import os
import shutil
import sys
import time

FRONTEND_DIR = os.path.dirname(os.path.abspath(__file__))
NODE_MODULES = os.path.join(FRONTEND_DIR, "node_modules")
LOCK_FILE = os.path.join(FRONTEND_DIR, "package-lock.json")
OUTPUT_FILE = os.path.join(FRONTEND_DIR, "setup_output.txt")

def log(msg):
    print(msg, flush=True)
    with open(OUTPUT_FILE, "a") as f:
        f.write(msg + "\n")

def main():
    # Clear output file
    with open(OUTPUT_FILE, "w") as f:
        f.write(f"=== Frontend Setup Started at {time.strftime('%H:%M:%S')} ===\n")

    os.chdir(FRONTEND_DIR)

    # Step 1: Check if .bin exists
    bin_dir = os.path.join(NODE_MODULES, ".bin")
    vite_pkg = os.path.join(NODE_MODULES, "vite")
    tw_pkg = os.path.join(NODE_MODULES, "tailwindcss")

    log(f".bin exists: {os.path.isdir(bin_dir)}")
    log(f"vite pkg exists: {os.path.isdir(vite_pkg)}")
    log(f"tailwindcss pkg exists: {os.path.isdir(tw_pkg)}")

    if os.path.isdir(bin_dir):
        bin_contents = os.listdir(bin_dir)
        log(f".bin has {len(bin_contents)} items")
        if len(bin_contents) > 0:
            log(f"First items: {bin_contents[:10]}")
    
    needs_install = not os.path.isdir(bin_dir) or not os.path.isdir(vite_pkg) or not os.path.isdir(tw_pkg)
    
    if os.path.isdir(bin_dir):
        bin_contents = os.listdir(bin_dir)
        if len(bin_contents) < 5:
            needs_install = True
            log(f".bin only has {len(bin_contents)} items - needs reinstall")

    if needs_install:
        log("--- Running npm install (this may take a while on OneDrive) ---")
        # Delete node_modules and lock
        if os.path.isdir(NODE_MODULES):
            log("Deleting node_modules...")
            try:
                shutil.rmtree(NODE_MODULES, ignore_errors=True)
            except:
                # On Windows, sometimes rmtree fails. Use cmd
                subprocess.run(["cmd", "/c", "rmdir", "/s", "/q", NODE_MODULES], 
                             capture_output=True, timeout=120)
            log("node_modules deleted")
        
        if os.path.isfile(LOCK_FILE):
            os.remove(LOCK_FILE)
            log("package-lock.json deleted")
        
        log(f"Starting npm install at {time.strftime('%H:%M:%S')}...")
        result = subprocess.run(
            ["npm", "install", "--no-optional", "--legacy-peer-deps"],
            capture_output=True, text=True, timeout=300,
            cwd=FRONTEND_DIR
        )
        log(f"npm install completed at {time.strftime('%H:%M:%S')}")
        log(f"Return code: {result.returncode}")
        if result.stdout:
            log(f"stdout: {result.stdout[-1000:]}")
        if result.stderr:
            log(f"stderr: {result.stderr[-1000:]}")
        
        # Verify
        log(f".bin exists after install: {os.path.isdir(bin_dir)}")
        if os.path.isdir(bin_dir):
            bin_contents = os.listdir(bin_dir)
            log(f".bin has {len(bin_contents)} items after install")
    else:
        log("Dependencies appear complete - skipping npm install")

    # Step 2: Verify critical files exist
    vite_bin = os.path.join(NODE_MODULES, "vite", "bin", "vite.js")
    if not os.path.isfile(vite_bin):
        log(f"ERROR: vite.js not found at {vite_bin}")
        sys.exit(1)
    log(f"vite.js found: {vite_bin}")

    # Step 3: Test tailwindcss resolve
    try:
        result = subprocess.run(
            ["node", "-e", "require.resolve('tailwindcss'); console.log('tailwindcss OK')"],
            capture_output=True, text=True, timeout=30, cwd=FRONTEND_DIR
        )
        log(f"tailwindcss resolve: {result.stdout.strip()} {result.stderr.strip()}")
    except Exception as e:
        log(f"tailwindcss resolve error: {e}")

    log(f"\n=== Setup Complete at {time.strftime('%H:%M:%S')} ===")
    log("Run: node node_modules/vite/bin/vite.js --port 5173 --host 127.0.0.1")

if __name__ == "__main__":
    main()
