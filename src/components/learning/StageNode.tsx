import Link from "next/link";
import type { Stage } from "@/types";

type StageNodeProps = {
  stage: Stage;
  index: number;
  totalStages: number;
};

function getNodeOffset(index: number) {
  const offsets = ["", "ml-24", "", "-ml-24", "", "ml-16"];
  return offsets[index % offsets.length];
}

export function StageNode({ stage, index, totalStages }: StageNodeProps) {
  const isLocked = stage.status === "locked";
  const isCompleted = stage.status === "completed";
  const isActive = stage.status === "available";
  const isMilestone = index === totalStages - 1 && isLocked;
  const offset = getNodeOffset(index);

  const nodeClassName = [
    "relative z-10 flex flex-col items-center",
    offset,
    isLocked ? "opacity-55" : "",
    isActive ? "animate-[soft-bounce_2s_infinite_ease-in-out]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const shapeClassName = isMilestone
    ? "h-20 w-28 rounded-lg"
    : isActive
      ? "h-24 w-24 rounded-full"
      : "h-20 w-20 rounded-full";

  const colorClassName = isCompleted
    ? "bg-[#7d3500]"
    : isActive
      ? "bg-[#344e5d]"
      : "bg-[#d9d9e3]";

  const labelClassName = isActive
    ? "mt-4 rounded-lg border border-white/20 bg-[#344e5d] px-6 py-2 text-white shadow-md"
    : "mt-3 rounded-full border border-[#c4c6d5]/40 bg-white px-4 py-1 shadow-sm";

  const icon = isCompleted ? "OK" : isLocked ? "--" : String(index + 1);

  const content = (
    <>
      <div
        className={`${shapeClassName} ${colorClassName} flex items-center justify-center border-4 border-white shadow-md transition-transform active:scale-95 ${isLocked ? "cursor-not-allowed" : "cursor-pointer shadow-xl"}`}
      >
        <span
          className={`${isActive ? "text-3xl" : "text-2xl"} font-bold ${isLocked ? "text-[#434653]" : "text-white"}`}
        >
          {icon}
        </span>
      </div>
      <div className={labelClassName}>
        <span
          className={`${isActive ? "text-xs font-bold uppercase tracking-wide" : "text-sm font-medium"} ${isLocked ? "text-[#434653]" : isActive ? "text-white" : "text-[#1a1b22]"}`}
        >
          {isActive ? `Start: ${stage.title}` : stage.title}
        </span>
      </div>
    </>
  );

  if (isLocked) {
    return <div className={nodeClassName}>{content}</div>;
  }

  return (
    <Link className={nodeClassName} href={`/stage/${stage.id}`}>
      {content}
    </Link>
  );
}
