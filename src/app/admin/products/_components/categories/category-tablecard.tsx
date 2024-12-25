import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import EditCategoryDialog from "./edit-category-dialog";
import { CategoryWithCounts } from "@/types/dataTypes";

export default function CategoryTableCard({
  category,
}: {
  category: CategoryWithCounts;
}) {
  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {category.name}
          </CardTitle>
          <EditCategoryDialog category={category} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package size={16} />
              <span className="text-sm">
                {category._count?.products || 0} products
              </span>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
