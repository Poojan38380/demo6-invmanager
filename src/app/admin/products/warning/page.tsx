import React from "react";
import { getCachedProductsforTable } from "../_actions/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ProductDataTable } from "../_components/data-table";
import { BasicColumns } from "../basic-columns";
import BackButton from "../../_components/sidebar/back-button";

export default async function WarningProducts() {
  const products = await getCachedProductsforTable();
  const approachingThreshold = 1.1; // 10% above buffer stock

  const warningProducts = products.filter((product) => {
    const bufferStock = product.bufferStock || 0;
    return (
      product.stock <= bufferStock * approachingThreshold &&
      product.stock >= bufferStock
    );
  });

  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader>
        <div className="flex items-center">
          <BackButton />
          <CardTitle className="text-warning">Warning Products</CardTitle>
        </div>
        <CardDescription>
          Products on the verge of becoming critical (stock is approching
          min.stock)
        </CardDescription>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ProductDataTable columns={BasicColumns} data={warningProducts} />
      </CardContent>
    </Card>
  );
}
