import os
import json
import re
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()

class AIService:
    @staticmethod
    def get_active_provider_name() -> str:
        if GEMINI_API_KEY and not GEMINI_API_KEY.startswith("your_"):
            return "Gemini 2.5 Flash"
        elif OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_"):
            return "OpenAI GPT-4o"
        return "Demo AI Mode"

    @classmethod
    async def extract_client_context(
        cls,
        client_name: str,
        existing_memories: List[Dict[str, Any]],
        new_content: str,
        source_type: str,
        date_str: str
    ) -> Dict[str, Any]:
        """
        Extracts structured memory items from raw communication and determines temporal evolution.
        """
        prompt = f"""
You are the AI Context Engine for ClientTwin AI. Your job is to extract institutional client memory and detect evolving preferences.

Client Name: {client_name}
Communication Date: {date_str}
Source Type: {source_type}

--- EXISTING ACTIVE & SUPERSEDED CLIENT MEMORY ---
{json.dumps(existing_memories, indent=2)}

--- NEW RAW COMMUNICATION TO ANALYZE ---
{new_content}

--- INSTRUCTIONS ---
Analyze the new communication carefully.
1. Extract high-level, persistent client context (preferences, restrictions, communication_style, etc.).
2. Detect if any new preference/requirement updates or directly contradicts an existing memory.
3. Return ONLY valid JSON in this exact structure:
{{
  "summary": "Short 1-2 sentence executive summary of this interaction",
  "extracted_items": [
    {{
      "statement": "Clear rule/fact statement",
      "category": "preferences|restrictions|communication_style|brand_guidelines|decisions|priorities|requirements|feedback|important_facts",
      "status": "active",
      "confidence": "High|Medium|Low",
      "supersedes_statement": "Exact text or summary of existing memory that is now superseded, or null if completely new",
      "reason": "Why this is added or why it supersedes the previous item"
    }}
  ],
  "superseded_existing_ids": ["IDs of existing memory items that are now superseded"],
  "changes_summary": ["Bullet point list of what changed in the client profile"]
}}
"""
        # Try real AI provider if configured
        if GEMINI_API_KEY and not GEMINI_API_KEY.startswith("your_"):
            try:
                res = await cls._call_gemini(prompt)
                if res and "extracted_items" in res:
                    return {**res, "ai_provider": "Gemini 2.5 Flash"}
            except Exception as e:
                print(f"[Gemini Error] Falling back to intelligent demo engine: {e}", flush=True)

        if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_"):
            try:
                res = await cls._call_openai(prompt)
                if res and "extracted_items" in res:
                    return {**res, "ai_provider": "OpenAI GPT-4o"}
            except Exception as e:
                print(f"[OpenAI Error] Falling back to intelligent demo engine: {e}", flush=True)

        # Intelligent Deterministic Fallback Engine (Demo Mode)
        return cls._fallback_context_extraction(client_name, existing_memories, new_content, source_type, date_str)

    @classmethod
    async def analyze_conflicts_and_draft(
        cls,
        client_name: str,
        active_memories: List[Dict[str, Any]],
        user_prompt: str,
        content_type: str = "Draft"
    ) -> Dict[str, Any]:
        """
        Retrieves context, analyzes prompt against client rules, detects conflicts, and generates a context-compliant draft without fabricated statistics.
        """
        prompt = f"""
You are the Context-Aware Draft Assistant in ClientTwin AI.

Client: {client_name}
Requested Task: {user_prompt}
Target Type: {content_type}

--- ACTIVE CLIENT RULES & PREFERENCES ---
{json.dumps(active_memories, indent=2)}

--- INSTRUCTIONS ---
1. Retrieve and list all client context items relevant to this request.
2. Check if the user prompt violates any active client restriction, prohibited words, brand guidelines, or tone preferences.
3. Write a high-quality, professional draft that obeys ALL client preferences and strictly avoids any prohibited words (like 'synergy') or promotional hype.
4. IMPORTANT: Do NOT fabricate specific invented numbers or statistics. Use generic evidence-based phrasing such as "supported by measurable performance results and empirical benchmarks".

Return ONLY a valid JSON object:
{{
  "context_used": [
    {{
      "statement": "rule statement",
      "category": "category",
      "source_date": "date",
      "relevance": "Why this rule is relevant to the draft"
    }}
  ],
  "conflicts_detected": [
    {{
      "rule_statement": "Prohibited term 'synergy'",
      "rule_category": "restrictions",
      "rule_source": "July 2026 meeting",
      "rule_date": "July 2026",
      "conflict_reason": "Prompt requested synergy, but client explicitly prohibited this buzzword.",
      "severity": "HIGH"
    }}
  ],
  "suggested_adjustment": "Clear instruction on tone and vocabulary fixes.",
  "original_risks": ["Risk 1", "Risk 2"],
  "draft_content": "The complete, corrected, context-compliant draft."
}}
"""
        if GEMINI_API_KEY and not GEMINI_API_KEY.startswith("your_"):
            try:
                res = await cls._call_gemini(prompt)
                if res and "draft_content" in res:
                    return {**res, "ai_provider": "Gemini 2.5 Flash"}
            except Exception as e:
                print(f"[Gemini Draft Error]: {e}", flush=True)

        if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_"):
            try:
                res = await cls._call_openai(prompt)
                if res and "draft_content" in res:
                    return {**res, "ai_provider": "OpenAI GPT-4o"}
            except Exception as e:
                print(f"[OpenAI Draft Error]: {e}", flush=True)

        return cls._fallback_draft_generation(client_name, active_memories, user_prompt, content_type)

    @classmethod
    async def generate_call_brief(
        cls,
        client_name: str,
        active_memories: List[Dict[str, Any]],
        timeline_events: List[Dict[str, Any]],
        objective: str
    ) -> Dict[str, Any]:
        """
        Generates an 8-point executive call preparation brief without fabricated facts.
        """
        prompt = f"""
You are the Executive Client Preparation Engine in ClientTwin AI.
Generate a structured call prep brief for an upcoming meeting with {client_name}.
Objective: {objective}

Active Client Knowledge: {json.dumps(active_memories, indent=2)}
Chronological Milestones: {json.dumps(timeline_events, indent=2)}

Output JSON:
{{
  "current_priorities": ["list of priorities"],
  "communication_preferences": ["list of preferred styles"],
  "active_restrictions": ["list of prohibited items/words"],
  "recent_changes": ["list of preference evolutions"],
  "recent_feedback": ["list of recurring feedback"],
  "open_items": ["list of open deliverables/milestones"],
  "mistakes_to_avoid": ["list of pitfalls specific to this client's history"],
  "suggested_talking_points": ["strategic points aligned with their latest preferences"]
}}
"""
        if GEMINI_API_KEY and not GEMINI_API_KEY.startswith("your_"):
            try:
                res = await cls._call_gemini(prompt)
                if res and "current_priorities" in res:
                    return {**res, "ai_provider": "Gemini 2.5 Flash"}
            except Exception as e:
                print(f"[Gemini CallBrief Error]: {e}", flush=True)

        if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_"):
            try:
                res = await cls._call_openai(prompt)
                if res and "current_priorities" in res:
                    return {**res, "ai_provider": "OpenAI GPT-4o"}
            except Exception as e:
                print(f"[OpenAI CallBrief Error]: {e}", flush=True)

        return cls._fallback_call_brief(client_name, active_memories, timeline_events, objective)

    # --- HTTP LLM API Helpers ---

    @classmethod
    async def _call_gemini(cls, prompt: str) -> Optional[Dict[str, Any]]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
        return None

    @classmethod
    async def _call_openai(cls, prompt: str) -> Optional[Dict[str, Any]]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": "You are a specialized institutional context engine that outputs strict JSON."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                return json.loads(text)
        return None

    # --- Intelligent Fallback Engine for Reliable Zero-Config Demonstration ---

    @classmethod
    def _fallback_context_extraction(
        cls,
        client_name: str,
        existing_memories: List[Dict[str, Any]],
        new_content: str,
        source_type: str,
        date_str: str
    ) -> Dict[str, Any]:
        text_lower = new_content.lower()
        extracted_items = []
        superseded_ids = []
        changes = []

        # Find existing active memories for reference
        active_memories = [m for m in existing_memories if m.get("status") == "active"]

        # 1. Custom Evolution Case: Executive Summaries / Key Findings
        if "key findings before" in text_lower or "executive summaries to begin with" in text_lower:
            extracted_items.append({
                "statement": "Executive summaries must begin with key findings before presenting detailed analysis.",
                "category": "preferences",
                "status": "active",
                "confidence": "High",
                "supersedes_statement": None,
                "reason": "Client mandated key findings placement at beginning of executive summaries."
            })
            changes.append("Added preference: Executive summaries must begin with key findings")

        elif "concise again" in text_lower or "concise executive summaries" in text_lower:
            # Detect previous preference about detailed/beginning with findings
            findings_match = next((m for m in active_memories if "key findings" in m["statement"].lower() or "detailed analysis" in m["statement"].lower()), None)
            supersedes_text = findings_match["statement"] if findings_match else None
            if findings_match:
                superseded_ids.append(findings_match["id"])
                changes.append(f"Preference evolved: '{findings_match['statement']}' is now SUPERSEDED by concise executive summaries with available detailed appendices.")

            extracted_items.append({
                "statement": "Executive summaries should be concise, with detailed supporting analysis kept available as supporting documentation.",
                "category": "preferences",
                "status": "active",
                "confidence": "High",
                "supersedes_statement": supersedes_text,
                "reason": "Client evolved preference: summaries concise again with detailed analysis in appendix."
            })
            changes.append("Preference evolved: Concise executive summaries with detailed supporting appendices")

        # 2. Check for Prohibited Words / Synergy / Buzzwords
        if "synergy" in text_lower or "prohibit" in text_lower or "do not use" in text_lower or "avoid" in text_lower:
            if "synergy" in text_lower:
                extracted_items.append({
                    "statement": "Do not use the word 'synergy' in any marketing or campaign materials.",
                    "category": "restrictions",
                    "status": "active",
                    "confidence": "High",
                    "supersedes_statement": None,
                    "reason": "Explicit restriction specified by client leadership."
                })
                changes.append("Added restriction: Prohibited word 'synergy'")
            
            if "promotional" in text_lower or "overly promotional" in text_lower:
                extracted_items.append({
                    "statement": "Avoid overly promotional or hyperbolic language in campaign materials.",
                    "category": "restrictions",
                    "status": "active",
                    "confidence": "High",
                    "supersedes_statement": None,
                    "reason": "Client requested fact-based messaging over hype."
                })
                changes.append("Added restriction: Avoid overly promotional language")

        # 3. Check for Reporting format & Data-driven vs Concise Evolution
        if "detailed" in text_lower or "data-driven" in text_lower or "measurable" in text_lower or "statistics" in text_lower:
            if not any(item["category"] == "preferences" for item in extracted_items):
                concise_match = next((m for m in active_memories if "concise" in m["statement"].lower()), None)
                supersedes_text = concise_match["statement"] if concise_match else None
                if concise_match:
                    superseded_ids.append(concise_match["id"])
                    changes.append(f"Preference evolved: '{concise_match['statement']}' is now SUPERSEDED by detailed data-driven reporting.")

                extracted_items.append({
                    "statement": "Client requires detailed, data-driven reports containing measurable results and statistics.",
                    "category": "preferences",
                    "status": "active",
                    "confidence": "High",
                    "supersedes_statement": supersedes_text,
                    "reason": "Client updated reporting standards to mandate verifiable metrics."
                })
                
                extracted_items.append({
                    "statement": "Support all claims and case studies with measurable evidence and empirical benchmarks.",
                    "category": "requirements",
                    "status": "active",
                    "confidence": "High",
                    "supersedes_statement": None,
                    "reason": "Client requires quantitative proof points for all claims."
                })
                changes.append("New requirement: Support all claims with measurable evidence")

        elif ("concise" in text_lower or "short report" in text_lower or "brief" in text_lower) and not extracted_items:
            extracted_items.append({
                "statement": "Client prefers concise, high-level summary reports.",
                "category": "preferences",
                "status": "active",
                "confidence": "High",
                "supersedes_statement": None,
                "reason": "Initial client preference for brief executive summaries."
            })
            changes.append("Added preference: Concise reports")

        # 4. Communication Style
        if "clear" in text_lower or "straightforward" in text_lower:
            existing_clear = any("straightforward" in m["statement"].lower() for m in active_memories)
            if not existing_clear:
                extracted_items.append({
                    "statement": "Maintain clear, straightforward, and transparent communication across all touchpoints.",
                    "category": "communication_style",
                    "status": "active",
                    "confidence": "High",
                    "supersedes_statement": None,
                    "reason": "Established baseline communication principle."
                })
                changes.append("Added style rule: Clear and straightforward communication")

        # Fallback if custom arbitrary text was entered
        if not extracted_items:
            clean_stmt = new_content.strip()
            if not clean_stmt.endswith('.'):
                clean_stmt += '.'
            extracted_items.append({
                "statement": clean_stmt,
                "category": "requirements" if ("must" in text_lower or "need" in text_lower or "require" in text_lower) else "preferences",
                "status": "active",
                "confidence": "High",
                "supersedes_statement": None,
                "reason": f"Captured directive from {source_type} on {date_str}."
            })
            changes.append(f"Added context directive: {clean_stmt[:60]}...")

        summary = f"Processed {source_type} ({date_str}). Extracted {len(extracted_items)} context item(s) with {len(superseded_ids)} superseded rule(s)."

        return {
            "summary": summary,
            "extracted_items": extracted_items,
            "superseded_existing_ids": superseded_ids,
            "changes_summary": changes,
            "ai_provider": "Demo AI Mode (Deterministic NLP Engine)"
        }

    @classmethod
    def _fallback_draft_generation(
        cls,
        client_name: str,
        active_memories: List[Dict[str, Any]],
        user_prompt: str,
        content_type: str
    ) -> Dict[str, Any]:
        prompt_lower = user_prompt.lower()
        context_used = []
        conflicts = []
        risks = []
        
        # 1. Detect Prohibited 'synergy'
        synergy_rule = next((m for m in active_memories if "synergy" in m["statement"].lower() and m.get("status") == "active"), None)
        has_synergy_violation = "synergy" in prompt_lower

        if has_synergy_violation and synergy_rule:
            conflicts.append({
                "rule_statement": synergy_rule["statement"],
                "rule_category": "Language Restriction",
                "rule_source": f"{synergy_rule.get('source_type', 'Meeting')} ({synergy_rule.get('date', 'July 2026')})",
                "rule_date": synergy_rule.get("date", "July 2026"),
                "conflict_reason": "The term 'synergy' was explicitly prohibited by client leadership in marketing/campaign materials.",
                "severity": "HIGH"
            })
            risks.append("Using prohibited corporate buzzword 'synergy' violates explicit client restriction from July 2026.")

        # 2. Detect Promotional Language vs Data-Driven Evidence
        promo_rule = next((m for m in active_memories if "promotional" in m["statement"].lower() and m.get("status") == "active"), None)
        data_rule = next((m for m in active_memories if ("data-driven" in m["statement"].lower() or "measurable" in m["statement"].lower()) and m.get("status") == "active"), None)
        
        is_promo_request = "promotional" in prompt_lower or "campaign" in prompt_lower or "pitch" in prompt_lower or "hype" in prompt_lower
        
        if is_promo_request:
            if promo_rule:
                conflicts.append({
                    "rule_statement": promo_rule["statement"],
                    "rule_category": "Language Restriction",
                    "rule_source": f"{promo_rule.get('source_type', 'Revision Notes')} ({promo_rule.get('date', 'September 2026')})",
                    "rule_date": promo_rule.get("date", "September 2026"),
                    "conflict_reason": "Client strictly restricts overly promotional language and unsubstantiated claims.",
                    "severity": "HIGH"
                })
                risks.append("Promotional tone violates the latest September 2026 revision guidelines.")

            if data_rule:
                conflicts.append({
                    "rule_statement": data_rule["statement"],
                    "rule_category": "Reporting Preference",
                    "rule_source": f"{data_rule.get('source_type', 'Meeting Transcript')} ({data_rule.get('date', 'August 2026')})",
                    "rule_date": data_rule.get("date", "August 2026"),
                    "conflict_reason": "Client currently mandates evidence-based, data-driven messaging supported by measurable results.",
                    "severity": "MEDIUM"
                })
                risks.append("Draft lacks empirical proof points mandated in the August 2026 update.")

        # Populate context items used
        for m in active_memories:
            context_used.append({
                "statement": m["statement"],
                "category": m["category"],
                "source_date": m.get("date", "2026"),
                "status": m.get("status", "active"),
                "relevance": "Active constraint applied during draft generation"
            })

        suggested_adjustment = (
            "1. Strip out the prohibited word 'synergy' and replace with concrete cross-functional collaboration metrics.\n"
            "2. Shift tone from promotional marketing claims to clear, evidence-backed statements supported by measurable performance results.\n"
            "3. Structure deliverables with transparent statistical validation and data-driven milestones."
        ) if conflicts else "Adhering to active client style guidelines and data-driven standards."

        # Generated context-compliant draft (Option A: Using generic measurable evidence wording without fabricating fake numbers)
        draft_content = f"""# Executive Introduction: Operational Collaboration & Performance Optimization
**Prepared for:** {client_name} Leadership Team
**Focus:** Cross-Departmental Integration & Measurable Efficiency Gains

---

### Executive Overview
To advance {client_name}'s strategic roadmap, our integrated operational model aligns cross-functional engineering, marketing, and account operations into a unified workflow. In strict adherence to {client_name}'s standards, this engagement focuses on **verifiable outputs, concrete cycle-time optimizations, and measurable performance results**.

### Evidence-Based Impact & Operational Standards
All initiative milestones are anchored on quantitative validation and empirical benchmarks:

- **Cross-Team Workflow Optimization:** Standardized communication protocols reduce operational friction and accelerate inter-departmental handoffs.
- **Deliverable Accuracy & Throughput:** Automated data validation pipelines maintain consistent reporting fidelity across all workstreams.
- **Data-Driven Governance:** Every performance review is backed by measurable results and statistical progress metrics, avoiding subjective estimates.

### Strategic Alignment with {client_name}
1. **Clear & Direct Communication:** Executive digests present transparent milestone progress and key decisions without promotional jargon.
2. **Evidence-Based Validation:** Strategic assertions are supported by empirical benchmarks and historical performance data.
3. **Structured Accountability:** Deliverables are tied directly to verifiable service-level agreements (SLAs).

---
*Generated in compliance with {client_name}'s active memory profile (strictly avoiding prohibited corporate buzzwords, avoiding promotional hype, and adhering to August/September data-driven reporting requirements).*"""

        return {
            "client_name": client_name,
            "prompt": user_prompt,
            "context_used": context_used,
            "conflicts_detected": conflicts,
            "suggested_adjustment": suggested_adjustment,
            "original_risks": risks,
            "draft_content": draft_content,
            "ai_provider": "Demo AI Mode (Deterministic Context Engine)"
        }

    @classmethod
    def _fallback_call_brief(
        cls,
        client_name: str,
        active_memories: List[Dict[str, Any]],
        timeline_events: List[Dict[str, Any]],
        objective: str
    ) -> Dict[str, Any]:
        return {
            "current_priorities": [
                f"Scale operational collaboration across {client_name}'s core business units.",
                "Mandate quantitative, data-driven reporting across all reviews.",
                "Ensure deliverable accuracy supported by empirical evidence and measurable benchmarks."
            ],
            "communication_preferences": [
                "Maintain clear, straightforward, and transparent communication across all touchpoints.",
                "Provide detailed, analytical reports containing measurable results and statistics.",
                "Deliver executive summaries backed by structured supporting data."
            ],
            "active_restrictions": [
                "Strict prohibition: NEVER use the word 'synergy' in any materials or verbal discussions.",
                "Avoid overly promotional, hyperbolic, or unverified marketing assertions.",
                "Do not present speculative claims without empirical evidence."
            ],
            "recent_changes": [
                "August 2026 Evolution: Reporting preference shifted from concise summary reports to detailed data-driven analytical reports.",
                "September 2026 Revision: Restriction added against promotional marketing rhetoric in favor of evidence-backed claims."
            ],
            "recent_feedback": [
                "Demanded measurable evidence for all campaign assertions in September 2026.",
                "Requested detailed statistical breakdown in regular progress reviews."
            ],
            "open_items": [
                "Review performance model incorporating empirical validation metrics.",
                "Confirm upcoming deliverable alignment with latest evidence standards."
            ],
            "mistakes_to_avoid": [
                "DO NOT use the word 'synergy' during the call.",
                "DO NOT use promotional marketing hype or unsubstantiated claims.",
                "DO NOT rely solely on brief high-level summaries without offering detailed data."
            ],
            "suggested_talking_points": [
                f"Begin by reviewing measurable progress milestones achieved since the previous update.",
                "Walk through the empirical metrics framework directly addressing the August reporting criteria.",
                "Confirm that all deliverables adhere strictly to the September evidence-based guidelines."
            ],
            "ai_provider": "Demo AI Mode (Executive Brief Engine)"
        }
