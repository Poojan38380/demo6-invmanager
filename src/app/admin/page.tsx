import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";

import DashboardAnalytics from "./dash-analytics";
import { getCachedProductsforTable } from "./products/_actions/products";
import { getAllCachedTransactions } from "./transactions/_actions/getTransactions";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminPage() {
  const products = await getCachedProductsforTable();
  const transactions = await getAllCachedTransactions();

  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardOverviewCards products={products} />
      </CardContent>
      <DashboardAnalytics transactions={transactions} />
      <CardFooter></CardFooter>
    </Card>
  );
}
