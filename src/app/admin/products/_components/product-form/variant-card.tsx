import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ProductFormValues } from "./ProductForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusIcon, TrashIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function VariantCard({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  const { control } = form;

  // Use react-hook-form's useFieldArray to manage an array of variants
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productVariants", // The name should match the field array in your form schema
  });

  const addVariant = () => {
    append({ variantName: "", variantStock: 0 }); // Initial values for new variant fields
  };

  return (
    <Collapsible className="w-full group/collapsible" asChild>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className=" flex flex-row justify-between items-center cursor-pointer">
            <div className="flex flex-col gap-1">
              <CardTitle>Add Variants</CardTitle>
              <CardDescription>Add colour and size variants.</CardDescription>
            </div>
            <ChevronRight
              className={cn(
                "w-6 h-6 transition-transform duration-200 text-muted-foreground",
                "group-data-[state=open]/collapsible:rotate-90"
              )}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 gap-2 items-center"
              >
                <FormField
                  control={control}
                  name={`productVariants.${index}.variantName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter variant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 items-center">
                  <FormField
                    control={control}
                    name={`productVariants.${index}.variantStock`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            placeholder="Enter stock"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"ghost"}
                    className="flex gap-2 items-center text-destructive"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              size={"sm"}
              variant={"outline"}
              className="flex gap-2 items-center"
              onClick={addVariant}
            >
              <PlusIcon />
              Add Variant
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
