"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";
import { Package } from "lucide-react";
import { ProductWithOneImage } from "./_actions/products";
import { formatNumber } from "@/lib/formatter";
import UpdateStock from "./_components/update-stock";

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
          <Avatar className="">
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
    accessorKey: "actions",
    header: undefined,
    cell: ({ row }) => {
      return <UpdateStock product={row.original} />;
    },
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
  {
    accessorKey: "updatedAt",
    id: "updated-at-basic",
    cell: ({ row }) => {
      const updatedAt: Date = row.getValue("updated-at-basic");
      return (
        <span className="text-muted-foreground">
          {formatDateYYMMDDHHMM(updatedAt)}
        </span>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated at" />
    ),
  },
];
