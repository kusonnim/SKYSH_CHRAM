type LearningStatsProps = {
  completedLessons: number;
  progressPercent: number;
  streakDays: number;
  totalXp: number;
  moduleProgress?: { label: string; value: string; muted?: boolean }[];
};

export function LearningStats({
  completedLessons,
  progressPercent,
  streakDays,
  totalXp,
  moduleProgress,
}: LearningStatsProps) {
  return (
    <>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard
          accent="text-[#344e5d]"
          label="Completed Lessons"
          title={String(completedLessons)}
          trend="+1 this week"
        />
        <StatCard
          accent="text-[#9c4500]"
          label="Current Streak"
          title={`${streakDays} Days`}
          trend="Keep going"
        />
        <div className="col-span-2 flex flex-col justify-between rounded-xl border border-[#4c6676] bg-[#4c6676] p-6 text-[#c8e3f6] shadow-md md:col-span-1">
          <div className="flex items-start justify-between">
            <span className="text-3xl font-bold">XP</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold">
              +
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">{totalXp.toLocaleString()}</div>
            <div className="text-sm font-medium opacity-80">Total XP Points</div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#c4c6d5]/30 bg-[#e8e7f1] p-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a1b22]">
              Learning Progress
            </h3>
            <p className="text-sm text-[#434653]">
              Curriculum: Chart Reading Fundamentals
            </p>
          </div>
          <span className="text-2xl font-bold text-[#344e5d]">
            {progressPercent}%
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-[#e2e2eb]">
          <div
            className="h-full rounded-full bg-[#344e5d] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#c4c6d5]/30 pt-6 md:grid-cols-4">
          {moduleProgress ? (
            moduleProgress.map((mod, i) => (
              <ChapterProgress
                key={i}
                label={mod.label}
                value={mod.value}
                muted={mod.muted}
              />
            ))
          ) : (
            <>
              <ChapterProgress label="Chapter 1" value="Volume: 50%" />
              <ChapterProgress label="Chapter 2" value="Momentum: 0%" />
              <ChapterProgress label="Chapter 3" value="Trends: 0%" muted />
              <ChapterProgress label="Chapter 4" value="Risk: 0%" muted />
            </>
          )}
        </div>
      </section>
    </>
  );
}

function StatCard({
  accent,
  label,
  title,
  trend,
}: {
  accent: string;
  label: string;
  title: string;
  trend: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#c4c6d5]/30 bg-[#ededf7] p-6 transition-colors hover:border-[#344e5d]/40">
      <div className="flex items-start justify-between">
        <span className={`text-3xl font-bold ${accent}`}>*</span>
        <span className={`text-xs font-bold ${accent}`}>{trend}</span>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-[#1a1b22]">{title}</div>
        <div className="text-sm font-medium text-[#434653]">{label}</div>
      </div>
    </div>
  );
}

function ChapterProgress({
  label,
  muted,
  value,
}: {
  label: string;
  muted?: boolean;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-[#747685]">
        {label}
      </div>
      <div
        className={`text-sm font-semibold ${
          muted ? "text-[#747685]" : "text-[#1a1b22]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
