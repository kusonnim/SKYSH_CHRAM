import type { Candle } from "@/types";

export function normalizeUpbitCandles(rawCandles: any[]): Candle[] {
  return rawCandles.map((raw) => {
    if (!raw.candle_date_time_utc) {
      throw new Error("Invalid raw candle data: missing candle_date_time_utc");
    }
    return {
      time: raw.candle_date_time_utc.split("T")[0],
      open: raw.opening_price,
      high: raw.high_price,
      low: raw.low_price,
      close: raw.trade_price,
      volume: raw.candle_acc_trade_volume,
    };
  });
}

export function sortCandlesOldestFirst(candles: Candle[]): Candle[] {
  return [...candles].reverse();
}

