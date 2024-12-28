import React from "react";
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
import { BarChart, Bar, YAxis, Cell, XAxis } from "recharts";

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
  const { vendorData, customerData } = processTransactionData(transactions);

  const renderBarChart = (
    data: { name: string; value: number }[],
    title: string
  ) => (
    <Card className=" shadow-md rounded-2xl border-none ">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Distribution of transaction amounts</CardDescription>
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
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart accessibilityLayer layout="vertical" data={data}>
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <XAxis type="number" dataKey="value" hide />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Bar dataKey="value" radius={5}>
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
    <div className="grid grid-cols-2 max-1024:grid-cols-1 gap-4">
      {renderBarChart(vendorData, "Purchases from Suppliers")}
      {renderBarChart(customerData, "Sales to Customers")}
    </div>
  );
}
export function processTransactionData(transactions: TransactionForTable[]) {
  const vendorData: { [key: string]: number } = {};
  const customerData: { [key: string]: number } = {};

  transactions.forEach((transaction) => {
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
