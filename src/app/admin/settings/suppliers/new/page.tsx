import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import SupplierForm from "../../_components/create-update-supplier-form";
import BackButton from "@/app/admin/_components/sidebar/back-button";

export default function CreateSuppliersPage() {
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <BackButton title="Add Supplier" />

        <CardDescription>
          Enter the details of the new supplier below.
        </CardDescription>
      </CardHeader>
      <SupplierForm />
    </Card>
  );
}
