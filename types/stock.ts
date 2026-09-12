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

export interface Stockrow extends StockInput, StockLiveData {
    investment: number;
    presentValue: number;
    gainLoss: number;
    gainLessPct: number;
    PortfolioPct: number;
}

export interface SectorSummary {
    sector: string;
    totalInvestment: number;
    totalPresentValue: number;
    totalGainLoss: number;
    rows: Stockrow[];
}

