import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { ProductWithOneImage } from "../../products/_actions/products";
import { formatCurrency } from "@/lib/formatter";

const DashboardOverviewCards = ({
  products,
}: {
  products: ProductWithOneImage[];
}) => {
  const calculateMetrics = () => {
    let belowBufferCount = 0;
    let approachingBufferCount = 0;
    let totalInventoryValue = 0;
    let potentialRevenue = 0;
    const approachingThreshold = 1.1; // 10% above buffer stock

    products.forEach((product) => {
      // Skip archived products
      if (product.isArchived) return;

      const bufferStock = product.bufferStock || 0;
      const currentStock = product.stock || 0;
      const costPrice = product.costPrice || 0;
      const sellingPrice = product.sellingPrice || 0;

      // Check buffer stock conditions
      if (currentStock < bufferStock) {
        belowBufferCount++;
      } else if (currentStock <= bufferStock * approachingThreshold) {
        approachingBufferCount++;
      }

      // Calculate financial metrics
      totalInventoryValue += currentStock * costPrice;
      potentialRevenue += currentStock * sellingPrice;
    });

    return {
      belowBufferCount,
      approachingBufferCount,
      totalInventoryValue,
      potentialRevenue,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Inventory Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <Package className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.totalInventoryValue)}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Total cost of current inventory
          </p>
        </CardContent>
      </Card>

      {/* Potential Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Potential Revenue
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.potentialRevenue)}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Expected revenue at current stock levels
          </p>
        </CardContent>
      </Card>
      {/* Approaching Buffer Stock Warning */}
      <Card className="bg-warning/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Approaching Buffer
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {metrics.approachingBufferCount}
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Products nearing buffer stock level
          </p>
        </CardContent>
      </Card>

      {/* Below Buffer Stock Alert */}
      <Card className="bg-destructive/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Below Buffer Stock
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
    </div>
  );
};

export default DashboardOverviewCards;
