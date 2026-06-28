import type { Candle } from "@/types";

type CandleChartProps = {
  candles: Candle[];
  selectedIndex: number | null;
  onSelectCandle: (index: number) => void;
};

export function CandleChart({
  candles,
  selectedIndex,
  onSelectCandle,
}: CandleChartProps) {
  return (
    <div className="min-h-[520px] rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="font-semibold text-slate-950">BTC Daily Chart</h2>
        <span className="text-sm text-slate-500">
          Selected: {selectedIndex ?? "none"}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-10 items-end gap-1">
        {candles.map((candle, index) => (
          <button
            className="min-h-16 rounded bg-slate-200 text-xs text-slate-700"
            key={candle.time}
            onClick={() => onSelectCandle(index)}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

