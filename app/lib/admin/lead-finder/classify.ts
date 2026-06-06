import type { LeadFinderClassification, LeadFinderEntityType } from "./types";
import type { LeadPriority } from "../types";

interface ClassifyInput {
  title: string;
  url: string;
  snippet?: string;
  emails: string[];
  phones: string[];
  evidence: string;
  sourcePlatform: string;
}

export async function classifyLeadFinderResult(
  input: ClassifyInput,
): Promise<LeadFinderClassification> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const prompt = `Analyse this publicly available Boracay property web result for ARAYA luxury villa/condo management lead potential.

PAGE TITLE: ${input.title}
URL: ${input.url}
SOURCE PLATFORM: ${input.sourcePlatform}
SNIPPET: ${input.snippet ?? "N/A"}
PUBLIC EMAILS FOUND: ${input.emails.join(", ") || "none"}
PUBLIC PHONES FOUND: ${input.phones.join(", ") || "none"}
EVIDENCE EXCERPT: ${input.evidence || "none"}

Classify entity_type as one of:
- villa_owner_operator
- condo_owner_operator
- real_estate_agent
- property_manager
- hotel_resort
- irrelevant

Return JSON:
{
  "entity_type": "...",
  "araya_fit_score": 0-100,
  "priority": "low" | "medium" | "high",
  "fit_rationale": "why this is or isn't a strong ARAYA lead",
  "outreach_angle": "suggested personalised outreach angle (no email body yet)",
  "page_summary": "2 sentence summary",
  "property_name": "business or property name or null",
  "source_platform": "${input.sourcePlatform}"
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You classify Boracay property leads for ARAYA luxury management. Respond only with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI classification failed: ${res.status}`);
  }

  const json = await res.json();
  const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");

  const entity_type = parsed.entity_type as LeadFinderEntityType;
  const priority = parsed.priority as LeadPriority;

  return {
    entity_type: entity_type ?? "irrelevant",
    araya_fit_score: Math.min(100, Math.max(0, Number(parsed.araya_fit_score) || 0)),
    priority: priority ?? "medium",
    fit_rationale: parsed.fit_rationale ?? "",
    outreach_angle: parsed.outreach_angle ?? "",
    page_summary: parsed.page_summary ?? "",
    property_name: parsed.property_name ?? null,
    source_platform: parsed.source_platform ?? input.sourcePlatform,
  };
}

export async function generateFinderOutreachDraft(input: {
  property_name: string | null;
  page_title: string | null;
  source_url: string;
  contact_email: string | null;
  page_summary: string | null;
  outreach_angle: string | null;
  fit_rationale: string | null;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Write a calm, premium, discreet outreach email for ARAYA Boracay luxury property management. Subject line first as 'Subject: ...'. Draft only — requires human approval.",
        },
        {
          role: "user",
          content: `Property: ${input.property_name ?? input.page_title ?? "Boracay property"}
URL: ${input.source_url}
Email: ${input.contact_email ?? "unknown"}
Summary: ${input.page_summary ?? ""}
Angle: ${input.outreach_angle ?? ""}
Rationale: ${input.fit_rationale ?? ""}`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI draft failed: ${res.status}`);

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}
