import { Suspense } from "react";
import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";
import QuickActions from "./_components/dashboard/quick-actions";

import { getCachedProductsforTable } from "./products/_actions/products";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
async function AdminPageComp() {
  const products = await getCachedProductsforTable();

  return (
    <Card className="border-none  shadow-none bg-background ">
      <QuickActions />
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardOverviewCards products={products} />
      </CardContent>
    </Card>
  );
}
export default async function AdminPage() {
  return (
    <Suspense fallback={<Loader className="animate-spin" />}>
      <AdminPageComp />
    </Suspense>
  );
}
