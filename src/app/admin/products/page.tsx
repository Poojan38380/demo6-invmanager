import React from "react";
import ToggleTable from "./toggle-table";
import { getProductsforTable } from "./_actions/products";

export default async function ProductsPage() {
  const products = await getProductsforTable();

  return (
    <>
      <ToggleTable products={products} />
    </>
  );
}
