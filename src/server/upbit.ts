import type { Candle } from "@/types";
import { normalizeUpbitCandles } from "@/domain/candle";

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
  const url = `https://api.upbit.com/v1/candles/days?market=${market}&count=${count}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch candles from Upbit: ${response.statusText}`);
  }

  const rawCandles = await response.json();
  return normalizeUpbitCandles(rawCandles);
}

