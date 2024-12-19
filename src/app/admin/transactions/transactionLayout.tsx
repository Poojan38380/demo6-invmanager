"use server";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionsDataTable } from "./_components/trans-data-table";
import { TransactionForTable } from "@/types/dataTypes";
import { TransactionTableColumns } from "./columns";

export default async function TransactionLayout({
  transactions,
  title,
}: {
  transactions: TransactionForTable[];
  title: string;
}) {
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="py-2 flex flex-row items-center justify-between ">
        <CardTitle className="flex items-center space-x-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <TransactionsDataTable
          columns={TransactionTableColumns}
          data={transactions}
        />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
