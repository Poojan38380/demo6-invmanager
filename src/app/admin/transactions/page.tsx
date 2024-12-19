import React from "react";
import { getAllCachedTransactions } from "./_actions/getTransactions";
import { TransactionTable } from "./_components/TransactionTable";

export default async function TransactionsPage() {
  const transactions = await getAllCachedTransactions();
  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Transactions</h1>
      <TransactionTable transactions={transactions} />
    </>
  );
}
