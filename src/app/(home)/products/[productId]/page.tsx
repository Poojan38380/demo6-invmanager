import { getCachedSingleProduct } from "@/app/admin/products/_actions/products";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProductImageCarousel from "./ProductImageCarousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default async function SingleProductDisplayPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await getCachedSingleProduct(productId);
  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 ">
      <Card className="overflow-hidden bg-background shadow-none border-none">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            <ProductImageCarousel
              images={product.productImages}
              name={product.name}
            />
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              <Separator className="my-6" />

              <Button size="lg" className="w-full mb-6">
                <ShoppingCart className="mr-2 h-5 w-5" /> Shop on amazon
              </Button>

              <Separator className="my-6" />
              <div
                className="prose max-w-none text-foreground"
                dangerouslySetInnerHTML={{
                  __html: product.longDescription || "",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
