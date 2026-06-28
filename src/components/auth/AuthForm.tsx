"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthMessage } from "./AuthMessage";
import { AuthRedirectLink } from "./AuthRedirectLink";

type AuthFormProps = {
  mode: "login" | "signup";
};

type AuthInputProps = {
  autoComplete: string;
  label: string;
  leftLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  rightSlot?: React.ReactNode;
  type: string;
  value: string;
};

function AuthInput({
  autoComplete,
  label,
  leftLabel,
  onChange,
  placeholder,
  required,
  rightSlot,
  type,
  value,
}: AuthInputProps) {
  return (
    <div className="space-y-1">
      <label className="px-1 text-sm font-medium text-[#434653]">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-sm font-semibold text-[#747685]">
          {leftLabel}
        </span>
        <input
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-[#c4c6d5] bg-[#f3f3fd] py-3 pl-12 pr-12 text-[#1a1b22] outline-none transition-all placeholder:text-[#747685]/70 focus:border-[#344e5d] focus:ring-2 focus:ring-[#344e5d]/20"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
        {rightSlot}
      </div>
    </div>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome Back" : "Create Account";
  const subtitle = isLogin
    ? "Enter your credentials to access your chart learning dashboard."
    : "Start your journey to financial chart mastery.";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: {
                full_name: fullName,
                nickname: fullName,
              },
            },
          });
        if (signUpError) throw signUpError;

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
          setMessage({
            type: "success",
            text: "Sign up successful. Please check your email to confirm your account.",
          });
        } else {
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
    <div className="relative z-10 flex w-full max-w-md flex-col items-center">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#344e5d] shadow-lg shadow-[#344e5d]/20 transition-transform duration-300 hover:scale-105">
          <span className="text-3xl font-bold text-white">C</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#344e5d]">
          SKYSH CHRAM
        </h2>
      </div>

      <section className="flex w-full flex-col items-center rounded-xl border border-[#c4c6d5]/40 bg-white p-8 shadow-sm lg:p-10">
        <header className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1a1b22]">
            {title}
          </h1>
          <p className="text-base text-[#434653]">{subtitle}</p>
        </header>

        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {error && <AuthMessage type="error" message={error} />}
          {message && <AuthMessage type={message.type} message={message.text} />}

          {!isLogin && (
            <AuthInput
              autoComplete="name"
              label="Full Name"
              leftLabel="ID"
              onChange={setFullName}
              placeholder="Enter your full name"
              required
              type="text"
              value={fullName}
            />
          )}

          <AuthInput
            autoComplete="email"
            label="Email Address"
            leftLabel="@"
            onChange={setEmail}
            placeholder="name@example.com"
            required
            type="email"
            value={email}
          />

          <div className="space-y-1">
            <AuthInput
              autoComplete={isLogin ? "current-password" : "new-password"}
              label="Password"
              leftLabel="PW"
              onChange={setPassword}
              placeholder="Enter your password"
              required
              rightSlot={
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 text-sm font-medium text-[#747685] transition-colors hover:text-[#344e5d]"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
              type={showPassword ? "text" : "password"}
              value={password}
            />
            {!isLogin && (
              <p className="mt-2 px-1 text-xs text-[#747685]">
                Must be at least 8 characters.
              </p>
            )}
          </div>

          <button
            className="mt-2 w-full rounded-lg bg-[#344e5d] py-4 font-semibold text-white shadow-md transition-all hover:bg-[#4c6676] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
                ? "Sign In"
                : "Sign Up"}
          </button>
        </form>

        {!isLogin && (
          <>
            <div className="my-8 flex w-full items-center">
              <div className="flex-grow border-t border-[#c4c6d5]" />
              <span className="mx-4 text-xs font-medium text-[#747685]">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t border-[#c4c6d5]" />
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center rounded-lg border border-[#c4c6d5] py-3 text-sm font-semibold text-[#1a1b22] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                disabled
                type="button"
              >
                Google
              </button>
              <button
                className="flex items-center justify-center rounded-lg border border-[#c4c6d5] py-3 text-sm font-semibold text-[#1a1b22] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                disabled
                type="button"
              >
                GitHub
              </button>
            </div>
          </>
        )}

        <footer className="mt-10 text-center">
          <AuthRedirectLink mode={mode} />
        </footer>
      </section>
    </div>
  );
}

