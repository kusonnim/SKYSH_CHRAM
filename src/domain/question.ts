import type { Candle, Question } from "@/types";

export function findMaxVolumeCandleIndex(candles: Candle[]): number {
  if (candles.length === 0) return -1;
  let maxIndex = 0;
  let maxVolume = candles[0].volume;
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].volume > maxVolume) {
      maxVolume = candles[i].volume;
      maxIndex = i;
    }
  }
  return maxIndex;
}

export function createMaxVolumeQuestion(candles: Candle[]): Question {
  const correctIndex = findMaxVolumeCandleIndex(candles);
  return {
    id: "today-volume-max",
    type: "select_candle",
    market: "KRW-BTC",
    timeframe: "day",
    prompt: "가장 거래량이 많이 터진 캔들을 선택하세요.",
    candles,
    answer: {
      correctIndex,
    },
  };
}

