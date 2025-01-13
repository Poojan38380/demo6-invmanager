import TransactionLayout from "../../../transactionLayout";
import { getCachedTransactionsByVariantId } from "../../../_actions/getTransactions";
import { checkIdValidity } from "@/utils/checkIdValidity";
import { decodeURLid } from "@/utils/url-encoder-decoder";

export default async function ProductTransactionsPage({
  params,
}: {
  params: Promise<{ variantId: string }>;
}) {
  const { variantId } = await params;
  const variantIdDecoded = decodeURLid(variantId);

  const idValidityCheck = checkIdValidity(variantIdDecoded, "variantId");
  if (idValidityCheck) return idValidityCheck;

  const transactions = await getCachedTransactionsByVariantId(variantIdDecoded);

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
