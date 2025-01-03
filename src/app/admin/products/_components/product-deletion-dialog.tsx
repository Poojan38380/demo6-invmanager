"use client";
import { useState } from "react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteProduct } from "../_actions/deleteProduct";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductDeletionDialog({
  productId,
}: {
  productId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting product...");

    try {
      const result = await deleteProduct({ productId });

      if (result?.error) {
        toast.error("Error", {
          description: result.error,
          id: loadingToast,
        });
      } else {
        router.refresh();
        toast.success("Success", {
          description: "Product deleted successfully",
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to delete product",
        id: loadingToast,
      });
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipWrapper content="Delete product">
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="opacity-50 w-6 h-6 p-1 text-destructive"
          >
            <Trash className="text-xs" />
          </Button>
        </AlertDialogTrigger>
      </TooltipWrapper>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product and all its related data.
            <br />
            <br />
            FIRST DELETE ALL TRANSACTIONS !!!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
