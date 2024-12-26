"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsDataTable } from "./_components/trans-data-table";
import { TransactionForTable } from "@/types/dataTypes";
import { TransactionTableColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, FilterX } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function TransactionLayout({
  transactions,
  title,
}: {
  transactions: TransactionForTable[];
  title: string;
}) {
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    handleFilter();
  }, [dateRange]);

  const handleFilter = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      if (dateRange?.from && dateRange?.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        return transactionDate >= dateRange.from && transactionDate <= endDate;
      }
      return true;
    });
    setFilteredTransactions(filtered);
  };

  const clearFilter = () => {
    setDateRange(undefined);
    setFilteredTransactions(transactions);
  };

  const setToday = () => {
    const today = new Date();
    setDateRange({ from: today, to: today });
    setIsCalendarOpen(false);
  };

  const setLast7Days = () => {
    const today = new Date();
    setDateRange({
      from: subDays(today, 6),
      to: today,
    });
    setIsCalendarOpen(false);
  };
  const setLast14Days = () => {
    const today = new Date();
    setDateRange({
      from: subDays(today, 13),
      to: today,
    });
    setIsCalendarOpen(false);
  };

  const setLast30Days = () => {
    const today = new Date();
    setDateRange({
      from: subDays(today, 29),
      to: today,
    });
    setIsCalendarOpen(false);
  };

  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader className="py-4 flex flex-row flex-wrap items-center gap-4 justify-between">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <div className="flex items-center gap-4">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "items-center rounded-full",
                  !dateRange && "text-muted-foreground"
                )}
              >
                {dateRange?.from && dateRange.to ? null : (
                  <CalendarIcon className="h-4 w-4 text-primary-foreground" />
                )}
                {dateRange?.from ? (
                  dateRange.to ? (
                    <div>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </div>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px]   mx-2" align="start">
              <div className="flex flex-wrap  gap-2   p-3  border-b ">
                <Badge
                  variant={"outline"}
                  onClick={setToday}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors  "
                >
                  Today
                </Badge>
                <Badge
                  variant={"outline"}
                  onClick={setLast7Days}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors  "
                >
                  Last 7 Days
                </Badge>
                <Badge
                  variant={"outline"}
                  onClick={setLast14Days}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors  "
                >
                  Last 14 Days
                </Badge>
                <Badge
                  variant={"outline"}
                  onClick={setLast30Days}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors  "
                >
                  Last 30 Days
                </Badge>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(newDateRange) => {
                  setDateRange(newDateRange);
                  if (newDateRange?.to) setIsCalendarOpen(false);
                }}
                numberOfMonths={1}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>

          {dateRange?.from && dateRange.to && (
            <Button onClick={clearFilter} variant="destructive">
              <FilterX />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <TransactionsDataTable
          columns={TransactionTableColumns}
          data={filteredTransactions}
        />
      </CardContent>
    </Card>
  );
}
