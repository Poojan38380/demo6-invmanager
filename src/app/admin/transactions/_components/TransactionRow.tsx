import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionForTable } from "@/types/dataTypes";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import Link from "next/link";

export function TransactionRow({
  transaction,
}: {
  transaction: TransactionForTable;
}) {
  const {
    userId,
    productId,
    customerId,
    vendorId,
    product,
    user,
    customer,
    vendor,
    note,
    stockBefore,
    stockChange,
    stockAfter,
    createdAt,
    action,
  } = transaction;

  const customerOrVendor = customer
    ? { id: customerId, name: customer.companyName, type: "customer" }
    : vendor
    ? { id: vendorId, name: vendor.companyName, type: "supplier" }
    : null;

  return (
    <TableRow>
      <TableCell>
        <Link href={`/admin/transactions/product/${productId}`}>
          {product.name}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/admin/transactions/user/${userId}`}>{user.username}</Link>
      </TableCell>
      <TableCell>
        {customerOrVendor && (
          <Link
            href={`/admin/transactions/${customerOrVendor.type}/${customerOrVendor.id}`}
          >
            {customerOrVendor.name}
          </Link>
        )}
      </TableCell>
      <TableCell>{note || null}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">{stockBefore} </span>
        <span
          className={`font-medium ${
            stockChange > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {stockChange > 0 ? "+ " : " "}
          {stockChange.toFixed(2)}
        </span>
      </TableCell>
      <TableCell>{stockAfter.toFixed(2)}</TableCell>
      <TableCell>{action}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDateYYMMDDHHMM(new Date(createdAt))}
      </TableCell>
    </TableRow>
  );
}
