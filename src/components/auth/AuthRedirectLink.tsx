import Link from "next/link";

type AuthRedirectLinkProps = {
  mode: "login" | "signup";
};

export function AuthRedirectLink({ mode }: AuthRedirectLinkProps) {
  const isLogin = mode === "login";

  return (
    <p className="text-center text-sm text-slate-600">
      {isLogin ? "Need an account?" : "Already have an account?"}{" "}
      <Link
        className="font-medium text-slate-950 underline-offset-4 hover:underline"
        href={isLogin ? "/signup" : "/login"}
      >
        {isLogin ? "Sign up" : "Log in"}
      </Link>
    </p>
  );
}

