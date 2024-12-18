import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import ProductForm from "../_components/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="max-w-5xl mx-auto">
        <CardTitle className=" text-left flex items-center gap-2">
          <Link href="/admin/products">
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
