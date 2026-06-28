import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get the authenticated user
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
        { status: 401 }
      );
    }

    // Query the profiles table
    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .select("id, nickname, avatar_url, updated_at")
      .eq("id", user.id)
      .single();

    if (dbError) {
      // If the profile does not exist yet (e.g., PostgREST code PGRST116: 0 rows),
      // we can automatically create a default profile row for a seamless user experience.
      if (dbError.code === "PGRST116") {
        const defaultNickname = user.user_metadata?.nickname || user.email?.split("@")[0] || "User";
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            nickname: defaultNickname,
            avatar_url: "/avatars/default.png",
          })
          .select("id, nickname, avatar_url, updated_at")
          .single();

        if (insertError) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "DATABASE_ERROR",
                message: insertError.message,
              },
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            id: newProfile.id,
            nickname: newProfile.nickname,
            avatarUrl: newProfile.avatar_url,
            updatedAt: newProfile.updated_at,
          },
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: dbError.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        nickname: profile.nickname,
        avatarUrl: profile.avatar_url,
        updatedAt: profile.updated_at,
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
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get the authenticated user
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
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nickname, avatarUrl } = body;

    // Build the update data
    const updateData: any = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
    updateData.updated_at = new Date().toISOString();

    // Update (upsert) the profiles table
    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...updateData,
      })
      .select("id, nickname, avatar_url, updated_at")
      .single();

    if (dbError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: dbError.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        nickname: profile.nickname,
        avatarUrl: profile.avatar_url,
        updatedAt: profile.updated_at,
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
      { status: 500 }
    );
  }
}
