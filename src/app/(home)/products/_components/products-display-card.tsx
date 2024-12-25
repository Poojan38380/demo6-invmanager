import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductWithImages } from "@/types/dataTypes";
import Link from "next/link";

const placeholderImage =
  "https://res.cloudinary.com/dxvvg9nwf/image/upload/v1733234845/zup2ich88q9k8xhoyeuj.png";

export default function ProductDisplayCard({
  product,
}: {
  product: ProductWithImages;
}) {
  const { name, shortDescription, productImages } = product;
  const imageUrl =
    productImages.length > 0 ? productImages[0].url : placeholderImage;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block overflow-hidden rounded-xl border-none bg-background/50 transition-all hover:shadow-2xl"
    >
      <Card className="relative overflow-hidden border-gray-400">
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
        <CardContent className="relative space-y-2.5 p-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight text-foreground/90">
              {name}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {shortDescription}
            </p>
          </div>
          <div className="flex items-center justify-between">
            {product.sellingPrice && (
              <Badge
                variant="secondary"
                className="px-2.5 py-0.5 text-sm font-semibold"
              >
                ₹{product.sellingPrice}
              </Badge>
            )}
            <span className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              View Details
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
