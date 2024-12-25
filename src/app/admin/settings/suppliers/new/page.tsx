import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import SupplierForm from "../../_components/create-update-supplier-form";

export default function CreateSuppliersPage() {
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create supplier</CardTitle>
        <CardDescription>
          Enter the details of the new supplier below.
        </CardDescription>
      </CardHeader>
      <SupplierForm />
    </Card>
  );
}
