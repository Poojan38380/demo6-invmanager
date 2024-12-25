import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerForm from "../../_components/create-update-customer-form";

export default function CreateCustomerPage() {
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create customer</CardTitle>
        <CardDescription>
          Enter the details of the new customer below.
        </CardDescription>
      </CardHeader>
      <CustomerForm />
    </Card>
  );
}
