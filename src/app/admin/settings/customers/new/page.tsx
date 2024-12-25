import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerForm from "../../_components/create-update-customer-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateCustomerPage() {
  return (
    <Card className="m-6 max-425:m-2">
      <CardHeader>
        <CardTitle className=" flex items-center gap-2">
          <Link href="/admin/settings/customers">
            <ChevronLeft />
          </Link>
          Add customer
        </CardTitle>
        <CardDescription>
          Enter the details of the new customer below.
        </CardDescription>
      </CardHeader>
      <CustomerForm />
    </Card>
  );
}
