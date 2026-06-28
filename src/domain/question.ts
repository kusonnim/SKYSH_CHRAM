import type { Candle, Question } from "@/types";

export function findMaxVolumeCandleIndex(candles: Candle[]): number {
  if (candles.length === 0) {
    return -1;
  }

  return candles.reduce(
    (maxVolumeIndex, candle, index) =>
      candle.volume > candles[maxVolumeIndex].volume ? index : maxVolumeIndex,
    0,
  );
}

export function createMaxVolumeQuestion(candles: Candle[]): Question {
  return {
    id: "today-volume-max",
    type: "select_candle",
    market: "KRW-BTC",
    timeframe: "day",
    prompt: "Select the candle with the highest trading volume.",
    candles,
    answer: {
      correctIndex: findMaxVolumeCandleIndex(candles),
    },
  };
}
