"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";
import { ChartNoAxesCombined, Package, Pen } from "lucide-react";
import { ProductWithOneImage } from "../_actions/products";
import { formatNumber } from "@/lib/formatter";
import UpdateStock from "../_components/update-stock";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      const productId = row.original.id;

      return (
        <Link
          href={`/admin/transactions/product/${productId}`}
          className="flex items-center gap-2"
          prefetch={false}
        >
          <Avatar className="">
            <AvatarImage src={row.original.productImages[0]?.url} />
            <AvatarFallback>
              <Package className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span>{productName}</span>
        </Link>
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
      const qtyInBox: number | null = row.original.qtyInBox;
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Badge variant={badgeVariant}>{formatNumber(stock)}</Badge>
            <span>{unit}</span>
          </div>
          {qtyInBox && stock / qtyInBox ? (
            <div className="text-xs text-muted-foreground ">
              {stock / qtyInBox} boxes
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: undefined,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center justify-center gap-2">
          <UpdateStock product={product} />
          <Button
            asChild
            variant="outline"
            size="icon"
            className=" bg-card shadow-md opacity-50"
          >
            <Link
              href={`/admin/products/${product.id}`}
              prefetch={false}
              className="w-6  h-6"
            >
              <Pen className="text-xs" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className=" bg-card shadow-md opacity-50"
          >
            <Link
              href={`/admin/transactions/product/${product.id}`}
              className="w-6  h-6"
              prefetch={false}
            >
              <ChartNoAxesCombined className="text-xs" />
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "lastMonthSales",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last 30 days Demand" />
    ),
    cell: ({ row }) => {
      const lastMonthSales: number = row.original.lastMonthSales;
      const unit: string = row.original.unit || "pcs";

      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground ">
          {formatNumber(lastMonthSales)}
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
