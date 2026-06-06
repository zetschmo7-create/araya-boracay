import type { Lead, LeadAnalysisResult } from "./types";

const ARAYA_SYSTEM_PROMPT = `You are ARAYA Boracay's luxury owner acquisition assistant.

ARAYA positioning:
- Quiet luxury tropical hospitality in Boracay, Philippines
- Premium property presentation and professional photography
- Airbnb and direct booking optimisation
- Guest communication, cleaning coordination, viewings, negotiations, contracts
- Full operational management for foreign condo/villa owners and investors
- 20% commission per booking — effortless ownership

Prioritise leads with:
- Premium property potential (ocean views, luxury interiors, high nightly rate potential)
- Weak photography or listing copy
- Poor guest communication in reviews
- Self-managed appearance
- Foreign/remote owner likelihood
- Underperforming listings despite strong assets

Tone for all outreach:
- Calm, premium, discreet, intelligent, bespoke
- Hospitality-led, never spammy or salesy
- Personalised to the specific property

Respond ONLY with valid JSON matching the requested schema. No markdown fences.`;

function buildLeadContext(lead: Lead): string {
  const fields: [string, string | number | null | undefined][] = [
    ["Property Name", lead.property_name],
    ["Owner Name", lead.owner_name],
    ["Contact Email", lead.contact_email],
    ["Contact Phone", lead.contact_phone],
    ["WhatsApp", lead.whatsapp],
    ["Instagram", lead.instagram],
    ["Source Platform", lead.source_platform],
    ["Listing URL", lead.listing_url],
    ["Listing Text", lead.listing_text],
    ["Property Type", lead.property_type],
    ["Location", lead.location],
    ["Bedrooms", lead.bedrooms],
    ["Nightly Rate", lead.nightly_rate],
    ["Rating", lead.rating],
    ["Review Count", lead.review_count],
    ["Property Description", lead.property_description],
    ["Notes", lead.notes],
    ["Presentation Quality", lead.presentation_quality],
    ["Photography Quality", lead.photography_quality],
    ["Guest Review Issues", lead.guest_review_issues],
    ["Self-Managed Likelihood", lead.self_managed_likelihood],
  ];

  return fields
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export async function analyseLead(lead: Lead): Promise<LeadAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const userPrompt = `Analyse this potential Boracay villa/condo owner lead for ARAYA's luxury property management service.

LEAD DATA:
${buildLeadContext(lead)}

Return JSON with exactly these fields:
{
  "summary": "2-3 sentence lead summary",
  "araya_fit_score": <integer 0-100>,
  "fit_rationale": "Why this is or isn't a strong ARAYA lead",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "presentation_weaknesses": "Listing/photography/presentation gaps",
  "operational_weaknesses": "Hospitality/operational gaps from reviews or signals",
  "opportunity": "Estimated opportunity for ARAYA",
  "outreach_angle": "Suggested personalised outreach angle",
  "email_draft": "Full personalised outreach email (subject line on first line as 'Subject: ...')",
  "whatsapp_draft": "Short WhatsApp or Instagram DM (under 300 chars)",
  "follow_up_1": "First follow-up message if no reply in 5 days",
  "follow_up_2": "Second follow-up message if no reply in 12 days"
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ARAYA_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const parsed = JSON.parse(content) as LeadAnalysisResult;

  if (
    typeof parsed.araya_fit_score !== "number" ||
    parsed.araya_fit_score < 0 ||
    parsed.araya_fit_score > 100
  ) {
    throw new Error("Invalid fit score from AI");
  }

  return parsed;
}
