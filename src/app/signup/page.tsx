import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#faf8ff] px-6 py-12 text-[#1a1b22]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_-20%,#cbe6f9_0%,#faf8ff_62%)]" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-1/4 w-full bg-[linear-gradient(135deg,rgba(52,78,93,0.08),rgba(253,128,46,0.05))]" />
      <AuthForm mode="signup" />
    </main>
  );
}

