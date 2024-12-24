import { Product, Transaction, User } from "@prisma/client";

export type ProductWithImages = Product & {
  productImages: {
    url: string;
  }[];
};

export type TransactionForTable = Transaction & {
  product: {
    name: string;
    unit?: string | null;
  };
  user: {
    username: string;
  };
  customer: {
    companyName: string;
  } | null;
  vendor: {
    companyName: string;
  } | null;
};

export type UserWithCounts = User & {
  _count: { products: number; transactions: number };
};
