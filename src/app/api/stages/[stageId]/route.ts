import { NextResponse } from "next/server";
import { staticLearningMap } from "@/content/curriculum";
import { findStageById } from "@/domain";
import { fetchUpbitCandles } from "@/server/upbit";
import { sortCandlesOldestFirst, createMaxVolumeQuestion } from "@/domain";

type StageRouteContext = {
  params: Promise<{
    stageId: string;
  }>;
};

export async function GET(_request: Request, context: StageRouteContext) {
  const { stageId } = await context.params;
  const stage = findStageById(staticLearningMap, stageId);

  if (!stage) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "STAGE_NOT_FOUND",
          message: "Stage not found.",
        },
      },
      { status: 404 },
    );
  }

  try {
    const candles = await fetchUpbitCandles({
      market: "KRW-BTC",
      timeframe: "day",
      count: 30,
    });

    const sortedCandles = sortCandlesOldestFirst(candles);
    const question = createMaxVolumeQuestion(sortedCandles);

    return NextResponse.json({
      success: true,
      data: {
        stage,
        questions: [
          {
            ...question,
            id: `${stage.id}-question-1`,
            stageId: stage.id,
          },
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPBIT_FETCH_FAILED",
          message: error.message || "Unable to load candle data.",
        },
      },
      { status: 500 },
    );
  }
}

