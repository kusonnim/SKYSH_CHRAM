import type { LearningMap } from "@/types";

export const staticLearningMap: LearningMap = {
  chapters: [
    {
      id: "volume",
      title: "Volume Reading",
      description: "Learn how to compare trading volume on real candles.",
      order: 1,
      stages: [
        {
          id: "volume-highest-candle",
          chapterId: "volume",
          title: "Find the highest volume",
          description: "Select the candle with the highest trading volume.",
          order: 1,
          status: "available",
          questionCount: 3,
        },
        {
          id: "volume-spike",
          chapterId: "volume",
          title: "Spot a volume spike",
          description: "Find a candle where volume suddenly expands.",
          order: 2,
          status: "locked",
          questionCount: 3,
        },
      ],
    },
  ],
};

