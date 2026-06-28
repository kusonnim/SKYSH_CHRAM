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

export type PortfolioSummary = {
  market: string;
  points: number;
  position: {
    quantity: number;
    averageBuyPrice: number;
  };
  ticker: {
    tradePrice: number;
    timestamp: number;
  };
  valuation: {
    positionValue: number;
    investedPoints: number;
    unrealizedProfit: number;
    unrealizedProfitRate: number;
    totalAssetValue: number;
  };
};

export type TradeSide = "buy" | "sell";

export type SubmitTradeRequest = {
  market: string;
  side: TradeSide;
  pointsAmount: number;
};

export type TradeResult = {
  market: string;
  side: TradeSide;
  price: number;
  quantity: number;
  pointsAmount: number;
  portfolio: PortfolioSummary;
};
