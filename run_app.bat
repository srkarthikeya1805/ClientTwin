@echo off
echo =======================================================
echo   Starting ClientTwin AI (Full Stack System)
echo =======================================================
echo.

start "ClientTwin AI Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

start "ClientTwin AI Frontend (Vite + React)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Backend started at http://localhost:8000
echo Frontend starting at http://localhost:5173
echo.
echo Application ready for demo!
pause
