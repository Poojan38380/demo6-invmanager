"use server";
import React from "react";
import { getAllCachedTransactions } from "./_actions/getTransactions";
import TransactionLayout from "./transactionLayout";

export default async function TransactionsPage() {
  const transactions = await getAllCachedTransactions();
  return (
    <TransactionLayout title="All Transactions" transactions={transactions} />
  );
}
