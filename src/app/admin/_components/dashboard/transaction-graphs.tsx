"use client";

import { useMemo } from "react";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  format,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Transaction {
  createdAt: Date;
  action: "CREATED" | "UPDATED" | "DELETED" | "INCREASED" | "DECREASED";
}

interface TransactionGraphsProps {
  transactions: Transaction[];
}

function groupTransactionsByDate(
  transactions: Transaction[],
  groupingFn: (date: Date) => Date
) {
  const grouped = transactions.reduce((acc, transaction) => {
    const key = format(
      groupingFn(new Date(transaction.createdAt)),
      "yyyy-MM-dd"
    );
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key]++;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

export function TransactionGraphs({ transactions }: TransactionGraphsProps) {
  const dailyData = useMemo(
    () =>
      groupTransactionsByDate(transactions, startOfDay)
        .slice(-30)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [transactions]
  );

  const weeklyData = useMemo(
    () =>
      groupTransactionsByDate(transactions, startOfWeek)
        .slice(-12)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [transactions]
  );

  const monthlyData = useMemo(
    () =>
      groupTransactionsByDate(transactions, startOfMonth)
        .slice(-12)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [transactions]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Activity</CardTitle>
        <CardDescription>
          Overview of transaction activity over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <ChartContainer
              config={{
                count: {
                  label: "Transactions",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="weekly">
            <ChartContainer
              config={{
                count: {
                  label: "Transactions",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      `Week of ${format(new Date(value), "MMM d")}`
                    }
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="monthly">
            <ChartContainer
              config={{
                count: {
                  label: "Transactions",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      format(new Date(value), "MMM yyyy")
                    }
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
