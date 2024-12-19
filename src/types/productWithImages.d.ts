import { Product } from "@prisma/client";

export type ProductWithImages = Product & {
  productImages: {
    url: string;
  }[];
};
