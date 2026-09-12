import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { portfolio } from "@/data/portfolio";
import { getGoogleFinanceData } from "@/lib/google-finance";

const yahooFinance = new YahooFinance();

const cache = new Map<string, {
  data: any;
  time: number;
}>();

const CACHE_TIME = 12000;

function toGoogleSymbol(symbol: string) {
  if (symbol.endsWith(".NS")) {
    return `${symbol.replace(".NS", "")}:NSE`;
  }

  return `${symbol.replace(".BO", "")}:BOM`;
}

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

      let cmp: number | null = null;
      let peRatio: number | null = null;
      let latestEarnings: number | null = null;

      try {
        const result = await yahooFinance.quoteSummary(
          stock.exchangeSymbol,
          {
            modules: ["price"],
          }
        );

        cmp = result.price?.regularMarketPrice ?? null;
      } catch {
        console.log(
          `Yahoo Finance failed for ${stock.exchangeSymbol}`
        );
      }

      try {
        const result = await getGoogleFinanceData(
          toGoogleSymbol(stock.exchangeSymbol)
        );

        peRatio = result.peRatio;
        latestEarnings = result.latestEarnings;
      } catch {
        console.log(
          `Google Finance failed for ${stock.exchangeSymbol}`
        );
      }

      const liveData = {
        cmp,
        peRatio,
        latestEarnings,
      };

      cache.set(stock.exchangeSymbol, {
        data: liveData,
        time: Date.now(),
      });

      return {
        ...stock,
        ...liveData,
      };
    })
  );

  return NextResponse.json({
    data,
    fetchedAt: new Date().toISOString(),
  });
}