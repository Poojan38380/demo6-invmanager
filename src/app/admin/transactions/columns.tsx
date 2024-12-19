"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";
import { IndentDecrease, Package, SquareChevronUp } from "lucide-react";
import { formatNumber } from "@/lib/formatter";

import { TransactionForTable } from "@/types/dataTypes";
import Link from "next/link";

export const TransactionTableColumns: ColumnDef<TransactionForTable>[] = [
  {
    accessorKey: "product.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const productName = row.original.product.name;
      const productId = row.original.productId;
      return (
        <Link href={`/admin/transactions/product/${productId}`}>
          {productName}
        </Link>
      );
    },
  },
  {
    accessorKey: "user.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const userName = row.original.user.username;
      const userId = row.original.userId;
      return (
        <Link href={`/admin/transactions/user/${userId}`}>{userName}</Link>
      );
    },
  },

  {
    accessorKey: "stockChange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Change" />
    ),
    enableSorting: false,

    cell: ({ row }) => {
      const stockChange: number = row.getValue("stockChange");
      const stockBefore: number = row.original.stockBefore;
      const action: string = row.original.action;
      return (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{stockBefore}</span>
          <span
            className={
              action === "INCREASED"
                ? "text-green-600"
                : action === "DECREASED"
                ? "text-red-600"
                : ""
            }
          >
            {action === "INCREASED" ? "+" : ""}
            {formatNumber(stockChange)} {row.original.product?.unit || "pcs"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "stockAfter",
    header: "Stock After",
    cell: ({ row }) => {
      const stockAfter: number = row.getValue("stockAfter");
      return (
        <span>
          {formatNumber(stockAfter)} {row.original.product?.unit || "pcs"}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "Customer/Supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer/Supplier" />
    ),
    cell: ({ row }) => {
      const customerOrVendor = row.original.customer
        ? {
            id: row.original.customerId,
            name: row.original.customer?.companyName,
            type: "customer",
          }
        : row.original.vendor
        ? {
            id: row.original.vendorId,
            name: row.original.vendor?.companyName,
            type: "supplier",
          }
        : null;

      if (customerOrVendor)
        return (
          <Link
            href={`/admin/transactions/${customerOrVendor.type}/${customerOrVendor.id}`}
          >
            {customerOrVendor.name}
          </Link>
        );
    },
  },

  {
    accessorKey: "note",
    header: "Note",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("createdAt");
      return (
        <span className="text-muted-foreground">
          {formatDateYYMMDDHHMM(createdAt)}
        </span>
      );
    },
  },
];
