import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import SupplierForm from "../../_components/create-update-supplier-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateSuppliersPage() {
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <CardTitle className=" flex items-center gap-2">
          <Link href="/admin/settings/suppliers">
            <ChevronLeft />
          </Link>
          Add supplier
        </CardTitle>
        <CardDescription>
          Enter the details of the new supplier below.
        </CardDescription>
      </CardHeader>
      <SupplierForm />
    </Card>
  );
}
