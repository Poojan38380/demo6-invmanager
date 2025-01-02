import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import SupplierForm from "../../_components/create-update-supplier-form";
import { getCachedSinglesupplier } from "../../_actions/cust-supp-actions";
import BackButton from "@/app/admin/_components/sidebar/back-button";

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;

  const supplier = await getCachedSinglesupplier(supplierId);
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
