import {
  Category,
  Product,
  ProductImage,
  Transaction,
  User,
} from "@prisma/client";

export type ProductWithImages = Product & {
  productImages: ProductImage[];
};

export type TransactionForTable = Transaction & {
  product: {
    name: string;
    unit?: string | null;
    costPrice: number | null;
    sellingPrice?: number | null;
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
export type CategoryWithCounts = Category & {
  _count: { products: number };
};
