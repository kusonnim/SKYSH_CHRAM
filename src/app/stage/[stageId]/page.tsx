import { staticLearningMap } from "@/content/curriculum";
import { findStageById } from "@/domain";

type StagePageProps = {
  params: Promise<{
    stageId: string;
  }>;
};

export default async function StagePage({ params }: StagePageProps) {
  const { stageId } = await params;
  const stage = findStageById(staticLearningMap, stageId);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8">
      <p className="text-sm font-semibold uppercase text-slate-500">Stage</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">
        {stage?.title ?? "Unknown stage"}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        {stage?.description ??
          "This placeholder page will host the stage question session."}
      </p>
    </main>
  );
}

