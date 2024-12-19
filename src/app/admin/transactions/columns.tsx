"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/lib/formatter";
import { TransactionForTable } from "@/types/dataTypes";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Package,
  User,
  Building,
  CalendarIcon,
  ClipboardIcon,
  PlusCircle,
  Truck,
} from "lucide-react";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";

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
        <Link
          href={`/admin/transactions/product/${productId}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Package className="h-4 w-4" />
          <span className="font-medium">{productName}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "stockChange",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Change" />
    ),
    cell: ({ row }) => {
      const stockChange: number = row.getValue("stockChange");
      const stockBefore: number = row.original.stockBefore;
      const action: string = row.original.action;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                {action === "INCREASED" ? (
                  <ArrowUpIcon className="h-4 w-4 text-success" />
                ) : action === "DECREASED" ? (
                  <ArrowDownIcon className="h-4 w-4 text-destructive" />
                ) : (
                  <PlusCircle className="h-4 w-4 text-primary" />
                )}
                <span className="text-muted-foreground text-xs">
                  {action !== "CREATED" && formatNumber(stockBefore)}
                </span>
                <span
                  className={
                    action === "INCREASED"
                      ? "text-green-600 font-semibold"
                      : action === "DECREASED"
                      ? "text-red-600 font-semibold"
                      : "text-primary"
                  }
                >
                  {action === "INCREASED"
                    ? "+"
                    : action === "DECREASED"
                    ? "-"
                    : ""}

                  {formatNumber(Math.abs(stockChange))}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous stock: {formatNumber(stockBefore)}</p>
              <p>New stock: {formatNumber(stockBefore + stockChange)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "stockAfter",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Final Stock" />
    ),
    cell: ({ row }) => {
      const stockAfter: number = row.getValue("stockAfter");
      const unit = row.original.product?.unit || "pcs";
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>{formatNumber(stockAfter)}</span>
          {unit}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("createdAt");
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatDateYYMMDDHHMM(createdAt)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{formatDateYYMMDDHHMM(createdAt)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
        <Link
          href={`/admin/transactions/user/${userId}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <User className="h-4 w-4" />
          <span className="font-medium">{userName}</span>
        </Link>
      );
    },
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
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            {customerOrVendor.type === "customer" ? (
              <Building className="h-4 w-4" />
            ) : (
              <Truck className="h-4 w-4" />
            )}
            <span className="font-medium">{customerOrVendor.name}</span>
          </Link>
        );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
    enableSorting: false,
    cell: ({ row }) => {
      const note = row.getValue("note") as string;
      if (!note) return null;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <ClipboardIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[200px]">{note}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{note}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
