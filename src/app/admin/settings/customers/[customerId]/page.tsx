import { notFound } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CustomerForm from "../../_components/create-update-customer-form";
import { getCachedSingleCustomer } from "../../_actions/cust-supp-actions";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const customer = await getCachedSingleCustomer(customerId);
  if (!customer) return notFound();
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <CardTitle className=" flex items-center gap-2">
          <Link href="/admin/settings/suppliers">
            <ChevronLeft />
          </Link>
          Edit customer
        </CardTitle>
        <CardDescription>
          Update the details of the existing customer below.
        </CardDescription>
      </CardHeader>
      <CustomerForm customer={customer} />
    </Card>
  );
}
