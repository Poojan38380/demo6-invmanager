import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { ProductWithOneImage } from "../../products/_actions/products";
import Link from "next/link";

const DashboardOverviewCards = ({
  products,
}: {
  products: ProductWithOneImage[];
}) => {
  const calculateMetrics = () => {
    let belowBufferCount = 0;
    let approachingBufferCount = 0;
    const approachingThreshold = 1.1; // 10% above buffer stock

    products.forEach((product) => {
      // Skip archived products
      if (product.isArchived) return;

      const bufferStock = product.bufferStock || 0;
      const currentStock = product.stock || 0;

      // Check buffer stock conditions
      if (currentStock < bufferStock) {
        belowBufferCount++;
      } else if (
        currentStock <= bufferStock * approachingThreshold &&
        currentStock >= bufferStock
      ) {
        approachingBufferCount++;
      }
    });

    return {
      belowBufferCount,
      approachingBufferCount,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Approaching Buffer Stock Warning */}

      <Link prefetch={false} href={"/admin/products/warning"} target="_blank">
        <Card className="bg-warning/10 shadow-md rounded-2xl border-none hover:shadow-lg hover:scale-105 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Approaching Min. Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.approachingBufferCount}
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Products nearing minimum stock level
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Below Buffer Stock Alert */}
      {metrics.belowBufferCount > 0 ? (
        <Link
          prefetch={false}
          href={"/admin/products/critical"}
          target="_blank"
        >
          <Card className="bg-destructive/30 shadow-md rounded-2xl border-none  hover:shadow-lg hover:scale-105 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Below Min. Stock
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {metrics.belowBufferCount}
              </div>
              <p className="text-xs text-red-600 mt-1">
                Products requiring immediate attention
              </p>
            </CardContent>
          </Card>
        </Link>
      ) : null}
    </div>
  );
};

export default DashboardOverviewCards;
