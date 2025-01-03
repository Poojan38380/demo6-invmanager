import { checkIdValidity } from "@/utils/checkIdValidity";
import { getCachedTransactionsByProductId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";
import TableSkeleton from "@/app/admin/_components/table-skeleton";
import { Suspense } from "react";

async function ProductTransactionsComp({ productId }: { productId: string }) {
  const idValidityCheck = checkIdValidity(productId, "productId");
  if (idValidityCheck) return idValidityCheck;

  const transactions = await getCachedTransactionsByProductId(productId);
  if (!transactions || transactions.length === 0)
    return (
      <div className="text-center p-8 text-gray-600">
        No transactions done on this product.
      </div>
    );
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
