import { notFound } from "next/navigation";
import { getCachedTransactionsByProductId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";

export default async function ProductTransactionsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const transactions = await getCachedTransactionsByProductId(productId);
  if (!transactions || transactions.length === 0) return notFound();
  return (
    <TransactionLayout
      title={`Transactions on product: ${transactions[0].product.name}`}
      transactions={transactions}
    />
  );
}
