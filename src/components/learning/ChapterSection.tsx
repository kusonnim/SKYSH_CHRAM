import type { Chapter } from "@/types";
import { StageNode } from "./StageNode";

type ChapterSectionProps = {
  chapter: Chapter;
  onSelectStage: (stageId: string) => void;
};

export function ChapterSection({
  chapter,
  onSelectStage,
}: ChapterSectionProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">{chapter.title}</h2>
      <p className="mt-1 text-sm text-slate-600">{chapter.description}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {chapter.stages.map((stage) => (
          <StageNode key={stage.id} onSelect={onSelectStage} stage={stage} />
        ))}
      </div>
    </section>
  );
}

