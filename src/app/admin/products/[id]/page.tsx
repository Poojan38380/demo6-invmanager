import { notFound } from "next/navigation";
import { getCachedSingleProduct } from "../_actions/products";
import ProductForm from "../_components/product-form/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
        <CardTitle className=" text-left flex items-center gap-2">
          <Link href="/admin/products">
            <ChevronLeft />
          </Link>
          Edit Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm product={product} />
      </CardContent>
    </Card>
  );
}
