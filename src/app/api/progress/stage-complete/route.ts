import { NextResponse } from "next/server";

import { getNextStageId } from "@/domain/progress";
import { staticLearningMap } from "@/content/curriculum";

export async function POST(request: Request) {
  const body = (await request.json()) as { stageId?: string };

  if (!body.stageId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "stageId is required.",
        },
      },
      { status: 400 },
    );
  }

  const nextStageId = getNextStageId(staticLearningMap, body.stageId);

  return NextResponse.json({
    success: true,
    data: {
      stageId: body.stageId,
      status: "completed",
      nextStageId,
    },
  });
}

