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

function ToggleTable({ products }: { products: ProductWithOneImage[] }) {
  const [showAccountingTable, setShowAccountingTable] = useState(false);

  return (
    <Card className="border-none ">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Switch
            id="table-toggle"
            checked={showAccountingTable}
            onCheckedChange={setShowAccountingTable}
            className="data-[state=unchecked]:bg-gray-500"
            aria-label="Toggle accounting table"
          />
          <div>{showAccountingTable ? "Accounting" : "Product Inventory"}</div>
        </CardTitle>
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
