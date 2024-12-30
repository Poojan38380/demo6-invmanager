import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdditionalFields({
  lastMonthSales,
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
  lastMonthSales?: number;
}) {
  return (
    <Collapsible className="w-full group/collapsible" asChild>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className=" flex flex-row justify-between items-center cursor-pointer">
            <CardTitle>Additional Fields</CardTitle>
            <ChevronRight
              className={cn(
                "w-6 h-6 transition-transform duration-200 text-muted-foreground",
                "group-data-[state=open]/collapsible:rotate-90"
              )}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="bufferStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                      placeholder="Min. stock"
                    />
                  </FormControl>
                  <FormMessage />
                  {lastMonthSales && (
                    <FormDescription>
                      Last 30 days demand : {lastMonthSales} units.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qtyInBox"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Items in a box</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                      placeholder="Items in a box"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
