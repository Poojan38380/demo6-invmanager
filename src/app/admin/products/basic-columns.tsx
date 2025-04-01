"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChartNoAxesCombined,
  EllipsisVertical,
  Package,
  Pen,
  Proportions,
} from "lucide-react";
import { ProductWithOneImage } from "./_actions/products";
import { formatNumber } from "@/lib/formatter";
import UpdateStock from "./_components/update-stock";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import UpdateStockVariants from "./_components/update-stock-variants";
import ProductDeletionDialog from "./_components/product-deletion-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import LastTransactionsButton from "./_components/LastTransactionsButton";
import { encodeURLid } from "@/utils/url-encoder-decoder";

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
          <span className="font-semibold">{productName}</span>
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
      const product = row.original;

      if (product.hasVariants) {
        const totalVariantStock = product.productVariants?.reduce(
          (sum, variant) => sum + variant.variantStock,
          0
        );

        return (
          <div className="space-y-3 ">
            {product.productVariants?.map((variant) => (
              <div
                key={variant.id}
                className=" flex items-center justify-between gap-2"
              >
                <span className="text-sm   truncate">
                  {variant.variantName}
                </span>
                <Badge>{formatNumber(variant.variantStock)}</Badge>
              </div>
            ))}
            <Separator />
            <div className="flex justify-end text-muted-foreground text-sm">
              <Badge variant={"outline"}>
                {formatNumber(totalVariantStock || 0)} {product.unit}
              </Badge>
            </div>
          </div>
        );
      }

      const stock: number = row.getValue("stock");
      const qtyInBox: number | null = row.original.qtyInBox;
      const bufferStock: number = row.original.bufferStock || 0;
      const threshold = 1.1;
      const unit = row.original.unit || "pcs";

      const getBadgeVariant = (
        stock: number,
        bufferStock: number,
        threshold: number
      ) => {
        if (stock < bufferStock) return "destructive";
        if (stock <= bufferStock * threshold) return "warning";
        return "default";
      };

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <Badge variant={getBadgeVariant(stock, bufferStock, threshold)}>
              {formatNumber(stock)}
            </Badge>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          {qtyInBox && stock / qtyInBox ? (
            <span className="text-xs text-muted-foreground">
              {formatNumber(stock / qtyInBox)} boxes
            </span>
          ) : null}
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: undefined,
    cell: ({ row }) => <ProductActionsCell product={row.original} />,
  },

  {
    accessorKey: "lastMonthSales",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last 30 days" />
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

const ProductActionsCell = ({ product }: { product: ProductWithOneImage }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-max flex items-center justify-between gap-1">
      {product.hasVariants ? (
        <UpdateStockVariants product={product} />
      ) : (
        <UpdateStock product={product} />
      )}
      <LastTransactionsButton productId={product.id} />

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-1" title="Addtional Settings">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-semibold">
          <DropdownMenuGroup>
            <Link
              href={`/admin/products/${encodeURLid(product.id)}`}
              prefetch={false}
              title="Edit Product"
            >
              <DropdownMenuItem>
                <Pen />
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>
            <Link
              href={`/admin/transactions/product/${encodeURLid(product.id)}`}
              prefetch={false}
              title="View Transactions"
            >
              <DropdownMenuItem>
                <ChartNoAxesCombined />
                <span>Transactions</span>
              </DropdownMenuItem>
            </Link>
            <Link
              href={`/admin/products/report/${encodeURLid(product.id)}`}
              prefetch={false}
              title="View Report"
            >
              <DropdownMenuItem>
                <Proportions />
                <span>Report</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          {product.specialTransactionCount === 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <ProductDeletionDialog
                  productId={product.id}
                  setOpenFnAction={setOpen}
                />
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
