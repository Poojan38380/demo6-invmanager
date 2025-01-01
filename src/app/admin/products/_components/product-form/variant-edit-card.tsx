import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductVariant } from "@prisma/client";
import { toast } from "sonner";
import { EditVariants } from "../../_actions/variants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function VariantEditCard({
  productVariants,
  productId,
}: {
  productVariants: ProductVariant[];
  productId: string;
}) {
  const [variants, setVariants] = useState(
    productVariants.map((variant) => ({
      variantId: variant.id,
      variantNewName: variant.variantName,
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        variantId: `temp-${Date.now()}`,
        variantNewName: "",
      },
    ]);
  };

  const handleVariantNameChange = (index: number, newName: string) => {
    const newVariants = [...variants];
    newVariants[index].variantNewName = newName;
    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate that no variant names are empty
      if (variants.some((v) => !v.variantNewName.trim())) {
        toast.error("Error", {
          description: "All variants must have a name",
        });
        return;
      }

      const result = await EditVariants({
        data: {
          productId,
          variants,
        },
      });

      if (result.success) {
        toast.success("Success", {
          description: "Variants updated successfully",
        });
      } else {
        throw new Error(result.error || "Failed to update variants");
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to update variants",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Collapsible className="w-full group/collapsible" asChild>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className=" flex flex-row justify-between items-center cursor-pointer">
            <CardTitle>Edit Variants</CardTitle>
            <ChevronRight
              className={cn(
                "w-6 h-6 transition-transform duration-200 text-muted-foreground",
                "group-data-[state=open]/collapsible:rotate-90"
              )}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {variants.map((variant, index) => (
              <div key={variant.variantId} className="flex items-center gap-2">
                <Input
                  placeholder="Variant name"
                  value={variant.variantNewName}
                  onChange={(e) =>
                    handleVariantNameChange(index, e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            ))}
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="flex gap-2 items-center"
              onClick={handleAddVariant}
            >
              <PlusIcon className="h-4 w-4" />
              Add Variant
            </Button>
            <Button
              size="sm"
              type="button"
              className="flex gap-2 items-center"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Check className="h-4 w-4" />
              Save Variants
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
