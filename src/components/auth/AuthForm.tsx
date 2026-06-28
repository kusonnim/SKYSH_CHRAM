"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthMessage } from "./AuthMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthRedirectLink } from "./AuthRedirectLink";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome Back" : "Create Account";
  const subtitle = isLogin 
    ? "Enter your credentials to access your trading dashboard" 
    : "Start learning how to read market charts with real data";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
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

        // Check if user already exists
        const isExistingUser =
          signUpData.user &&
          signUpData.user.identities &&
          signUpData.user.identities.length === 0;

        if (isExistingUser) {
          setMessage({
            type: "info",
            text: "This email is already registered. Redirecting to login...",
          });
          setTimeout(() => {
            router.push("/login");
          }, 2500);
        } else if (!signUpData.session) {
          // If email confirmation is required
          setMessage({
            type: "success",
            text: "Sign up successful! Please check your email to confirm your account.",
          });
        } else {
          // If email confirmation is disabled and signed in immediately
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
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl shadow-emerald-950/5 backdrop-blur-xl">
      <div className="text-center">
        <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && <AuthMessage type="error" message={error} />}
        {message && <AuthMessage type={message.type} message={message.text} />}

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Email Address
          </label>
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Password
          </label>
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        <div className="pt-2">
          <AuthSubmitButton loading={loading}>
            {isLogin ? "Sign In" : "Sign Up"}
          </AuthSubmitButton>
        </div>
      </form>

      <div className="mt-6 border-t border-slate-800/60 pt-6">
        <AuthRedirectLink mode={mode} />
      </div>
    </div>
  );
}
