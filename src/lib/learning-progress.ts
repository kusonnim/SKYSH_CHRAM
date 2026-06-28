import { getNextStageId } from "@/domain/progress";
import type { LearningMap, Stage } from "@/types";

const STORAGE_KEY = "skysh-chram-learning-progress-v2";

type StoredProgress = {
  completedStageIds: string[];
};

export function readProgress(): StoredProgress {
  if (typeof window === "undefined") {
    return { completedStageIds: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { completedStageIds: [] };
    }

    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      completedStageIds: Array.isArray(parsed.completedStageIds)
        ? parsed.completedStageIds
        : [],
    };
  } catch {
    return { completedStageIds: [] };
  }
}

function writeProgress(progress: StoredProgress) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getOrderedStages(learningMap: LearningMap): Stage[] {
  return [...learningMap.chapters]
    .sort((a, b) => a.order - b.order)
    .flatMap((chapter) =>
      [...chapter.stages].sort((a, b) => a.order - b.order),
    );
}

export function markStageCompleted(learningMap: LearningMap, stageId: string) {
  const progress = readProgress();
  const completedStageIds = new Set(progress.completedStageIds);
  const nextStageId = getNextStageId(learningMap, stageId);

  completedStageIds.add(stageId);
  writeProgress({ completedStageIds: [...completedStageIds] });

  return nextStageId;
}

export function applyStoredProgress(learningMap: LearningMap): LearningMap {
  const completedStageIds = new Set(readProgress().completedStageIds);
  const orderedStages = getOrderedStages(learningMap);
  const availableStageIds = new Set(
    orderedStages
      .filter((stage, index) => {
        if (index === 0) {
          return true;
        }

        const previousStage = orderedStages[index - 1];
        return previousStage ? completedStageIds.has(previousStage.id) : false;
      })
      .map((stage) => stage.id),
  );

  return {
    chapters: learningMap.chapters.map((chapter) => ({
      ...chapter,
      stages: chapter.stages.map((stage) => {
        if (completedStageIds.has(stage.id)) {
          return { ...stage, status: "completed" };
        }

        if (availableStageIds.has(stage.id)) {
          return { ...stage, status: "available" };
        }

        return { ...stage, status: "locked" };
      }),
    })),
  };
}
