import { getCachedSingleProduct } from "@/app/admin/products/_actions/products";
import { notFound } from "next/navigation";
import React from "react";

export default async function SingleProductDisplayPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await getCachedSingleProduct(productId);
  if (!product) return notFound();

  return <div>SingleProductDisplayPage</div>;
}
