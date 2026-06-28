"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CandleChart } from "@/components/chart";
import type { Candle, PortfolioSummary, TradeSide } from "@/types";

function formatPoints(value: number) {
  return `${Math.round(value).toLocaleString()} P`;
}

function formatKrw(value: number) {
  return `${Math.round(value).toLocaleString()} KRW`;
}

function formatBtc(value: number) {
  return `${value.toFixed(8)} BTC`;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [pointsAmount, setPointsAmount] = useState("100");
  const [side, setSide] = useState<TradeSide>("buy");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tradePreview = useMemo(() => {
    const amount = Number(pointsAmount);
    if (!portfolio || !Number.isFinite(amount) || amount <= 0) {
      return 0;
    }
    return amount / portfolio.ticker.tradePrice;
  }, [pointsAmount, portfolio]);

  const maxSellPoints = useMemo(() => {
    if (!portfolio) {
      return 0;
    }

    return Math.floor(portfolio.valuation.positionValue);
  }, [portfolio]);

  async function loadPortfolio() {
    setError(null);
    try {
      const [portfolioResponse, candlesResponse] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/market/btc-candles"),
      ]);
      const [portfolioData, candlesData] = await Promise.all([
        portfolioResponse.json(),
        candlesResponse.json(),
      ]);

      if (!portfolioData.success) {
        throw new Error(
          portfolioData.error?.message ?? "Unable to load portfolio.",
        );
      }

      setPortfolio(portfolioData.data);
      if (candlesData.success) {
        setCandles(candlesData.data.candles);
      }
    } catch (err: any) {
      setError(err.message ?? "Unable to load portfolio.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPortfolio();
  }, []);

  async function handleTrade() {
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          side,
          pointsAmount: Number(pointsAmount),
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message ?? "Trade failed.");
      }
      setPortfolio(data.data.portfolio);
      setMessage(
        `${side === "buy" ? "Bought with" : "Sold for"} ${formatPoints(
          data.data.pointsAmount,
        )}: ${formatBtc(
          data.data.quantity,
        )} at ${formatKrw(data.data.price)}.`,
      );
    } catch (err: any) {
      setError(err.message ?? "Trade failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#c4c6d5] border-t-[#344e5d]" />
          <p className="mt-4 text-sm text-[#434653]">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-32 text-[#1a1b22]">
      <header className="sticky top-0 z-50 border-b border-[#c4c6d5]/40 bg-[#faf8ff]/85 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#747685]">
              Mock Investing
            </p>
            <h1 className="text-2xl font-bold text-[#344e5d]">Portfolio</h1>
          </div>
          <Link
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#344e5d] hover:bg-[#344e5d]/5"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 pt-8">
        {error && (
          <div className="rounded-xl border border-[#ba1a1a]/20 bg-[#ffdad6]/35 p-4 text-sm font-semibold text-[#ba1a1a]">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-[#00885d]/20 bg-[#d8f5e6] p-4 text-sm font-semibold text-[#006c49]">
            {message}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            label="Available Points"
            value={formatPoints(portfolio?.points ?? 0)}
          />
          <SummaryCard
            label="BTC Position"
            value={formatBtc(portfolio?.position.quantity ?? 0)}
          />
          <SummaryCard
            label="Total Asset Value"
            value={formatPoints(portfolio?.valuation.totalAssetValue ?? 0)}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-[#c4c6d5]/30 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#747685]">
                  KRW-BTC
                </p>
                <h2 className="mt-1 text-3xl font-bold text-[#1a1b22]">
                  {formatKrw(portfolio?.ticker.tradePrice ?? 0)}
                </h2>
              </div>
              <div className="rounded-full bg-[#ededf7] px-3 py-1 text-xs font-bold text-[#344e5d]">
                Upbit
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Metric
                label="Average Buy Price"
                value={formatKrw(portfolio?.position.averageBuyPrice ?? 0)}
              />
              <Metric
                label="Position Value"
                value={formatPoints(portfolio?.valuation.positionValue ?? 0)}
              />
              <Metric
                label="Invested Points"
                value={formatPoints(portfolio?.valuation.investedPoints ?? 0)}
              />
              <Metric
                label="Unrealized P/L"
                tone={
                  (portfolio?.valuation.unrealizedProfit ?? 0) >= 0
                    ? "positive"
                    : "negative"
                }
                value={`${formatPoints(
                  portfolio?.valuation.unrealizedProfit ?? 0,
                )} (${(portfolio?.valuation.unrealizedProfitRate ?? 0).toFixed(
                  2,
                )}%)`}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#c4c6d5]/30 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1a1b22]">Trade BTC</h2>
            <div className="mt-5 flex rounded-lg bg-[#e2e2eb]/60 p-1">
              {(["buy", "sell"] as TradeSide[]).map((option) => (
                <button
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-bold uppercase ${
                    side === option
                      ? "bg-[#344e5d] text-white shadow-sm"
                      : "text-[#434653]"
                  }`}
                  key={option}
                  onClick={() => setSide(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-sm font-semibold text-[#434653]">
              {side === "buy" ? "Points to spend" : "Points to receive"}
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-[#c4c6d5] bg-[#f3f3fd] px-4 py-3 text-[#1a1b22]"
              min="10"
              onChange={(event) => setPointsAmount(event.target.value)}
              type="number"
              value={pointsAmount}
            />
            <div className="mt-3 space-y-1 text-xs font-medium text-[#747685]">
              <p>
                {side === "buy" ? "Estimated BTC" : "BTC to sell"}:{" "}
                <span className="font-bold text-[#344e5d]">
                  {formatBtc(tradePreview)}
                </span>
              </p>
              {side === "sell" && (
                <p>
                  Max sellable now:{" "}
                  <button
                    className="font-bold text-[#344e5d] underline underline-offset-2"
                    onClick={() => setPointsAmount(String(maxSellPoints))}
                    type="button"
                  >
                    {formatPoints(maxSellPoints)}
                  </button>
                </p>
              )}
            </div>

            <button
              className="mt-6 w-full rounded-xl bg-[#344e5d] py-4 font-bold uppercase text-white shadow-md transition-colors hover:bg-[#4c6676] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                submitting ||
                (side === "sell" &&
                  (maxSellPoints <= 0 || Number(pointsAmount) > maxSellPoints))
              }
              onClick={handleTrade}
              type="button"
            >
              {submitting
                ? "Submitting..."
                : side === "buy"
                  ? "Buy BTC with points"
                  : "Sell BTC for points"}
            </button>
          </div>
        </section>

        {candles.length > 0 ? (
          <CandleChart
            candles={candles}
            selectable={false}
            selectedIndex={null}
          />
        ) : (
          <section className="flex h-[420px] items-center justify-center rounded-xl border border-[#c4c6d5]/30 bg-white text-sm font-semibold text-[#747685] shadow-sm">
            BTC chart unavailable.
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-[#c4c6d5]/40 bg-[#faf8ff]/85 px-4 shadow-lg backdrop-blur-md">
        <Link
          className="flex flex-col items-center justify-center px-4 py-1 text-[#434653]"
          href="/dashboard"
        >
          <span className="text-lg font-bold">L</span>
          <span className="mt-1 text-[10px] font-bold uppercase">Learn</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center rounded-xl bg-[#4c6676] px-6 py-1 text-[#c8e3f6]"
          href="/portfolio"
        >
          <span className="text-lg font-bold">B</span>
          <span className="mt-1 text-[10px] font-bold uppercase">Invest</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center px-4 py-1 text-[#434653]"
          href="/profile"
        >
          <span className="text-lg font-bold">P</span>
          <span className="mt-1 text-[10px] font-bold uppercase">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#c4c6d5]/30 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-[#747685]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-[#1a1b22]">{value}</p>
    </div>
  );
}

function Metric({
  label,
  tone,
  value,
}: {
  label: string;
  tone?: "positive" | "negative";
  value: string;
}) {
  const toneClass =
    tone === "positive"
      ? "text-[#006c49]"
      : tone === "negative"
        ? "text-[#ba1a1a]"
        : "text-[#1a1b22]";

  return (
    <div className="rounded-lg bg-[#f3f3fd] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#747685]">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
