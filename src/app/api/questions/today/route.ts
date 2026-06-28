import { NextResponse } from "next/server";
import { fetchUpbitCandles } from "@/server/upbit";
import { sortCandlesOldestFirst, createMaxVolumeQuestion } from "@/domain";

export async function GET() {
  try {
    // Fetch 100 daily candles for KRW-BTC
    const candles = await fetchUpbitCandles({
      market: "KRW-BTC",
      timeframe: "day",
      count: 100,
    });

    // Sort them oldest first for proper chart rendering
    const sortedCandles = sortCandlesOldestFirst(candles);
    
    // Create the question based on the sorted candles
    const question = createMaxVolumeQuestion(sortedCandles);

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_QUESTION_FAILED",
          message: error.message || "Failed to fetch today's question",
        },
      },
      { status: 500 },
    );
  }
}

