import { Product, Transaction } from "@prisma/client";

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
