import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chartine",
  description: "Learn to read charts using real market data.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
