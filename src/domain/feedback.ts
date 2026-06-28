export function createBasicFeedback(
  isCorrect: boolean,
  _mistakeCode: string | null,
): string {
  if (isCorrect) {
    return "정답입니다! 가장 거래량이 많이 터진 캔들을 올바르게 찾으셨습니다.";
  } else {
    return "선택하신 캔들은 가장 거래량이 많은 캔들이 아닙니다. 거래량 막대그래프를 다시 비교해 보세요.";
  }
}

