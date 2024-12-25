"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryWithCounts } from "@/types/dataTypes";
import { editCategory } from "../../_actions/categories";

interface EditCategoryDialogProps {
  category: CategoryWithCounts;
}

const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
}) => {
  const [name, setName] = useState(category.name);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Editing category...");

    try {
      const result = await editCategory({
        name,
        categoryId: category.id,
      });

      if (result.success) {
        setDialogOpen(false);
        router.refresh();
        toast.success("Category Updated", {
          description: "The category details have been successfully updated.",
          id: loadingToast,
        });
      } else {
        toast.error(result.error || "Failed to edit category", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error editing category:", error);
      toast.error("An unexpected error occurred", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit category">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
