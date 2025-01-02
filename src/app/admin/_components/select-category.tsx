import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";
import { getCachedCategories } from "../_actions/selector-data";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../products/_components/product-form/ProductForm";
import Link from "next/link";

export function SelectCategory({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCategories = async () => {
    if (hasLoaded) return;

    setIsLoading(true);
    try {
      const data = await getCachedCategories();
      setCategories(data);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  if (error) return <p>Error: {error}</p>;

  return (
    <FormField
      control={form.control}
      name="categoryId"
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
              <SelectTrigger id="category-select">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : error ? (
                <SelectItem value="error" disabled>
                  Error: {error}
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="none">None</SelectItem>
                  {categories.length &&
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
          <FormDescription>
            <Link
              href={`/admin/products/categories/new`}
              prefetch={false}
              target="_blank"
              className="flex justify-end underline"
            >
              Add new category ?
            </Link>
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
