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
import { updateProductStock } from "../_actions/stock";
import { Product } from "@prisma/client";
import { formatNumber } from "@/lib/formatter";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { TooltipWrapper } from "@/components/tooltip-wrapper";

export default function UpdateStock({ product }: { product: Product }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState<string | undefined>(
    product.vendorId || undefined
  );
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [addStockValue, setAddStockValue] = useState<number>(0);
  const [removeStockValue, setRemoveStockValue] = useState<number>(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const stockChange = useMemo(() => {
    return addStockValue - removeStockValue;
  }, [addStockValue, removeStockValue]);

  const newStock = useMemo(() => {
    return product.stock + stockChange;
  }, [product.stock, stockChange]);

  const isBelowBuffer = useMemo(() => {
    return newStock < (product.bufferStock || 0);
  }, [newStock, product.bufferStock]);

  const isValidChange = useMemo(() => {
    return (
      (addStockValue > 0 && removeStockValue === 0) ||
      (removeStockValue > 0 && addStockValue === 0)
    );
  }, [addStockValue, removeStockValue]);

  const handleAddStockChange = (value: number) => {
    setAddStockValue(value);
    setRemoveStockValue(0); // Reset remove when adding
  };

  const handleRemoveStockChange = (value: number) => {
    setRemoveStockValue(value);
    setAddStockValue(0); // Reset add when removing
  };

  const resetForm = () => {
    setAddStockValue(0);
    setRemoveStockValue(0);
    setNote("");
    setError("");
    setCustomerId(undefined);
    setVendorId(product.vendorId || undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

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
      const result = await updateProductStock({
        data: {
          productId: product.id,
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
      <TooltipWrapper content="Update stock">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 p-1 bg-card shadow-lg"
          >
            <ArrowUpDown />
          </Button>
        </DrawerTrigger>
      </TooltipWrapper>
      <DrawerContent className="bg-background">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-xl font-semibold justify-between">
              {product.name}
              <span className="text-muted-foreground">
                {product.stock} {product.unit}
              </span>
            </DrawerTitle>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="space-y-4">
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
                      className="text-xl font-black h-12 bg-success/40  shadow-sm"
                    />
                  </div>
                  {addStockValue > 0 && product.qtyInBox ? (
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(addStockValue / product.qtyInBox)} box
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Supplier</Label>
                  <div className="flex items-center gap-2">
                    <SupplierSelectorforUpdater
                      onSupplierSelectAction={setVendorId}
                      defaultValue={product.vendorId || "none"}
                    />
                    <Button asChild variant="ghost" size="icon" className="  ">
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
                      className="text-xl font-black h-12 bg-destructive/40  shadow-sm"
                    />
                  </div>
                  {removeStockValue > 0 && product.qtyInBox ? (
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(removeStockValue / product.qtyInBox)} box
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Customer</Label>
                  <div className="flex items-center gap-2">
                    <CustomerSelectorforUpdater
                      onCustomerSelectAction={setCustomerId}
                    />
                    <Button asChild variant="ghost" size="icon" className="  ">
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
                    New: {newStock} {product.unit}
                  </span>
                </div>

                {isBelowBuffer && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <TriangleAlert className="h-4 w-4" />
                    Below minimum stock ({product.bufferStock} {product.unit})
                  </div>
                )}
              </div>

              <div>
                <Textarea
                  id="note"
                  placeholder="Optional note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className=" shadow-sm"
                  rows={3}
                />
              </div>

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
                <Button
                  variant="outline"
                  className=" bg-card rounded-full h-12"
                >
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
