import { notFound } from "next/navigation";
import { getCachedSingleProduct } from "../_actions/products";
import ProductForm from "../_components/product-form/ProductForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BackButton from "../../_components/sidebar/back-button";
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
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="max-w-5xl mx-auto">
        <BackButton title="Edit Product" />
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ProductForm product={product} />
      </CardContent>
    </Card>
  );
}
