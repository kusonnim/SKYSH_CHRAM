import { NextResponse } from "next/server";
import { mockQuestion } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockQuestion,
  });
}

