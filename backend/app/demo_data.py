import uuid
from datetime import datetime
from app.models import Client, MemoryItem, TimelineEvent
from app.database import (
    save_client, save_memory_item, save_timeline_event,
    log_activity, clear_all_data
)

def seed_demo_data():
    clear_all_data()

    # 1. ACME CORPORATION (Flagship Demo Client)
    acme = Client(
        id="client-acme-corp",
        name="Acme Corporation",
        industry="Enterprise Technology & Logistics",
        description="Global supply chain optimization platform and enterprise infrastructure vendor.",
        primary_contact="Sarah Jenkins (VP Global Marketing & Strategy)",
        last_updated="September 2026",
        active_rules_count=4,
        communication_style_summary="Clear, straightforward, evidence-based",
        recent_activity="Revision feedback: Avoid promotional language and mandate measurable evidence",
        tags=["Tier 1", "Strategic Enterprise", "Active Campaign"]
    )
    save_client(acme)

    # --- JULY 2026: Initial Meeting ---
    mem_july_1 = MemoryItem(
        id="mem-acme-july-1",
        client_id="client-acme-corp",
        statement="Client prefers concise reports and high-level summaries.",
        category="preferences",
        status="superseded",  # Superseded in August!
        confidence="High",
        source_type="Meeting Transcript",
        source_context="Initial Client Strategy Alignment (July 15, 2026)",
        date="July 2026",
        superseded_by="mem-acme-aug-1",
        created_at="2026-07-15T10:00:00",
        last_updated="2026-08-12T14:30:00",
        tags=["Reporting", "Concise"]
    )
    save_memory_item(mem_july_1)

    mem_july_2 = MemoryItem(
        id="mem-acme-july-2",
        client_id="client-acme-corp",
        statement="Do not use the word 'synergy' in any marketing or campaign materials.",
        category="restrictions",
        status="active",
        confidence="High",
        source_type="Meeting Transcript",
        source_context="Initial Client Strategy Alignment (July 15, 2026)",
        date="July 2026",
        superseded_by=None,
        created_at="2026-07-15T10:00:00",
        last_updated="2026-07-15T10:00:00",
        tags=["Prohibited Words", "Marketing", "Restriction"]
    )
    save_memory_item(mem_july_2)

    mem_july_3 = MemoryItem(
        id="mem-acme-july-3",
        client_id="client-acme-corp",
        statement="Maintain clear, straightforward, and transparent communication across all touchpoints.",
        category="communication_style",
        status="active",
        confidence="High",
        source_type="Meeting Transcript",
        source_context="Initial Client Strategy Alignment (July 15, 2026)",
        date="July 2026",
        superseded_by=None,
        created_at="2026-07-15T10:00:00",
        last_updated="2026-07-15T10:00:00",
        tags=["Tone", "Style"]
    )
    save_memory_item(mem_july_3)

    evt_july = TimelineEvent(
        id="evt-acme-july",
        client_id="client-acme-corp",
        title="July 2026 — Initial Client Meeting",
        date="July 2026",
        source_type="Meeting Transcript",
        summary="Initial kickoff meeting establishing communication baseline, report format preferences, and language constraints.",
        changes_summary=[
            "Established communication preference: Concise reports",
            "Set strict language restriction: Prohibit the term 'synergy'",
            "Defined brand communication style: Clear and straightforward"
        ],
        raw_content="The client wants concise reports and does not want the word 'synergy' used in marketing materials. They prefer clear and straightforward communication.",
        created_at="2026-07-15T11:00:00"
    )
    save_timeline_event(evt_july)

    # --- AUGUST 2026: Follow-Up Meeting (Evolution) ---
    mem_aug_1 = MemoryItem(
        id="mem-acme-aug-1",
        client_id="client-acme-corp",
        statement="Client now requires detailed, data-driven reports containing measurable results and statistics.",
        category="preferences",
        status="active",
        confidence="High",
        source_type="Meeting Transcript",
        source_context="Follow-up Strategy Review (August 12, 2026)",
        date="August 2026",
        supersedes="mem-acme-july-1",
        created_at="2026-08-12T14:30:00",
        last_updated="2026-08-12T14:30:00",
        tags=["Reporting", "Data-Driven", "Evolved"]
    )
    save_memory_item(mem_aug_1)

    evt_aug = TimelineEvent(
        id="evt-acme-aug",
        client_id="client-acme-corp",
        title="August 2026 — Follow-up Strategy Meeting",
        date="August 2026",
        source_type="Meeting Transcript",
        summary="Acme executive board updated reporting standards to mandate deep analytics and statistical proof.",
        changes_summary=[
            "SUPERSEDED: 'Concise reports' preference replaced by detailed analytical reports",
            "NEW REQUIREMENT: Include measurable results and statistics in all reports",
            "RETAINED ACTIVE: Clear and straightforward tone remains active"
        ],
        raw_content="Acme Corporation has changed its reporting preference. They now want more detailed, data-driven reports containing measurable results and statistics. The client still wants clear communication.",
        created_at="2026-08-12T15:00:00"
    )
    save_timeline_event(evt_aug)

    # --- SEPTEMBER 2026: Revision Feedback ---
    mem_sep_1 = MemoryItem(
        id="mem-acme-sep-1",
        client_id="client-acme-corp",
        statement="Avoid overly promotional or hyperbolic language in campaign and marketing materials.",
        category="restrictions",
        status="active",
        confidence="High",
        source_type="Revision Notes",
        source_context="Q3 Campaign Revision Feedback (September 20, 2026)",
        date="September 2026",
        created_at="2026-09-20T09:15:00",
        last_updated="2026-09-20T09:15:00",
        tags=["Tone Restriction", "Campaigns"]
    )
    save_memory_item(mem_sep_1)

    mem_sep_2 = MemoryItem(
        id="mem-acme-sep-2",
        client_id="client-acme-corp",
        statement="All assertions and campaign claims must be supported by measurable evidence and empirical benchmarks.",
        category="requirements",
        status="active",
        confidence="High",
        source_type="Revision Notes",
        source_context="Q3 Campaign Revision Feedback (September 20, 2026)",
        date="September 2026",
        created_at="2026-09-20T09:15:00",
        last_updated="2026-09-20T09:15:00",
        tags=["Evidence", "Metrics", "Validation"]
    )
    save_memory_item(mem_sep_2)

    evt_sep = TimelineEvent(
        id="evt-acme-sep",
        client_id="client-acme-corp",
        title="September 2026 — Campaign Revision Notes",
        date="September 2026",
        source_type="Revision Notes",
        summary="Feedback from CMO office highlighting restriction against promotional copy and mandating empirical evidence.",
        changes_summary=[
            "NEW RESTRICTION: Do not use overly promotional language",
            "NEW MANDATE: Support all claims with measurable evidence"
        ],
        raw_content="The client does not want overly promotional language in campaign materials. They want claims to be supported by measurable evidence.",
        created_at="2026-09-20T10:00:00"
    )
    save_timeline_event(evt_sep)

    # --- 2. TECHNOVA (Fintech Client) ---
    technova = Client(
        id="client-technova",
        name="TechNova Payments",
        industry="Financial Technology & High-Frequency Clearing",
        description="Next-generation API clearinghouse for global real-time cross-border settlements.",
        primary_contact="David Kim (Head of Compliance & DevRel)",
        last_updated="September 2026",
        active_rules_count=5,
        communication_style_summary="Technical, audit-ready, bulleted summaries",
        recent_activity="Updated security compliance disclosures",
        tags=["Fintech", "High Compliance", "Tier 1"]
    )
    save_client(technova)

    save_memory_item(MemoryItem(
        id="mem-tn-1",
        client_id="client-technova",
        statement="All documentation must include SEC / SOC2 Type II audit readiness notes.",
        category="requirements",
        status="active",
        confidence="High",
        source_type="Email",
        source_context="Security Audit Kickoff",
        date="August 2026"
    ))
    save_memory_item(MemoryItem(
        id="mem-tn-2",
        client_id="client-technova",
        statement="Prohibit describing features as 'guaranteed risk-free' or 'foolproof'.",
        category="restrictions",
        status="active",
        confidence="High",
        source_type="Revision Notes",
        source_context="Legal Review",
        date="September 2026"
    ))
    save_memory_item(MemoryItem(
        id="mem-tn-3",
        client_id="client-technova",
        statement="Prefers asynchronous Slack bullet updates over scheduled video calls.",
        category="communication_style",
        status="active",
        confidence="High",
        source_type="Slack / Chat",
        source_context="Onboarding Chat",
        date="July 2026"
    ))
    save_timeline_event(TimelineEvent(
        id="evt-tn-1",
        client_id="client-technova",
        title="August 2026 — Security Compliance Brief",
        date="August 2026",
        source_type="Email",
        summary="Compliance team mandated strict audit disclaimers across all external collaterals.",
        changes_summary=["Mandatory SOC2 disclosures", "Async communication preferred"]
    ))

    # --- 3. VERTEX CONSULTING ---
    vertex = Client(
        id="client-vertex",
        name="Vertex Consulting",
        industry="Management Consulting & Strategic Advisory",
        description="Boutique advisory firm specializing in M&A integration and restructuring.",
        primary_contact="Elena Rostova (Senior Partner)",
        last_updated="August 2026",
        active_rules_count=4,
        communication_style_summary="Executive slide-deck oriented, punchy",
        recent_activity="Deliverable format update: Slides preferred over long docs",
        tags=["Advisory", "Executive"]
    )
    save_client(vertex)
    save_memory_item(MemoryItem(
        id="mem-vx-1",
        client_id="client-vertex",
        statement="Deliverables must be formatted as 16:9 executive presentation slide decks, not Word documents.",
        category="preferences",
        status="active",
        confidence="High",
        source_type="Meeting Transcript",
        source_context="Q2 Partner Meeting",
        date="June 2026"
    ))
    save_memory_item(MemoryItem(
        id="mem-vx-2",
        client_id="client-vertex",
        statement="Prohibited buzzword: Never use the phrase 'low-hanging fruit'.",
        category="restrictions",
        status="active",
        confidence="High",
        source_type="Email",
        source_context="Partner Feedback",
        date="July 2026"
    ))

    # --- 4. GLOBALHEALTH BIOTECH ---
    globalhealth = Client(
        id="client-globalhealth",
        name="GlobalHealth Therapeutics",
        industry="Biotechnology & Clinical Research",
        description="Clinical stage biopharma developing targeted oncology therapies.",
        primary_contact="Dr. Marcus Vance (Chief Medical Officer)",
        last_updated="September 2026",
        active_rules_count=4,
        communication_style_summary="Clinical, peer-reviewed, academic precision",
        recent_activity="FDA review milestone preparation guidelines",
        tags=["Healthcare", "Biotech", "Clinical"]
    )
    save_client(globalhealth)
    save_memory_item(MemoryItem(
        id="mem-gh-1",
        client_id="client-globalhealth",
        statement="Every clinical claim must cite a PubMed ID or peer-reviewed clinical trial phase.",
        category="requirements",
        status="active",
        confidence="High",
        source_type="Meeting Transcript",
        source_context="CMO Review",
        date="August 2026"
    ))
    save_memory_item(MemoryItem(
        id="mem-gh-2",
        client_id="client-globalhealth",
        statement="Strict HIPAA privacy: No patient-identifiable sample data in test environments.",
        category="restrictions",
        status="active",
        confidence="High",
        source_type="Revision Notes",
        source_context="IRB Governance",
        date="September 2026"
    ))

    # Seed Initial Activities
    log_activity("client-acme-corp", "Acme Corporation", "Revision feedback processed", "Added restriction: Avoid promotional language; Mandated measurable evidence.", "2026-09-20T10:05:00")
    log_activity("client-acme-corp", "Acme Corporation", "Preference evolution detected", "Superseded concise reporting with detailed data-driven analytics.", "2026-08-12T15:05:00")
    log_activity("client-technova", "TechNova Payments", "Compliance rule added", "Mandatory SOC2 Type II disclosures required on all materials.", "2026-08-10T09:00:00")
    log_activity("client-acme-corp", "Acme Corporation", "Prohibited term registered", "Added language restriction: Prohibit the word 'synergy'.", "2026-07-15T11:05:00")
