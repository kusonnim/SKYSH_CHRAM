import type { Chapter } from "@/types";
import { StageNode } from "./StageNode";

type ChapterSectionProps = {
  chapter: Chapter;
};

export function ChapterSection({ chapter }: ChapterSectionProps) {
  const completedCount = chapter.stages.filter(
    (stage) => stage.status === "completed",
  ).length;
  const totalCount = Math.max(chapter.stages.length, 1);
  const progress = (completedCount / totalCount) * 100;

  return (
    <section className="w-full">
      <div className="mb-12 rounded-xl border border-[#c4c6d5]/30 bg-[#ededf7] p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-[#344e5d]">
              Chapter {chapter.order}
            </span>
            <h2 className="mt-1 text-2xl font-bold text-[#1a1b22]">
              {chapter.title}
            </h2>
          </div>
          <span className="text-sm font-medium text-[#747685]">
            {completedCount}/{chapter.stages.length} stages
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e2e2eb]">
          <div
            className="h-full rounded-full bg-[#344e5d] transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center gap-12 py-8">
        <div className="absolute bottom-0 top-0 z-0 w-1 -translate-x-1/2 rounded-full bg-[#e4e1ed] left-1/2" />
        {chapter.stages.map((stage, index) => (
          <StageNode
            index={index}
            key={stage.id}
            stage={stage}
            totalStages={chapter.stages.length}
          />
        ))}
      </div>
    </section>
  );
}
