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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TransactionForTable } from "@/types/dataTypes";
import React, { useMemo, useState } from "react";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  transactions: {
    label: "Transactions",
  },
  increased: {
    label: "Added",
    color: "hsl(var(--chart-1))",
  },
  decreased: {
    label: "Removed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function TransactionActionGraph({
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
          acc[date] = { date, increased: 0, decreased: 0 };
        }
        switch (transaction.action) {
          case "INCREASED":
            acc[date].increased++;
            break;
          case "DECREASED":
            acc[date].decreased++;
            break;
        }
        return acc;
      }, {} as Record<string, { date: string; increased: number; decreased: number }>);

    return Object.values(groupedData).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [transactions, timeRange]);

  return (
    <Card className="w-full  shadow-md rounded-2xl border-none">
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-8 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-2xl font-bold">
            Transaction Trends
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Showing transaction action trends over time
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6  ">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full "
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
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    });
                  }}
                  indicator="line"
                />
              }
            />
            <Line
              type="monotone"
              dataKey="increased"
              stroke={chartConfig.increased.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="decreased"
              stroke={chartConfig.decreased.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
