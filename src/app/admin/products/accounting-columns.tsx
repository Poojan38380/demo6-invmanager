"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductWithOneImage } from "./_actions/products";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";

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
      <DataTableColumnHeader column={column} title="Raw price" />
    ),
    cell: ({ row }) => {
      const cost: number = row.getValue("costPrice");

      return formatCurrency(cost);
    },
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Raw" />
    ),
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const costPrice: number = row.getValue("costPrice");
      const totalValue = stock * costPrice;
      return <div>{formatNumber(totalValue)}</div>;
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selling price" />
    ),
    cell: ({ row }) => {
      const cost: number = row.getValue("sellingPrice");

      return formatCurrency(cost);
    },
  },
  {
    accessorKey: "totalFinalValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Raw" />
    ),
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const sellingPrice: number = row.getValue("sellingPrice");
      const totalFinalValue = stock * sellingPrice;
      return <div>{formatNumber(totalFinalValue)}</div>;
    },
  },

  {
    accessorKey: "updatedAt",
    id: "updated-at-accounting",
    cell: ({ row }) => {
      const updatedAt: Date = row.getValue("updated-at-accounting");
      return formatDateYYMMDDHHMM(updatedAt);
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated at" />
    ),
  },

  {
    accessorKey: "vendor.companyName",
    id: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => {
      const companyName = row.original.vendor?.companyName ?? null;
      return <span>{companyName}</span>;
    },
  },
  {
    accessorKey: "category.name",
    id: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categoryName = row.original.category?.name ?? null;
      return <span>{categoryName}</span>;
    },
  },
];
