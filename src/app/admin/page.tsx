import { Suspense } from "react";
import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";
import QuickActions from "./_components/dashboard/quick-actions";
import { getCachedProductsforTable } from "./products/_actions/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-6">
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="w-full h-[150px] " />
            <Skeleton className="w-full h-[150px] " />
            <Skeleton className="w-full h-[150px] " />
            <Skeleton className="w-full h-[150px] " />
          </div>

          <Skeleton className="w-[100px] h-[20px] rounded-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="w-full h-[150px] " />
            <Skeleton className="w-full h-[150px] " />
          </div>
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
          <div className="">
            <Skeleton className="w-full h-[350px] " />
          </div>
        </div>
      }
    >
      <AdminPageComp />
    </Suspense>
  );
}
