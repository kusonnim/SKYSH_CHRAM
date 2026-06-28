import { NextResponse } from "next/server";
import { staticLearningMap } from "@/content/curriculum";
import { findStageById } from "@/domain";
import { mockQuestion } from "@/lib/mock-data";

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

  return NextResponse.json({
    success: true,
    data: {
      stage,
      questions: [
        {
          ...mockQuestion,
          id: `${stage.id}-question-1`,
          stageId: stage.id,
        },
      ],
    },
  });
}

