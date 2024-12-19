"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCachedSuppliers } from "../_actions/selector-data";
import { Vendor } from "@prisma/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../products/_components/product-form/ProductForm";

interface SupplierSelectorProps {
  form: UseFormReturn<ProductFormValues>;
}

export function SupplierSelector({ form }: SupplierSelectorProps) {
  const [suppliers, setSuppliers] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    if (hasLoaded) return;

    try {
      const data = await getCachedSuppliers();
      setSuppliers(data);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="vendorId"
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={(value) => {
              if (value === "none") {
                field.onChange(undefined);
              } else {
                field.onChange(value);
              }
            }}
            defaultValue={field.value}
            onOpenChange={(open) => setIsOpen(open)}
          >
            <FormControl>
              <SelectTrigger id="supplier-select">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Loading suppliers...
                </SelectItem>
              ) : error ? (
                <SelectItem value="error" disabled>
                  Error: {error}
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="none">None</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.companyName}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
