import { NextResponse } from "next/server";
import { gradeSelectCandleAnswer, createBasicFeedback } from "@/domain";
import type { SubmitAnswerRequest, AnswerResult } from "@/types";

export async function POST(request: Request) {
  try {
    const body: SubmitAnswerRequest = await request.json();
    const { selectedCandleIndex, correctCandleIndex } = body;

    if (selectedCandleIndex === undefined || correctCandleIndex === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "selectedCandleIndex and correctCandleIndex are required.",
          },
        },
        { status: 400 },
      );
    }

    // Grade the selected candle index
    const gradingResult = gradeSelectCandleAnswer(selectedCandleIndex, correctCandleIndex);
    
    // Generate feedback message
    const feedback = createBasicFeedback(gradingResult.isCorrect, gradingResult.mistakeCode);

    const result: AnswerResult = {
      isCorrect: gradingResult.isCorrect,
      score: gradingResult.score,
      feedback,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SUBMIT_ANSWER_FAILED",
          message: error.message || "Failed to grade answer",
        },
      },
      { status: 500 },
    );
  }
}

