export type GradeSelectCandleAnswerResult = {
  isCorrect: boolean;
  score: number;
  mistakeCode: string | null;
};

export function gradeSelectCandleAnswer(
  selectedIndex: number,
  correctIndex: number,
): GradeSelectCandleAnswerResult {
  const isCorrect = selectedIndex === correctIndex;

  return {
    isCorrect,
    score: isCorrect ? 1 : 0,
    mistakeCode: isCorrect ? null : "wrong_selection",
  };
}

