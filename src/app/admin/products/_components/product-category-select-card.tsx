import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectCategory } from "../../_components/select-category";

export default function CategoryCard({
  categoryId,
  setCategoryId,
}: {
  categoryId: string | undefined;
  setCategoryId: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Category</CardTitle>
      </CardHeader>
      <CardContent>
        <SelectCategory
          defaultValue={categoryId || "none"}
          onCategorySelect={setCategoryId}
        />
      </CardContent>
    </Card>
  );
}
