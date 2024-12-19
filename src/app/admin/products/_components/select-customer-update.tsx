"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCachedCustomers } from "../../_actions/selector-data";
import { Customer } from "@prisma/client";

interface CustomerSelectorforUpdaterProps {
  onCustomerSelect: (customerId: string | undefined) => void;
  defaultValue?: string;
}

export function CustomerSelectorforUpdater({
  onCustomerSelect,
  defaultValue,
}: CustomerSelectorforUpdaterProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCachedCustomers();
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchCustomers();
  }, []);

  const [selectedCustomer, setSelectedCustomer] = useState<string | undefined>(
    defaultValue
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedCustomer(defaultValue);
    }
  }, [defaultValue]);

  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    onCustomerSelect(value === "none" ? undefined : value);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <Select value={selectedCustomer} onValueChange={handleCustomerChange}>
      <SelectTrigger
        id="customer-select"
        className=" h-12  border-none rounded-full shadow-sm"
      >
        <SelectValue placeholder="Select a customer" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        {customers.length &&
          customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.companyName}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
