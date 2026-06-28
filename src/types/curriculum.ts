export type StageStatus = "locked" | "available" | "completed";

export type Stage = {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  order: number;
  status: StageStatus;
  questionCount: number;
};

export type Chapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  stages: Stage[];
};

export type LearningMap = {
  chapters: Chapter[];
};

