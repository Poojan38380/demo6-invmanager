import React from "react";
import { getCachedCustomers } from "../../_actions/selector-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustSuppDataTable } from "../_components/cust-supp-data-table";
import { CustomerColumns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import BackButton from "../../_components/sidebar/back-button";

export default async function CustomersPage() {
  const customers = await getCachedCustomers();
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="py-4 flex flex-row items-center justify-between ">
        <BackButton title="All Customers" />
        <Button asChild className="rounded-full shadow-sm">
          <Link prefetch={false} href="/admin/settings/customers/new">
            <PlusIcon size={16} />
            Add customer
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <CustSuppDataTable columns={CustomerColumns} data={customers} />
      </CardContent>
    </Card>
  );
}
