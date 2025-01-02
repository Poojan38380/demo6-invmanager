import { Suspense } from "react";
import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";
import DashboardSkeleton from "./_components/dashboard/dashboard-skeleton";
import { getCachedProductsforTable } from "./products/_actions/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminPageContent />
    </Suspense>
  );
}

async function AdminPageContent() {
  const products = await getCachedProductsforTable();

  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardOverviewCards products={products} />
      </CardContent>
    </Card>
  );
}
