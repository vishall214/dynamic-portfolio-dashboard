export interface StockInput {
    id: string;
    name: string;
    purchasePrice: number;
    qty: number;
    exchangeSymbol: string;
    sector: string;
}

export interface StockLiveData {
    cmp: number | null;
    peRatio: number | null;
    latestEarnings: number | null;
    error?: string;
}

export interface StockRow extends StockInput, StockLiveData {
    investment: number;
    presentValue: number | null;
    gainLoss: number | null;
    gainLossPct: number | null;
    portfolioPct: number;
}

export interface SectorSummary {
    sector: string;
    totalInvestment: number;
    totalPresentValue: number;
    totalGainLoss: number;
    rows: StockRow[];
}

