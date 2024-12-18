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
import { updateProductStock } from "../_actions/stock";
import { Product } from "@prisma/client";
import { CustomerSelectorforUpdater } from "./select-customer-update copy";

export default function UpdateStock({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const [addValue, setAddValue] = useState(0);
  const [removeValue, setRemoveValue] = useState(0);
  const [vendorId, setVendorId] = useState<string | undefined>();
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const stockChange = useMemo(
    () => addValue - removeValue,
    [addValue, removeValue]
  );
  const newStock = useMemo(
    () => product.stock + stockChange,
    [product.stock, stockChange]
  );

  const resetForm = () => {
    setAddValue(0);
    setRemoveValue(0);
    setVendorId(undefined);
    setCustomerId(undefined);
    setNote("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (stockChange === 0) {
      setError("Please enter a non-zero value to update stock.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating stock...");

    try {
      const data = {
        productId: product.id,
        change: stockChange,
        customerId,
        vendorId,
        transactionNote: note,
      };
      const result = await updateProductStock({ data });
      if (result.success) {
        toast.success("Stock updated successfully.", { id: loadingToast });
        resetForm();
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

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddValue(Number(e.target.value));
    setRemoveValue(0); // Ensure mutual exclusivity
    setError("");
  };

  const handleRemoveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveValue(Number(e.target.value));
    setAddValue(0); // Ensure mutual exclusivity
    setError("");
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
          <DrawerHeader>
            <DrawerTitle className="text-2xl">
              Update Stock for {product.name}
            </DrawerTitle>
            <DrawerDescription className="text-lg">
              Current stock: {product.stock} {product.unit}
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add" className="text-lg">
                    {removeValue > 0 ? "Select Customer?" : "Add Stock"}
                  </Label>
                  {removeValue > 0 ? (
                    <CustomerSelectorforUpdater
                      onCustomerSelect={setCustomerId}
                    />
                  ) : (
                    <div className="relative">
                      <Input
                        id="add"
                        type="number"
                        min="0"
                        value={addValue}
                        onChange={handleAddChange}
                        className="pl-8"
                      />
                      <Plus
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500"
                        size={16}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remove" className="text-lg">
                    {addValue > 0 ? "Select Supplier?" : "Remove Stock"}
                  </Label>
                  {addValue > 0 ? (
                    <SupplierSelectorforUpdater
                      onSupplierSelect={setVendorId}
                      defaultValue={product.vendorId || ""}
                    />
                  ) : (
                    <div className="relative">
                      <Input
                        id="remove"
                        type="number"
                        min="0"
                        value={removeValue}
                        onChange={handleRemoveChange}
                        className="pl-8"
                      />
                      <Minus
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500"
                        size={16}
                      />
                    </div>
                  )}
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <span
                className={`text-2xl font-bold flex gap-2 justify-end items-center ${
                  newStock < (product.bufferStock || 0) ? "text-red-600" : ""
                }`}
              >
                {newStock < (product.bufferStock || 0) && (
                  <Popover>
                    <PopoverTrigger>
                      <TriangleAlert />
                    </PopoverTrigger>
                    <PopoverContent>
                      <p>Stock is below minimum level.</p>
                    </PopoverContent>
                  </Popover>
                )}
                {newStock} {product.unit}
              </span>
              <Textarea
                placeholder="Add a note (optional)"
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
              />
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
