"use client";

import React, { useState, useEffect } from "react";
import { History, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateYYMMDDHHMM } from "@/lib/format-date";
import { formatNumber } from "@/lib/formatter";
import { getCachedProductLastTransactions } from "../_actions/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TransactionAction } from "@prisma/client";

type ProductTransaction = {
  id: string;
  createdAt: Date;
  action: TransactionAction;
  stockBefore: number;
  stockChange: number;
  stockAfter: number;
  note: string | null;
  user: { username: string };
  customer: { companyName: string } | null;
  vendor: { companyName: string } | null;
  productVariant: { variantName: string } | null;
};

const TransactionItem = ({
  transaction,
}: {
  transaction: ProductTransaction;
}) => {
  const isIncrease = transaction.action === "INCREASED";
  return (
    <div className=" flex  justify-between mb-4">
      <div>
        <div className="flex items-center gap-2">
          {transaction.productVariant ? (
            <Badge variant={"outline"} className={`text-xs font-medium `}>
              {transaction.productVariant.variantName}
            </Badge>
          ) : null}
          <Badge
            variant={`${isIncrease ? "success" : "destructive"}`}
            className={`text-sm font-medium flex items-center gap-1  w-min`}
          >
            {isIncrease ? "" : "-"}
            {formatNumber(Math.abs(transaction.stockChange))}
            {isIncrease ? (
              <ArrowUp className="h-4 w-4  flex-shrink-0" />
            ) : (
              <ArrowDown className="h-4 w-4  flex-shrink-0" />
            )}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatDateYYMMDDHHMM(transaction.createdAt)} •{" "}
          {transaction.user.username}
        </div>
      </div>
      <div className="text-sm flex justify-between gap-1   pt-2">
        <div className="">
          {formatNumber(transaction.stockBefore)} →{" "}
          <span className="font-semibold">
            {formatNumber(transaction.stockAfter)}
          </span>
          <div className="text-sm text-muted-foreground flex justify-end">
            {transaction.note}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompactTransactionHistory = ({ productId }: { productId: string }) => {
  const [transactions, setTransactions] = useState<ProductTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchTransactions = async () => {
    if (!open) return;
    setIsLoading(true);
    try {
      const response = await getCachedProductLastTransactions(productId);
      setTransactions(response);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
          title="View transaction history"
        >
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Last 5 transactions</DialogTitle>
        </DialogHeader>

        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center p-4 text-sm text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <div className="p-2">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompactTransactionHistory;
