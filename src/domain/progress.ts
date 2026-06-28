import type { Stage, StageStatus, LearningMap } from "@/types";

export type MockProgress = Record<string, StageStatus>;

export function applyMockProgress(
  stages: Stage[],
  progress: MockProgress,
): Stage[] {
  return stages.map((stage) => ({
    ...stage,
    status: progress[stage.id] ?? stage.status,
  }));
}

export function getNextStageId(learningMap: LearningMap, currentStageId: string): string | null {
  const allStages = [...learningMap.chapters]
    .sort((a, b) => a.order - b.order)
    .flatMap((chapter) =>
      [...chapter.stages].sort((a, b) => a.order - b.order),
    );

  const currentIndex = allStages.findIndex((stage) => stage.id === currentStageId);

  if (currentIndex === -1 || currentIndex === allStages.length - 1) {
    return null;
  }

  return allStages[currentIndex + 1].id;
}

