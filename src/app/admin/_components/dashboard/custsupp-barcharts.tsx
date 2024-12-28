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
import { BarChart, Bar, YAxis, CartesianGrid, Cell } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatter";

const colorPalette = [
  "#3498db",
  "#2ecc71",
  "#e74c3c",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#d35400",
  "#34495e",
];

export default function CustSuppBarCharts({
  transactions,
}: {
  transactions: TransactionForTable[];
}) {
  const [timeRange, setTimeRange] = useState("30d");

  const { vendorData, customerData } = processTransactionData(
    transactions,
    timeRange
  );

  const renderBarChart = (
    data: { name: string; value: number }[],
    title: string
  ) => (
    <Card className="w-full shadow-lg rounded-2xl border-none ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Distribution of transaction amounts
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            ...Object.fromEntries(
              data.map((item, index) => [
                item.name,
                {
                  label: item.name,
                  color: colorPalette[index % colorPalette.length],
                },
              ])
            ),
          }}
          className="aspect-auto h-[400px] w-full"
        >
          <BarChart accessibilityLayer layout="vertical" data={data}>
            <CartesianGrid horizontal={false} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Bar dataKey="value" radius={[0, 5, 5, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorPalette[index % colorPalette.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold ">Customer/Supplier Analysis</h2>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[180px] rounded-md bg-white dark:bg-gray-700 shadow-sm"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderBarChart(vendorData, "Purchases from Suppliers")}
        {renderBarChart(customerData, "Sales to Customers")}
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
