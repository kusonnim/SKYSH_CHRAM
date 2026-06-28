export type SupportedMarket = {
  label: string;
  market: string;
  symbol: string;
};

export const supportedMarkets: SupportedMarket[] = [
  { label: "Bitcoin", market: "KRW-BTC", symbol: "BTC" },
  { label: "Ethereum", market: "KRW-ETH", symbol: "ETH" },
  { label: "XRP", market: "KRW-XRP", symbol: "XRP" },
  { label: "Solana", market: "KRW-SOL", symbol: "SOL" },
  { label: "Dogecoin", market: "KRW-DOGE", symbol: "DOGE" },
];

export const DEFAULT_MARKET = supportedMarkets[0].market;

export function findSupportedMarket(market: string | null | undefined) {
  return (
    supportedMarkets.find((supportedMarket) => supportedMarket.market === market) ??
    supportedMarkets[0]
  );
}

export function isSupportedMarket(market: unknown): market is string {
  return (
    typeof market === "string" &&
    supportedMarkets.some((supportedMarket) => supportedMarket.market === market)
  );
}
