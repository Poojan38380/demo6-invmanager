import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UnitSelector } from "../../../_components/unit-selector";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./ProductForm";

export default function ProductInfoCard({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bufferStock"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Min. Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={() => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <UnitSelector form={form} />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
