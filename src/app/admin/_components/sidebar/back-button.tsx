"use client";
import { CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton({ title }: { title?: string }) {
  const router = useRouter();

  if (title)
    return (
      <div className="flex items-center">
        <ChevronLeft
          className=" cursor-pointer mr-2"
          onClick={() => router.back()}
        />
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </div>
    );

  return (
    <ChevronLeft
      className=" cursor-pointer mr-2"
      onClick={() => router.back()}
    />
  );
}
