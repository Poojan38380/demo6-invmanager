import { checkIdValidity } from "@/utils/checkIdValidity";
import { getCachedTransactionsByCustomerId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";
import { decodeURLid } from "@/utils/url-encoder-decoder";

export default async function CustomerTransactionsPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customerIdDecoded = decodeURLid(customerId);

  const idValidityCheck = checkIdValidity(customerIdDecoded, "customerId");
  if (idValidityCheck) return idValidityCheck;

  const transactions = await getCachedTransactionsByCustomerId(
    customerIdDecoded
  );

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No transactions found for this customer.
      </div>
    );
  }

  return (
    <TransactionLayout
      title={`Transactions to customer: ${transactions[0].customer?.companyName}`}
      transactions={transactions}
    />
  );
}
