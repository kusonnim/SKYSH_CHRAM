import { NextResponse } from "next/server";

import { sortCandlesOldestFirst } from "@/domain";
import { findSupportedMarket } from "@/domain/markets";
import { fetchUpbitCandles } from "@/server/upbit";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const selectedMarket = findSupportedMarket(url.searchParams.get("market"));
    const candles = await fetchUpbitCandles({
      market: selectedMarket.market,
      timeframe: "day",
      count: 60,
    });

    return NextResponse.json({
      success: true,
      data: {
        market: selectedMarket.market,
        timeframe: "day",
        candles: sortCandlesOldestFirst(candles),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "MARKET_CANDLES_READ_FAILED",
          message: error.message || "Unable to load market candles.",
        },
      },
      { status: 500 },
    );
  }
}
