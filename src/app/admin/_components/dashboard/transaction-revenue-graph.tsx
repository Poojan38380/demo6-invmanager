"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { TransactionForTable } from "@/types/dataTypes";
import React, { useMemo, useState } from "react";
import { Line, LineChart, CartesianGrid, XAxis, TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/formatter";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

const chartConfig = {
  moneyEarned: {
    label: "Money Earned",
    color: "hsl(var(--success))",
  },
  moneySpent: {
    label: "Money Spent",
    color: "hsl(var(--destructive))",
  },
  netProfit: {
    label: "Net Profit",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface CustomTooltipProps extends TooltipProps<number, string> {
  chartConfig: typeof chartConfig;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  chartConfig,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-card p-4 shadow-md">
        <h4 className="mb-2 font-semibold">
          {new Date(label).toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </h4>
        {Object.entries(chartConfig).map(([key, config]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-1"
          >
            {config.label === "Net Profit" ? null : (
              <>
                <span className="flex items-center gap-2">
                  <div
                    className="h-3 w-1 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </span>
                <span className="font-mono font-medium">
                  {formatCurrency(data[key])}
                </span>
              </>
            )}
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t pt-2">
          <span className="font-semibold">
            {data.netProfit > 0 ? "Profit" : "Loss"}
          </span>
          <span
            className={`flex items-center gap-1 font-mono font-medium ${
              data.netProfit > 0
                ? "text-success"
                : data.netProfit < 0
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {data.netProfit > 0 ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : data.netProfit < 0 ? (
              <ArrowDownIcon className="h-4 w-4" />
            ) : (
              <MinusIcon className="h-4 w-4" />
            )}
            {formatCurrency(Math.abs(data.netProfit))}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TransactionRevenueGraph({
  transactions,
}: {
  transactions: TransactionForTable[];
}) {
  const [timeRange, setTimeRange] = useState<string>("30d");

  const processedData = useMemo(() => {
    const now = new Date();
    const timeRangeInDays = parseInt(timeRange);
    const startDate = new Date(
      now.getTime() - timeRangeInDays * 24 * 60 * 60 * 1000
    );

    const groupedData = transactions
      .filter((transaction) => new Date(transaction.createdAt) >= startDate)
      .reduce((acc, transaction) => {
        const date = new Date(transaction.createdAt)
          .toISOString()
          .split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, moneyEarned: 0, moneySpent: 0, netProfit: 0 };
        }

        switch (transaction.action) {
          case "DECREASED":
            acc[date].moneyEarned +=
              (transaction.product.sellingPrice || 0) *
              -transaction.stockChange;
            break;
          case "INCREASED":
            acc[date].moneySpent +=
              (transaction.product.costPrice || 0) * transaction.stockChange;
            break;
        }
        acc[date].netProfit = acc[date].moneyEarned - acc[date].moneySpent;
        return acc;
      }, {} as Record<string, { date: string; moneyEarned: number; moneySpent: number; netProfit: number }>);

    return Object.values(groupedData).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [transactions, timeRange]);

  return (
    <Card className="w-full shadow-md rounded-2xl border-none">
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-8 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-2xl font-bold">Revenue Trends</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Showing daily money earned, spent, and net profit
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[180px] rounded-md sm:ml-auto"
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart data={processedData} margin={{ top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={<CustomTooltip chartConfig={chartConfig} />}
              cursor={{ stroke: "hsl(var(--muted))" }}
            />
            <Line
              type="monotone"
              dataKey="moneyEarned"
              stroke={chartConfig.moneyEarned.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="moneySpent"
              stroke={chartConfig.moneySpent.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="netProfit"
              stroke={chartConfig.netProfit.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
