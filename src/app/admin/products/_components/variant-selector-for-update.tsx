import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface VariantSelectorForUpdaterProps {
  productVariants: {
    id: string;
    variantName: string;
    variantStock: number;
  }[];
  onVariantSelect: (variantId: string) => void;
  selectedVariantId?: string;
}

const VariantSelectorForUpdater: React.FC<VariantSelectorForUpdaterProps> = ({
  productVariants,
  onVariantSelect,
  selectedVariantId,
}) => {
  if (!productVariants || productVariants.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <Label>Select Variant</Label>
      <Select value={selectedVariantId} onValueChange={onVariantSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a variant" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {productVariants.map((variant) => (
              <SelectItem key={variant.id} value={variant.id}>
                {variant.variantName} ({variant.variantStock})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSelectorForUpdater;
