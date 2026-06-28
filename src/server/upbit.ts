import type { Candle } from "@/types";

export type FetchUpbitCandlesParams = {
  market: string;
  timeframe: string;
  count: number;
};

export async function fetchUpbitCandles(
  _params: FetchUpbitCandlesParams,
): Promise<Candle[]> {
  throw new Error("TODO: connect to the Upbit Quotation API in the server layer.");
}

