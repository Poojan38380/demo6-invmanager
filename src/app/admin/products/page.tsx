import React from "react";
import ToggleTable from "./toggle-table";
import { getCachedProductsforTable } from "./_actions/products";

export default async function ProductsPage() {
  const products = await getCachedProductsforTable();

  return <ToggleTable products={products} />;
}
