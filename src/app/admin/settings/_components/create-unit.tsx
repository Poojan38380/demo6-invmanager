"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUnit } from "../../_actions/selector-data";
function CreateUnitForm() {
  type FormData = {
    unitName: string;
  };
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    defaultValues: {
      unitName: "",
    },
  });

  const onSubmit = async (FormData: FormData) => {
    setLoading(true);
    const loadingToast = toast.loading(`Creating unit`);
    try {
      const result = await createUnit(FormData.unitName);
      if (result.success) {
        form.reset();
        router.refresh();
        toast.success("Unit created successfully", { id: loadingToast });
      } else {
        toast.error(result.error || "Failed to create unit", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
        <FormField
          control={form.control}
          name="unitName"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  className="max-w-sm"
                  placeholder="Enter unit name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Add"}
        </Button>
      </form>
    </Form>
  );
}

export default CreateUnitForm;
