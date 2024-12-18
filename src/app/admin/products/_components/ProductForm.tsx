"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UnitSelector } from "../../_components/unit-selector";
import { SupplierSelector } from "../../_components/select-supplier";
import { SelectCategory } from "../../_components/select-category";

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
  const [selectedUnit, setSelectedUnit] = useState<string>("pcs");
  const [vendorId, setVendorId] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      stock: 0,
      bufferStock: 0,
    },
  });

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

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent>
                <section id="media" className="space-y-4">
                  {/* <ImageUploader onImagesChange={setProductImages} /> */}
                </section>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <section id="product-description" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a brief description of the product"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A concise summary of the product (optional).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Long Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a detailed description of the product"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          A comprehensive description of the product (optional).
                          You can format the text.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 flex flex-col   space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pricing
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="rounded-full px-3 text-sm">
                          {/* {margin || 0} % */}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {/* <p>{`Margin Percent: ${margin || 0}`}</p> */}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || "")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || "")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Category</CardTitle>
              </CardHeader>
              <CardContent>
                <SelectCategory
                  defaultValue={categoryId || "none"}
                  onCategorySelect={(id) => setCategoryId(id)}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Select Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplierSelector
                  onSupplierSelect={(supplierId) => setVendorId(supplierId)}
                  defaultValue={vendorId || "none"}
                />
              </CardContent>
            </Card>
            <div className="flex justify-end px-6">
              <Button
                type="submit"
                //   disabled={loading}
              >
                {/* {loading ? "Creating..." : "Create Product"} */}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
