import { useState, useEffect } from "react";
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

export function UnitSelector({ form }: { form: any }) {
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await getCachedUnits();
        setUnits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchUnits();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <FormField
      control={form.control}
      name="unit"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger id="unit-select">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.name} value={unit.name}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
