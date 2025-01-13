import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductWithImages } from "@/types/dataTypes";
import Link from "next/link";
import Image from "next/image";
import { encodeURLid } from "@/utils/url-encoder-decoder";

const placeholderImage =
  "https://res.cloudinary.com/dxvvg9nwf/image/upload/v1733234845/zup2ich88q9k8xhoyeuj.png";

export default function ProductDisplayCard({
  product,
}: {
  product: ProductWithImages;
}) {
  const { id, name, shortDescription, productImages } = product;
  const imageUrl = productImages[0]?.url || placeholderImage;

  return (
    <Link
      prefetch={false}
      href={`/products/${encodeURLid(id)}`}
      className="group relative block overflow-hidden rounded-xl transition-all hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="h-full">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            priority
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
            <span className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              View Details
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
