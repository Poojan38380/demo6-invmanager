import { notFound } from "next/navigation";
import { getCachedSingleProduct } from "../_actions/products";
import ProductForm from "../_components/product-form/ProductForm";
interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await getCachedSingleProduct(id);
  if (!product) return notFound();
  return (
    <>
      <ProductForm product={product} />
    </>
  );
}
