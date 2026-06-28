import Upbit from "@upbit-official/upbit-sdk";
import type { Candle } from "@/types";
import { normalizeUpbitCandles } from "@/domain/candle";

// Quotation API (candles, tickers, etc.) does not require authentication.
// The SDK internally marks these endpoints as unauthenticated.
const client = new Upbit();

export type FetchUpbitCandlesParams = {
  market: string;
  timeframe: string;
  count: number;
};

export async function fetchUpbitCandles(
  params: FetchUpbitCandlesParams,
): Promise<Candle[]> {
  const { market, count } = params;

  // For the MVP, we only support daily candles ("day")
  const rawCandles = await client.candles.listDays({ market, count });

  return normalizeUpbitCandles(rawCandles);
}
