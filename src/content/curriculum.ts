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
          title: "Find the strongest candle body",
          description: "Select the candle with the largest price body.",
          order: 1,
          status: "locked",
          questionCount: 3,
        },
      ],
    },
  ],
};
export const StageDatasets: Record<string, string[]> = {
  "volume-highest-candle": [
    "2021-05-20T00:00:00Z", // 부처빔 다음날 (부처빔 포함 30일)
    "2022-11-10T00:00:00Z", // FTX 사태 
    "2024-03-06T00:00:00Z", // 24년 초 거래량 폭발
  ],
  "volume-spike": [
    "2021-02-09T00:00:00Z", // 테슬라 비트코인 매수 발표
    "2023-01-15T00:00:00Z", // 23년 초반 반등 스파이크
    "2023-10-25T00:00:00Z", // 블랙록 ETF 스파이크
  ],
  "longest-body-candle": [
    "2021-05-20T00:00:00Z", // 부처빔 (긴 음봉)
    "2024-02-29T00:00:00Z", // 급상승 (긴 양봉)
    "2022-06-14T00:00:00Z", // 셀시우스 폭락 (긴 음봉)
  ],
};
