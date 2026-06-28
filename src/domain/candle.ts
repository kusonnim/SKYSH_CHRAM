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

function isNumeric(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") return Number.isFinite(Number(value));
  return false;
}

export function normalizeUpbitCandles(rawCandles: unknown[]): Candle[] {
  return rawCandles
    .filter(isRecord)
    .map((rawCandle): UpbitCandle => rawCandle)
    .filter(
      (rawCandle) =>
        typeof (rawCandle.candle_date_time_kst ?? rawCandle.candle_date_time_utc) ===
          "string" &&
        isNumeric(rawCandle.opening_price) &&
        isNumeric(rawCandle.high_price) &&
        isNumeric(rawCandle.low_price) &&
        isNumeric(rawCandle.trade_price) &&
        isNumeric(rawCandle.candle_acc_trade_volume),
    )
    .map((rawCandle) => ({
      time: ((rawCandle.candle_date_time_kst ??
        rawCandle.candle_date_time_utc) as string).split("T")[0],
      open: Number(rawCandle.opening_price),
      high: Number(rawCandle.high_price),
      low: Number(rawCandle.low_price),
      close: Number(rawCandle.trade_price),
      volume: Number(rawCandle.candle_acc_trade_volume),
    }));
}

export function sortCandlesOldestFirst(candles: Candle[]): Candle[] {
  return [...candles].sort((a, b) => a.time.localeCompare(b.time));
}
