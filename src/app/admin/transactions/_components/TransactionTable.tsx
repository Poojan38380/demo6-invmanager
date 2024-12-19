import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionRow } from "./TransactionRow";
import { Transaction } from "@prisma/client";

export function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Customer/Vendor</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Stock Change</TableHead>
          <TableHead>Final Stock</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </TableBody>
    </Table>
  );
}
