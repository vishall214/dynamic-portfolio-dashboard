import * as cheerio from "cheerio";

export async function getGoogleFinanceData(symbol: string) {
  const url = `https://www.google.com/finance/quote/${symbol}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Google Finance returned ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const text = $("body").text().replace(/\s+/g, " ");

  const peIndex = text.indexOf("P/E ratio");

  const firstEarningsIndex = text.indexOf("Net income");
  const earningsIndex = text.indexOf(
    "Net income",
    firstEarningsIndex + 1
  );

  const peText =
    peIndex >= 0
      ? text.substring(peIndex, peIndex + 150)
      : null;

  const earningsText =
    earningsIndex >= 0
      ? text.substring(earningsIndex, earningsIndex + 200)
      : null;

  let peRatio: number | null = null;
  let latestEarnings: number | null = null;

  if (peText) {
    const match = peText.match(/stocks([\d.]+)/);

    if (match) {
      peRatio = Number(match[1]);
    }
  }

  if (earningsText) {
    const match = earningsText.match(/interest([\d.]+)([BM])/);

    if (match) {
      const value = Number(match[1]);

      if (match[2] === "B") {
        latestEarnings = value * 1000000000;
      } else {
        latestEarnings = value * 1000000;
      }
    }
  }

  return {
    peRatio,
    latestEarnings,
  };
}