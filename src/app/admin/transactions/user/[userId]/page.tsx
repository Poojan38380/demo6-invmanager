import { checkIdValidity } from "@/utils/checkIdValidity";
import { getCachedTransactionsByUserId } from "../../_actions/getTransactions";
import TransactionLayout from "../../transactionLayout";

export default async function UserTransactionsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const idValidityCheck = checkIdValidity(userId, "userId");
  if (idValidityCheck) return idValidityCheck;

  const transactions = await getCachedTransactionsByUserId(userId);
  if (!transactions || transactions.length === 0)
    return (
      <div className="text-center p-8 text-gray-600">
        No transactions done by this user.
      </div>
    );

  const username = transactions[0]?.user?.username ?? "Unknown User";

  return (
    <TransactionLayout
      title={`Transactions by user: ${username}`}
      transactions={transactions}
    />
  );
}
