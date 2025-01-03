"use client";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShareButton = () => {
  const handleShare = async () => {
    const currentUrl = window.location.href;
    await navigator.share({
      title: document.title,
      url: currentUrl,
    });
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
};

export default ShareButton;
