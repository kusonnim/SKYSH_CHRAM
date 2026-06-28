import { NextResponse } from "next/server";

import { findSupportedMarket } from "@/domain/markets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchUpbitTicker } from "@/server/upbit";
import type { PortfolioSummary } from "@/types";

function toNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const selectedMarket = findSupportedMarket(url.searchParams.get("market"));
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          },
        },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, nickname, points")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PROFILE_READ_FAILED",
            message: profileError.message,
          },
        },
        { status: 500 },
      );
    }

    let points = toNumber(profile?.points);

    if (!profile) {
      const defaultNickname =
        user.user_metadata?.nickname || user.email?.split("@")[0] || "User";
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          nickname: defaultNickname,
          avatar_url: "/avatars/default.png",
          points: 0,
        })
        .select("points")
        .single();

      if (insertError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PROFILE_CREATE_FAILED",
              message: insertError.message,
            },
          },
          { status: 500 },
        );
      }

      points = toNumber(newProfile?.points);
    }

    const { data: position, error: positionError } = await supabase
      .from("portfolio_positions")
      .select("quantity, average_buy_price")
      .eq("user_id", user.id)
      .eq("market", selectedMarket.market)
      .maybeSingle();

    if (positionError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "POSITION_READ_FAILED",
            message: positionError.message,
          },
        },
        { status: 500 },
      );
    }

    const ticker = await fetchUpbitTicker(selectedMarket.market);
    const quantity = toNumber(position?.quantity);
    const averageBuyPrice = toNumber(position?.average_buy_price);
    const positionValue = quantity * ticker.tradePrice;
    const investedPoints = quantity * averageBuyPrice;
    const unrealizedProfit = positionValue - investedPoints;
    const unrealizedProfitRate =
      investedPoints > 0 ? (unrealizedProfit / investedPoints) * 100 : 0;

    const data: PortfolioSummary = {
      market: selectedMarket.market,
      points,
      position: {
        quantity,
        averageBuyPrice,
      },
      ticker: {
        tradePrice: ticker.tradePrice,
        timestamp: ticker.timestamp,
      },
      valuation: {
        positionValue,
        investedPoints,
        unrealizedProfit,
        unrealizedProfitRate,
        totalAssetValue: points + positionValue,
      },
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PORTFOLIO_READ_FAILED",
          message: error.message || "Failed to load portfolio.",
        },
      },
      { status: 500 },
    );
  }
}
