"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionForTable } from "@/types/dataTypes";
import {
  Line,
  LineChart,
  XAxis,
  TooltipProps,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { ArrowDown, ArrowUp } from "lucide-react";
import { formatNumber } from "@/lib/formatter";

const chartConfig = {
  stock: {
    label: "Total Stock Level",
    color: "hsl(var(--chart-4))",
  },
  demand: {
    label: "Total Demand (Units Decreased)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const actionColors = {
  INCREASED: "hsl(var(--success))",
  DECREASED: "hsl(var(--destructive))",
  CREATED: "hsl(var(--primary))",
  RETURNED: "hsl(var(--warning))",
};

export default function TransactionChart({
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
      demand: number;
      actions: string[];
      productStocks: { [key: string]: number };
    }

    const dailyData: { [key: string]: DailyDataEntry } = {};

    // Group transactions by date and aggregate data
    sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          stock: 0,
          stockChange: 0,
          demand: 0,
          actions: [],
          productStocks: {},
        };
      }

      const entry = dailyData[date];
      const productKey = transaction.productVariantId || transaction.productId;

      // Update product-specific stock
      entry.productStocks[productKey] = transaction.stockAfter;

      // Recalculate total stock as sum of all product stocks
      entry.stock = Object.values(entry.productStocks).reduce(
        (a, b) => a + b,
        0
      );
      entry.stockChange += transaction.stockChange;

      if (transaction.action === "DECREASED") {
        entry.demand += Math.abs(transaction.stockChange);
      }
      entry.actions.push(transaction.action);
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
            <Line
              type="monotone"
              dataKey="stock"
              stroke={chartConfig.stock.color}
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted))" />
            <Legend />
            <Line
              type="monotone"
              dataKey="demand"
              stroke={chartConfig.demand.color}
              strokeWidth={1}
              strokeOpacity={0.7}
              strokeDasharray="10 10"
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
  chartConfig,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const netChange = data.stockChange;
    const action =
      netChange > 0 ? "INCREASED" : netChange < 0 ? "DECREASED" : "NO_CHANGE";

    return (
      <div className="bg-card flex flex-col gap-1 p-4 rounded-md shadow-md border border-border">
        <p className="font-semibold text-muted-foreground">{label}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-1">
              <span
                style={{
                  backgroundColor: chartConfig.stock.color,
                }}
                className="w-3 h-3 rounded-full"
              />
              Total Stock:{" "}
              <span className="font-bold font-mono">
                {formatNumber(data.stock)}
              </span>
            </div>
            <div>
              <span
                style={{
                  color: actionColors[action as keyof typeof actionColors],
                }}
                className="flex items-center justify-end font-mono text-xs font-extralight"
              >
                {action === "INCREASED" ? (
                  <ArrowUp size={14} />
                ) : action === "DECREASED" ? (
                  <ArrowDown size={14} />
                ) : null}
                {formatNumber(Math.abs(netChange))}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              style={{
                backgroundColor: chartConfig.demand.color,
              }}
              className="w-3 h-3 rounded-full"
            />
            Total Demand:{" "}
            <span className="font-bold font-mono">
              {formatNumber(data.demand)}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {data.actions.length} transaction
          {data.actions.length > 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return null;
};
