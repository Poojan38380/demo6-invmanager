"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UnitSelector } from "./select-units";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  stock: z.number().optional(),
  bufferStock: z.number().optional(),
  sku: z.string().optional(),
  shortDescription: z
    .string()
    .max(200, {
      message: "Short description must not exceed 200 characters.",
    })
    .optional(),
  longDescription: z.string().optional(),
  costPrice: z.number().optional(),
  sellingPrice: z.number().optional(),
  imageUrl: z.string().url().optional(),
});

export default function ProductForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      stock: 0,
      bufferStock: 0,
    },
  });

  const [selectedUnit, setSelectedUnit] = useState<string>("pcs");

  return (
    <Form {...form}>
      <form>
        <div className=" px-3 max-768:px-0 grid max-1024:grid-cols-1 space-x-6 max-1024:space-x-0 max-1024:space-y-6   grid-cols-3 max-w-5xl  mx-auto  mb-10">
          <div className="  col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bufferStock"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Min. Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <UnitSelector
                      defaultValue={selectedUnit}
                      onUnitChange={(unit) => setSelectedUnit(unit)}
                    />
                  </FormItem>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
