import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierSelector } from "../../_components/select-supplier";

export default function SupplierCard({
  vendorId,
  setVendorId,
}: {
  vendorId: string | undefined;
  setVendorId: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplierSelector
          onSupplierSelect={setVendorId}
          defaultValue={vendorId || "none"}
        />
      </CardContent>
    </Card>
  );
}
