"use client";

import { useEffect, useState } from "react";
import { LearningMap } from "@/components/learning";
import { Header } from "@/components/auth";
import type {
  LearningMap as LearningMapType,
  PortfolioSummary,
} from "@/types";

export default function DashboardPage() {
  const [learningMap, setLearningMap] = useState<LearningMapType | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [learningMapResponse, portfolioResponse] = await Promise.all([
          fetch("/api/learning-map"),
          fetch("/api/portfolio"),
        ]);
        const [learningMapData, portfolioData] = await Promise.all([
          learningMapResponse.json(),
          portfolioResponse.json(),
        ]);

        if (!learningMapData.success) {
          throw new Error(
            learningMapData.error?.message ?? "Unable to load learning map.",
          );
        }

        setLearningMap(learningMapData.data);
        if (portfolioData.success) {
          setPortfolio(portfolioData.data);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load the learning map. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#c4c6d5] border-t-[#344e5d]" />
          <p className="mt-4 text-sm text-[#434653]">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (error || !learningMap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6">
        <div className="rounded-xl border border-[#c4c6d5] bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#ba1a1a]">
            {error ?? "Failed to load the learning map."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#1a1b22]">
      <Header />
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center px-4 pb-28 pt-8">
        <section className="mb-8 w-full rounded-xl border border-[#c4c6d5]/30 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#747685]">
            Available Points
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-bold text-[#1a1b22]">
                {(portfolio?.points ?? 0).toLocaleString()} P
              </p>
              <p className="mt-1 text-sm text-[#434653]">
                Earn points by completing stages, then invest them in BTC.
              </p>
            </div>
            <a
              className="rounded-lg bg-[#344e5d] px-4 py-2 text-sm font-bold text-white"
              href="/portfolio"
            >
              Invest
            </a>
          </div>
        </section>
        <LearningMap chapters={learningMap.chapters} />
      </main>
      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-[#c4c6d5]/40 bg-[#faf8ff]/85 px-6 shadow-lg backdrop-blur-md">
        <a
          className="flex flex-col items-center justify-center rounded-lg bg-[#344e5d]/10 px-4 py-2 text-[#344e5d] active:scale-95"
          href="/dashboard"
        >
          <span className="text-lg font-bold">L</span>
          <span className="text-xs font-bold uppercase tracking-wide">Learn</span>
        </a>
        <a
          className="flex flex-col items-center justify-center px-4 py-2 text-[#434653] transition-colors hover:text-[#344e5d] active:scale-95"
          href="/portfolio"
        >
          <span className="text-lg font-bold">B</span>
          <span className="text-xs font-bold uppercase tracking-wide">Invest</span>
        </a>
        <a
          className="flex flex-col items-center justify-center px-4 py-2 text-[#434653] transition-colors hover:text-[#344e5d] active:scale-95"
          href="/profile"
        >
          <span className="text-lg font-bold">P</span>
          <span className="text-xs font-bold uppercase tracking-wide">Profile</span>
        </a>
      </nav>
    </div>
  );
}
