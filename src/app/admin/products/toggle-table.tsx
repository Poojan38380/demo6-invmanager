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

import { ProductDataTable } from "./_components/data-table";
import { BasicColumns } from "./_cloumns/basic-columns";
import { AccountingColumns } from "./_cloumns/accounting-columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { ProductWithOneImage } from "./_actions/products";

function ToggleTable({ products }: { products: ProductWithOneImage[] }) {
  const [showAccountingTable, setShowAccountingTable] = useState(false);

  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="py-2 flex flex-row items-center justify-between ">
        <CardTitle className="flex items-center space-x-2">
          <Switch
            id="table-toggle"
            checked={showAccountingTable}
            onCheckedChange={setShowAccountingTable}
            className=" shadow-sm"
            aria-label="Toggle accounting table"
          />
          <div
            className="cursor-pointer"
            onClick={() => setShowAccountingTable(!showAccountingTable)}
          >
            {showAccountingTable ? "Accounting" : "Products"}
          </div>
        </CardTitle>
        <Button asChild className="rounded-full shadow-sm">
          <Link href="/admin/products/new">
            <PlusIcon size={16} />
            Add product
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="max-768:px-0">
        {showAccountingTable ? (
          <ProductDataTable columns={AccountingColumns} data={products} />
        ) : (
          <ProductDataTable columns={BasicColumns} data={products} />
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default ToggleTable;
