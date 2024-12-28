import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";
import TransactionGraphs from "./_components/dashboard/transaction-graphs";
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
      <CardContent className="max-768:px-0">
        <TransactionGraphs transactions={transactions} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
