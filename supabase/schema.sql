-- AI 한줄메모 — Supabase 테이블 스키마
-- 사용법: Supabase Dashboard → SQL Editor 에 붙여넣고 Run.

create table if not exists memos (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  ai_summary  text,
  ai_tags     text[],
  created_at  timestamptz not null default now()
);

create index if not exists memos_created_at_desc_idx
  on memos (created_at desc);

-- ── Row Level Security ────────────────────────────────────
-- 학습용: 누구나 읽기/쓰기 허용.
-- 실제 서비스라면 auth.uid() 기반 정책으로 제한하세요.

alter table memos enable row level security;

drop policy if exists "anyone can read"   on memos;
drop policy if exists "anyone can insert" on memos;

create policy "anyone can read"
  on memos for select
  using (true);

create policy "anyone can insert"
  on memos for insert
  with check (true);
