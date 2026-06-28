"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LearningStats,
  ProfileCard,
  ProfileEditForm,
} from "@/components/profile";
import { LogoutButton } from "@/components/auth";
import type { LearningMap, PortfolioSummary } from "@/types";

type ProfileData = {
  avatarUrl?: string | null;
  id: string;
  nickname: string;
  updatedAt?: string | null;
};

export default function ProfilePage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [moduleProgress, setModuleProgress] = useState<{label: string; value: string; muted?: boolean}[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const fallbackNickname =
        user.user_metadata?.nickname ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Chart Learner";

      setEmail(user.email ?? "");
      setJoinedAt(
        user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "recently",
      );
      setProfile({
        id: user.id,
        nickname: fallbackNickname,
      });

      try {
        const [profileResponse, portfolioResponse, learningMapResponse] =
          await Promise.all([
            fetch("/api/profile"),
            fetch("/api/portfolio"),
            fetch("/api/learning-map"),
          ]);
        const [data, portfolioData, learningMapData] = await Promise.all([
          profileResponse.json(),
          portfolioResponse.json(),
          learningMapResponse.json(),
        ]);

        if (data.success) {
          setProfile(data.data);
        }

        if (portfolioData.success) {
          setPortfolio(portfolioData.data);
        }

        if (learningMapData.success) {
          setLearningProgress(learningMapData.data);
        }
      } catch (error) {
        console.error("Unable to load profile API data.", error);
      } finally {
        setLoading(false);
      }
    }

    function setLearningProgress(learningMap: LearningMap) {
      const stages = learningMap.chapters.flatMap((chapter) => chapter.stages);
      const completedCount = stages.filter(
        (stage) => stage.status === "completed",
      ).length;
      const totalStages = learningMap.chapters.reduce(
        (acc, chapter) => acc + chapter.stages.length,
        0,
      );
      setCompletedLessons(completedCount);
      setProgressPercent(
        totalStages > 0 ? Math.round((completedCount / totalStages) * 100) : 0,
      );

      const mods = learningMap.chapters.map((chapter, i) => {
        const total = chapter.stages.length;
        const completed = chapter.stages.filter(stage => stage.status === 'completed').length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          label: `Module ${i + 1}`,
          value: `${chapter.title.split(' ')[0]}: ${percent}%`,
          muted: percent === 0,
        };
      });

      if (mods.length < 4) {
        if (mods.length < 3) mods.push({ label: "Module 3", value: "Trends: 0%", muted: true });
        if (mods.length < 4) mods.push({ label: "Module 4", value: "Risk: 0%", muted: true });
      }

      setModuleProgress(mods);
    }

    loadProfile();
  }, [supabase]);

  const nickname = profile?.nickname ?? "Chart Learner";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#c4c6d5] border-t-[#344e5d]" />
          <p className="mt-4 text-sm text-[#434653]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-32 text-[#1a1b22]">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#c4c6d5]/40 bg-[#faf8ff]/80 px-6 shadow-sm backdrop-blur-md md:px-12">
        <div className="flex items-center gap-4">
          <a
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#344e5d] transition-colors hover:bg-[#344e5d]/5 active:scale-95"
            href="/dashboard"
          >
            Back
          </a>
          <h1 className="text-lg font-bold tracking-tight text-[#344e5d] md:text-xl">
            SKYSH CHRAM
          </h1>
        </div>
        <LogoutButton />
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 pt-24">
        <ProfileCard email={email} joinedAt={joinedAt} nickname={nickname} />

        <LearningStats
          completedLessons={completedLessons}
          progressPercent={progressPercent}
          streakDays={1}
          totalXp={portfolio?.points ?? 0}
          moduleProgress={moduleProgress}
        />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a1b22]">
              Earned Achievements
            </h3>
            <button className="text-sm font-semibold text-[#344e5d]" type="button">
              View All
            </button>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4">
            <Achievement title="Chart Starter" detail="First lesson" />
            <Achievement title="Volume Pro" detail="In progress" />
            <Achievement title="Scholar" detail="Coming soon" />
            <Achievement title="100 Day Club" detail="Locked" muted />
          </div>
        </section>

        <ProfileEditForm nickname={nickname} />

        <section className="overflow-hidden rounded-xl border border-[#c4c6d5]/20 bg-white shadow-sm">
          <MenuItem label="Account Settings" />
          <MenuItem label="Notification Preferences" />
          <MenuItem label="Help & Support" />
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-[#c4c6d5]/40 bg-[#faf8ff]/80 px-4 shadow-lg backdrop-blur-md">
        <a
          className="flex flex-col items-center justify-center px-4 py-1 text-[#434653] transition-colors hover:text-[#344e5d] active:scale-90"
          href="/dashboard"
        >
          <span className="text-lg font-bold">L</span>
          <span className="mt-1 text-[10px] font-bold uppercase">Learn</span>
        </a>
        <a
          className="flex flex-col items-center justify-center px-4 py-1 text-[#434653] transition-colors hover:text-[#344e5d] active:scale-90"
          href="/portfolio"
        >
          <span className="text-lg font-bold">B</span>
          <span className="mt-1 text-[10px] font-bold uppercase">Invest</span>
        </a>
        <a
          className="flex flex-col items-center justify-center rounded-xl bg-[#4c6676] px-6 py-1 text-[#c8e3f6] active:scale-90"
          href="/profile"
        >
          <span className="text-lg font-bold">P</span>
          <span className="mt-1 text-[10px] font-bold uppercase">Profile</span>
        </a>
      </nav>
    </div>
  );
}

function Achievement({
  detail,
  muted,
  title,
}: {
  detail: string;
  muted?: boolean;
  title: string;
}) {
  return (
    <div className="flex min-w-[140px] flex-shrink-0 flex-col items-center gap-2 rounded-xl border border-[#c4c6d5]/20 bg-white p-4 text-center shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
      <div
        className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${
          muted ? "bg-[#747685]/10 text-[#747685]" : "bg-[#ffdbca]/30 text-[#9c4500]"
        }`}
      >
        *
      </div>
      <span className="text-sm font-bold text-[#1a1b22]">{title}</span>
      <span className="text-[10px] font-bold uppercase text-[#747685]">
        {detail}
      </span>
    </div>
  );
}

function MenuItem({ label }: { label: string }) {
  return (
    <a
      className="flex items-center justify-between border-b border-[#c4c6d5]/20 p-4 transition-colors last:border-b-0 hover:bg-[#ededf7]"
      href="#"
    >
      <span className="font-medium text-[#1a1b22]">{label}</span>
      <span className="text-[#747685]">&gt;</span>
    </a>
  );
}
