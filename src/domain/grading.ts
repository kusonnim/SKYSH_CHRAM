export type GradeSelectCandleAnswerResult = {
  isCorrect: boolean;
  score: number;
  mistakeCode: string | null;
};

export function gradeSelectCandleAnswer(
  _selectedIndex: number,
  _correctIndex: number,
): GradeSelectCandleAnswerResult {
  throw new Error("TODO: implement gradeSelectCandleAnswer in the domain layer.");
}

