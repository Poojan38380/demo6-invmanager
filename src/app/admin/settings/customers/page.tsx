import React from "react";
import { getCachedCustomers } from "../../_actions/selector-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustSuppDataTable } from "../_components/cust-supp-data-table";
import { CustomerColumns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function CustomersPage() {
  const customers = await getCachedCustomers();
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="py-2 flex flex-row items-center justify-between ">
        <CardTitle className="flex items-center justify-between space-x-2">
          All Customers
        </CardTitle>
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
