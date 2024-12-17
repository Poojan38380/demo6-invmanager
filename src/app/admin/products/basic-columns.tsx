"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { formatNumber } from "@/lib/format-number";
import { ColumnDef } from "@tanstack/react-table";
import { ProductWithOneImage } from "./page";
import { Package } from "lucide-react";

export const BasicColumns: ColumnDef<ProductWithOneImage>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Product"
        className="justify-center"
      />
    ),

    cell: ({ row }) => {
      const productName: string = row.getValue("name");
      return (
        <div className="flex items-center gap-2">
          <Avatar className="max-425:hidden">
            <AvatarImage src={row.original.productImages[0]?.url} />
            <AvatarFallback>
              <Package className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span>{productName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const bufferStock: number = row.original.bufferStock || 0;
      const unit: string = row.original.unit || "pcs";
      return (
        <div className="flex items-center gap-1">
          <Badge
            variant={stock < (bufferStock || 0) ? "destructive" : "default"}
          >
            {formatNumber(stock)}
          </Badge>
          <span>{unit}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "vendor.companyName",
    id: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
  },
  {
    accessorKey: "category.name",
    id: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const updatedAt: Date = row.getValue("updatedAt");
      return formatDateYYMMDDHHMM(updatedAt);
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated at" />
    ),
  },
];
