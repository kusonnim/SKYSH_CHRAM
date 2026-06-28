import type { Chapter } from "@/types";
import { ChapterSection } from "./ChapterSection";

type LearningMapProps = {
  chapters: Chapter[];
};

export function LearningMap({ chapters }: LearningMapProps) {
  if (chapters.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-20">
      {[...chapters]
        .sort((a, b) => a.order - b.order)
        .map((chapter) => (
          <ChapterSection chapter={chapter} key={chapter.id} />
        ))}
    </div>
  );
}
