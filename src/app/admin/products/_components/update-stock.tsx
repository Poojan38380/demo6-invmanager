import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUpDown, Minus, Plus, TriangleAlert, Info } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SupplierSelectorforUpdater } from "./select-supplier-update";
import { CustomerSelectorforUpdater } from "./select-customer-update";
import { updateProductStock } from "../_actions/stock";
import { Product } from "@prisma/client";

export default function UpdateStock({ product }: { product: Product }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockValue, setStockValue] = useState(0);
  const [isAdding, setIsAdding] = useState(true);
  const [vendorId, setVendorId] = useState<string | undefined>(
    product.vendorId || undefined
  );
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const stockChange = useMemo(
    () => (isAdding ? stockValue : -stockValue),
    [stockValue, isAdding]
  );

  const newStock = useMemo(
    () => product.stock + stockChange,
    [product.stock, stockChange]
  );

  const isBelowBuffer = newStock < (product.bufferStock || 0);

  const handleStockChange = (value: number) => {
    setStockValue(Math.max(0, value));
    setError("");
  };

  const handleModeChange = (adding: boolean) => {
    setIsAdding(adding);
    setStockValue(0);
    setError("");
    setVendorId(adding ? product.vendorId || undefined : undefined);
    setCustomerId(undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (stockValue === 0) {
      setError("Please enter a quantity to update stock");
      return;
    }

    if (!isAdding && stockValue > product.stock) {
      setError("Cannot remove more than current stock");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating stock...");

    try {
      const result = await updateProductStock({
        data: {
          productId: product.id,
          change: stockChange,
          customerId: !isAdding ? customerId : undefined,
          vendorId: isAdding ? vendorId : undefined,
          transactionNote: note,
        },
      });

      if (result.success) {
        toast.success("Stock updated successfully", { id: loadingToast });
        setOpen(false);
        router.refresh();
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 shadow-sm border-gray-300 "
          size="sm"
        >
          <ArrowUpDown className="" />
          <span className="max-768:hidden">Stock</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-xl font-semibold">
              {product.name}
              <span className="text-sm font-normal text-gray-500">
                Current: {product.stock} {product.unit}
              </span>
            </DrawerTitle>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-50 rounded-lg">
              <Button
                type="button"
                variant={isAdding ? "default" : "ghost"}
                onClick={() => handleModeChange(true)}
                className={`transition-all bg-green-100  ${
                  isAdding ? "shadow-lg bg-primary" : ""
                }`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
              <Button
                type="button"
                variant={!isAdding ? "default" : "ghost"}
                onClick={() => handleModeChange(false)}
                className={`transition-all bg-red-100 ${
                  !isAdding ? "shadow-lg bg-primary" : ""
                }`}
              >
                <Minus className="mr-2 h-4 w-4" />
                Remove Stock
              </Button>
            </div>

            <div className="space-y-4 ">
              <div className="grid grid-cols-2 max-425:grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="stock">{isAdding ? "Add" : "Remove"}</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={stockValue}
                    onChange={(e) => handleStockChange(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>{isAdding ? "Supplier" : "Customer"} (Optional)</Label>
                  {isAdding ? (
                    <SupplierSelectorforUpdater
                      onSupplierSelect={setVendorId}
                      defaultValue={product.vendorId || "none"}
                    />
                  ) : (
                    <CustomerSelectorforUpdater
                      onCustomerSelect={setCustomerId}
                    />
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Stock:</span>
                  <span
                    className={`text-lg font-bold ${
                      isBelowBuffer ? "text-red-600" : ""
                    }`}
                  >
                    {newStock} {product.unit}
                  </span>
                </div>

                {isBelowBuffer && (
                  <>
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <TriangleAlert className="h-4 w-4" />
                      Below minimum stock ({product.bufferStock} {product.unit})
                    </div>
                    <p className="text-red-600 text-sm">REFILL FAST !</p>
                  </>
                )}
              </div>

              <div>
                <Label
                  htmlFor="note"
                  className="text-sm font-medium mb-2 block"
                >
                  Note
                </Label>
                <Textarea
                  id="note"
                  placeholder="Add details about this stock update..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none"
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
              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Updating..."
                  : `${isAdding ? "Add" : "Remove"} Stock`}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
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
