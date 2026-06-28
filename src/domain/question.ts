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

export function findLongestBodyCandleIndex(candles: Candle[]): number {
  if (candles.length === 0) {
    return -1;
  }

  return candles.reduce(
    (longestBodyIndex, candle, index) => {
      const currentBodySize = Math.abs(candle.open - candle.close);
      const longestBodySize = Math.abs(candles[longestBodyIndex].open - candles[longestBodyIndex].close);
      return currentBodySize > longestBodySize ? index : longestBodyIndex;
    },
    0,
  );
}

export function createLongestBodyQuestion(candles: Candle[]): Question {
  return {
    id: "longest-body-candle",
    type: "select_candle",
    stageId: "longest-body-candle",
    market: "KRW-BTC",
    timeframe: "day",
    prompt: "가장 몸통이 긴 캔들을 선택하세요.",
    candles,
    answer: {
      correctIndex: findLongestBodyCandleIndex(candles),
    },
  };
}
