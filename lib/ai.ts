import Anthropic from "@anthropic-ai/sdk";

export type Enrichment = {
  summary: string;
  tags: string[];
};

const MODEL = "claude-haiku-4-5";

export async function enrichMemo(content: string): Promise<Enrichment> {
  const key = process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return dummyEnrichment(content);
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content:
            `다음 한 줄 메모를 읽고 JSON 으로만 답하세요. 다른 텍스트 금지.\n` +
            `형식: { "summary": "한국어 한 줄 요약(20자 이내)", "tags": ["태그1","태그2","태그3"] }\n\n` +
            `메모: ${content}`,
        },
      ],
    });

    const text = res.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();

    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);

    const summary = String(parsed.summary ?? "").slice(0, 80);
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags
          .slice(0, 5)
          .map((t: unknown) => String(t).replace(/^#/, "").slice(0, 20))
          .filter((t: string) => t.length > 0)
      : [];

    return { summary, tags };
  } catch (e) {
    console.error("[ai] enrichMemo failed, falling back to dummy:", e);
    return dummyEnrichment(content);
  }
}

function dummyEnrichment(content: string): Enrichment {
  return {
    summary: content.length > 30 ? content.slice(0, 27) + "…" : content,
    tags: ["dummy", "no-api-key"],
  };
}
