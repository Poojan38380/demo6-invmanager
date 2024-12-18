import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Product } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import React, { useState } from "react";

export default function UpdateStock({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
