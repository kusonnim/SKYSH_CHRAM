import { NextResponse } from "next/server";

import { isSupportedMarket } from "@/domain/markets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchUpbitTicker } from "@/server/upbit";
import type {
  PortfolioSummary,
  SubmitTradeRequest,
  TradeResult,
  TradeSide,
} from "@/types";

const MIN_TRADE_POINTS = 10;

type ProfileRow = {
  points?: unknown;
};

type PositionRow = {
  average_buy_price?: unknown;
  quantity?: unknown;
};

function toNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function isTradeSide(value: unknown): value is TradeSide {
  return value === "buy" || value === "sell";
}

function buildPortfolioSummary({
  averageBuyPrice,
  points,
  quantity,
  tradePrice,
  timestamp,
  market,
}: {
  averageBuyPrice: number;
  market: string;
  points: number;
  quantity: number;
  tradePrice: number;
  timestamp: number;
}): PortfolioSummary {
  const positionValue = quantity * tradePrice;
  const investedPoints = quantity * averageBuyPrice;
  const unrealizedProfit = positionValue - investedPoints;
  const unrealizedProfitRate =
    investedPoints > 0 ? (unrealizedProfit / investedPoints) * 100 : 0;

  return {
    market,
    points,
    position: {
      quantity,
      averageBuyPrice,
    },
    ticker: {
      tradePrice,
      timestamp,
    },
    valuation: {
      positionValue,
      investedPoints,
      unrealizedProfit,
      unrealizedProfitRate,
      totalAssetValue: points + positionValue,
    },
  };
}

export async function POST(request: Request) {
  try {
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

    const body = (await request.json()) as Partial<SubmitTradeRequest>;
    const market = body.market;
    const side = body.side;
    const pointsAmount = Math.floor(toNumber(body.pointsAmount));

    if (!isSupportedMarket(market)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Unsupported market.",
          },
        },
        { status: 400 },
      );
    }

    if (!isTradeSide(side)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "side must be either buy or sell.",
          },
        },
        { status: 400 },
      );
    }

    if (pointsAmount < MIN_TRADE_POINTS) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: `pointsAmount must be at least ${MIN_TRADE_POINTS}.`,
          },
        },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

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

    let currentPoints = toNumber(profile?.points);
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
        .single<ProfileRow>();

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

      currentPoints = toNumber(newProfile?.points);
    }

    const { data: position, error: positionError } = await supabase
      .from("portfolio_positions")
      .select("quantity, average_buy_price")
      .eq("user_id", user.id)
      .eq("market", market)
      .maybeSingle<PositionRow>();

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

    const ticker = await fetchUpbitTicker(market);
    const currentQuantity = toNumber(position?.quantity);
    const currentAverageBuyPrice = toNumber(position?.average_buy_price);
    const tradeQuantity = pointsAmount / ticker.tradePrice;

    let nextPoints = currentPoints;
    let nextQuantity = currentQuantity;
    let nextAverageBuyPrice = currentAverageBuyPrice;

    if (side === "buy") {
      if (currentPoints < pointsAmount) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INSUFFICIENT_POINTS",
              message: "Not enough points to buy this coin.",
            },
          },
          { status: 400 },
        );
      }

      const nextCostBasis =
        currentQuantity * currentAverageBuyPrice + pointsAmount;
      nextQuantity = currentQuantity + tradeQuantity;
      nextAverageBuyPrice = nextCostBasis / nextQuantity;
      nextPoints = currentPoints - pointsAmount;
    } else {
      if (currentQuantity < tradeQuantity) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INSUFFICIENT_POSITION",
              message: "Not enough position to sell.",
            },
          },
          { status: 400 },
        );
      }

      nextQuantity = currentQuantity - tradeQuantity;
      if (nextQuantity < 0.000000000001) {
        nextQuantity = 0;
        nextAverageBuyPrice = 0;
      }
      nextPoints = currentPoints + pointsAmount;
    }

    const { error: pointsUpdateError } = await supabase
      .from("profiles")
      .update({
        points: nextPoints,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (pointsUpdateError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "POINTS_UPDATE_FAILED",
            message: pointsUpdateError.message,
          },
        },
        { status: 500 },
      );
    }

    const { error: positionUpdateError } = await supabase
      .from("portfolio_positions")
      .upsert(
        {
          user_id: user.id,
          market,
          quantity: nextQuantity,
          average_buy_price: nextAverageBuyPrice,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,market" },
      );

    if (positionUpdateError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "POSITION_UPDATE_FAILED",
            message: positionUpdateError.message,
          },
        },
        { status: 500 },
      );
    }

    const { error: orderInsertError } = await supabase
      .from("trade_orders")
      .insert({
        user_id: user.id,
        market,
        side,
        price: ticker.tradePrice,
        quantity: tradeQuantity,
        points_amount: pointsAmount,
      });

    if (orderInsertError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ORDER_INSERT_FAILED",
            message: orderInsertError.message,
          },
        },
        { status: 500 },
      );
    }

    const result: TradeResult = {
      market,
      side,
      price: ticker.tradePrice,
      quantity: tradeQuantity,
      pointsAmount,
      portfolio: buildPortfolioSummary({
        averageBuyPrice: nextAverageBuyPrice,
        market,
        points: nextPoints,
        quantity: nextQuantity,
        tradePrice: ticker.tradePrice,
        timestamp: ticker.timestamp,
      }),
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TRADE_FAILED",
          message: error.message || "Failed to submit trade.",
        },
      },
      { status: 500 },
    );
  }
}
