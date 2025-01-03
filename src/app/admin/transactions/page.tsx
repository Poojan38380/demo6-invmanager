import React, { Suspense } from "react";
import { getAllCachedTransactions } from "./_actions/getTransactions";
import TransactionLayout from "./transactionLayout";
import TableSkeleton from "../_components/table-skeleton";

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <TransactionsPageComp />
    </Suspense>
  );
}

async function TransactionsPageComp() {
  const transactions = await getAllCachedTransactions();
  return (
    <TransactionLayout title="All Transactions" transactions={transactions} />
  );
}
