"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = mode === "login" ? "Login" : "Sign up";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        router.push("/dashboard");
        router.refresh();
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;

        // 이미 가입된 계정인지 확인 (identities 배열이 비어있으면 이미 존재하는 유저)
        const isExistingUser =
          signUpData.user &&
          signUpData.user.identities &&
          signUpData.user.identities.length === 0;

        if (isExistingUser) {
          // 알림창 없이 바로 로그인 페이지로 이동
          router.push("/login");
        } else if (!signUpData.session) {
          // 새 계정이고 이메일 인증이 필요한 경우
          alert("Sign up successful! Please check your email for confirmation.");
          router.push("/login");
        } else {
          // 이메일 인증이 비활성화되어 즉시 로그인이 된 경우
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full rounded border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <input
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
          placeholder="email@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full rounded bg-slate-950 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Processing..." : title}
        </button>
      </form>
    </section>
  );
}

