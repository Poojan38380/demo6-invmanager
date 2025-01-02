import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";

import { getCachedProductsforTable } from "./products/_actions/products";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const products = await getCachedProductsforTable();
  // const transactions = await getAllCachedTransactions();

  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardOverviewCards products={products} />
      </CardContent>
      {/* <DashboardAnalytics transactions={transactions} /> */}
    </Card>
  );
}
