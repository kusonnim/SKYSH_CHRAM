import { NextResponse } from "next/server";
import { gradeSelectCandleAnswer } from "@/domain/grading";
import type { SubmitAnswerRequest } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitAnswerRequest;

  if (
    typeof body.selectedCandleIndex !== "number" ||
    typeof body.correctCandleIndex !== "number"
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "invalid_request",
          message: "Missing or invalid answer payload.",
        },
      },
      { status: 400 },
    );
  }

  const grading = gradeSelectCandleAnswer(
    body.selectedCandleIndex,
    body.correctCandleIndex,
  );

  return NextResponse.json({
    success: true,
    data: {
      isCorrect: grading.isCorrect,
      score: grading.score,
      feedback: grading.isCorrect
        ? "Great job! You correctly identified the highest-volume candle."
        : "That candle is not the highest-volume candle. Compare the volume bars again.",
    },
  });
}

