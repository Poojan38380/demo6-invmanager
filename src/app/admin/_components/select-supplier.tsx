"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCachedSuppliers } from "../_actions/selector-data";
import { Vendor } from "@prisma/client";

interface SupplierSelectorProps {
  onSupplierSelect: (supplierId: string | undefined) => void;
  defaultValue?: string;
}

export function SupplierSelector({
  onSupplierSelect,
  defaultValue,
}: SupplierSelectorProps) {
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
      <SelectTrigger id="supplier-select">
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
