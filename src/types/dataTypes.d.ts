import { Product } from "@prisma/client";

export type ProductWithImages = Product & {
  productImages: {
    url: string;
  }[];
};

export type TransactionForTable = Transaction & {
  product: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    username: string;
  };
  customer?: {
    id: string;
    companyName: string;
  };
  vendor?: {
    id: string;
    companyName: string;
  };
};
