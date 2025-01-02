"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ProductInfoCard from "./product-info-card";
import ProductDetailsCard from "./product-details-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addProduct, editProduct } from "../../_actions/products";
import { ImageUploader } from "./image-uploader";
import { ProductWithImages } from "@/types/dataTypes";
import AdditionalFields from "./additional-fields";
import VariantCard from "./variant-card";
import VariantEditCard from "./variant-edit-card";
import CategorySupplierCard from "./cat-supp-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const VariantSchema = z.object({
  variantName: z.string().min(1, {
    message: "Variant name must be at least 1 character.",
  }),
  variantStock: z.number().default(0),
});

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

  unit: z.string(),
  vendorId: z.string().optional(),
  categoryId: z.string().optional(),
  qtyInBox: z
    .number()
    .min(1, { message: "Quantity in box must be greater than 0." })
    .optional(),
  productVariants: z.array(VariantSchema).optional(), // Variants are optional for products without variants
});

export type ProductFormValues = z.infer<typeof ProductformSchema>;

export default function ProductForm({
  product,
}: {
  product?: ProductWithImages | null;
}) {
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productPrevImageUrls, setProductPrevImageUrls] = useState<string[]>(
    product?.productImages?.map((image) => image.url) || []
  );
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductformSchema),
    defaultValues: {
      name: product?.name || "",
      stock: product?.stock || 0,
      bufferStock: product?.bufferStock || 0,
      unit: product?.unit || "pcs",
      shortDescription: product?.shortDescription || undefined,
      longDescription: product?.longDescription || undefined,
      vendorId: product?.vendorId || undefined,
      categoryId: product?.categoryId || undefined,
      qtyInBox: product?.qtyInBox || undefined,
      productVariants: product?.productVariants,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (product) {
      const loadingToast = toast.loading("Editing product...");
      try {
        const payload = {
          ...data,
          productId: product.id,
          productPrevImageUrls: productPrevImageUrls,
        };
        const result = await editProduct(payload, productImages);
        if (result.success) {
          router.push("/admin/products");
          toast.success("Product edited successfully", { id: loadingToast });
        } else {
          toast.error(result.error || "Failed to edit product", {
            id: loadingToast,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred", { id: loadingToast });
      }
    } else {
      const loadingToast = toast.loading("Adding product...");
      try {
        const result = await addProduct(data, productImages);
        if (result.success) {
          router.push("/admin/products");
          toast.success("Product added successfully", { id: loadingToast });
        } else {
          toast.error(result.error || "Failed to add product", {
            id: loadingToast,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred", { id: loadingToast });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className=" grid max-1024:grid-cols-1 space-x-6 max-1024:space-x-0 max-1024:space-y-6 grid-cols-3 max-w-5xl mx-auto mb-10">
          <div className="col-span-2 space-y-6">
            <ProductInfoCard
              form={form}
              canStockChange={product ? false : true}
            />
            <AdditionalFields
              lastMonthSales={product?.lastMonthSales}
              form={form}
            />

            {product ? (
              product.hasVariants && (
                <VariantEditCard
                  productId={product.id}
                  productVariants={product.productVariants}
                />
              )
            ) : (
              <VariantCard form={form} />
            )}

            <Collapsible className="w-full group/collapsible" asChild>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className=" flex flex-row justify-between items-center cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <CardTitle>Media</CardTitle>
                      <CardDescription>Add images.</CardDescription>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-6 h-6 transition-transform duration-200 text-muted-foreground",
                        "group-data-[state=open]/collapsible:rotate-90"
                      )}
                    />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <section id="media" className="space-y-4">
                      {product ? (
                        <ImageUploader
                          onImagesChangeAction={setProductImages}
                          existingImages={productPrevImageUrls}
                          onRemoveExistingImage={setProductPrevImageUrls}
                        />
                      ) : (
                        <ImageUploader
                          onImagesChangeAction={setProductImages}
                        />
                      )}
                    </section>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
            <ProductDetailsCard form={form} />
          </div>
          <div className="col-span-1 flex flex-col space-y-6">
            <CategorySupplierCard form={form} />
            <div className="flex justify-end px-6">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {product
                  ? form.formState.isSubmitting
                    ? "Editing..."
                    : "Edit product"
                  : form.formState.isSubmitting
                  ? "Adding..."
                  : "Add product"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
