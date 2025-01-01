import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowUpDown,
  TriangleAlert,
  Info,
  Truck,
  Store,
  PlusCircle,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SupplierSelectorforUpdater } from "./select-supplier-update";
import { CustomerSelectorforUpdater } from "./select-customer-update";
import { updateProductVariantStock } from "../_actions/stock";
import { formatNumber } from "@/lib/formatter";
import { Label } from "@/components/ui/label";
import VariantSelectorForUpdater from "./variant-selector-for-update";
import { ProductWithOneImage } from "../_actions/products";
import Link from "next/link";

export default function UpdateStockVariants({
  product,
}: {
  product: ProductWithOneImage;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState<string | undefined>(
    product.vendorId || undefined
  );
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [selectedVariantId, setSelectedVariantId] = useState<string>();
  const [addStockValue, setAddStockValue] = useState<number>(0);
  const [removeStockValue, setRemoveStockValue] = useState<number>(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const selectedVariant = useMemo(() => {
    return product.productVariants!.find((v) => v.id === selectedVariantId);
  }, [selectedVariantId, product.productVariants]);

  const stockChange = useMemo(() => {
    return addStockValue - removeStockValue;
  }, [addStockValue, removeStockValue]);

  const newStock = useMemo(() => {
    if (!selectedVariant) return 0;
    return selectedVariant.variantStock + stockChange;
  }, [selectedVariant, stockChange]);

  const isBelowBuffer = useMemo(() => {
    return newStock < (product.bufferStock || 0);
  }, [newStock, product.bufferStock]);

  const isValidChange = useMemo(() => {
    return (
      selectedVariantId &&
      ((addStockValue > 0 && removeStockValue === 0) ||
        (removeStockValue > 0 && addStockValue === 0))
    );
  }, [addStockValue, removeStockValue, selectedVariantId]);

  const handleAddStockChange = (value: number) => {
    setAddStockValue(value);
    setRemoveStockValue(0);
  };

  const handleRemoveStockChange = (value: number) => {
    setRemoveStockValue(value);
    setAddStockValue(0);
  };

  const resetForm = () => {
    setAddStockValue(0);
    setRemoveStockValue(0);
    setNote("");
    setError("");
    setCustomerId(undefined);
    setVendorId(product.vendorId || undefined);
    setSelectedVariantId(undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedVariantId) {
      setError("Please select a variant");
      return;
    }

    if (!isValidChange) {
      setError("Please either add OR remove stock, not both");
      return;
    }

    if (stockChange === 0) {
      setError("Please enter a valid stock change amount");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating stock...");

    try {
      const result = await updateProductVariantStock({
        data: {
          productId: product.id,
          variantId: selectedVariantId,
          change: stockChange,
          customerId: removeStockValue > 0 ? customerId : undefined,
          vendorId: addStockValue > 0 ? vendorId : undefined,
          transactionNote: note,
        },
      });

      if (result.success) {
        setOpen(false);
        resetForm();
        router.refresh();
        toast.success("Stock updated successfully", { id: loadingToast });
      } else {
        toast.error(result.error || "Failed to update stock", {
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
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 p-1 bg-card shadow-lg"
        >
          <ArrowUpDown />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-background">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-xl font-semibold justify-between">
              {product.name}
              {selectedVariant && (
                <span className="text-muted-foreground">
                  Current: {formatNumber(selectedVariant.variantStock)}{" "}
                  {product.unit}
                </span>
              )}
            </DrawerTitle>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="space-y-4">
              <div>
                <VariantSelectorForUpdater
                  productVariants={product.productVariants}
                  onVariantSelect={setSelectedVariantId}
                  selectedVariantId={selectedVariantId}
                />
              </div>

              {selectedVariantId && (
                <>
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <div className="flex gap-2 items-center">
                      <div className="mt-5">
                        <Truck className="text-success" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="addStock">Add stock</Label>
                        <Input
                          id="addStock"
                          type="number"
                          min="0"
                          value={addStockValue || ""}
                          onChange={(e) =>
                            handleAddStockChange(Number(e.target.value))
                          }
                          className="text-lg h-12 bg-success/40 border-none shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Supplier</Label>{" "}
                      <div className="flex items-center gap-2">
                        <SupplierSelectorforUpdater
                          onSupplierSelectAction={setVendorId}
                          defaultValue={product.vendorId || "none"}
                        />
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="  "
                        >
                          <Link
                            href={`/admin/settings/suppliers/new`}
                            className="w-6  h-6"
                            prefetch={false}
                            target="_blank"
                          >
                            <PlusCircle className="text-xs" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 items-end">
                    <div className="flex gap-2 items-center">
                      <div className="mt-5">
                        <Store className="text-destructive" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="removeStock">Remove stock</Label>
                        <Input
                          id="removeStock"
                          type="number"
                          min="0"
                          value={removeStockValue || ""}
                          onChange={(e) =>
                            handleRemoveStockChange(Number(e.target.value))
                          }
                          className="text-lg h-12 bg-destructive/40 border-none shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Label>Customer</Label>
                      <div className="flex items-center gap-2">
                        <CustomerSelectorforUpdater
                          onCustomerSelectAction={setCustomerId}
                        />
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="  "
                        >
                          <Link
                            href={`/admin/settings/customers/new`}
                            className="w-6  h-6"
                            prefetch={false}
                            target="_blank"
                          >
                            <PlusCircle className="text-xs" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-end">
                      <span
                        className={`text-lg font-bold ${
                          isBelowBuffer ? "text-red-600" : ""
                        }`}
                      >
                        New: {formatNumber(newStock)} {product.unit}
                      </span>
                    </div>

                    {isBelowBuffer && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <TriangleAlert className="h-4 w-4" />
                        Below minimum stock ({product.bufferStock}{" "}
                        {product.unit})
                      </div>
                    )}
                  </div>

                  <div>
                    <Textarea
                      id="note"
                      placeholder="Optional note..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="border-none shadow-sm"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>

            <DrawerFooter className="px-0 pt-2">
              <Button
                type="submit"
                disabled={loading || !isValidChange || stockChange === 0}
                className="rounded-full h-12 shadow-md"
              >
                {loading
                  ? "Updating..."
                  : `${addStockValue > 0 ? "Add" : "Remove"} Stock`}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="rounded-full h-12">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
