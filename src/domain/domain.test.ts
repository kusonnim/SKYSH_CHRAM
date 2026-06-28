import { describe, expect, it } from "vitest";
import {
  createFeedback,
  createLongestBodyQuestion,
  createMaxVolumeQuestion,
  findLongestBodyCandleIndex,
  findMaxVolumeCandleIndex,
  gradeSelectCandleAnswer,
  normalizeUpbitCandles,
  sortCandlesOldestFirst,
} from "./index";
import type { Candle } from "@/types";

const candles: Candle[] = [
  {
    time: "2026-06-03T00:00:00",
    open: 100,
    high: 110,
    low: 90,
    close: 105,
    volume: 300,
  },
  {
    time: "2026-06-01T00:00:00",
    open: 200,
    high: 260,
    low: 190,
    close: 250,
    volume: 500,
  },
  {
    time: "2026-06-02T00:00:00",
    open: 300,
    high: 310,
    low: 290,
    close: 305,
    volume: 500,
  },
];

describe("normalizeUpbitCandles", () => {
  it("maps valid Upbit candle rows to shared candles", () => {
    expect(
      normalizeUpbitCandles([
        {
          candle_date_time_kst: "2026-06-01T09:00:00",
          candle_date_time_utc: "2026-06-01T00:00:00",
          opening_price: 100,
          high_price: 120,
          low_price: 90,
          trade_price: 110,
          candle_acc_trade_volume: 42,
        },
      ]),
    ).toEqual([
      {
        time: "2026-06-01",
        open: 100,
        high: 120,
        low: 90,
        close: 110,
        volume: 42,
      },
    ]);
  });

  it("filters malformed rows", () => {
    expect(
      normalizeUpbitCandles([
        null,
        {
          candle_date_time_kst: "2026-06-01T09:00:00",
          opening_price: "not-a-number",
          high_price: 120,
          low_price: 90,
          trade_price: 110,
          candle_acc_trade_volume: 42,
        },
      ]),
    ).toEqual([]);
  });

  it("accepts string-typed numeric fields from SDK responses", () => {
    expect(
      normalizeUpbitCandles([
        {
          candle_date_time_kst: "2026-06-01T09:00:00",
          opening_price: "100",
          high_price: "120",
          low_price: "90",
          trade_price: "110",
          candle_acc_trade_volume: "42",
        },
      ]),
    ).toEqual([
      {
        time: "2026-06-01",
        open: 100,
        high: 120,
        low: 90,
        close: 110,
        volume: 42,
      },
    ]);
  });
});

describe("sortCandlesOldestFirst", () => {
  it("returns a sorted copy without mutating the input", () => {
    const sorted = sortCandlesOldestFirst(candles);

    expect(sorted.map((candle) => candle.time)).toEqual([
      "2026-06-01T00:00:00",
      "2026-06-02T00:00:00",
      "2026-06-03T00:00:00",
    ]);
    expect(candles[0].time).toBe("2026-06-03T00:00:00");
  });
});

describe("findMaxVolumeCandleIndex", () => {
  it("returns the first highest-volume candle index", () => {
    expect(findMaxVolumeCandleIndex(candles)).toBe(1);
  });

  it("returns -1 for empty input", () => {
    expect(findMaxVolumeCandleIndex([])).toBe(-1);
  });
});

describe("createMaxVolumeQuestion", () => {
  it("creates the MVP question with the correct answer index", () => {
    expect(createMaxVolumeQuestion(candles)).toEqual({
      id: "today-volume-max",
      type: "select_candle",
      market: "KRW-BTC",
      timeframe: "day",
      prompt: "Select the candle with the highest trading volume.",
      candles,
      answer: {
        correctIndex: 1,
      },
    });
  });
});

describe("findLongestBodyCandleIndex", () => {
  it("returns the index of the candle with the longest body", () => {
    expect(findLongestBodyCandleIndex(candles)).toBe(1);
  });

  it("returns -1 for empty input", () => {
    expect(findLongestBodyCandleIndex([])).toBe(-1);
  });
});

describe("createLongestBodyQuestion", () => {
  it("creates the longest body question with the correct answer index", () => {
    expect(createLongestBodyQuestion(candles)).toEqual({
      id: "longest-body-candle",
      type: "select_candle",
      stageId: "longest-body-candle",
      market: "KRW-BTC",
      timeframe: "day",
      prompt: "Select the candle with the largest body.",
      candles,
      answer: {
        correctIndex: 1,
      },
    });
  });
});

describe("gradeSelectCandleAnswer", () => {
  it("grades correct answers", () => {
    expect(gradeSelectCandleAnswer(1, 1)).toEqual({
      isCorrect: true,
      score: 100,
      mistakeCode: null,
    });
  });

  it("grades wrong answers", () => {
    expect(gradeSelectCandleAnswer(0, 1)).toEqual({
      isCorrect: false,
      score: 0,
      mistakeCode: "wrong_candle",
    });
  });

  it("rejects non-integer answers", () => {
    expect(gradeSelectCandleAnswer(1.5, 1)).toEqual({
      isCorrect: false,
      score: 0,
      mistakeCode: "invalid_selection",
    });
  });
});

describe("createFeedback", () => {
  it("returns correct-answer feedback", () => {
    expect(createFeedback(true, null)).toBe(
      "Great job! You correctly identified the highest-volume candle.",
    );
  });

  it("returns invalid-selection feedback", () => {
    expect(createFeedback(false, "invalid_selection")).toBe(
      "Please select one candle before submitting your answer.",
    );
  });

  it("returns wrong-candle feedback by default", () => {
    expect(createFeedback(false, "wrong_candle")).toBe(
      "That candle is not the highest-volume candle. Compare the volume bars again.",
    );
  });

  it("returns stage-specific correct feedback for longest-body-candle", () => {
    expect(createFeedback(true, null, "longest-body-candle")).toBe(
      "Correct. You found the candle with the strongest body.",
    );
  });

  it("returns stage-specific wrong feedback for longest-body-candle", () => {
    expect(createFeedback(false, "wrong_candle", "longest-body-candle")).toBe(
      "Not quite. Compare the distance between open and close again.",
    );
  });
});
