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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "../_actions/deleteTransaction";

export default function TransactionDeletionDialog({
  transactionId,
}: {
  transactionId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting transaction...");

    try {
      const result = await deleteTransaction({ transactionId });

      if (result?.error) {
        toast.error("Error", {
          description: result.error,
          id: loadingToast,
        });
      } else {
        router.refresh();
        toast.success("Success", {
          description: "transaction deleted successfully",
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to delete transaction",
        id: loadingToast,
      });
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipWrapper side="left" content="Delete transaction">
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
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
            This will permanently delete this transaction. The stock change wont
            be reverted. This action cannot be undone.
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
