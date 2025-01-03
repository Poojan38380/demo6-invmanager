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
import { Badge } from "@/components/ui/badge";
import TransactionDeletionDialog from "./_components/trans-deletion-dialog";

export const TransactionTableColumns: ColumnDef<TransactionForTable>[] = [
  {
    accessorKey: "product.name",
    id: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const { name: productName } = row.original.product;
      const { productId, productVariant, productVariantId } = row.original;
      const variantName = productVariant?.variantName;

      return (
        <span className="flex flex-wrap gap-1">
          <Link
            href={`/admin/transactions/product/${productId}`}
            className="flex items-center gap-2 text-primary hover:underline hover:text-accent-foreground transition-colors"
            prefetch={false}
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">{productName}</span>
          </Link>
          {variantName && (
            <Link
              href={`/admin/transactions/product/variant/${productVariantId}`}
              className=" text-foreground hover:underline hover:text-accent-foreground transition-colors"
              prefetch={false}
            >
              <Badge variant={"secondary"}>{variantName}</Badge>
            </Link>
          )}
        </span>
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
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-xs">
            {action !== "CREATED" && formatNumber(stockBefore)}
          </span>
          <div
            className={` flex gap-1  items-center
             ${
               action === "INCREASED"
                 ? "text-success font-semibold"
                 : action === "DECREASED"
                 ? "text-destructive font-semibold"
                 : "text-primary"
             }
            `}
          >
            <span>
              {action === "INCREASED" ? "+" : action === "DECREASED" ? "-" : ""}
            </span>
            <span>{formatNumber(Math.abs(stockChange))}</span>
          </div>
          {action === "INCREASED" ? (
            <ArrowUpIcon className="h-4 w-4 text-success" />
          ) : action === "DECREASED" ? (
            <ArrowDownIcon className="h-4 w-4 text-destructive" />
          ) : (
            <PlusCircle className="h-4 w-4 text-primary" />
          )}
        </div>
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
                <span className="font-medium text-muted-foreground">
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
    id: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const userName = row.original.user.username;
      const userId = row.original.userId;
      return (
        <Link
          prefetch={false}
          href={`/admin/transactions/user/${userId}`}
          className="flex items-center gap-2 text-primary hover:underline hover:text-accent-foreground transition-colors"
        >
          <User className="h-4 w-4" />
          <span className="font-medium">{userName}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "Customer/Supplier",
    id: "customer-supplier",
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
            prefetch={false}
            href={`/admin/transactions/${customerOrVendor.type}/${customerOrVendor.id}`}
            className="flex items-center gap-2 text-primary hover:underline hover:text-accent-foreground transition-colors"
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
    id: "note",
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
  {
    accessorKey: "actions",
    header: undefined,
    cell: ({ row }) => {
      const transaction = row.original;
      if (transaction.action !== "CREATED")
        return <TransactionDeletionDialog transactionId={transaction.id} />;
    },
  },
];
