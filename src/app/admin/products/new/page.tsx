import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductForm from "../_components/product-form/ProductForm";
import BackButton from "../../_components/sidebar/back-button";

export default function CreateProductPage() {
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CardHeader className="max-w-5xl mx-auto">
        <BackButton title="Add Product" />
      </CardHeader>
      <CardContent className="max-768:px-0">
        <ProductForm />
      </CardContent>
    </Card>
  );
}
