import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { enrichMemo } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("memos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ memos: data ?? [] });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { content?: unknown }
      | null;
    const content =
      typeof body?.content === "string" ? body.content.trim() : "";
    if (!content) {
      return NextResponse.json(
        { error: "content가 필요합니다." },
        { status: 400 }
      );
    }
    if (content.length > 500) {
      return NextResponse.json(
        { error: "메모는 500자 이내로 작성하세요." },
        { status: 400 }
      );
    }

    const { summary, tags } = await enrichMemo(content);

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("memos")
      .insert({ content, ai_summary: summary, ai_tags: tags })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ memo: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
