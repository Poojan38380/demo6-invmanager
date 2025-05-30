"use client";
import { Dispatch, SetStateAction, useState } from "react";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash } from "lucide-react";
import { deleteProduct } from "../_actions/deleteProduct";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductDeletionDialog({
  productId,
  setOpenFnAction,
}: {
  productId: string;
  setOpenFnAction: Dispatch<SetStateAction<boolean>>;
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
      setOpenFnAction(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
          className="bg-destructive/70 text-destructive-foreground"
          title="Delete Product"
        >
          <Trash />
          <span>Delete</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product.
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
