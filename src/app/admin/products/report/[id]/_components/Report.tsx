"use client";
import React, { useState } from "react";
import { ProductReportDataType } from "../_actions/getProductReportData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  Package,
  TrendingUp,
  Users,
  Truck,
  ArrowUp,
  ArrowDown,
  PackageCheck,
  AlertCircle,
  Clock,
  User,
  CalendarIcon,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalenderComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function ProductReport({
  product,
}: {
  product: ProductReportDataType;
}) {
  const [timeRange, setTimeRange] = useState<string | DateRange>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Calculate if stock level is below buffer
  const isLowStock = product.stock < (product.bufferStock || 0);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format transactions for various charts
  const filteredTransactions = product.transactions
    .filter((t) => {
      if (typeof timeRange === "object" && timeRange.from) {
        const txDate = new Date(t.createdAt);
        if (timeRange.to) {
          // Range with from and to dates
          return txDate >= timeRange.from && txDate <= timeRange.to;
        } else {
          // Only from date
          return txDate >= timeRange.from;
        }
      } else if (timeRange === "7") {
        return (
          new Date(t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
      } else if (timeRange === "30") {
        return (
          new Date(t.createdAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
      } else if (timeRange === "90") {
        return (
          new Date(t.createdAt) >
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        );
      } else if (timeRange === "all") {
        return true;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  // Stock movement data for line chart
  const stockMovementData = filteredTransactions.map((t) => ({
    date: formatDate(new Date(t.createdAt)),
    stock: t.stockAfter,
  }));

  // Add current stock level to the chart if there are no recent transactions
  if (
    stockMovementData.length === 0 ||
    new Date(
      filteredTransactions[filteredTransactions.length - 1].createdAt
    ).getTime() <
      Date.now() - 24 * 60 * 60 * 1000
  ) {
    stockMovementData.push({
      date: new Date().toLocaleDateString(),
      stock: product.stock,
    });
  }

  // Transaction types breakdown for pie chart
  const transactionTypes = filteredTransactions.reduce(
    (acc: { [key: string]: number }, transaction) => {
      const action = transaction.action;
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const transactionTypesData = Object.keys(transactionTypes).map((key) => ({
    name: key,
    value: transactionTypes[key],
  }));

  // User transaction counts
  const userTransactions = filteredTransactions.reduce(
    (acc: { [key: string]: number }, transaction) => {
      const username = transaction.user?.username || "unknown";
      acc[username] = (acc[username] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const topUsers = (Object.entries(userTransactions) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([username, count]) => ({ username, count }));

  // Calculate days of stock remaining based on average daily usage
  const calculateDaysRemaining = () => {
    if (filteredTransactions.length === 0) return "N/A";

    const decreaseTransactions = filteredTransactions.filter(
      (t) => t.action === "DECREASED"
    );
    if (decreaseTransactions.length === 0) return "N/A";

    const totalDecrease = decreaseTransactions.reduce(
      (sum, t) => sum + Math.abs(t.stockChange),
      0
    );

    let daysPeriod = 30;
    if (typeof timeRange === "string") {
      daysPeriod = timeRange === "all" ? 365 : Number.parseInt(timeRange) || 30;
    } else if (timeRange.from && timeRange.to) {
      // Calculate days between the two dates
      const diffTime = Math.abs(
        timeRange.to.getTime() - timeRange.from.getTime()
      );
      daysPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const avgDailyUsage = totalDecrease / daysPeriod;

    if (avgDailyUsage === 0) return "N/A";

    const daysRemaining = Math.floor(product.stock / avgDailyUsage);
    return [daysRemaining, avgDailyUsage];
  };

  const daysCalcResult = calculateDaysRemaining();

  const [daysRemaining, avgDailyUsage] = Array.isArray(daysCalcResult)
    ? daysCalcResult
    : ["N/A", 0];

  const increased = filteredTransactions
    .filter((t) => t.action === "INCREASED")
    .reduce((total, t) => total + t.stockChange, 0);

  const decreased = filteredTransactions
    .filter((t) => t.action === "DECREASED")
    .reduce((total, t) => total + Math.abs(t.stockChange), 0);

  // COLORS for charts
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex  flex-col items-center lg:flex-row gap-4 justify-between">
        <div className="px-4">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.SKU && (
              <Badge variant="outline" className="text-sm">
                SKU: {product.SKU}
              </Badge>
            )}
            {product.category && (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {product.category.name}
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="destructive" className="animate-pulse">
                Low Stock
              </Badge>
            )}
          </div>
          {product.shortDescription && (
            <p className="text-muted-foreground max-w-2xl">
              {product.shortDescription}
            </p>
          )}
        </div>

        <Card className="min-w-60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Current Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold">{product.stock}</span>
              <div>
                {product.unit && (
                  <span className="text-sm text-muted-foreground block">
                    {product.unit}
                  </span>
                )}
                {product.qtyInBox && (
                  <span className="text-sm text-muted-foreground block">
                    {product.qtyInBox} per box
                  </span>
                )}
              </div>
            </div>
            {product.bufferStock !== null && (
              <div className="mt-2 text-sm">
                Buffer level:{" "}
                <span
                  className={
                    isLowStock
                      ? "text-red-500 font-medium"
                      : "text-green-500 font-medium"
                  }
                >
                  {product.bufferStock} {product.unit}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* NOTE: Time Range Filter */}
      <div className="flex justify-end mb-4 max-425:px-4">
        <div className="border rounded-md p-1 flex flex-wrap gap-1">
          <Button
            onClick={() => setTimeRange("all")}
            className="px-3 py-1 rounded-md"
            variant={`${timeRange === "all" ? "default" : "ghost"}`}
          >
            All Time
          </Button>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={typeof timeRange === "object" ? "default" : "ghost"}
                className="px-3 py-1 rounded-md flex items-center gap-1"
              >
                <CalendarIcon className="h-4 w-4" />
                {typeof timeRange === "object" && timeRange.from ? (
                  timeRange.to ? (
                    <>
                      {format(timeRange.from, "LLL dd, y")} -{" "}
                      {format(timeRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(timeRange.from, "LLL dd, y")
                  )
                ) : (
                  ""
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] mt-1 mx-2" align="start">
              <div className="flex flex-wrap  gap-2   p-3  border-b ">
                <Badge
                  onClick={() => {
                    setTimeRange("7");
                    setIsCalendarOpen(false);
                  }}
                  variant={`${timeRange === "7" ? "default" : "outline"}`}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors  "
                >
                  Last 7 Days
                </Badge>
                <Badge
                  onClick={() => {
                    setTimeRange("30");
                    setIsCalendarOpen(false);
                  }}
                  variant={`${timeRange === "30" ? "default" : "outline"}`}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors  "
                >
                  Last 30 Days
                </Badge>
                <Badge
                  onClick={() => {
                    setTimeRange("90");
                    setIsCalendarOpen(false);
                  }}
                  variant={`${timeRange === "90" ? "default" : "outline"}`}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors  "
                >
                  Last 90 Days
                </Badge>
              </div>
              <CalenderComponent
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={typeof timeRange === "object" ? timeRange : undefined}
                onSelect={(range) => {
                  if (range) setTimeRange(range);
                }}
                numberOfMonths={1}
                disabled={(date) =>
                  date > new Date() && date < product.createdAt
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 max-768:grid-cols-2 h-full gap-1  mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="trends">Stock Trends</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package size={18} /> Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                {product.SKU && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>{product.SKU}</span>
                  </div>
                )}
                {product.category && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{product.category.name}</span>
                  </div>
                )}
                {product.vendor && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Vendor:</span>
                    <span>{product.vendor.companyName}</span>
                  </div>
                )}
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Created By:</span>
                  <span>{product.creator.username}</span>
                </div>
              </CardContent>
            </Card>

            {/* NOTE: Stock metrics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={18} /> Stock Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-bold">
                    {product.stock} {product.unit}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Buffer Level:</span>
                  <span
                    className={
                      isLowStock ? "text-red-500 font-medium" : "font-medium"
                    }
                  >
                    {product.bufferStock || "Not set"} {product.unit}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Stock Status:</span>
                  <span>
                    {isLowStock ? (
                      <Badge variant="destructive">Below Buffer</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Healthy
                      </Badge>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">
                    Est. Days Remaining:
                  </span>
                  <span
                    className={
                      typeof daysRemaining === "number" && daysRemaining < 14
                        ? "text-amber-500 font-medium"
                        : "font-medium"
                    }
                  >
                    {daysRemaining !== "N/A" ? `~${daysRemaining} days` : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Qty per Box:</span>
                  <span>{product.qtyInBox || "-"}</span>
                </div>
              </CardContent>
            </Card>

            {/* NOTE: Variant overview */}
            {product.hasVariants && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Variants ({product.productVariants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                  {product.productVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex justify-between border-b pb-2 last:border-0"
                    >
                      <span>{variant.variantName}</span>
                      <span className="font-medium">
                        {variant.variantStock} {product.unit}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* NOTE: Net stock change */}
          <Card>
            <CardHeader>
              <CardTitle>Net Stock Change</CardTitle>
              <CardDescription>Total added vs. removed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-green-600 text-sm font-medium">Added</p>
                    <p className="text-2xl font-bold text-green-700">
                      +{increased}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-red-600 text-sm font-medium">Removed</p>
                    <p className="text-2xl font-bold text-red-700">
                      -{decreased}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Daily Usage Rate</h4>
                  <p className="text-lg">
                    {avgDailyUsage.toFixed(2)} units/day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTE: Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1  gap-6">
            {/* NOTE: Overview of insights --- turnover, days remaining, stockout incidents*/}
            {(() => {
              const getDaysPeriod = () => {
                if (typeof timeRange === "string") {
                  if (timeRange === "all") {
                    const productAgeMs =
                      Date.now() - new Date(product.createdAt).getTime();
                    return Math.ceil(productAgeMs / (1000 * 60 * 60 * 24));
                  }
                  return Number.parseInt(timeRange) || 30;
                }
                if (timeRange?.from) {
                  const from = timeRange.from;
                  const to = timeRange.to || new Date();
                  const diffTime = Math.abs(to.getTime() - from.getTime());
                  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                }
                return 30;
              };

              const decreaseTransactions = filteredTransactions.filter(
                (t) => t.action === "DECREASED"
              );
              const turnoverRate = (() => {
                if (decreaseTransactions.length === 0) return null;

                const totalDecrease = decreaseTransactions.reduce(
                  (sum, t) => sum + Math.abs(t.stockChange),
                  0
                );
                const avgStock = product.stock;

                if (avgStock === 0) return null;

                const daysPeriod = getDaysPeriod();
                const turnover =
                  (totalDecrease / avgStock) * (365 / daysPeriod);
                return turnover.toFixed(2);
              })();

              // Check for stockout incidents
              const stockouts = filteredTransactions.filter(
                (t) => t.stockAfter === 0
              ).length;

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Stock Turnover Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center pt-2">
                        <div className="text-3xl font-bold">
                          {turnoverRate}x
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Turns over {turnoverRate} times during the selected
                          period
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Days Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center pt-2">
                        {typeof daysRemaining === "number" ? (
                          <>
                            <div
                              className={`text-3xl font-bold ${
                                typeof daysRemaining === "number" &&
                                daysRemaining < 7
                                  ? "text-red-600"
                                  : typeof daysRemaining === "number" &&
                                    daysRemaining < 30
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}
                            >
                              {typeof daysRemaining === "number"
                                ? `~${daysRemaining}`
                                : "-"}
                            </div>
                            <p className="text-sm text-muted-foreground text-center mt-2">
                              Days until depletion at current usage rate
                            </p>
                          </>
                        ) : (
                          <p className="text-center text-muted-foreground">
                            Insufficient usage data
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Stockout Incidents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center pt-2">
                        <div
                          className={`text-3xl font-bold ${
                            stockouts > 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {stockouts}
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Times the stock reached zero in the selected period
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}

            {/* NOTE: Variant Analytics */}
            {product.hasVariants && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Variant Analytics</CardTitle>
                  <CardDescription>
                    Stock distribution across variants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={product.productVariants.map((v) => ({
                            name: v.variantName,
                            value: v.variantStock,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="hsl(var(--chart-1))"
                          dataKey="value"
                        >
                          {product.productVariants.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Variant Overview</h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">
                            Variant
                          </th>
                          <th className="text-right py-2 font-medium">Stock</th>
                          <th className="text-right py-2 font-medium">
                            % of Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.productVariants.map((variant, idx) => {
                          const percentage = (
                            (variant.variantStock / product.stock) *
                            100
                          ).toFixed(1);
                          return (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-2">{variant.variantName}</td>
                              <td className="py-2 text-right">
                                {variant.variantStock}
                              </td>
                              <td className="py-2 text-right">{percentage}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NOTE: Seasonal Trends */}
            <Card
              className={
                product.hasVariants ? "md:col-span-2" : "md:col-span-1"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar size={18} /> Seasonal Analysis
                </CardTitle>
                <CardDescription>Usage patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Extract monthly data for seasonal analysis
                  const seasonalData: { [key: string]: number } = {};

                  // Process all decreases by month
                  filteredTransactions
                    .filter((t) => t.action === "DECREASED")
                    .forEach((t) => {
                      const month = new Date(t.createdAt).toLocaleString(
                        "default",
                        { month: "short" }
                      );
                      seasonalData[month] =
                        (seasonalData[month] || 0) + Math.abs(t.stockChange);
                    });

                  // Sort months chronologically
                  const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  const sortedData = months
                    .filter((month) => seasonalData[month])
                    .map((month) => ({
                      month,
                      usage: seasonalData[month],
                    }));

                  return (
                    <>
                      {sortedData.length > 0 ? (
                        <>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={sortedData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <Tooltip />
                                <Bar
                                  dataKey="usage"
                                  name="Demand"
                                  fill="hsl(var(--chart-1))"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-medium mb-2">
                              Peak Usage Periods
                            </h4>
                            {(() => {
                              if (sortedData.length < 2)
                                return (
                                  <p className="text-sm text-muted-foreground">
                                    Not enough data to determine peaks
                                  </p>
                                );

                              // Identify peak months
                              const sortedByUsage = [...sortedData].sort(
                                (a, b) => b.usage - a.usage
                              );
                              const peaks = sortedByUsage.slice(
                                0,
                                Math.min(2, sortedByUsage.length)
                              );

                              return (
                                <div className="space-y-2">
                                  {peaks.map((peak, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center border-b pb-2 last:border-0"
                                    >
                                      <span>{peak.month}</span>
                                      <span className="font-medium">
                                        {peak.usage} units
                                      </span>
                                    </div>
                                  ))}
                                  <p className="text-sm mt-2">
                                    {peaks[0].month} has the highest usage.
                                    Consider stocking up before this period.
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>
                            Not enough transaction data to analyze seasonal
                            patterns
                          </p>
                          <p className="text-sm mt-2">
                            Try selecting a longer time period
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTE: Stock Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 space-y-6">
            {/* NOTE: Stock area chart */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={18} /> Stock Level History
                </CardTitle>
                <CardDescription>Stock level changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stockMovementData}>
                      <defs>
                        <linearGradient
                          id="stockGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.split(" ")[0]}
                      />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="stock"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#stockGradient)"
                      />
                      {product.bufferStock !== null && (
                        <Area
                          type="monotone"
                          dataKey={() => product.bufferStock}
                          stroke="#ff9800"
                          strokeDasharray="5 5"
                          fill="none"
                          name="Buffer Stock"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* NOTE: Recent transactions */}
            <Card className="w-full border-none shadow-none bg-background">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredTransactions.slice(-5).reverse().length > 0 ? (
                    filteredTransactions
                      .slice(-5)
                      .reverse()
                      .map((txn, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-3 rounded-lg border"
                        >
                          <div
                            className={`p-2 rounded-full ${
                              txn.action === "INCREASED"
                                ? "bg-green-100"
                                : txn.action === "DECREASED"
                                ? "bg-red-100"
                                : txn.action === "CREATED"
                                ? "bg-blue-100"
                                : txn.action === "RETURNED"
                                ? "bg-yellow-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {txn.action === "INCREASED" && (
                              <ArrowUp className="h-5 w-5 text-green-600" />
                            )}
                            {txn.action === "DECREASED" && (
                              <ArrowDown className="h-5 w-5 text-red-600" />
                            )}
                            {txn.action === "CREATED" && (
                              <PackageCheck className="h-5 w-5 text-blue-600" />
                            )}
                            {txn.action === "DELETED" && (
                              <AlertCircle className="h-5 w-5 text-gray-600" />
                            )}
                            {txn.action === "RETURNED" && (
                              <PackageOpen className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {txn.action === "INCREASED"
                                    ? "Stock Increased"
                                    : txn.action === "DECREASED"
                                    ? "Stock Decreased"
                                    : txn.action === "CREATED"
                                    ? "Product Created"
                                    : txn.action === "RETURNED"
                                    ? "Product Returned"
                                    : "Stock Deleted"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  By {txn.user.username}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-semibold ${
                                    txn.stockChange > 0
                                      ? "text-green-600"
                                      : txn.stockChange < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {txn.stockChange > 0 ? "+" : ""}
                                  {txn.stockChange}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {txn.stockBefore} → {txn.stockAfter}
                              </span>
                              <span className="text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDateTime(txn.createdAt)}
                              </span>
                            </div>
                            {txn.note && (
                              <p className="mt-2 text-sm bg-muted p-2 rounded">
                                {txn.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No recent transactions found for this time period.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTE: Transaction Analysis */}
        <TabsContent value="transactions" className="space-y-6 mt-6">
          {/* NOTE: Transaction Quantities */}
          <Card className="col-span-1 md:col-span-2">
            {/* <CardHeader>
              <CardTitle>Transaction Quantities</CardTitle>
              <CardDescription>
                Units sold to customers and purchased from vendors
              </CardDescription>
            </CardHeader> */}
            <CardContent className="mt-6">
              {(() => {
                // Calculate quantities by vendor and customer
                const vendorQuantities: Record<string, number> = {};
                const customerQuantities: Record<string, number> = {};

                filteredTransactions.forEach((t) => {
                  // Track quantities added by vendors (INCREASED transactions)
                  if (t.action === "INCREASED" && t.vendorId && t.vendor) {
                    vendorQuantities[t.vendor.companyName] =
                      (vendorQuantities[t.vendor.companyName] || 0) +
                      t.stockChange;
                  }

                  // Track quantities decreased for customers (DECREASED transactions)
                  if (t.action === "DECREASED" && t.customerId && t.customer) {
                    customerQuantities[t.customer.companyName] =
                      (customerQuantities[t.customer.companyName] || 0) +
                      Math.abs(t.stockChange);
                  }
                });

                const sortedVendors = Object.entries(vendorQuantities)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([name, quantity]) => ({ name, quantity }));

                const sortedCustomers = Object.entries(customerQuantities)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([name, quantity]) => ({ name, quantity }));

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer quantities */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" /> Sold to Customers
                      </h3>
                      {sortedCustomers.length > 0 ? (
                        <div className="space-y-3">
                          {sortedCustomers.map((customer, idx) => (
                            <div key={idx} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {customer.name}
                                </span>
                                <span className="text-red-600 font-semibold">
                                  {customer.quantity} {product.unit}
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (customer.quantity /
                                        Math.max(
                                          ...sortedCustomers.map(
                                            (c) => c.quantity
                                          )
                                        )) *
                                        100
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No customer sales data for this time period.
                        </p>
                      )}
                    </div>

                    {/* Vendor quantities */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Truck className="w-5 h-5 mr-2" /> Purchased from
                        Suppliers
                      </h3>
                      {sortedVendors.length > 0 ? (
                        <div className="space-y-3">
                          {sortedVendors.map((vendor, idx) => (
                            <div key={idx} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {vendor.name}
                                </span>
                                <span className="text-green-600 font-semibold">
                                  {vendor.quantity} {product.unit}
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (vendor.quantity /
                                        Math.max(
                                          ...sortedVendors.map(
                                            (v) => v.quantity
                                          )
                                        )) *
                                        100
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No vendor purchase data for this time period.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NOTE: Transaction Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transactionTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {transactionTypesData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* NOTE: Most Active Users */}

            <Card>
              <CardHeader>
                <CardTitle>Most Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.length > 0 ? (
                    topUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold">
                            {user.count}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">
                            transactions
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No user activity data available for this time period.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* NOTE: Associated Partners */}
          <Card>
            <CardHeader>
              <CardTitle>Associated Partners</CardTitle>
            </CardHeader>
            {(() => {
              // Extract vendors and customers from transactions
              const vendors: Record<string, number> = {};
              const customers: Record<string, number> = {};

              filteredTransactions.forEach((t) => {
                if (t.vendorId && t.vendor) {
                  vendors[t.vendor.companyName] =
                    (vendors[t.vendor.companyName] || 0) + 1;
                }

                if (t.customerId && t.customer) {
                  customers[t.customer.companyName] =
                    (customers[t.customer.companyName] || 0) + 1;
                }
              });

              const topVendors = (Object.entries(vendors) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

              const topCustomers = (
                Object.entries(customers) as [string, number][]
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
              return (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" /> Associated Customers
                      </h3>
                      {topCustomers.length > 0 ? (
                        <div className="space-y-2">
                          {topCustomers.map(([customer, count], index) => (
                            <div
                              key={index}
                              className="p-3 bg-primary/10 rounded-lg flex justify-between items-center"
                            >
                              <span>{customer}</span>
                              <Badge variant="outline">
                                {count} transactions
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No associated customers for this time period.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Truck className="w-5 h-5 mr-2" /> Associated Suppliers
                      </h3>
                      {topVendors.length > 0 ? (
                        <div className="space-y-2">
                          {topVendors.map(([vendor, count], index) => (
                            <div
                              key={index}
                              className="p-3 bg-success/10 rounded-lg flex justify-between items-center"
                            >
                              <span>{vendor}</span>
                              <Badge variant="outline">
                                {count} transactions
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No associated suppliers for this time period.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              );
            })()}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
