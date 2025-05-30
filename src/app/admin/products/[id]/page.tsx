import { notFound } from "next/navigation";
import { getCachedSingleProduct } from "../_actions/products";
import ProductForm from "../_components/product-form/ProductForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BackButton from "../../_components/sidebar/back-button";
import { checkIdValidity } from "@/utils/checkIdValidity";
import { decodeURLid } from "@/utils/url-encoder-decoder";
interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const decodedId = decodeURLid(id);

  const idValidityCheck = checkIdValidity(decodedId, "productId");
  if (idValidityCheck) return idValidityCheck;

  const product = await getCachedSingleProduct(decodedId);
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
