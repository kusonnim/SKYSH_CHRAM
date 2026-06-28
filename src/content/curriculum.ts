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
    {
      id: "momentum",
      title: "Momentum Reading",
      description: "Learn how to analyze price momentum using candle bodies.",
      order: 2,
      stages: [
        {
          id: "longest-body-candle",
          chapterId: "momentum",
          title: "장대양봉/음봉 찾기",
          description: "매수세나 매도세가 가장 강했던, 몸통이 가장 긴 캔들을 찾아보세요.",
          order: 1,
          status: "available",
          questionCount: 3,
        },
      ],
    },
  ],
};

