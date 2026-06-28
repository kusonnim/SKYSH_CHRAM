import type { Chapter } from "@/types";
import { ChapterSection } from "./ChapterSection";

type LearningMapProps = {
  chapters: Chapter[];
  onSelectStage: (stageId: string) => void;
};

export function LearningMap({ chapters, onSelectStage }: LearningMapProps) {
  return (
    <div className="space-y-6">
      {chapters.map((chapter) => (
        <ChapterSection
          chapter={chapter}
          key={chapter.id}
          onSelectStage={onSelectStage}
        />
      ))}
    </div>
  );
}

