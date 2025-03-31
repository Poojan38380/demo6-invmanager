import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { checkIdValidity } from "@/utils/checkIdValidity";
import { decodeURLid } from "@/utils/url-encoder-decoder";
import BackButton from "@/app/admin/_components/sidebar/back-button";
import { getCachedSingleProduct } from "../../_actions/products";
interface ProductReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductReportPage({
  params,
}: ProductReportPageProps) {
  const { id } = await params;
  const decodedId = decodeURLid(id);

  const idValidityCheck = checkIdValidity(decodedId, "productId");
  if (idValidityCheck) return idValidityCheck;

  const product = await getCachedSingleProduct(decodedId);
  if (!product) return notFound();
  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader className="py-4 flex flex-row  items-center gap-4 justify-between">
        <BackButton title={`${product.name} : Product report`} />
      </CardHeader>
    </Card>
  );
}
