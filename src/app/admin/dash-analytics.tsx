"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForTable } from "@/types/dataTypes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function DashboardAnalytics({
  transactions,
}: {
  transactions: TransactionForTable[];
}) {
  const [timeRange, setTimeRange] = useState<string>("30d");
  const now = new Date();
  const timeRangeInDays = parseInt(timeRange);
  const startDate = new Date(
    now.getTime() - timeRangeInDays * 24 * 60 * 60 * 1000
  );

  const filteredTransactions = transactions.filter(
    (transaction) => new Date(transaction.createdAt) >= startDate
  );
  console.log(filteredTransactions);
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between gap-4 ">
        <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[140px] border-none shadow-md  "
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectItem value="1d">Today</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="max-768:px-0"></CardContent>
      <CardContent className="max-768:px-0"></CardContent>
    </>
  );
}
