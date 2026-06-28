import type { Candle } from "@/types";

export function normalizeUpbitCandles(_rawCandles: unknown[]): Candle[] {
  throw new Error("TODO: implement normalizeUpbitCandles in the domain layer.");
}

export function sortCandlesOldestFirst(_candles: Candle[]): Candle[] {
  throw new Error("TODO: implement sortCandlesOldestFirst in the domain layer.");
}

