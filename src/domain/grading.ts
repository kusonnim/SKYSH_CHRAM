export type GradeSelectCandleAnswerResult = {
  isCorrect: boolean;
  score: number;
  mistakeCode: string | null;
};

export function gradeSelectCandleAnswer(
  selectedIndex: number,
  correctIndex: number,
): GradeSelectCandleAnswerResult {
  if (!Number.isInteger(selectedIndex) || !Number.isInteger(correctIndex)) {
    return {
      isCorrect: false,
      score: 0,
      mistakeCode: "invalid_selection",
    };
  }

  if (selectedIndex !== correctIndex) {
    return {
      isCorrect: false,
      score: 0,
      mistakeCode: "wrong_candle",
    };
  }

  return {
    isCorrect: true,
    score: 100,
    mistakeCode: null,
  };
}
