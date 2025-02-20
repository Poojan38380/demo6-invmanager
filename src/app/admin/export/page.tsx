import {
  getCustomersForExport,
  getProductsForExport,
  getSuppliersForExport,
  getTransactionsForExport,
  getusersForExport,
} from "./_actions/getData";
import TransactionExport from "./_components/TransactionExport";

import React from "react";

export default async function ExportPage() {
  const transactions = await getTransactionsForExport();
  const products = await getProductsForExport();
  const customers = await getCustomersForExport();
  const suppliers = await getSuppliersForExport();
  const users = await getusersForExport();
  return (
    <div className="container mx-auto p-4">
      <TransactionExport
        transactions={transactions}
        products={products}
        customers={customers}
        vendors={suppliers}
        users={users}
      />
    </div>
  );
}
