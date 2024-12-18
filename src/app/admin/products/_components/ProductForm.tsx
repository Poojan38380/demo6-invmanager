"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import MediaCard from "./media-card";
import ProductInfoCard from "./product-info-card";
import ProductDetailsCard from "./product-details-card";
import PricingCard from "./product-pricing-card";
import CategoryCard from "./product-category-select-card";
import SupplierCard from "./product-supplier-select-card";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  stock: z.number().nonnegative().optional(),
  bufferStock: z.number().nonnegative().optional(),
  shortDescription: z
    .string()
    .max(200, {
      message: "Short description must not exceed 200 characters.",
    })
    .optional(),
  longDescription: z.string().optional(),
  costPrice: z.number().nonnegative().optional(),
  sellingPrice: z.number().nonnegative().optional(),
  unit: z.string(),
  vendorId: z.string().optional(),
  categoryId: z.string().optional(),
  images: z
    .array(z.instanceof(File))
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: "Each file must be smaller than 5MB.",
    })
    .refine(
      (files) =>
        files.every((file) => ["image/jpeg", "image/png"].includes(file.type)),
      {
        message: "Only JPEG and PNG files are allowed.",
      }
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductForm() {
  const [selectedUnit, setSelectedUnit] = useState<string>("pcs");
  const [vendorId, setVendorId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [productImages, setProductImages] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      stock: 0,
      bufferStock: 0,
      unit: selectedUnit,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Handle form submission
    console.log(data);
  };

  const calculateMargin = () => {
    const costPrice = form.watch("costPrice") || 0;
    const sellingPrice = form.watch("sellingPrice") || 0;
    if (costPrice === 0) return 0;
    return ((sellingPrice - costPrice) / costPrice) * 100;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="px-3 max-768:px-0 grid max-1024:grid-cols-1 gap-6 grid-cols-3 max-w-5xl mx-auto mb-10">
          <div className="col-span-2 space-y-6">
            <ProductInfoCard form={form} />
            <MediaCard setProductImages={setProductImages} />
            <ProductDetailsCard form={form} />
          </div>
          <div className="col-span-1 flex flex-col space-y-6">
            <PricingCard form={form} margin={calculateMargin()} />
            <CategoryCard
              categoryId={categoryId}
              setCategoryId={setCategoryId}
            />
            <SupplierCard vendorId={vendorId} setVendorId={setVendorId} />
            <div className="flex justify-end px-6">
              <Button type="submit">Create Product</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
