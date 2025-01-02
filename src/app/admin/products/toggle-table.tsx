import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ProductDataTable } from "./_components/data-table";
import { BasicColumns } from "./_cloumns/basic-columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { ProductWithOneImage } from "./_actions/products";
import BackButton from "../_components/sidebar/back-button";

function ToggleTable({ products }: { products: ProductWithOneImage[] }) {
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="py-2 flex flex-row items-center justify-between ">
        <BackButton title="Products" />
        <Button asChild className="rounded-full shadow-sm">
          <Link prefetch={false} href="/admin/products/new">
            <PlusIcon size={16} />
            Add product
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ProductDataTable columns={BasicColumns} data={products} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default ToggleTable;
