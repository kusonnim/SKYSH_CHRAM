import { NextResponse } from "next/server";

import { staticLearningMap } from "@/content/curriculum";
import { getNextStageId } from "@/domain/progress";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STAGE_COMPLETE_POINTS = 100;

function toNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

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

    const { error: completionError } = await supabase
      .from("stage_completions")
      .insert({
        user_id: user.id,
        stage_id: body.stageId,
        points_awarded: STAGE_COMPLETE_POINTS,
      });

    const alreadyCompleted = completionError?.code === "23505";
    if (completionError && !alreadyCompleted) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "STAGE_COMPLETE_FAILED",
            message: completionError.message,
          },
        },
        { status: 500 },
      );
    }

    const pointsAwarded = alreadyCompleted ? 0 : STAGE_COMPLETE_POINTS;
    const { data: profile, error: profileReadError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .maybeSingle();

    if (profileReadError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PROFILE_READ_FAILED",
            message: profileReadError.message,
          },
        },
        { status: 500 },
      );
    }

    let totalPoints = toNumber(profile?.points);
    if (profile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          points: totalPoints + pointsAwarded,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select("points")
        .single();

      if (updateError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PROFILE_UPDATE_FAILED",
              message: updateError.message,
            },
          },
          { status: 500 },
        );
      }

      totalPoints = toNumber(updatedProfile?.points);
    } else {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          nickname:
            user.user_metadata?.nickname || user.email?.split("@")[0] || "User",
          avatar_url: "/avatars/default.png",
          points: pointsAwarded,
        })
        .select("points")
        .single();

      if (insertError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PROFILE_CREATE_FAILED",
              message: insertError.message,
            },
          },
          { status: 500 },
        );
      }

      totalPoints = toNumber(newProfile?.points);
    }

    const nextStageId = getNextStageId(staticLearningMap, body.stageId);

    return NextResponse.json({
      success: true,
      data: {
        stageId: body.stageId,
        status: "completed",
        nextStageId,
        pointsAwarded,
        alreadyCompleted,
        totalPoints,
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
