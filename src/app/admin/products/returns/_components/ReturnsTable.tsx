"use client";

import { useState } from "react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ReturnItem {
  id: string;
  createdAt: Date;
  returnQty: number;
  returnReason: string | null;
  product: {
    id: string;
    name: string;
  };
  productVariant: {
    id: string;
    variantName: string;
  } | null;
  customer: {
    id: string;
    companyName: string;
  } | null;
  user: {
    id: string;
    username: string;
  };
}

interface ReturnsTableProps {
  returns: ReturnItem[];
}

export default function ReturnsTable({ returns }: ReturnsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof ReturnItem>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Handle search
  const filteredReturns = returns.filter((returnItem) => {
    const searchable = [
      returnItem.product.name,
      returnItem.productVariant?.variantName || "",
      returnItem.customer?.companyName || "",
      returnItem.user.username,
      returnItem.returnReason || "",
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(searchTerm.toLowerCase());
  });

  // Handle sorting
  const sortedReturns = [...filteredReturns].sort((a, b) => {
    if (sortField === "createdAt") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    // For other fields
    const valueA = String(a[sortField] || "");
    const valueB = String(b[sortField] || "");
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Handle sort toggle
  const toggleSort = (field: keyof ReturnItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search returns..."
            className="pl-8 rounded-full bg-card shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("createdAt")}
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Filed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReturns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <p className="text-muted-foreground">No returns found</p>
                </TableCell>
              </TableRow>
            ) : (
              sortedReturns.map((returnItem) => (
                <TableRow key={returnItem.id}>
                  <TableCell>
                    {format(new Date(returnItem.createdAt), "MMM d, yyyy")}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(returnItem.createdAt), "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/products/report/${returnItem.product.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {returnItem.product.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {returnItem.productVariant ? (
                      <Badge variant="outline">
                        {returnItem.productVariant.variantName}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      +{returnItem.returnQty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {returnItem.customer ? (
                      <Link
                        href={`/admin/settings/customers/${returnItem.customer.id}`}
                        className="hover:underline"
                      >
                        {returnItem.customer.companyName}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {returnItem.returnReason || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {returnItem.user.username}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
