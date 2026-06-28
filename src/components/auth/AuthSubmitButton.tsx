type AuthSubmitButtonProps = {
  loading: boolean;
  children: React.ReactNode;
};

export function AuthSubmitButton({
  loading,
  children,
}: AuthSubmitButtonProps) {
  return (
    <button
      className="w-full rounded bg-slate-950 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      disabled={loading}
      type="submit"
    >
      {loading ? "Processing..." : children}
    </button>
  );
}

