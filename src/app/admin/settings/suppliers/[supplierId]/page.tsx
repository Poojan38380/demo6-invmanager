import { notFound } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SupplierForm from "../../_components/create-update-supplier-form";
import { getCachedSinglesupplier } from "../../_actions/cust-supp-actions";

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
        <CardTitle className=" flex items-center gap-2">
          <Link href="/admin/settings/suppliers">
            <ChevronLeft />
          </Link>
          Edit supplier
        </CardTitle>
        <CardDescription>
          Update the details of the existing supplier below.
        </CardDescription>
      </CardHeader>
      <SupplierForm supplier={supplier} />
    </Card>
  );
}
