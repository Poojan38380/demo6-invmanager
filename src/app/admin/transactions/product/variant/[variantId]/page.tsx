import TransactionLayout from "../../../transactionLayout";
import { getCachedTransactionsByVariantId } from "../../../_actions/getTransactions";
import { checkIdValidity } from "@/utils/checkIdValidity";

export default async function ProductTransactionsPage({
  params,
}: {
  params: Promise<{ variantId: string }>;
}) {
  const { variantId } = await params;

  const idValidityCheck = checkIdValidity(variantId, "variantId");
  if (idValidityCheck) return idValidityCheck;

  const transactions = await getCachedTransactionsByVariantId(variantId);

  if (!transactions || transactions.length === 0)
    return (
      <div className="text-center p-8 text-gray-600">
        No transactions done on this product variant.
      </div>
    );

  const productName = transactions[0].product.name;
  return (
    <TransactionLayout
      title={`Transactions on product: ${productName} (${transactions[0].productVariant?.variantName})`}
      transactions={transactions}
      displayChart
    />
  );
}
