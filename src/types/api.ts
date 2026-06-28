export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Question = {
  id: string;
  type: "select_candle";
  stageId?: string;
  market: string;
  timeframe: string;
  prompt: string;
  candles: Candle[];
  answer?: {
    correctIndex: number;
  };
};

export type SubmitAnswerRequest = {
  questionId: string;
  selectedCandleIndex: number;
  correctCandleIndex: number;
};

export type AnswerResult = {
  isCorrect: boolean;
  score: number;
  feedback: string;
};
