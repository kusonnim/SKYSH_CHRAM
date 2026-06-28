"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  CandlestickSeries,
  HistogramSeries,
  Time,
} from "lightweight-charts";
import type { Candle } from "@/types";

type CandleChartProps = {
  candles: Candle[];
  selectedIndex: number | null;
  onSelectCandle: (index: number) => void;
};

function toChartTime(time: string): Time {
  return time.includes("T") ? time.split("T")[0] : time;
}

export function CandleChart({
  candles,
  selectedIndex,
  onSelectCandle,
}: CandleChartProps) {
  const chartContainer = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const timeToIndex = useMemo(() => {
    return candles.reduce<Record<string, number>>((map, candle, index) => {
      map[String(toChartTime(candle.time))] = index;
      return map;
    }, {});
  }, [candles]);

  useEffect(() => {
    const container = chartContainer.current;
    if (!container) return;

    const initialWidth = Math.max(container.clientWidth, 1);

    const chart = createChart(container, {
      width: initialWidth,
      height: 520,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#0f172a",
      },
      grid: {
        vertLines: { color: "#e2e8f0" },
        horzLines: { color: "#e2e8f0" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "#cbd5e1",
      },
      timeScale: {
        borderColor: "#cbd5e1",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderVisible: false,
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume",
      color: "rgba(15, 23, 42, 0.2)",
    });

    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      if (width > 0) {
        chart.applyOptions({ width, height: 520 });
        chart.timeScale().fitContent();
      }
    });

    resizeObserver.observe(container);

    chart.subscribeClick((param) => {
      const rawTime = param.time;
      if (!rawTime) return;
      const time = String(rawTime);
      const index = timeToIndex[time];
      if (index !== undefined) {
        onSelectCandle(index);
      }
    });

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [onSelectCandle, timeToIndex]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    const chart = chartRef.current;
    if (!candleSeries || !volumeSeries || !chart) return;

    const candleData: CandlestickData[] = candles.map((candle) => ({
      time: toChartTime(candle.time),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    const volumeData: HistogramData[] = candles.map((candle) => ({
      time: toChartTime(candle.time),
      value: candle.volume,
      color: candle.close >= candle.open ? "rgba(22, 163, 74, 0.35)" : "rgba(220, 38, 38, 0.35)",
    }));

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();
  }, [candles]);

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="font-semibold text-slate-950">BTC Daily Chart</h2>
          <p className="text-sm text-slate-500">Click a candle to select it.</p>
        </div>
        <span className="text-sm text-slate-500">Selected: {selectedIndex ?? "none"}</span>
      </div>
      <div ref={chartContainer} className="mt-4 h-[520px] w-full" />
    </div>
  );
}

