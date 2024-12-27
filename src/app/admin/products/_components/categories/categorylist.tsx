"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader, PlusIcon, Search } from "lucide-react";
import Link from "next/link";
import CategoryTableCard from "./category-tablecard";
import { CategoryWithCounts } from "@/types/dataTypes";

function CategoryList({ categories }: { categories: CategoryWithCounts[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
        <CardTitle className="text-2xl font-bold">All Categories</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search categories..."
              className=" rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Link
            href="/admin/products/categories/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full flex items-center justify-center gap-2 hover:shadow-md rounded-full">
              <PlusIcon size={16} />
              Add a New Category
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="max-768:px-0">
        {!categories ? (
          <div className="flex justify-center items-center py-20">
            <Loader size={40} className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredCategories.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <CategoryTableCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No categories found. Try adjusting your search or add a new
                category.
              </div>
            )}
          </>
        )}
      </CardContent>
    </>
  );
}

export default CategoryList;
