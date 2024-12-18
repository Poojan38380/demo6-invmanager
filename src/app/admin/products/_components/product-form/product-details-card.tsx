import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./ProductForm";

export default function ProductDetailsCard({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <section id="product-description" className="space-y-4">
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a brief description of the product"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A concise summary of the product (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a detailed description of the product"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A comprehensive description of the product (optional). You can
                  format the text.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
      </CardContent>
    </Card>
  );
}
