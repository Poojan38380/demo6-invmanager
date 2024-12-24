import React from "react";
import { getCachedCustomers } from "../../_actions/selector-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustSuppDataTable } from "../_components/cust-supp-data-table";
import { CustomerColumns } from "./columns";

export default async function CustomersPage() {
  const customers = await getCachedCustomers();
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="py-2 flex flex-row items-center justify-between ">
        <CardTitle className="flex items-center space-x-2">
          All Customers
        </CardTitle>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <CustSuppDataTable columns={CustomerColumns} data={customers} />
      </CardContent>
    </Card>
  );
}
