import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 한줄메모",
  description: "한 줄 메모를 AI(Claude)가 요약·태깅해주는 학습용 미니 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
