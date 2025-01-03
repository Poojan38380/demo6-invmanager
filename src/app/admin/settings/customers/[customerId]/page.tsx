import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import CustomerForm from "../../_components/create-update-customer-form";
import { getCachedSingleCustomer } from "../../_actions/cust-supp-actions";
import BackButton from "@/app/admin/_components/sidebar/back-button";
import { checkIdValidity } from "@/utils/checkIdValidity";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const idValidityCheck = checkIdValidity(customerId, "customerId");
  if (idValidityCheck) return idValidityCheck;

  const customer = await getCachedSingleCustomer(customerId);
  if (!customer) return notFound();
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <BackButton title="Edit Customer" />
        <CardDescription>
          Update the details of the existing customer below.
        </CardDescription>
      </CardHeader>
      <CustomerForm customer={customer} />
    </Card>
  );
}
