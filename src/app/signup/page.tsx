import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 px-6 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
      
      <AuthForm mode="signup" />
    </main>
  );
}


