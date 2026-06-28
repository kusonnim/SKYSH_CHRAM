export function createFeedback(
  isCorrect: boolean,
  mistakeCode: string | null,
  stageId?: string,
): string {
  if (isCorrect) {
    if (stageId === "longest-body-candle") {
      return "정답입니다! 몸통이 가장 긴 캔들을 정확히 찾으셨습니다.";
    }
    return "Great job! You correctly identified the highest-volume candle.";
  }

  if (mistakeCode === "invalid_selection") {
    return "Please select one candle before submitting your answer.";
  }

  if (stageId === "longest-body-candle") {
    return "시가와 종가의 차이가 가장 큰 캔들을 찾아야 합니다.";
  }

  return "That candle is not the highest-volume candle. Compare the volume bars again.";
}
