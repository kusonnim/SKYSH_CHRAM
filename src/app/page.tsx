import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6 py-12 text-[#1a1b22]">
      <section className="w-full max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#344e5d] text-xl font-bold text-white">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-[#344e5d]">
            SKYSH CHRAM
          </span>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#747685]">
          Chart Learning
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-[#1a1b22] md:text-6xl">
          Learn to read charts, not just trade them.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#434653]">
          Practice candle-reading skills through short stage-based lessons using
          real market chart data.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            className="rounded-xl bg-[#344e5d] px-6 py-4 text-center font-bold text-white shadow-md transition-colors hover:bg-[#4c6676] active:scale-95"
            href="/dashboard"
          >
            Start learning
          </Link>
          <Link
            className="rounded-xl border border-[#c4c6d5] bg-white px-6 py-4 text-center font-bold text-[#344e5d] shadow-sm transition-colors hover:bg-[#ededf7] active:scale-95"
            href="/login"
          >
            Log in
          </Link>
          <Link
            className="rounded-xl border border-[#c4c6d5] px-6 py-4 text-center font-bold text-[#434653] transition-colors hover:bg-white active:scale-95"
            href="/signup"
          >
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
}
