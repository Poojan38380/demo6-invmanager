import { notFound } from "next/navigation";
import { getCachedTransactionsByCustomerId } from "../../_actions/getTransactions";
import { TransactionTable } from "../../_components/TransactionTable";

export default async function CustomerTransactionsPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const transactions = await getCachedTransactionsByCustomerId(customerId);
  if (!transactions) return notFound();
  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Transactions</h1>
      <TransactionTable transactions={transactions} />
    </>
  );
}
