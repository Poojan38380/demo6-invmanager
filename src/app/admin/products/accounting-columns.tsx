"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductWithOneImage } from "./_actions/products";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";

const SelectHeader = ({ table }: { table: Table<ProductWithOneImage> }) => (
  <Checkbox
    checked={
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Select all"
  />
);

const SelectCell = ({ row }: { row: Row<ProductWithOneImage> }) => (
  <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label="Select row"
  />
);

export const AccountingColumns: ColumnDef<ProductWithOneImage>[] = [
  {
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
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
      const { stock, bufferStock = 0, unit = "pcs" } = row.original;
      return (
        <div className="flex items-center gap-1">
          <Badge
            variant={stock < (bufferStock ?? 0) ? "destructive" : "default"}
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
    cell: ({ row }) => formatCurrency(row.getValue("costPrice")),
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Raw" />
    ),
    cell: ({ row }) => {
      const { stock, costPrice } = row.original;
      return <div>{formatNumber(stock * (costPrice ?? 0))}</div>;
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selling price" />
    ),
    cell: ({ row }) => formatCurrency(row.getValue("sellingPrice")),
  },
  {
    accessorKey: "totalFinalValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Final" />
    ),
    cell: ({ row }) => {
      const { stock, sellingPrice } = row.original;
      return <div>{formatNumber(stock * (sellingPrice ?? 0))}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    id: "updated-at-accounting",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated at" />
    ),
    cell: ({ row }) =>
      formatDateYYMMDDHHMM(row.getValue("updated-at-accounting")),
  },
  {
    accessorKey: "vendor.companyName",
    id: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => <span>{row.original.vendor?.companyName ?? null}</span>,
  },
  {
    accessorKey: "category.name",
    id: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <span>{row.original.category?.name ?? null}</span>,
  },
];
