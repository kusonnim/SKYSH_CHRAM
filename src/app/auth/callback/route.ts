import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 인증 완료 후 이동할 페이지 (기본값: 대시보드)
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    // 일회성 코드를 Supabase 세션 쿠키로 교환합니다.
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 인증 실패 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
