"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LearningMap } from "@/components/learning";
import type { LearningMap as LearningMapType } from "@/types";

export default function DashboardPage() {
  const [learningMap, setLearningMap] = useState<LearningMapType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/learning-map")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLearningMap(data.data);
        } else {
          throw new Error(data.error?.message ?? "Unable to load learning map.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load the learning map. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSelectStage(stageId: string) {
    router.push(`/stage/${stageId}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">Loading your learning map...</p>
        </div>
      </div>
    );
  }

  if (error || !learningMap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm text-center">
          <p className="text-sm font-semibold text-red-600">{error ?? "Failed to load the learning map."}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 px-6 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Learning Path</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Dashboard</h1>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            Real BTC volume lessons
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Select a stage below to open a chart-based question and build your candle-reading skills.
        </p>
      </section>

      <LearningMap chapters={learningMap.chapters} onSelectStage={handleSelectStage} />
    </main>
  );
}
