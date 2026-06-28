import type { Chapter } from "@/types";
import { ChapterSection } from "./ChapterSection";

type LearningMapProps = {
  chapters: Chapter[];
};

export function LearningMap({ chapters }: LearningMapProps) {
  const activeChapter = chapters[0];

  if (!activeChapter) {
    return null;
  }

  return (
    <div className="w-full space-y-12">
      <ChapterSection chapter={activeChapter} />
    </div>
  );
}

