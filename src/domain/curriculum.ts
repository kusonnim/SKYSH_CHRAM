import type { LearningMap, Stage } from "@/types";

export function getStagesFromLearningMap(learningMap: LearningMap): Stage[] {
  return learningMap.chapters.flatMap((chapter) => chapter.stages);
}

export function findStageById(
  learningMap: LearningMap,
  stageId: string,
): Stage | null {
  return (
    getStagesFromLearningMap(learningMap).find((stage) => stage.id === stageId) ??
    null
  );
}

