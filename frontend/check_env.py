import shutil
import sys
import subprocess
import os

with open("env_check.txt", "w") as f:
    f.write(f"Python: {sys.executable}\n")
    f.write(f"npm.cmd: {shutil.which('npm.cmd')}\n")
    f.write(f"npm: {shutil.which('npm')}\n")
    f.write(f"node.exe: {shutil.which('node.exe')}\n")
    f.write(f"node: {shutil.which('node')}\n")
    f.write(f"PATH: {os.environ.get('PATH')}\n")
