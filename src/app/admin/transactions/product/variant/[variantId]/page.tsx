import { notFound } from "next/navigation";
import TransactionLayout from "../../../transactionLayout";
import { getCachedTransactionsByVariantId } from "../../../_actions/getTransactions";

export default async function ProductTransactionsPage({
  params,
}: {
  params: Promise<{ variantId: string }>;
}) {
  const { variantId } = await params;

  const transactions = await getCachedTransactionsByVariantId(variantId);
  if (!transactions || transactions.length === 0) return notFound();

  const productName = transactions[0].product.name;
  return (
    <TransactionLayout
      title={`Transactions on product: ${productName} (${transactions[0].productVariant?.variantName})`}
      transactions={transactions}
      displayChart
    />
  );
}
