"use client";

import React, { useState } from "react";
import { TransactionForTable } from "@/types/dataTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function CustSuppPieCharts({
  transactions,
}: {
  transactions: TransactionForTable[];
}) {
  const [timeRange, setTimeRange] = useState("30d");
  const { vendorData, customerData } = processTransactionData(
    transactions,
    timeRange
  );

  const renderPieChart = (
    data: { name: string; value: number }[],
    title: string
  ) => (
    <Card className="w-full shadow-md rounded-2xl border-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Distribution of transaction amounts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ...Object.fromEntries(
              data.map((item, index) => [
                item.name,
                { label: item.name, color: COLORS[index % COLORS.length] },
              ])
            ),
          }}
          className="aspect-auto h-[300px] w-full"
        >
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[180px] rounded-md"
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderPieChart(vendorData, "Purchases from Vendors")}
        {renderPieChart(customerData, "Sales to Customers")}
      </div>
    </div>
  );
}

export function processTransactionData(
  transactions: TransactionForTable[],
  timeRange: string
) {
  const vendorData: { [key: string]: number } = {};
  const customerData: { [key: string]: number } = {};

  const currentDate = new Date();
  const filterDate = new Date(
    currentDate.getTime() -
      getDaysFromTimeRange(timeRange) * 24 * 60 * 60 * 1000
  );

  transactions
    .filter((transaction) => new Date(transaction.createdAt) >= filterDate)
    .forEach((transaction) => {
      if (transaction.vendor) {
        const amount = Math.abs(
          transaction.stockChange * (transaction.product.costPrice || 0)
        );
        vendorData[transaction.vendor.companyName] =
          (vendorData[transaction.vendor.companyName] || 0) + amount;
      } else if (transaction.customer) {
        const amount = Math.abs(
          transaction.stockChange * (transaction.product.sellingPrice || 0)
        );
        customerData[transaction.customer.companyName] =
          (customerData[transaction.customer.companyName] || 0) + amount;
      }
    });

  return {
    vendorData: Object.entries(vendorData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    customerData: Object.entries(customerData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
  };
}

function getDaysFromTimeRange(timeRange: string): number {
  switch (timeRange) {
    case "90d":
      return 90;
    case "30d":
      return 30;
    case "7d":
      return 7;
    case "14d":
      return 14;
    case "1d":
      return 1;
    default:
      return 90;
  }
}
