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

export function applyCompletedStageProgress(
  learningMap: LearningMap,
  completedStageIds: string[],
): LearningMap {
  const completedIds = new Set(completedStageIds);
  const orderedStages = [...learningMap.chapters]
    .sort((a, b) => a.order - b.order)
    .flatMap((chapter) =>
      [...chapter.stages].sort((a, b) => a.order - b.order),
    );
  const availableIds = new Set(
    orderedStages
      .filter((stage, index) => {
        if (index === 0) {
          return true;
        }

        const previousStage = orderedStages[index - 1];
        return previousStage ? completedIds.has(previousStage.id) : false;
      })
      .map((stage) => stage.id),
  );

  return {
    chapters: learningMap.chapters.map((chapter) => ({
      ...chapter,
      stages: chapter.stages.map((stage) => {
        if (completedIds.has(stage.id)) {
          return { ...stage, status: "completed" };
        }

        if (availableIds.has(stage.id)) {
          return { ...stage, status: "available" };
        }

        return { ...stage, status: "locked" };
      }),
    })),
  };
}

