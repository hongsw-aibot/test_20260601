import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 한줄메모",
  description: "한 줄 메모를 AI(Claude)가 요약·태깅해주는 학습용 미니 앱",
};

// FOUC(flash of un-styled content) 방지: 하이드레이션 전에 동기적으로
// 저장된 테마 또는 시스템 선호를 읽어 <html>에 .dark 클래스를 부여한다.
const themeBootstrap = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="bg-white text-zinc-900 antialiased transition-colors dark:bg-[#0b0d12] dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
