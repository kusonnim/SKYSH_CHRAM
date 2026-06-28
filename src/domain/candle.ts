import type { Candle } from "@/types";

type UpbitCandle = {
  candle_date_time_kst?: unknown;
  candle_date_time_utc?: unknown;
  opening_price?: unknown;
  high_price?: unknown;
  low_price?: unknown;
  trade_price?: unknown;
  candle_acc_trade_volume?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function normalizeUpbitCandles(rawCandles: unknown[]): Candle[] {
  return rawCandles
    .filter(isRecord)
    .map((rawCandle): UpbitCandle => rawCandle)
    .filter(
      (rawCandle) =>
        typeof (rawCandle.candle_date_time_kst ?? rawCandle.candle_date_time_utc) ===
          "string" &&
        isFiniteNumber(rawCandle.opening_price) &&
        isFiniteNumber(rawCandle.high_price) &&
        isFiniteNumber(rawCandle.low_price) &&
        isFiniteNumber(rawCandle.trade_price) &&
        isFiniteNumber(rawCandle.candle_acc_trade_volume),
    )
    .map((rawCandle) => ({
      time: (rawCandle.candle_date_time_kst ??
        rawCandle.candle_date_time_utc) as string,
      open: rawCandle.opening_price as number,
      high: rawCandle.high_price as number,
      low: rawCandle.low_price as number,
      close: rawCandle.trade_price as number,
      volume: rawCandle.candle_acc_trade_volume as number,
    }));
}

export function sortCandlesOldestFirst(candles: Candle[]): Candle[] {
  return [...candles].sort((a, b) => a.time.localeCompare(b.time));
}
