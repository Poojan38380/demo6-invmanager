"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ProductInfoCard from "./product-info-card";
import ProductDetailsCard from "./product-details-card";
import PricingCard from "./product-pricing-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MediaCard from "./media-card";
import { addProduct } from "../../_actions/products";
import { SupplierSelector } from "@/app/admin/_components/select-supplier";
import { SelectCategory } from "@/app/admin/_components/select-category";

const ProductformSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  stock: z.number(),
  bufferStock: z.number().optional(),
  shortDescription: z
    .string()
    .max(200, {
      message: "Short description must not exceed 200 characters.",
    })
    .optional(),
  longDescription: z.string().optional(),
  costPrice: z.number().optional(),
  sellingPrice: z.number().optional(),
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

export type ProductFormValues = z.infer<typeof ProductformSchema>;

export default function ProductForm() {
  const [productImages, setProductImages] = useState<File[]>([]);

  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductformSchema),
    defaultValues: {
      name: "",
      stock: 0,
      bufferStock: 0,
      unit: "pcs",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    const loadingToast = toast.loading("Adding product...");
    try {
      const result = await addProduct(data, productImages);
      if (result.success) {
        toast.success("Product added successfully", { id: loadingToast });
        form.reset();
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to add product", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", { id: loadingToast });
    }
  };

  const calculateMargin = () => {
    const costPrice = form.watch("costPrice") || 0;
    const sellingPrice = form.watch("sellingPrice") || 0;
    if (costPrice === 0 || sellingPrice === 0) return 0;
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
            <Card>
              <CardHeader>
                <CardTitle>Select Category</CardTitle>
              </CardHeader>
              <CardContent>
                <SelectCategory form={form} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Select Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplierSelector form={form} />
              </CardContent>
            </Card>
            <div className="flex justify-end px-6">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding..." : "Add product"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
