import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <AuthForm mode="login" />
    </main>
  );
}

