import React from "react";
import { getCachedSuppliers } from "../../_actions/selector-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustSuppDataTable } from "../_components/cust-supp-data-table";
import { SupplierColumns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function SuppliersPage() {
  const suppliers = await getCachedSuppliers();
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="py-2 flex flex-row items-center justify-between ">
        <CardTitle className="flex items-center space-x-2">
          All Suppliers
        </CardTitle>
        <Button asChild className="rounded-full shadow-sm">
          <Link prefetch={false} href="/admin/settings/suppliers/new">
            <PlusIcon size={16} />
            Add supplier
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <CustSuppDataTable columns={SupplierColumns} data={suppliers} />
      </CardContent>
    </Card>
  );
}
