import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowUpDown, Minus, Plus, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SupplierSelectorforUpdater } from "./select-supplier-update";
import { CustomerSelectorforUpdater } from "./select-customer-update copy";
import { updateProductStock } from "../_actions/stock";
import { Product } from "@prisma/client";

export default function UpdateStock({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // State for stock management
  const [stockValue, setStockValue] = useState(0);
  const [isAdding, setIsAdding] = useState(true);
  const [vendorId, setVendorId] = useState<string | undefined>(
    product.vendorId || undefined
  );
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  // Calculate new stock based on whether we're adding or removing
  const stockChange = useMemo(
    () => (isAdding ? stockValue : -stockValue),
    [stockValue, isAdding]
  );

  const newStock = useMemo(
    () => product.stock + stockChange,
    [product.stock, stockChange]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (stockValue === 0) {
      setError("Please enter a non-zero value to update stock.");
      return;
    }

    // Validate stock removal doesn't exceed current stock
    if (!isAdding && stockValue > product.stock) {
      setError("Cannot remove more stock than available.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating stock...");

    try {
      const data = {
        productId: product.id,
        change: stockChange,
        customerId: !isAdding ? customerId : undefined,
        vendorId: isAdding ? vendorId : undefined,
        transactionNote: note,
      };

      const result = await updateProductStock({ data });
      if (result.success) {
        toast.success("Stock updated successfully.", { id: loadingToast });
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

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setStockValue(value >= 0 ? value : 0);
    setError("");
  };

  const handleModeChange = (adding: boolean) => {
    setIsAdding(adding);
    setStockValue(0);
    setError("");
    // Reset the IDs when switching modes
    setVendorId(adding ? product.vendorId || undefined : undefined);
    setCustomerId(undefined);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent shadow-sm border-gray-400"
          size="sm"
        >
          <ArrowUpDown className="mr-1 max-768:mr-0 h-4 w-4" />
          <span className="max-768:hidden">Stock</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="space-y-2 pb-6">
            <DrawerTitle className="text-2xl font-semibold">
              Update Stock for {product.name}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              Current stock: {product.stock} {product.unit}
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant={isAdding ? "default" : "outline"}
                  onClick={() => handleModeChange(true)}
                  className="w-full"
                >
                  Add Stock
                </Button>
                <Button
                  type="button"
                  variant={!isAdding ? "default" : "outline"}
                  onClick={() => handleModeChange(false)}
                  className="w-full"
                >
                  Remove Stock
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  {isAdding ? "Add Stock" : "Remove Stock"}
                </Label>
                <div className="relative">
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={stockValue}
                    onChange={handleStockChange}
                    className="pl-8"
                  />
                  {isAdding ? (
                    <Plus
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500"
                      size={16}
                    />
                  ) : (
                    <Minus
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500"
                      size={16}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {isAdding
                    ? "Select Supplier (Optional)"
                    : "Select Customer (Optional)"}
                </Label>
                {isAdding ? (
                  <SupplierSelectorforUpdater
                    onSupplierSelect={setVendorId}
                    defaultValue={product.vendorId || undefined}
                  />
                ) : (
                  <CustomerSelectorforUpdater
                    onCustomerSelect={setCustomerId}
                  />
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Stock:</span>
                <span
                  className={`text-xl font-bold flex items-center ${
                    newStock < (product.bufferStock || 0) ? "text-red-600" : ""
                  }`}
                >
                  {newStock < (product.bufferStock || 0) && (
                    <Popover>
                      <PopoverTrigger>
                        <TriangleAlert className="mr-1 h-4 w-4" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-sm">Stock is below minimum level.</p>
                      </PopoverContent>
                    </Popover>
                  )}
                  {newStock} {product.unit}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">
                  Note (Optional)
                </Label>
                <Textarea
                  placeholder="Add a note"
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>

            <DrawerFooter className="px-0">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Stock"}
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
