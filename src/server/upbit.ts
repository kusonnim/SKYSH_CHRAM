import type { Candle } from "@/types";
import { normalizeUpbitCandles } from "@/domain/candle";

export type FetchUpbitCandlesParams = {
  market: string;
  timeframe: string; // e.g. "day", "minute"
  count: number;
};

// Fallback: Call Upbit public REST API directly instead of using SDK.
// Endpoint example: https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=100
export async function fetchUpbitCandles(
  params: FetchUpbitCandlesParams,
): Promise<Candle[]> {
  const { market, timeframe, count } = params;

  const base = "https://api.upbit.com/v1/candles";
  const type = timeframe === "day" ? "days" : `${timeframe}s`;
  const url = `${base}/${type}?market=${encodeURIComponent(market)}&count=${encodeURIComponent(
    String(count),
  )}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Upbit API returned ${res.status}`);
  }

  const raw = await res.json();
  return normalizeUpbitCandles(Array.isArray(raw) ? raw : []);
}
