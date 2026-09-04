import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, PRD } from "@/types/prd";
import { buildSystemPrompt } from "@/lib/prompts";
import { MOCK_PRD } from "@/lib/mock-prd";

const DEMO_MODE = !process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  const body: GenerateRequest = await req.json();

  if (!body.note || body.note.trim().length < 10) {
    return NextResponse.json(
      { error: "Note must be at least 10 characters." },
      { status: 400 }
    );
  }

  // Demo mode — return mock PRD with a simulated delay
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const mockPRD: PRD = {
      ...MOCK_PRD,
      metadata: {
        ...MOCK_PRD.metadata,
        generatedAt: new Date().toISOString(),
        tone: body.tone,
        audience: body.audience,
        inputLength: body.note.length,
      },
    };
    return NextResponse.json({ prd: mockPRD, demo: true });
  }

  // Live Claude mode
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: buildSystemPrompt(body),
      messages: [
        {
          role: "user",
          content: `Here is the founder's raw note. Transform it into a complete PRD:\n\n---\n${body.note}\n---`,
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let prd: PRD;
    try {
      prd = JSON.parse(rawText);
    } catch {
      // Claude sometimes wraps in ```json — strip it
      const cleaned = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      prd = JSON.parse(cleaned);
    }

    return NextResponse.json({ prd, demo: false });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "Failed to generate PRD. Check your API key and try again." },
      { status: 500 }
    );
  }
}
