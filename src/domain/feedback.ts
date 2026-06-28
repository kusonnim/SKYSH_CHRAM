export function createBasicFeedback(
  isCorrect: boolean,
  mistakeCode: string | null,
): string {
  if (isCorrect) {
    return "Great job! You correctly identified the highest-volume candle.";
  }

  if (mistakeCode === "invalid_selection") {
    return "Please select one candle before submitting your answer.";
  }

  return "That candle is not the highest-volume candle. Compare the volume bars again.";
}
