import { notFound } from "next/navigation";
import { getCachedTransactionsByUserId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";

export default async function UserTransactionsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const transactions = await getCachedTransactionsByUserId(userId);
  if (!transactions) return notFound();
  return (
    <TransactionLayout
      title={`Transactions by user: ${transactions[0].user.username}`}
      transactions={transactions}
    />
  );
}
