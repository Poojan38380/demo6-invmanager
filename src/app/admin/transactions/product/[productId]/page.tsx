import { notFound } from "next/navigation";
import { getCachedTransactionsByProductId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";
import TableSkeleton from "@/app/admin/_components/table-skeleton";
import { Suspense } from "react";

async function ProductTransactionsComp({ productId }: { productId: string }) {
  const transactions = await getCachedTransactionsByProductId(productId);
  if (!transactions || transactions.length === 0) return notFound();
  return (
    <TransactionLayout
      title={`Transactions on product: ${transactions[0].product.name}`}
      transactions={transactions}
      displayChart
    />
  );
}

export default async function TransactionsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return (
    <Suspense fallback={<TableSkeleton />}>
      <ProductTransactionsComp productId={productId} />
    </Suspense>
  );
}
