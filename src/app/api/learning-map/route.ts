import { NextResponse } from "next/server";
import { staticLearningMap } from "@/content/curriculum";
import { applyCompletedStageProgress } from "@/domain/progress";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
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

    const { data, error } = await supabase
      .from("stage_completions")
      .select("stage_id")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "LEARNING_PROGRESS_READ_FAILED",
            message: error.message,
          },
        },
        { status: 500 },
      );
    }

    const completedStageIds = (data ?? [])
      .map((completion) => completion.stage_id)
      .filter((stageId): stageId is string => typeof stageId === "string");

    return NextResponse.json({
      success: true,
      data: applyCompletedStageProgress(staticLearningMap, completedStageIds),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "LEARNING_MAP_READ_FAILED",
          message: error.message || "Unable to load learning map.",
        },
      },
      { status: 500 },
    );
  }
}

