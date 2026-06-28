import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchUpbitTicker } from "@/server/upbit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { side, quantity } = body as { side?: string; quantity?: number };

    // 1. Validate request body
    if (!side || !quantity || (side !== "buy" && side !== "sell") || quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Invalid request body. 'side' must be 'buy' or 'sell', and 'quantity' must be greater than 0.",
          },
        },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    // 2. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
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

    // 3. Fetch real-time BTC price from Upbit
    let price: number;
    try {
      price = await fetchUpbitTicker("KRW-BTC");
    } catch (tickerError: any) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UPBIT_FETCH_FAILED",
            message: tickerError.message || "Failed to fetch real-time BTC price.",
          },
        },
        { status: 500 },
      );
    }

    // 4. Calculate total points required/gained
    const pointsAmount = Math.floor(price * quantity);
    if (pointsAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TRADE_AMOUNT_TOO_SMALL",
            message: "The calculated trade points amount is too small. Please increase the quantity.",
          },
        },
        { status: 400 },
      );
    }

    // 5. Execute trade via PostgreSQL RPC to ensure ACID transactions
    if (side === "buy") {
      const { data, error } = await supabase.rpc("process_buy_trade", {
        p_user_id: user.id,
        p_market: "KRW-BTC",
        p_price: price,
        p_quantity: quantity,
        p_points_amount: pointsAmount,
      });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: error.message,
            },
          },
          { status: 500 },
        );
      }

      const result = data as { success: boolean; message?: string; new_points?: number; new_quantity?: number; new_average_buy_price?: number };
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "TRADE_EXECUTION_FAILED",
              message: result.message || "Failed to execute buy trade.",
            },
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          side,
          price,
          quantity,
          pointsAmount,
          newPoints: result.new_points,
          newQuantity: result.new_quantity,
          newAverageBuyPrice: result.new_average_buy_price,
        },
      });
    } else {
      // side === 'sell'
      const { data, error } = await supabase.rpc("process_sell_trade", {
        p_user_id: user.id,
        p_market: "KRW-BTC",
        p_price: price,
        p_quantity: quantity,
        p_points_amount: pointsAmount,
      });

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: error.message,
            },
          },
          { status: 500 },
        );
      }

      const result = data as { success: boolean; message?: string; new_points?: number; new_quantity?: number };
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "TRADE_EXECUTION_FAILED",
              message: result.message || "Failed to execute sell trade.",
            },
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          side,
          price,
          quantity,
          pointsAmount,
          newPoints: result.new_points,
          newQuantity: result.new_quantity,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Internal server error",
        },
      },
      { status: 500 },
    );
  }
}
