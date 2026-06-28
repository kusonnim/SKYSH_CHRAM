type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const title = mode === "login" ? "Login" : "Sign up";

  return (
    <section className="w-full rounded border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      <div className="mt-6 space-y-4">
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="email@example.com"
          type="email"
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Password"
          type="password"
        />
        <button className="w-full rounded bg-slate-950 px-4 py-2 font-medium text-white">
          {title}
        </button>
      </div>
    </section>
  );
}

