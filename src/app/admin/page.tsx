import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";
import { TransactionGraphs } from "./_components/dashboard/transaction-graphs";
import { getCachedProductsforTable } from "./products/_actions/products";
import { getAllCachedTransactions } from "./transactions/_actions/getTransactions";

export default async function AdminPage() {
  const products = await getCachedProductsforTable();
  const transactions = await getAllCachedTransactions();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="flex flex-col gap-4">
        <DashboardOverviewCards products={products} />
        <TransactionGraphs transactions={transactions} />
      </div>
    </div>
  );
}
