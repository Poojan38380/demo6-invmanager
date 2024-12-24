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
  if (!transactions || transactions.length === 0) return notFound();

  const username = transactions[0]?.user?.username ?? "Unknown User";

  return (
    <TransactionLayout
      title={`Transactions by user: ${username}`}
      transactions={transactions}
    />
  );
}
