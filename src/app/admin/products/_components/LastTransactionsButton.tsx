"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Building,
  Truck,
} from "lucide-react";
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
import Link from "next/link";
import TransactionLoader from "../../transactions/_components/loader/transaction-loader";
import { encodeURLid } from "@/utils/url-encoder-decoder";

type ProductTransaction = {
  id: string;
  createdAt: Date;
  action: TransactionAction;
  stockBefore: number;
  stockChange: number;
  stockAfter: number;
  note: string | null;
  user: { username: string };
  customer: { companyName: string; id: string } | null;
  vendor: { companyName: string; id: string } | null;
  productVariant: { variantName: string; id: string } | null;
};

const TransactionItem = ({
  transaction,
}: {
  transaction: ProductTransaction;
}) => {
  const isIncrease = transaction.action === "INCREASED";

  return (
    <div className="flex flex-col gap-1 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {transaction.productVariant && (
            <Badge variant="outline" className="text-xs">
              {transaction.productVariant.variantName}
            </Badge>
          )}
          <Badge
            variant={isIncrease ? "success" : "destructive"}
            className="text-sm font-medium flex items-center gap-1"
          >
            {isIncrease ? "+" : "-"}
            {formatNumber(Math.abs(transaction.stockChange))}
            {isIncrease ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatNumber(transaction.stockBefore)}
          </span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm font-medium">
            {formatNumber(transaction.stockAfter)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{formatDateYYMMDDHHMM(transaction.createdAt)}</span>
            <span>•</span>
            <span>{transaction.user.username}</span>
          </div>
          <div>
            {transaction.customer ? (
              <Link
                prefetch={false}
                href={`/admin/transactions/customer/${encodeURLid(
                  transaction.customer.id
                )}`}
                className="flex items-center gap-2 text-primary hover:underline hover:text-accent-foreground transition-colors"
              >
                <Building className="h-4 w-4" />
                {transaction.customer.companyName}
              </Link>
            ) : transaction.vendor ? (
              <Link
                prefetch={false}
                href={`/admin/transactions/supplier/${encodeURLid(
                  transaction.vendor.id
                )}`}
                className="flex items-center gap-2 text-primary hover:underline hover:text-accent-foreground transition-colors"
              >
                <Truck className="h-4 w-4" />
                {transaction.vendor.companyName}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-bold">
          {transaction.note}
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Last 5 Transactions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 scale-90">
              <TransactionLoader />
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <History className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-2">
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
