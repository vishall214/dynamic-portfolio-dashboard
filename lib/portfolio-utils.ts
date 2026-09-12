import { StockInput, StockLiveData, StockRow, SectorSummary } from "@/types/stock";

export function buildRows(
  inputs: StockInput[],
  live: Record<string, StockLiveData>
): StockRow[] {
  const totalInvestment = inputs.reduce(
    (sum, stock) => sum + stock.purchasePrice * stock.qty,
    0
  );

  return inputs.map((stock) => {
    const liveData = live[stock.exchangeSymbol] ?? {
      cmp: null,
      peRatio: null,
      latestEarnings: null,
    };

    const investment = stock.purchasePrice * stock.qty;
    const presentValue =
      liveData.cmp !== null ? liveData.cmp * stock.qty : null;

    const gainLoss =
      presentValue !== null ? presentValue - investment : null;

    const gainLossPct =
      gainLoss !== null ? (gainLoss / investment) * 100 : null;

    const portfolioPct =
      totalInvestment ? (investment / totalInvestment) * 100 : 0;

    return {
      ...stock,
      ...liveData,
      investment,
      presentValue,
      gainLoss,
      gainLossPct,
      portfolioPct,
    };
  });
}

export function groupBySector(rows: StockRow[]): SectorSummary[] {
  const groups: Record<string, StockRow[]> = {};

  rows.forEach((row) => {
    if (!groups[row.sector]) {
      groups[row.sector] = [];
    }

    groups[row.sector].push(row);
  });

  return Object.entries(groups).map(([sector, sectorRows]) => ({
    sector,
    rows: sectorRows,
    totalInvestment: sectorRows.reduce(
      (sum, row) => sum + row.investment,
      0
    ),
    totalPresentValue: sectorRows.reduce(
      (sum, row) => sum + (row.presentValue ?? 0),
      0
    ),
    totalGainLoss: sectorRows.reduce(
      (sum, row) => sum + (row.gainLoss ?? 0),
      0
    ),
  }));
}

export function formatCurrency(value: number | null) {
  if (value === null) return "-";

  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number | null) {
  if (value === null) return "-";

  return `${value.toFixed(2)}%`;
}