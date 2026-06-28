"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth state changes to keep header in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 shadow-md shadow-emerald-500/10">
            {/* Candlestick Icon */}
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M8 6v12M16 8v8M4 9h8M12 15h8" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Chartine
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-1.5 border border-slate-100 sm:flex">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">
                {user.email}
              </span>
            </div>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
