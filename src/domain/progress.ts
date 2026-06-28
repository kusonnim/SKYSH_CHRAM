import type { Stage, StageStatus } from "@/types";

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

