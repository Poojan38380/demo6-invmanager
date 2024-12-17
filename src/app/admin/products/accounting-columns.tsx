"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { formatNumber } from "@/lib/format-number";
import { ColumnDef } from "@tanstack/react-table";
import { ProductWithOneImage } from "./page";
import { Package } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const AccountingColumns: ColumnDef<ProductWithOneImage>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Product"
        className="justify-center"
      />
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
    accessorKey: "costPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Value" />
    ),
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const costPrice: number = row.getValue("costPrice");
      const totalValue = stock * costPrice;
      return <div>{formatNumber(totalValue)}</div>;
    },
  },
];
