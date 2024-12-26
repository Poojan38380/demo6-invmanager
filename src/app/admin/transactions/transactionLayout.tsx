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
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
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

  const setThisWeek = () => {
    const today = new Date();
    setDateRange({
      from: startOfWeek(today),
      to: endOfWeek(today),
    });
    setIsCalendarOpen(false);
  };

  const setThisMonth = () => {
    const today = new Date();
    setDateRange({
      from: startOfMonth(today),
      to: endOfMonth(today),
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
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex justify-between p-3 border-b">
                <Button variant="ghost" size="sm" onClick={setToday}>
                  Today
                </Button>
                <Button variant="ghost" size="sm" onClick={setThisWeek}>
                  This Week
                </Button>
                <Button variant="ghost" size="sm" onClick={setThisMonth}>
                  This Month
                </Button>
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
              />
            </PopoverContent>
          </Popover>

          <Button onClick={clearFilter} variant="secondary">
            Clear Filter
          </Button>
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
