# AI 한줄메모

Week13 배포 실습용 미니 웹앱. 한 줄 메모를 적으면 AI(Claude)가 **요약 한 줄 + 태그 2~3개**를 붙여 Supabase 에 저장합니다.

전체 학습 계획은 [`docs/Week13_실습프로젝트_계획.md`](docs/Week13_실습프로젝트_계획.md) 참고.

---

## 빠르게 시작 (로컬)

```bash
npm install
copy .env.example .env.local   # (PowerShell: Copy-Item .env.example .env.local)
# .env.local 의 값을 채워 넣으세요
npm run dev
```

브라우저에서 http://localhost:3000 접속.

---

## 환경변수 (`.env.local`)

| 키 | 어디서 받나 | 비어 있을 때 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`     | Supabase → Project Settings → API | 메모 저장/조회 시 500 에러 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 위와 같음                          | 메모 저장/조회 시 500 에러 |
| `ANTHROPIC_API_KEY`            | https://console.anthropic.com    | AI 요약/태깅이 **더미값**으로 동작 (앱은 정상) |

> **주의**: `.env.local` 은 `.gitignore` 로 막혀 있어 GitHub 에 절대 올라가지 않습니다. 배포 시에는 Vercel 대시보드의 Environment Variables 에 같은 키를 다시 넣어주세요.

---

## Supabase 테이블 만들기

1. Supabase 대시보드에서 새 프로젝트 생성
2. 좌측 메뉴 → **SQL Editor**
3. [`supabase/schema.sql`](supabase/schema.sql) 내용을 붙여넣고 **Run**
4. 좌측 메뉴 → **Settings → API** 에서 `URL`, `anon public` 키 복사 → `.env.local` 에 붙여넣기

---

## 배포 (Vercel)

자세한 단계별 가이드는 다음 문서에서 다룹니다:
- 계획: [`docs/Week13_실습프로젝트_계획.md`](docs/Week13_실습프로젝트_계획.md)
- (예정) Step별 핸즈온: `docs/Week13_실습_Step별_가이드.md`

요약:

```
1. GitHub 에 Push
2. Vercel → Add New Project → 해당 Repo 선택
3. Settings → Environment Variables 에 위 3개 키 입력
4. Deploy
5. https://<프로젝트>.vercel.app 발급 → 친구에게 공유
```

---

## 디렉토리

```
.
├─ app/
│  ├─ page.tsx              # 1페이지 UI (클라이언트)
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ api/memos/route.ts    # GET 목록 / POST 생성 (서버)
├─ lib/
│  ├─ supabase.ts           # Supabase 클라이언트 (lazy 초기화)
│  └─ ai.ts                 # Claude 호출 + 더미 폴백
├─ supabase/
│  └─ schema.sql            # 테이블 + RLS 정책
├─ docs/                    # 강의/실습 문서
├─ .env.example
└─ package.json
```

---

## 스택

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres + RLS)
- **Anthropic Claude** (`claude-haiku-4-5`) — 키 없으면 더미 폴백
- **Vercel** 배포 대상
