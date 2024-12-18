import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";
import { getCachedCategories } from "../_actions/selector-data";

interface SelectCategoryProps {
  onCategorySelect: (categoryId: string | undefined) => void;
  defaultValue?: string;
  label?: string;
}

export function SelectCategory({
  onCategorySelect,
  defaultValue,
}: SelectCategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getCachedCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchSuppliers();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    defaultValue
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedCategory(defaultValue);
    }
  }, [defaultValue]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onCategorySelect(value === "none" ? undefined : value);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger id="category-select">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        {categories.length &&
          categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
