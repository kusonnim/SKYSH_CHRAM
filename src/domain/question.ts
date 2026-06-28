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

export function createMaxVolumeQuestion(_candles: Candle[]): Question {
  throw new Error("TODO: implement createMaxVolumeQuestion in the domain layer.");
}
