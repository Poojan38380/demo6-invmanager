import React from "react";
import { getCachedCategories } from "../../_actions/selector-data";
import { Card } from "@/components/ui/card";

import CategoryList from "../_components/categories/categorylist";

export default async function CategoriesPage() {
  const categories = await getCachedCategories();
  return (
    <Card className="border-none  shadow-none bg-background ">
      <CategoryList categories={categories} />
    </Card>
  );
}
