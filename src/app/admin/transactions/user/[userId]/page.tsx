import { notFound } from "next/navigation";
import { getCachedTransactionsByUserId } from "../../_actions/getTransactions";
import { TransactionTable } from "../../_components/TransactionTable";

export default async function UserTransactionsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const transactions = await getCachedTransactionsByUserId(userId);
  if (!transactions) return notFound();
  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Transactions</h1>
      <TransactionTable transactions={transactions} />
    </>
  );
}
