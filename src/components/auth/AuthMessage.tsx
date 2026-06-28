type AuthMessageProps = {
  type: "error" | "success" | "info";
  message: string;
};

const typeClassName: Record<AuthMessageProps["type"], string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-slate-200 bg-slate-50 text-slate-700",
};

export function AuthMessage({ type, message }: AuthMessageProps) {
  return (
    <div className={`rounded border px-3 py-2 text-sm ${typeClassName[type]}`}>
      {message}
    </div>
  );
}

