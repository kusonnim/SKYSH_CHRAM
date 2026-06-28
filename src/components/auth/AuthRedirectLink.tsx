import Link from "next/link";

type AuthRedirectLinkProps = {
  mode: "login" | "signup";
};

export function AuthRedirectLink({ mode }: AuthRedirectLinkProps) {
  const isLogin = mode === "login";

  return (
    <p className="text-center text-base text-[#434653]">
      {isLogin ? "Need an account?" : "Already have an account?"}{" "}
      <Link
        className="font-semibold text-[#344e5d] underline-offset-4 transition-all hover:underline"
        href={isLogin ? "/signup" : "/login"}
      >
        {isLogin ? "Sign Up" : "Sign In"}
      </Link>
    </p>
  );
}

