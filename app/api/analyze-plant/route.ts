import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rate-limit";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are PlantSoul, an expert botanist with a playful personality who analyzes plant health from photos.

Analyze the plant image and respond with a JSON object in exactly this shape:
{
  "healthScore": <integer 0-100>,
  "issues": <string array of specific observed issues, empty if none>,
  "personality": <one word from: dramatic | resilient | needy | chill | anxious | thriving | mysterious | stubborn>,
  "personalityDescription": <2-3 fun sentences describing the plant's "mood" and character based on its appearance>,
  "careRecommendations": <string array of 3-5 actionable care tips>
}

Health score guide: 90-100 = thriving, 70-89 = healthy, 50-69 = okay, 30-49 = struggling, 0-29 = critical.

For issues, be specific: e.g. "yellowing lower leaves", "brown leaf tips", "root bound signs", "powdery mildew on foliage".
For personality, match the plant's visual energy: wilting/drooping = dramatic or needy; lush/full = thriving or chill; spotty/stressed = anxious.
For care recommendations, be concrete: "Water every 5-7 days, allowing top inch of soil to dry between waterings" not just "water more".

Return ONLY valid JSON. No markdown, no explanation outside the JSON.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const limit = rateLimit(ip);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let imageUrl: string;
  try {
    const body = await req.json();
    imageUrl = body?.imageUrl;
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Accept base64 data URLs or https URLs
    const isDataUrl = imageUrl.startsWith("data:image/");
    const isHttpsUrl = imageUrl.startsWith("https://");
    if (!isDataUrl && !isHttpsUrl) {
      return NextResponse.json(
        { error: "imageUrl must be a base64 data URL or an https URL" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 800,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "high" },
            },
            {
              type: "text",
              text: "Analyze this plant and return the JSON response.",
            },
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) {
      return NextResponse.json({ error: "No response from vision model" }, { status: 502 });
    }

    let parsed: {
      healthScore: number;
      issues: string[];
      personality: string;
      personalityDescription: string;
      careRecommendations: string[];
    };

    try {
      // Strip markdown code fences if the model wraps anyway
      const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(json);
    } catch {
      console.error("Failed to parse model response:", raw);
      return NextResponse.json({ error: "Failed to parse plant analysis" }, { status: 502 });
    }

    // Validate shape
    if (
      typeof parsed.healthScore !== "number" ||
      !Array.isArray(parsed.issues) ||
      typeof parsed.personality !== "string" ||
      typeof parsed.personalityDescription !== "string" ||
      !Array.isArray(parsed.careRecommendations)
    ) {
      return NextResponse.json({ error: "Unexpected analysis format" }, { status: 502 });
    }

    // Clamp health score to 0-100
    parsed.healthScore = Math.max(0, Math.min(100, Math.round(parsed.healthScore)));

    return NextResponse.json(parsed);
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      console.error("OpenAI API error:", err.status, err.message);
      if (err.status === 429) {
        return NextResponse.json({ error: "AI service is busy. Try again shortly." }, { status: 503 });
      }
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }
    console.error("Unexpected error in /api/analyze-plant:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
