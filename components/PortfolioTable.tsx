"use client";

import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { portfolio } from "@/data/portfolio";
import {
  buildRows,
  formatCurrency,
  formatPercent,
} from "@/lib/portfolio-utils";
import { StockLiveData, StockRow } from "@/types/stock";

const helper = createColumnHelper<StockRow>();

const columns = [
  helper.accessor("name", {
    header: "Particulars",
  }),
  helper.accessor("purchasePrice", {
    header: "Purchase Price",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  helper.accessor("qty", {
    header: "Qty",
  }),
  helper.accessor("investment", {
    header: "Investment",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  helper.accessor("portfolioPct", {
    header: "Portfolio %",
    cell: (info) => formatPercent(info.getValue()),
  }),
  helper.accessor("exchangeSymbol", {
    header: "NSE/BSE",
  }),
  helper.accessor("cmp", {
    header: "CMP",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  helper.accessor("presentValue", {
    header: "Present Value",
    cell: (info) => formatCurrency(info.getValue()),
  }),
  helper.accessor("gainLoss", {
    header: "Gain/Loss",
    cell: (info) => {
      const value = info.getValue();

      if (value === null) return "-";

      return (
        <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
          {formatCurrency(value)}
        </span>
      );
    },
  }),
  helper.accessor("peRatio", {
    header: "P/E",
    cell: (info) => info.getValue() ?? "-",
  }),
];

export function PortfolioTable() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("/api/stocks");

        if (!response.ok) {
          throw new Error();
        }

        const result = await response.json();

        const live: Record<string, StockLiveData> = {};

        for (const stock of result.data) {
          live[stock.exchangeSymbol] = {
            cmp: stock.cmp,
            peRatio: stock.peRatio,
            latestEarnings: stock.latestEarnings,
          };
        }

        setRows(buildRows(portfolio, live));
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getData();

    const interval = setInterval(getData, 15000);

    return () => clearInterval(interval);
  }, []);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to load stock data.</p>;
  }

  const sectors = [...new Set(rows.map((row) => row.sector))];

  return (
    <div>
      {sectors.map((sector) => (
        <div key={sector} className="mb-6">
          <h2 className="mb-2 text-lg font-bold">{sector}</h2>

          <table className="w-full border">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="border p-2 text-left"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table
                .getRowModel()
                .rows.filter((row) => row.original.sector === sector)
                .map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}