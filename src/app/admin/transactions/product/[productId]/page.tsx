import { notFound } from "next/navigation";
import { getCachedTransactionsByProductId } from "../../_actions/getTransactions";
import { TransactionTable } from "../../_components/TransactionTable";

export default async function ProductTransactionsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const transactions = await getCachedTransactionsByProductId(productId);
  if (!transactions) return notFound();
  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Transactions</h1>
      <TransactionTable transactions={transactions} />
    </>
  );
}
