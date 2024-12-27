import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";
import { getCachedProductsforTable } from "./products/_actions/products";

export default async function AdminPage() {
  const products = await getCachedProductsforTable();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <DashboardOverviewCards products={products} />
    </div>
  );
}
