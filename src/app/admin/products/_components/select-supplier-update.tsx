"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Vendor } from "@prisma/client";
import { getCachedSuppliers } from "../../_actions/selector-data";

interface SupplierSelectorforUpdaterProps {
  onSupplierSelect: (supplierId: string | undefined) => void;
  defaultValue?: string;
}

export function SupplierSelectorforUpdater({
  onSupplierSelect,
  defaultValue,
}: SupplierSelectorforUpdaterProps) {
  const [suppliers, setSuppliers] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getCachedSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchSuppliers();
  }, []);

  const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>(
    defaultValue
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedSupplier(defaultValue);
    }
  }, [defaultValue]);

  const handleSupplierChange = (value: string) => {
    setSelectedSupplier(value);
    onSupplierSelect(value === "none" ? undefined : value);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <Select value={selectedSupplier} onValueChange={handleSupplierChange}>
      <SelectTrigger
        className=" h-12  border-none rounded-full shadow-sm"
        id="supplier-select"
      >
        <SelectValue placeholder="Select a supplier" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        {suppliers.length &&
          suppliers.map((supplier) => (
            <SelectItem key={supplier.id} value={supplier.id}>
              {supplier.companyName}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
