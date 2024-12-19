import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionForTable } from "@/types/dataTypes";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";

export function TransactionRow({
  transaction,
}: {
  transaction: TransactionForTable;
}) {
  const {
    product,
    user,
    customer,
    vendor,
    note,
    stockChange,
    stockAfter,
    createdAt,
  } = transaction;

  const customerOrVendor = customer
    ? customer.companyName
    : vendor
    ? vendor.companyName
    : null;

  return (
    <TableRow>
      <TableCell>{product.name}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{customerOrVendor}</TableCell>
      <TableCell>{note || null}</TableCell>
      <TableCell>
        <span
          className={`font-medium ${
            stockChange > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {stockChange > 0 ? "+" : ""}
          {stockChange.toFixed(2)}
        </span>
      </TableCell>
      <TableCell>{stockAfter.toFixed(2)}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDateYYMMDDHHMM(new Date(createdAt))}
      </TableCell>
    </TableRow>
  );
}
