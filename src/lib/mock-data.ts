import type { AnswerResult, Candle, Question } from "@/types";

export const mockCandles: Candle[] = Array.from({ length: 30 }, (_, index) => ({
  time: `2026-06-${String(index + 1).padStart(2, "0")}`,
  open: 100 + index,
  high: 108 + index,
  low: 96 + index,
  close: 104 + index,
  volume: index === 12 ? 4200 : 1000 + index * 75,
}));

export const mockQuestion: Question = {
  id: "today-volume-max",
  type: "select_candle",
  market: "KRW-BTC",
  timeframe: "day",
  prompt: "Select the candle with the highest trading volume.",
  candles: mockCandles,
  answer: {
    correctIndex: 12,
  },
};

export const mockAnswerResult: AnswerResult = {
  isCorrect: false,
  score: 0,
  feedback:
    "Mock feedback: compare the volume bars again before the real grader is implemented.",
};

