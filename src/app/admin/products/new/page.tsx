import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import ProductForm from "../_components/ProductForm";

export default function CreateProductPage() {
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader>
        <CardTitle>Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm />
      </CardContent>
    </Card>
  );
}
