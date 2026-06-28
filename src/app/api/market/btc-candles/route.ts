import { NextResponse } from "next/server";

import { sortCandlesOldestFirst } from "@/domain";
import { fetchUpbitCandles } from "@/server/upbit";

export async function GET() {
  try {
    const candles = await fetchUpbitCandles({
      market: "KRW-BTC",
      timeframe: "day",
      count: 60,
    });

    return NextResponse.json({
      success: true,
      data: {
        market: "KRW-BTC",
        timeframe: "day",
        candles: sortCandlesOldestFirst(candles),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BTC_CANDLES_READ_FAILED",
          message: error.message || "Unable to load BTC candles.",
        },
      },
      { status: 500 },
    );
  }
}
