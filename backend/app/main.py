from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db, get_all_clients
from app.demo_data import seed_demo_data
from app.ai_service import AIService
from app.routes import clients, ingest, draft, call_brief, demo

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    # Seed default data if database is empty
    existing_clients = get_all_clients()
    if not existing_clients:
        seed_demo_data()
        print("[ClientTwin] Initialized SQLite DB and seeded demo data.")
    yield

app = FastAPI(
    title="ClientTwin AI API",
    description="Dynamic Client Context Management Agent Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(clients.router)
app.include_router(ingest.router)
app.include_router(draft.router)
app.include_router(call_brief.router)
app.include_router(demo.router)

@app.get("/")
def health_check():
    return {
        "system": "ClientTwin AI - Institutional Client Memory Engine",
        "status": "online",
        "active_ai_provider": AIService.get_active_provider_name()
    }

@app.get("/system/status")
def system_status():
    return {
        "status": "ready",
        "ai_provider": AIService.get_active_provider_name(),
        "database": "SQLite (clienttwin.db)"
    }
