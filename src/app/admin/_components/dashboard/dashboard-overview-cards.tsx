import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Package } from "lucide-react";
import Link from "next/link";
import { ProductWithOneImage } from "../../products/_actions/products";

const DashboardOverviewCards = ({
  products,
}: {
  products: ProductWithOneImage[];
}) => {
  const calculateMetrics = () => {
    let belowBufferCount = 0;
    let approachingBufferCount = 0;
    let totalProducts = 0;
    let totalStock = 0;
    const approachingThreshold = 1.1; // 10% above buffer stock

    products.forEach((product) => {
      if (!product.isArchived) {
        totalProducts++;

        // Calculate actual stock based on whether product has variants
        const actualStock = product.hasVariants
          ? product.productVariants?.reduce(
              (sum, variant) => sum + variant.variantStock,
              0
            ) ?? 0
          : product.stock || 0;

        totalStock += actualStock;
        const bufferStock = product.bufferStock || 0;

        // Check buffer stock conditions using actual stock
        if (actualStock < bufferStock) {
          belowBufferCount++;
        } else if (
          actualStock <= bufferStock * approachingThreshold &&
          actualStock >= bufferStock
        ) {
          approachingBufferCount++;
        }
      }
    });

    return {
      belowBufferCount,
      approachingBufferCount,
      totalProducts,
      totalStock,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Active Products */}
      <Link prefetch={false} href="/admin/products">
        <Card className="bg-primary/5 rounded-2xl hover:shadow-lg hover:scale-105 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {metrics.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total stock: {metrics.totalStock.toLocaleString()} units
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Approaching Buffer Stock Warning */}
      {metrics.approachingBufferCount > 0 && (
        <Link prefetch={false} href="/admin/products/warning" target="_blank">
          <Card className="bg-warning/5 rounded-2xl hover:shadow-lg hover:scale-105 transition-all">
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
              <p className="text-xs text-yellow-700 mt-1">
                Products nearing minimum stock level
              </p>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Below Buffer Stock Alert */}
      {metrics.belowBufferCount > 0 && (
        <Link prefetch={false} href="/admin/products/critical" target="_blank">
          <Card className="bg-destructive/10 rounded-2xl hover:shadow-lg hover:scale-105 transition-all">
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
      )}
    </div>
  );
};

export default DashboardOverviewCards;
