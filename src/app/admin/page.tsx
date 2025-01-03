import { Suspense } from "react";
import DashboardOverviewCards from "./_components/dashboard/dashboard-overview-cards";
import QuickActions from "./_components/dashboard/quick-actions";
import { getCachedProductsforTable } from "./products/_actions/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for the dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Quick Actions Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

// Async component for loading data
async function DashboardContent() {
  const products = await getCachedProductsforTable();

  return (
    <>
      <QuickActions />
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardOverviewCards products={products} />
      </CardContent>
    </>
  );
}

export default function AdminPage() {
  return (
    <Card className="border-none shadow-none bg-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </Card>
  );
}
