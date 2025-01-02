import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import CustomerForm from "../../_components/create-update-customer-form";
import BackButton from "@/app/admin/_components/sidebar/back-button";

export default function CreateCustomerPage() {
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <BackButton title="Add Customer" />
        <CardDescription>
          Enter the details of the new customer below.
        </CardDescription>
      </CardHeader>
      <CustomerForm />
    </Card>
  );
}
