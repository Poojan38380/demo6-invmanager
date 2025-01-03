import { checkIdValidity } from "@/utils/checkIdValidity";
import { getCachedTransactionsByVendorId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";

export default async function UserTransactionsPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;

  const idValidityCheck = checkIdValidity(supplierId, "supplierId");
  if (idValidityCheck) return idValidityCheck;

  const transactions = await getCachedTransactionsByVendorId(supplierId);
  if (!transactions || transactions.length === 0)
    return (
      <div className="text-center p-8 text-gray-600">
        No transactions found for this supplier.
      </div>
    );
  return (
    <TransactionLayout
      title={`Transactions from supplier: ${transactions[0].vendor?.companyName}`}
      transactions={transactions}
    />
  );
}
