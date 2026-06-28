import { NextResponse } from "next/server";
import { staticLearningMap } from "@/content/curriculum";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: staticLearningMap,
  });
}

