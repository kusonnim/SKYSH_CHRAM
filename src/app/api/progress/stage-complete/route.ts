import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getNextStageId } from "@/domain/progress";
import { staticLearningMap } from "@/content/curriculum";

export async function POST(request: Request) {
  try {
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

    const supabase = await createSupabaseServerClient();
    
    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
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

    const nextStageId = getNextStageId(staticLearningMap, body.stageId);

    // 2. Try inserting into stage_completions
    const { error: insertError } = await supabase
      .from("stage_completions")
      .insert({
        user_id: user.id,
        stage_id: body.stageId,
        points_awarded: 100,
      });

    let pointsAwarded = 0;
    let alreadyCompleted = false;

    if (insertError) {
      // PostgreSQL error code 23505 is unique_violation
      if (insertError.code === "23505") {
        alreadyCompleted = true;
        pointsAwarded = 0;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: insertError.message,
            },
          },
          { status: 500 },
        );
      }
    } else {
      // 3. Increment user's points by 100
      const { error: updateError } = await supabase.rpc("increment_points", {
        p_user_id: user.id,
        p_amount: 100,
      });

      if (updateError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: updateError.message,
            },
          },
          { status: 500 },
        );
      }

      pointsAwarded = 100;
      alreadyCompleted = false;
    }

    return NextResponse.json({
      success: true,
      data: {
        stageId: body.stageId,
        status: "completed",
        nextStageId,
        pointsAwarded,
        alreadyCompleted,
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


