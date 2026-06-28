export function createFeedback(
  isCorrect: boolean,
  mistakeCode: string | null,
  stageId?: string,
): string {
  if (isCorrect) {
    if (stageId === "longest-body-candle") {
      return "Correct. You found the candle with the strongest body.";
    }
    return "Great job! You correctly identified the highest-volume candle.";
  }

  if (mistakeCode === "invalid_selection") {
    return "Please select one candle before submitting your answer.";
  }

  if (stageId === "longest-body-candle") {
    return "Not quite. Compare the distance between open and close again.";
  }

  return "That candle is not the highest-volume candle. Compare the volume bars again.";
}
