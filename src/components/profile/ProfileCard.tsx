type ProfileCardProps = {
  email: string;
  joinedAt: string;
  nickname: string;
};

export function ProfileCard({ email, joinedAt, nickname }: ProfileCardProps) {
  const initial = (nickname || email || "U").slice(0, 1).toUpperCase();

  return (
    <section className="flex flex-col items-center gap-6 rounded-xl border border-[#c4c6d5]/30 bg-white p-6 shadow-sm md:flex-row">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#344e5d]/10 bg-[#cbe6f9] text-4xl font-bold text-[#344e5d] md:h-32 md:w-32">
          {initial}
        </div>
        <div className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-[#fd802e] px-2 py-1 text-sm font-bold text-white shadow-md">
          +
        </div>
      </div>

      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-[#1a1b22] md:text-3xl">
          {nickname}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <span className="rounded-full bg-[#4c6676] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#c8e3f6]">
            Chart Learner
          </span>
          <span className="text-sm text-[#747685]">{email}</span>
        </div>
        <p className="max-w-md pt-1 text-sm text-[#434653]">
          Member since {joinedAt}. Keep building your chart-reading skill with
          real market data.
        </p>
      </div>

      <div className="w-full md:ml-auto md:w-auto">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#344e5d] px-6 py-3 font-semibold text-white shadow-md transition-all active:scale-95 md:w-auto"
          type="button"
        >
          Edit Profile
        </button>
      </div>
    </section>
  );
}
