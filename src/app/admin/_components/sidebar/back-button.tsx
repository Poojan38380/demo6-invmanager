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
        <Button variant="ghost" size="icon" title="Go back">
          <ChevronLeft
            className=" cursor-pointer "
            onClick={() => router.back()}
          />
        </Button>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </div>
    );

  return (
    <Button variant="ghost" size="icon" title="Go back">
      <ChevronLeft
        className=" cursor-pointer mr-2"
        onClick={() => router.back()}
      />
    </Button>
  );
}
