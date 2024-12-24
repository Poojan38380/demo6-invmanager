import { notFound } from "next/navigation";
import { getCachedTransactionsByVendorId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";

export default async function UserTransactionsPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;

  const transactions = await getCachedTransactionsByVendorId(supplierId);
  if (!transactions || transactions.length === 0) return notFound();
  return (
    <TransactionLayout
      title={`Transactions from supplier: ${transactions[0].vendor?.companyName}`}
      transactions={transactions}
    />
  );
}
