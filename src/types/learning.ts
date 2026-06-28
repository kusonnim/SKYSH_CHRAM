import type { Question } from "./api";
import type { Stage } from "./curriculum";

export type StageSession = {
  stage: Stage;
  questions: Question[];
};

export type StageCompletionResult = {
  stageId: string;
  status: "completed";
};
