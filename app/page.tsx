import { PortfolioTable } from "@/components/PortfolioTable";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Dynamic Portfolio Dashboard
      </h1>

      <PortfolioTable />
    </main>
  );
}