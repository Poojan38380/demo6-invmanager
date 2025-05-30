import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import SupplierForm from "../../_components/create-update-supplier-form";
import { getCachedSingleSupplier } from "../../_actions/cust-supp-actions";
import BackButton from "@/app/admin/_components/sidebar/back-button";
import { checkIdValidity } from "@/utils/checkIdValidity";
import { decodeURLid } from "@/utils/url-encoder-decoder";

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;
  const decodedSupplierId = decodeURLid(supplierId);

  const idValidityCheck = checkIdValidity(decodedSupplierId, "supplierId");
  if (idValidityCheck) return idValidityCheck;

  const supplier = await getCachedSingleSupplier(decodedSupplierId);
  if (!supplier) return notFound();
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <BackButton title="Edit Supplier" />
        <CardDescription>
          Update the details of the existing supplier below.
        </CardDescription>
      </CardHeader>
      <SupplierForm supplier={supplier} />
    </Card>
  );
}
