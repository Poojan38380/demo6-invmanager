"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { formatNumber } from "@/lib/format-number";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
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
        <>
          <Badge
            variant={stock < (bufferStock || 0) ? "destructive" : "default"}
          >
            {formatNumber(stock)}
          </Badge>
          <span className="ml-1">{unit}</span>
        </>
      );
    },
  },
  {
    accessorKey: "costPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
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
