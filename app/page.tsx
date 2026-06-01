"use client";

import { useEffect, useState } from "react";

type Memo = {
  id: string;
  content: string;
  ai_summary: string | null;
  ai_tags: string[] | null;
  created_at: string;
};

export default function Home() {
  const [content, setContent] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMemos() {
    try {
      const res = await fetch("/api/memos", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMemos(data.memos ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    loadMemos();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(await res.text());
      setContent("");
      await loadMemos();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">AI 한줄메모</h1>
        <p className="mt-2 text-sm text-zinc-400">
          한 줄을 적으면 AI(Claude)가 요약 한 줄 + 태그 2~3개를 붙여 저장합니다.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘 배운 것을 한 줄로..."
          maxLength={200}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-50"
        >
          {loading ? "저장 중…" : "저장"}
        </button>
      </form>

      {error && (
        <p className="mt-3 whitespace-pre-wrap text-sm text-red-400">
          ⚠ {error}
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-zinc-400">📝 최근 메모</h2>
        <ul className="mt-3 space-y-3">
          {memos.length === 0 && !error && (
            <li className="text-sm text-zinc-500">아직 메모가 없습니다.</li>
          )}
          {memos.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <p className="text-sm">{m.content}</p>
              {m.ai_summary && (
                <p className="mt-2 text-xs text-zinc-400">
                  ↳ AI 요약:{" "}
                  <span className="text-zinc-300">{m.ai_summary}</span>
                </p>
              )}
              {m.ai_tags && m.ai_tags.length > 0 && (
                <p className="mt-1 text-xs text-zinc-400">
                  ↳ 태그:{" "}
                  <span className="text-zinc-300">
                    {m.ai_tags.map((t) => `#${t}`).join(" ")}
                  </span>
                </p>
              )}
              <p className="mt-2 text-[10px] text-zinc-600">
                {new Date(m.created_at).toLocaleString("ko-KR")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 text-xs text-zinc-600">
        Week13 배포 실습 · Next.js + Vercel + Supabase
      </footer>
    </main>
  );
}
