import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MeasurementUnit } from "@prisma/client";
import { getCachedUnits } from "../_actions/selector-data";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../products/_components/product-form/ProductForm";

export function UnitSelector({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUnits();
    }
  }, [isOpen]);

  const fetchUnits = async () => {
    if (hasLoaded) return;

    setIsLoading(true);
    try {
      const data = await getCachedUnits();
      setUnits(data);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <FormField
      control={form.control}
      name="unit"
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            onOpenChange={(open) => setIsOpen(open)}
          >
            <FormControl>
              <SelectTrigger id="unit-select">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Loading units...
                </SelectItem>
              ) : error ? (
                <SelectItem value="error" disabled>
                  Error: {error}
                </SelectItem>
              ) : (
                <>
                  {units.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
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
