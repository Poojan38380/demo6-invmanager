import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "../_components/product-form/ProductForm";

export default function CreateProductPage() {
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="max-w-5xl mx-auto">
        <CardTitle className=" text-left flex items-center gap-2">
          <Link prefetch={false} href="/admin/products">
            <ChevronLeft />
          </Link>
          Add Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm />
      </CardContent>
    </Card>
  );
}
