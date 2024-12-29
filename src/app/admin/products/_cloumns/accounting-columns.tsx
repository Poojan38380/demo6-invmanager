"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductWithOneImage } from "../_actions/products";
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
      const stock: number = row.getValue("stock");
      const bufferStock: number = row.original.bufferStock || 0;
      const threshold = 1.1;
      const unit: string = row.original.unit || "pcs";
      let badgeVariant: "default" | "warning" | "destructive" = "default";
      if (stock < bufferStock) {
        badgeVariant = "destructive";
      } else if (stock <= bufferStock * threshold) {
        badgeVariant = "warning";
      }
      return (
        <div className="flex items-center gap-1">
          <Badge variant={badgeVariant}>{formatNumber(stock)}</Badge>
          <span>{unit}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "bufferStock",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Min. stock"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      const { bufferStock = 0 } = row.original;
      return <div className="text-right">{formatNumber(bufferStock || 0)}</div>;
    },
  },
  {
    accessorKey: "costPrice",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Cost price"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatCurrency(row.getValue("costPrice"))}
        </div>
      );
    },
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Cost"
        className="justify-end"
      />
    ),
    accessorFn: (row) => row.stock * (row.costPrice ?? 0),
    cell: ({ row }) => {
      const totalValue = row.getValue("totalValue");
      return (
        <div className="text-right  ">
          {formatCurrency(totalValue as number)}
        </div>
      );
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Selling price"
        className="justify-end"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right ">
          {formatCurrency(row.getValue("sellingPrice"))}
        </div>
      );
    },
  },
  {
    accessorKey: "totalFinalValue",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Sell"
        className="justify-end"
      />
    ),
    accessorFn: (row) => row.stock * (row.sellingPrice ?? 0),
    cell: ({ row }) => {
      const totalFinalValue = row.getValue("totalFinalValue");
      return (
        <div className="text-right ">
          {formatCurrency(totalFinalValue as number)}
        </div>
      );
    },
  },

  {
    accessorKey: "updatedAt",
    id: "updated-at-accounting",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated at" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {formatDateYYMMDDHHMM(row.getValue("updated-at-accounting"))}
        </span>
      );
    },
  },
];
