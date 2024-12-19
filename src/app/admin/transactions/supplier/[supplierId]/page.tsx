import { notFound } from "next/navigation";
import { getCachedTransactionsByVendorId } from "../../_actions/getTransactions";
import { TransactionTable } from "../../_components/TransactionTable";

export default async function UserTransactionsPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;

  const transactions = await getCachedTransactionsByVendorId(supplierId);
  if (!transactions) return notFound();
  return (
    <>
      <h1 className="text-2xl font-bold mb-5">Transactions</h1>
      <TransactionTable transactions={transactions} />
    </>
  );
}
