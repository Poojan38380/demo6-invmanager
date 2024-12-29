"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionForTable } from "@/types/dataTypes";
import { Line, LineChart, XAxis, CartesianGrid, TooltipProps } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { ArrowDown, ArrowUp, PlusCircle } from "lucide-react";

const chartConfig = {
  stock: {
    label: "Stock Level",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const actionColors = {
  INCREASED: "hsl(var(--success))",
  DECREASED: "hsl(var(--destructive))",
  CREATED: "hsl(var(--primary))",
};

export default function EnhancedTransactionChart({
  transactions,
}: {
  transactions: TransactionForTable[];
}) {
  const chartData = useMemo(() => {
    const sortedTransactions = transactions.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    interface DailyDataEntry {
      date: string;
      stock: number;
      stockChange: number;
      actions: string[];
    }

    const dailyData: { [key: string]: DailyDataEntry } = {};

    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          stock: transaction.stockAfter,
          stockChange: transaction.stockChange,
          actions: [transaction.action],
        };
      } else {
        dailyData[date].stock = transaction.stockAfter;
        dailyData[date].stockChange += transaction.stockChange;
        dailyData[date].actions.push(transaction.action);
      }
    });

    return Object.values(dailyData);
  }, [transactions]);

  return (
    <Card className="shadow-md rounded-2xl border-none">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart accessibilityLayer data={chartData}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <ChartTooltip
              content={<CustomTooltip chartConfig={chartConfig} />}
            />
            <CartesianGrid vertical={false} />

            <Line
              type="monotone"
              dataKey="stock"
              stroke="var(--color-stock)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  chartConfig: typeof chartConfig;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const netChange = data.stockChange;
    const action =
      netChange > 0 ? "INCREASED" : netChange < 0 ? "DECREASED" : "NO_CHANGE";

    return (
      <div className="bg-card flex flex-col gap-1 p-4 text-right rounded-md shadow-md border border-border">
        <p className="font-semibold text-left text-muted-foreground">{label}</p>

        <p>
          Stock: <span className="font-bold">{data.stock}</span>
        </p>
        <span
          style={{
            color: actionColors[action as keyof typeof actionColors],
          }}
          className="flex gap-1 items-center justify-end"
        >
          {action === "INCREASED" ? (
            <ArrowUp size={14} />
          ) : action === "DECREASED" ? (
            <ArrowDown size={14} />
          ) : (
            <PlusCircle size={14} />
          )}
          {Math.abs(netChange)}
        </span>
        <p className="text-xs text-muted-foreground">
          {data.actions.length} transaction{data.actions.length > 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return null;
};
