"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  Time,
  SeriesMarker,
} from "lightweight-charts";
import type { Candle } from "@/types";

type CandleChartProps = {
  candles: Candle[];
  selectedIndex: number | null;
  onSelectCandle?: (index: number) => void;
  correctIndex?: number | null;
  isWrong?: boolean;
  selectable?: boolean;
  title?: string;
};

function toChartTime(time: string): Time {
  return time.includes("T") ? time.split("T")[0] : time;
}

export function CandleChart({
  candles,
  selectedIndex,
  onSelectCandle,
  correctIndex,
  isWrong,
  selectable = true,
  title = "Candlestick Chart",
}: CandleChartProps) {
  const chartContainer = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const handlerRef = useRef<(index: number) => void>(() => {});
  const timeToIndexRef = useRef<Record<string, number>>({});

  useEffect(() => {
    handlerRef.current = onSelectCandle ?? (() => {});
  }, [onSelectCandle]);

  useEffect(() => {
    const map: Record<string, number> = {};
    candles.forEach((candle, index) => {
      map[String(toChartTime(candle.time))] = index;
    });
    timeToIndexRef.current = map;
  }, [candles]);

  useEffect(() => {
    const container = chartContainer.current;
    if (!container) return;

    const chart = createChart(container, {
      width: Math.max(container.clientWidth, 1),
      height: 360,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#1a1b22",
        attributionLogo: false,
      },
      localization: {
        priceFormatter: (price: number) =>
          new Intl.NumberFormat("en-US").format(price),
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      grid: {
        vertLines: { color: "#e4e1ed" },
        horzLines: { color: "#e4e1ed" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "#c4c6d5",
      },
      timeScale: {
        borderColor: "#c4c6d5",
        fixLeftEdge: true,
        fixRightEdge: true,
        secondsVisible: false,
        timeVisible: true,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#00885d",
      downColor: "#ba1a1a",
      borderVisible: false,
      wickUpColor: "#00885d",
      wickDownColor: "#ba1a1a",
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume",
      color: "rgba(67, 70, 83, 0.2)",
    });

    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      if (width > 0) {
        chart.applyOptions({ width, height: 360 });
        chart.timeScale().fitContent();
      }
    });

    resizeObserver.observe(container);

    chart.subscribeClick((param) => {
      const rawTime = param.time as Time | string | undefined;
      if (!selectable) return;
      if (!rawTime) return;
      const index = timeToIndexRef.current[String(rawTime)];
      if (index !== undefined) {
        handlerRef.current(index);
      }
    });

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [selectable]);

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

    const volumeData: HistogramData[] = candles.map((candle, index) => ({
      time: toChartTime(candle.time),
      value: candle.volume,
      color:
        selectedIndex === index
          ? "rgba(70, 72, 212, 0.85)"
          : candle.close >= candle.open
            ? "rgba(0, 136, 93, 0.28)"
            : "rgba(186, 26, 26, 0.24)",
    }));

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();
  }, [candles]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    if (!candleSeries) return;

    const markers: SeriesMarker<Time>[] = [];
    if (isWrong && selectedIndex !== null && candles[selectedIndex]) {
      markers.push({
        time: toChartTime(candles[selectedIndex].time),
        position: 'aboveBar',
        color: '#dc2626',
        shape: 'arrowDown',
        text: '오답',
      });
    }
    if (correctIndex != null && candles[correctIndex]) {
      markers.push({
        time: toChartTime(candles[correctIndex].time),
        position: 'belowBar',
        color: '#16a34a',
        shape: 'arrowUp',
        text: '정답',
      });
    }

    markers.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
    candleSeries.setMarkers(markers);
  }, [candles, selectedIndex, correctIndex, isWrong]);

  return (
    <section className="rounded-xl border border-[#c4c6d5]/50 bg-[#f3f3fd] p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1a1b22]">{title}</h3>
        {selectable && (
          <div className="text-[10px] font-medium uppercase text-[#434653]">
            Selected:{" "}
            <span className="font-bold text-[#344e5d]">
              {selectedIndex === null ? "none" : `Candle #${selectedIndex + 1}`}
            </span>
          </div>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border border-[#c4c6d5]/30 bg-white">
        <div ref={chartContainer} className="h-[360px] w-full" />
      </div>
      {(isWrong || correctIndex != null) && (
        <div className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#434653]">
          {isWrong && selectedIndex !== null
            ? `Try again: Candle #${selectedIndex + 1} is not the answer.`
            : null}
          {correctIndex != null
            ? ` Correct candle: #${correctIndex + 1}.`
            : null}
        </div>
      )}
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[#00885d]" />
          <span className="text-[10px] font-bold uppercase text-[#434653]">
            Bullish
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-[#ba1a1a]" />
          <span className="text-[10px] font-bold uppercase text-[#434653]">
            Bearish
          </span>
        </div>
      </div>
    </section>
  );
}
