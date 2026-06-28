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

  return candles.reduce((longestBodyIndex, candle, index) => {
    const currentBodySize = Math.abs(candle.open - candle.close);
    const longestBodySize = Math.abs(
      candles[longestBodyIndex].open - candles[longestBodyIndex].close,
    );
    return currentBodySize > longestBodySize ? index : longestBodyIndex;
  }, 0);
}

export function createLongestBodyQuestion(candles: Candle[]): Question {
  return {
    id: "longest-body-candle",
    type: "select_candle",
    stageId: "longest-body-candle",
    market: "KRW-BTC",
    timeframe: "day",
    prompt: "Select the candle with the largest body.",
    candles,
    answer: {
      correctIndex: findLongestBodyCandleIndex(candles),
    },
  };
}

export function findVolumeSpikeCandleIndex(candles: Candle[]): number {
  if (candles.length < 2) return -1;
  return candles.reduce((spikeIndex, candle, index) => {
    if (index === 0) return spikeIndex;
    const prevCandle = candles[index - 1];
    const prevSpikeCandle = candles[spikeIndex];
    const prevSpikePrevCandle = candles[spikeIndex - 1] || prevSpikeCandle;

    const currentSpikeRatio = prevCandle.volume === 0 ? 0 : candle.volume / prevCandle.volume;
    const maxSpikeRatio = prevSpikePrevCandle.volume === 0 ? 0 : prevSpikeCandle.volume / prevSpikePrevCandle.volume;

    return currentSpikeRatio > maxSpikeRatio ? index : spikeIndex;
  }, 1);
}

export function createVolumeSpikeQuestion(candles: Candle[]): Question {
  return {
    id: "volume-spike-candle",
    type: "select_candle",
    stageId: "volume-spike",
    market: "KRW-BTC",
    timeframe: "day",
    prompt: "직전 캔들 대비 거래량이 가장 폭발적으로 증가한(Volume Spike) 캔들을 선택하세요.",
    candles,
    answer: {
      correctIndex: findVolumeSpikeCandleIndex(candles),
    },
  };
}

export function generateQuestionForStage(stageId: string, candles: Candle[]): Question {
  switch (stageId) {
    case "volume-highest-candle":
      return createMaxVolumeQuestion(candles);
    case "longest-body-candle":
      return createLongestBodyQuestion(candles);
    case "volume-spike":
      return createVolumeSpikeQuestion(candles);
    default:
      return createMaxVolumeQuestion(candles);
  }
}
