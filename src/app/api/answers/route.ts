import { NextResponse } from "next/server";
import { mockAnswerResult } from "@/lib/mock-data";

export async function POST() {
  return NextResponse.json({
    success: true,
    data: mockAnswerResult,
  });
}

