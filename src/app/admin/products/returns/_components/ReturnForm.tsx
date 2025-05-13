"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { getCachedProductsforTable } from "../../_actions/products";
import { getCachedCustomers } from "../../../_actions/selector-data";
import { fileNewReturn } from "../_actions/fileNewReturn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define form schema
const formSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  returnQty: z.number().positive("Return quantity must be positive"),
  productName: z.string().min(1, "Product name is required"),
  returnReason: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  productVariantId: z.string().optional(),
  productVariantName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Product {
  id: string;
  name: string;
  hasVariants: boolean;
  productVariants?: {
    id: string;
    variantName: string;
    variantStock: number;
  }[];
}

interface Customer {
  id: string;
  companyName: string;
}

export default function ReturnForm() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [isProductPopoverOpen, setIsProductPopoverOpen] = useState(false);
  const [isCustomerPopoverOpen, setIsCustomerPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      returnQty: 1,
      productName: "",
      returnReason: "",
      customerId: "",
      customerName: "",
      productVariantId: "",
      productVariantName: "",
    },
  });

  // Fetch products and customers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, customersData] = await Promise.all([
          getCachedProductsforTable(),
          getCachedCustomers(),
        ]);
        setProducts(productsData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      customer.companyName.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customers, customerSearch]);

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    form.setValue("productId", product.id);
    form.setValue("productName", product.name);

    if (product.hasVariants && product.productVariants?.length) {
      setShowVariants(true);
      // Reset variant fields
      form.setValue("productVariantId", "");
      form.setValue("productVariantName", "");
    } else {
      setShowVariants(false);
      form.setValue("productVariantId", undefined);
      form.setValue("productVariantName", undefined);
    }

    setIsProductPopoverOpen(false);
  };

  // Handle variant selection
  const handleVariantSelect = (variantId: string, variantName: string) => {
    form.setValue("productVariantId", variantId);
    form.setValue("productVariantName", variantName);
  };

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer) => {
    form.setValue("customerId", customer.id);
    form.setValue("customerName", customer.companyName);
    setIsCustomerPopoverOpen(false);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Filing Return...");
    try {
      const result = await fileNewReturn({
        productId: values.productId,
        returnQty: values.returnQty,
        productName: values.productName,
        returnReason: values.returnReason,
        customerId: values.customerId,
        productVariantId: values.productVariantId,
        productVariantName: values.productVariantName,
      });

      if (result.success) {
        router.refresh();
        toast.success("Return filed successfully", { id: loadingToast });
        router.push("/admin/products/returns");
      } else {
        toast.error(result.error || "Failed to file return", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error filing return:", error);
      toast.error("An unexpected error occurred", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Search and select the product being returned
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Search */}
              <FormField
                control={form.control}
                name="productId"
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Product*</FormLabel>
                    <Popover
                      open={isProductPopoverOpen}
                      onOpenChange={setIsProductPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Search for a product..."
                              value={form.watch("productName") || productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              onClick={() => setIsProductPopoverOpen(true)}
                              className="pr-10"
                            />
                            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <ScrollArea className="h-72 w-[400px]">
                          <div className="p-4">
                            <Input
                              placeholder="Filter products..."
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              className="mb-2"
                            />
                            {filteredProducts.length === 0 ? (
                              <p className="text-sm text-muted-foreground p-2">
                                No products found
                              </p>
                            ) : (
                              <div className="space-y-1">
                                {filteredProducts.map((product) => (
                                  <Button
                                    key={product.id}
                                    variant="ghost"
                                    className="w-full justify-start text-left"
                                    onClick={() => handleProductSelect(product)}
                                  >
                                    {product.name}
                                    {product.hasVariants && (
                                      <span className="text-xs ml-2 bg-blue-100 text-blue-800 rounded px-1">
                                        Has variants
                                      </span>
                                    )}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Variants */}
              {showVariants && selectedProduct?.productVariants && (
                <FormField
                  control={form.control}
                  name="productVariantId"
                  render={() => (
                    <FormItem>
                      <FormLabel>Product Variant</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProduct.productVariants?.map((variant) => (
                          <Button
                            key={variant.id}
                            type="button"
                            variant={
                              form.watch("productVariantId") === variant.id
                                ? "default"
                                : "outline"
                            }
                            className="justify-start"
                            onClick={() =>
                              handleVariantSelect(
                                variant.id,
                                variant.variantName
                              )
                            }
                          >
                            {variant.variantName} (Stock: {variant.variantStock}
                            )
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Return Quantity */}
              <FormField
                control={form.control}
                name="returnQty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Quantity*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
              <CardTitle>Return Details</CardTitle>
              <CardDescription>
                Enter the reason for return and customer information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Return Reason */}
              <FormField
                control={form.control}
                name="returnReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the reason for return..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer Search */}
              <FormField
                control={form.control}
                name="customerId"
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Customer (Optional)</FormLabel>
                    <Popover
                      open={isCustomerPopoverOpen}
                      onOpenChange={setIsCustomerPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Search for a customer..."
                              value={
                                form.watch("customerName") || customerSearch
                              }
                              onChange={(e) =>
                                setCustomerSearch(e.target.value)
                              }
                              onClick={() => setIsCustomerPopoverOpen(true)}
                              className="pr-10"
                            />
                            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <ScrollArea className="h-72 w-[400px]">
                          <div className="p-4">
                            <Input
                              placeholder="Filter customers..."
                              value={customerSearch}
                              onChange={(e) =>
                                setCustomerSearch(e.target.value)
                              }
                              className="mb-2"
                            />
                            {filteredCustomers.length === 0 ? (
                              <p className="text-sm text-muted-foreground p-2">
                                No customers found
                              </p>
                            ) : (
                              <div className="space-y-1">
                                {filteredCustomers.map((customer) => (
                                  <Button
                                    key={customer.id}
                                    variant="ghost"
                                    className="w-full justify-start text-left"
                                    onClick={() =>
                                      handleCustomerSelect(customer)
                                    }
                                  >
                                    {customer.companyName}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products/returns")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Filing Return..." : "File Return"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
