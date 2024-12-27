"use client";

import { useMemo } from "react";
import { startOfDay, startOfWeek, startOfMonth, format } from "date-fns";
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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

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
        .slice(-14)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [transactions]
  );

  const weeklyData = useMemo(
    () =>
      groupTransactionsByDate(transactions, startOfWeek)
        .slice(-8)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [transactions]
  );

  const monthlyData = useMemo(
    () =>
      groupTransactionsByDate(transactions, startOfMonth)
        .slice(-6)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [transactions]
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          Transaction Activity
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Overview of transaction activity over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
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
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                  />
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
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                  />
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
              className="h-[200px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "MMM yy")}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
