"use client";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton({ title }: { title?: string }) {
  const router = useRouter();

  if (title)
    return (
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          title="Go back"
          className="mr-2 p-1"
          onClick={() => router.back()}
          asChild
        >
          <ChevronLeft className=" cursor-pointer w-7 h-7" />
        </Button>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </div>
    );

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Go back"
      asChild
      className="mr-2"
      onClick={() => router.back()}
    >
      <ChevronLeft className=" cursor-pointer w-6 h-6" />
    </Button>
  );
}
