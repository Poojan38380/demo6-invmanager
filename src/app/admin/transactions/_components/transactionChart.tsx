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

    return sortedTransactions.map((transaction) => {
      return {
        date: new Date(transaction.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        stock: transaction.stockAfter,
        stockChange: transaction.stockChange,
        action: transaction.action,
        note: transaction.note,
      };
    });
  }, [transactions]);

  return (
    <Card className="shadow-md rounded-2xl border-none">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
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
    return (
      <div className="bg-card flex flex-col gap-1 p-4 text-right rounded-md shadow-md border border-border">
        <p className="font-semibold text-left text-muted-foreground">{label}</p>

        <p>
          Stock: <span className="font-bold">{data.stock}</span>
        </p>
        <span
          style={{
            color: actionColors[data.action as keyof typeof actionColors],
          }}
          className="flex gap-1 items-center justify-end"
        >
          {data.action === "INCREASED" ? (
            <ArrowUp size={14} />
          ) : data.action === "DECREASED" ? (
            <ArrowDown size={14} />
          ) : (
            <PlusCircle size={14} />
          )}
          {data.stockChange}
        </span>
        {data.note && (
          <p className="text-muted-foreground text-left font-semibold">
            {data.note}
          </p>
        )}
      </div>
    );
  }

  return null;
};
