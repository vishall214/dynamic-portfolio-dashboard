import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { portfolio } from "@/data/portfolio";

const yahooFinance = new YahooFinance();

const cache = new Map<string, {
  data: any;
  time: number;
}>();

const CACHE_TIME = 12000;

export async function GET() {
  const data = await Promise.all(
    portfolio.map(async (stock) => {
      const cached = cache.get(stock.exchangeSymbol);

      if (cached && Date.now() - cached.time < CACHE_TIME) {
        return {
          ...stock,
          ...cached.data,
        };
      }

      try {
        const result = await yahooFinance.quoteSummary(
          stock.exchangeSymbol,
          {
            modules: ["price", "summaryDetail"],
          }
        );

        const liveData = {
          cmp: result.price?.regularMarketPrice ?? null,
          peRatio: result.summaryDetail?.trailingPE ?? null,
          latestEarnings: null,
        };

        cache.set(stock.exchangeSymbol, {
          data: liveData,
          time: Date.now(),
        });

        return {
          ...stock,
          ...liveData,
        };
      } catch (error) {
        return {
          ...stock,
          cmp: null,
          peRatio: null,
          latestEarnings: null,
          error: "Failed to fetch stock data",
        };
      }
    })
  );

  return NextResponse.json({
    data,
    fetchedAt: new Date().toISOString(),
  });
}