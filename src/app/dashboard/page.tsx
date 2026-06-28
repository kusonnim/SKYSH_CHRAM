"use client";

import { CandleChart } from "@/components/CandleChart";
import { FeedbackBox } from "@/components/FeedbackBox";
import { QuestionPanel } from "@/components/QuestionPanel";
import { mockAnswerResult, mockQuestion } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
      <section>
        <CandleChart
          candles={mockQuestion.candles}
          selectedIndex={null}
          onSelectCandle={() => undefined}
        />
      </section>
      <aside className="space-y-4">
        <QuestionPanel
          prompt={mockQuestion.prompt}
          selectedIndex={null}
          onSubmit={() => undefined}
        />
        <FeedbackBox result={mockAnswerResult} />
      </aside>
    </main>
  );
}
