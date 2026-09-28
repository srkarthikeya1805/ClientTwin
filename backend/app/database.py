import sqlite3
import json
import os
from typing import List, Optional, Dict, Any
from app.models import Client, MemoryItem, TimelineEvent

DB_FILE = os.environ.get("CLIENTTWIN_DB_FILE", "clienttwin.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Clients Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        industry TEXT NOT NULL,
        description TEXT NOT NULL,
        primary_contact TEXT,
        last_updated TEXT NOT NULL,
        active_rules_count INTEGER DEFAULT 0,
        communication_style_summary TEXT DEFAULT 'Standard Professional',
        recent_activity TEXT DEFAULT 'Client initialized',
        tags TEXT DEFAULT '[]'
    )
    """)

    # Memory Items Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memory_items (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        statement TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        confidence TEXT NOT NULL DEFAULT 'High',
        source_type TEXT NOT NULL,
        source_context TEXT NOT NULL,
        date TEXT NOT NULL,
        superseded_by TEXT,
        supersedes TEXT,
        created_at TEXT NOT NULL,
        last_updated TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        FOREIGN KEY (client_id) REFERENCES clients (id)
    )
    """)

    # Timeline Events Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS timeline_events (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        source_type TEXT NOT NULL,
        summary TEXT NOT NULL,
        changes_summary TEXT DEFAULT '[]',
        raw_content TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients (id)
    )
    """)

    # Activity Log Table for Dashboard
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT NOT NULL,
        client_name TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    """)

    # Warnings / Drafts History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS draft_history (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        prompt TEXT NOT NULL,
        conflicts_count INTEGER DEFAULT 0,
        draft_content TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

# Database Helper Functions

def get_all_clients() -> List[Client]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients ORDER BY name ASC")
    rows = cursor.fetchall()
    conn.close()
    
    clients = []
    for r in rows:
        clients.append(Client(
            id=r["id"],
            name=r["name"],
            industry=r["industry"],
            description=r["description"],
            primary_contact=r["primary_contact"],
            last_updated=r["last_updated"],
            active_rules_count=r["active_rules_count"],
            communication_style_summary=r["communication_style_summary"],
            recent_activity=r["recent_activity"],
            tags=json.loads(r["tags"] or "[]")
        ))
    return clients

def get_client_by_id(client_id: str) -> Optional[Client]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clients WHERE id = ?", (client_id,))
    r = cursor.fetchone()
    conn.close()
    if not r:
        return None
    return Client(
        id=r["id"],
        name=r["name"],
        industry=r["industry"],
        description=r["description"],
        primary_contact=r["primary_contact"],
        last_updated=r["last_updated"],
        active_rules_count=r["active_rules_count"],
        communication_style_summary=r["communication_style_summary"],
        recent_activity=r["recent_activity"],
        tags=json.loads(r["tags"] or "[]")
    )

def save_client(client: Client):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO clients (id, name, industry, description, primary_contact, last_updated, active_rules_count, communication_style_summary, recent_activity, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        industry=excluded.industry,
        description=excluded.description,
        primary_contact=excluded.primary_contact,
        last_updated=excluded.last_updated,
        active_rules_count=excluded.active_rules_count,
        communication_style_summary=excluded.communication_style_summary,
        recent_activity=excluded.recent_activity,
        tags=excluded.tags
    """, (
        client.id, client.name, client.industry, client.description,
        client.primary_contact, client.last_updated, client.active_rules_count,
        client.communication_style_summary, client.recent_activity,
        json.dumps(client.tags)
    ))
    conn.commit()
    conn.close()

def get_memories_by_client(client_id: str, status: Optional[str] = None) -> List[MemoryItem]:
    conn = get_db_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute("SELECT * FROM memory_items WHERE client_id = ? AND status = ? ORDER BY created_at DESC", (client_id, status))
    else:
        cursor.execute("SELECT * FROM memory_items WHERE client_id = ? ORDER BY created_at DESC", (client_id,))
    rows = cursor.fetchall()
    conn.close()

    memories = []
    for r in rows:
        memories.append(MemoryItem(
            id=r["id"],
            client_id=r["client_id"],
            statement=r["statement"],
            category=r["category"],
            status=r["status"],
            confidence=r["confidence"],
            source_type=r["source_type"],
            source_context=r["source_context"],
            date=r["date"],
            superseded_by=r["superseded_by"],
            supersedes=r["supersedes"],
            created_at=r["created_at"],
            last_updated=r["last_updated"],
            tags=json.loads(r["tags"] or "[]")
        ))
    return memories

def save_memory_item(item: MemoryItem):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO memory_items (id, client_id, statement, category, status, confidence, source_type, source_context, date, superseded_by, supersedes, created_at, last_updated, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        statement=excluded.statement,
        category=excluded.category,
        status=excluded.status,
        confidence=excluded.confidence,
        source_type=excluded.source_type,
        source_context=excluded.source_context,
        date=excluded.date,
        superseded_by=excluded.superseded_by,
        supersedes=excluded.supersedes,
        last_updated=excluded.last_updated,
        tags=excluded.tags
    """, (
        item.id, item.client_id, item.statement, item.category, item.status,
        item.confidence, item.source_type, item.source_context, item.date,
        item.superseded_by, item.supersedes, item.created_at, item.last_updated,
        json.dumps(item.tags)
    ))
    conn.commit()
    conn.close()

def get_timeline_by_client(client_id: str) -> List[TimelineEvent]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM timeline_events WHERE client_id = ? ORDER BY date ASC, created_at ASC", (client_id,))
    rows = cursor.fetchall()
    conn.close()

    events = []
    for r in rows:
        events.append(TimelineEvent(
            id=r["id"],
            client_id=r["client_id"],
            title=r["title"],
            date=r["date"],
            source_type=r["source_type"],
            summary=r["summary"],
            changes_summary=json.loads(r["changes_summary"] or "[]"),
            raw_content=r["raw_content"],
            created_at=r["created_at"]
        ))
    return events

def save_timeline_event(event: TimelineEvent):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO timeline_events (id, client_id, title, date, source_type, summary, changes_summary, raw_content, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        date=excluded.date,
        source_type=excluded.source_type,
        summary=excluded.summary,
        changes_summary=excluded.changes_summary,
        raw_content=excluded.raw_content
    """, (
        event.id, event.client_id, event.title, event.date, event.source_type,
        event.summary, json.dumps(event.changes_summary), event.raw_content, event.created_at
    ))
    conn.commit()
    conn.close()

def log_activity(client_id: str, client_name: str, action: str, details: str, timestamp: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO activity_log (client_id, client_name, action, details, timestamp)
    VALUES (?, ?, ?, ?, ?)
    """, (client_id, client_name, action, details, timestamp))
    conn.commit()
    conn.close()

def get_recent_activities(limit: int = 10) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM activity_log ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def log_draft(draft_id: str, client_id: str, prompt: str, conflicts_count: int, draft_content: str, created_at: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO draft_history (id, client_id, prompt, conflicts_count, draft_content, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (draft_id, client_id, prompt, conflicts_count, draft_content, created_at))
    conn.commit()
    conn.close()

def count_total_warnings() -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(conflicts_count) as total FROM draft_history")
    row = cursor.fetchone()
    conn.close()
    return (row["total"] or 0) if row else 0

def clear_all_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM timeline_events")
    cursor.execute("DELETE FROM memory_items")
    cursor.execute("DELETE FROM clients")
    cursor.execute("DELETE FROM activity_log")
    cursor.execute("DELETE FROM draft_history")
    conn.commit()
    conn.close()
