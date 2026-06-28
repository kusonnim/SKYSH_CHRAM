import type { Candle } from "@/types";
import { normalizeUpbitCandles } from "@/domain/candle";

export type FetchUpbitCandlesParams = {
  market: string;
  timeframe: string; // e.g. "day", "minute"
  count: number;
  to?: string;
};

export type UpbitTicker = {
  market: string;
  tradePrice: number;
  timestamp: number;
};

// Fallback: Call Upbit public REST API directly instead of using SDK.
// Endpoint example: https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=100
export async function fetchUpbitCandles(
  params: FetchUpbitCandlesParams,
): Promise<Candle[]> {
  const { market, timeframe, count, to } = params;

  const base = "https://api.upbit.com/v1/candles";
  const type = timeframe === "day" ? "days" : `${timeframe}s`;
  let url = `${base}/${type}?market=${encodeURIComponent(market)}&count=${encodeURIComponent(
    String(count),
  )}`;
  if (to) {
    url += `&to=${encodeURIComponent(to)}`;
  }

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Upbit API returned ${res.status}`);
  }

  const raw = await res.json();
  return normalizeUpbitCandles(Array.isArray(raw) ? raw : []);
}

export async function fetchUpbitTicker(market: string): Promise<UpbitTicker> {
  const url = `https://api.upbit.com/v1/ticker?markets=${encodeURIComponent(market)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Upbit API returned ${res.status}`);
  }

  const raw = await res.json();
  const ticker = Array.isArray(raw) ? raw[0] : null;
  const tradePrice = Number(ticker?.trade_price);
  const timestamp = Number(ticker?.timestamp);

  if (!ticker || !Number.isFinite(tradePrice) || tradePrice <= 0) {
    throw new Error("Upbit ticker response was malformed.");
  }

  return {
    market: String(ticker.market ?? market),
    tradePrice,
    timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(),
  };
}
