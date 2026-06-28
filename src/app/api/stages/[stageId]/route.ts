import { NextResponse } from "next/server";
import { staticLearningMap, StageDatasets } from "@/content/curriculum";
import { findStageById } from "@/domain";
import { fetchUpbitCandles } from "@/server/upbit";
import { sortCandlesOldestFirst, generateQuestionForStage } from "@/domain";

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
    const targetDates = StageDatasets[stageId] || [];
    const count = stage.questionCount || 1;
    
    const datesToFetch = targetDates.length > 0 
      ? targetDates.slice(0, count) 
      : Array.from({ length: count }).map(() => undefined);

    const candlesPromises = datesToFetch.map(to => 
      fetchUpbitCandles({
        market: "KRW-BTC",
        timeframe: "day",
        count: 30,
        to
      })
    );
    
    const allCandles = await Promise.all(candlesPromises);

    const questions = allCandles.map((candles, index) => {
      const sortedCandles = sortCandlesOldestFirst(candles);
      const question = generateQuestionForStage(stage.id, sortedCandles);
      return {
        ...question,
        id: `${stage.id}-question-${index + 1}`,
        stageId: stage.id,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stage,
        questions,
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

