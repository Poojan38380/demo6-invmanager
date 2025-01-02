import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "./ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectCategory } from "@/app/admin/_components/select-category";
import { SupplierSelector } from "@/app/admin/_components/select-supplier";

export default function CategorySupplierCard({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  return (
    <Collapsible className="w-full group/collapsible" asChild>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className=" flex flex-row justify-between items-center cursor-pointer">
            <CardTitle>Category & suppliers</CardTitle>
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
            <SelectCategory form={form} />
            <SupplierSelector form={form} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
