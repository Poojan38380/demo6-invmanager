import { notFound } from "next/navigation";
import { getCachedTransactionsByCustomerId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";

export default async function CustomerTransactionsPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const transactions = await getCachedTransactionsByCustomerId(customerId);
  if (!transactions || transactions.length === 0) return notFound();
  return (
    <TransactionLayout
      title={`Transactions to customer: ${transactions[0].customer?.companyName}`}
      transactions={transactions}
    />
  );
}
