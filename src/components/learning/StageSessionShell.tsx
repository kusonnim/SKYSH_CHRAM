import type { Stage } from "@/types";
import { StageProgress } from "./StageProgress";
import { StageStatusBadge } from "./StageStatusBadge";

type StageSessionShellProps = {
  stage: Stage;
  currentQuestionIndex: number;
  totalQuestions: number;
  children: React.ReactNode;
};

export function StageSessionShell({
  stage,
  currentQuestionIndex,
  totalQuestions,
  children,
}: StageSessionShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <header className="mb-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500">
              Stage
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              {stage.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {stage.description}
            </p>
          </div>
          <StageStatusBadge status={stage.status} />
        </div>
        <StageProgress
          current={currentQuestionIndex + 1}
          total={totalQuestions}
        />
      </header>
      {children}
    </main>
  );
}

