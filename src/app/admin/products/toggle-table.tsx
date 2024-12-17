"use client";
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { DataTable } from "./data-table";
import { ProductWithOneImage } from "./page";
import { BasicColumns } from "./basic-columns";
import { AccountingColumns } from "./accounting-columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

function ToggleTable({ products }: { products: ProductWithOneImage[] }) {
  const [showAccountingTable, setShowAccountingTable] = useState(false);

  return (
    <Card className="border-none  ">
      <CardHeader className="py-2 flex flex-row items-center justify-between ">
        <CardTitle className="flex items-center space-x-2">
          <Switch
            id="table-toggle"
            checked={showAccountingTable}
            onCheckedChange={setShowAccountingTable}
            className="data-[state=unchecked]:bg-gray-300"
            aria-label="Toggle accounting table"
          />
          <div>{showAccountingTable ? "Accounting" : "Products"}</div>
        </CardTitle>
        <Button asChild className="rounded-full ">
          <Link href="/admin/products/new">
            <PlusIcon size={16} />
            Add product
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="max-768:px-0">
        {showAccountingTable ? (
          <DataTable columns={AccountingColumns} data={products} />
        ) : (
          <DataTable columns={BasicColumns} data={products} />
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default ToggleTable;
