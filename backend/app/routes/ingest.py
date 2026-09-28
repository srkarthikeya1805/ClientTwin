from fastapi import APIRouter, HTTPException
from app.models import IngestRequest, ExtractionResult
from app.memory_engine import MemoryEngine

router = APIRouter(prefix="/clients", tags=["Ingestion & Context Extraction"])

@router.post("/{client_id}/ingest", response_model=ExtractionResult)
async def ingest_communication(client_id: str, payload: IngestRequest):
    if payload.client_id != client_id:
        payload.client_id = client_id
    if not payload.content.strip():
        raise HTTPException(status_code=400, detail="Communication content cannot be empty")
    
    try:
        result = await MemoryEngine.process_ingestion(payload)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Context ingestion failed: {str(e)}")
