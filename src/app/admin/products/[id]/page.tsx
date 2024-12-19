import { notFound } from "next/navigation";
import { getCachedSingleProductforEdit } from "../_actions/products";
import ProductForm from "../_components/product-form/ProductForm";
interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await getCachedSingleProductforEdit(id);
  if (!product) return notFound();
  return (
    <>
      <ProductForm />
    </>
  );
}
