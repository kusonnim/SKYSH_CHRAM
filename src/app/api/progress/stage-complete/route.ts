import { NextResponse } from "next/server";

import { getNextStageId } from "@/domain/progress";
import { staticLearningMap } from "@/content/curriculum";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STAGE_COMPLETE_POINTS = 100;

type CompleteStageResult = {
  already_completed: boolean;
  points_awarded: number;
  stage_id: string;
  status: string;
  total_points: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          },
        },
        { status: 401 },
      );
    }

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
    const { data, error } = await supabase
      .rpc("complete_stage", {
        p_stage_id: body.stageId,
        p_points_award: STAGE_COMPLETE_POINTS,
      })
      .single();
    const completion = data as CompleteStageResult | null;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "STAGE_COMPLETE_FAILED",
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        stageId: body.stageId,
        status: "completed",
        nextStageId,
        pointsAwarded: completion?.points_awarded ?? 0,
        alreadyCompleted: completion?.already_completed ?? false,
        totalPoints: completion?.total_points ?? 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Internal server error",
        },
      },
      { status: 500 },
    );
  }
}

