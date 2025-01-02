"use client";

import { Download } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleBeforeInstallPrompt = useCallback(
    (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    },
    []
  );

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorWithStandalone).standalone ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      return;
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, [handleBeforeInstallPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("Installation not available", {
        description:
          "Your browser doesn't support app installation or the app is already installed.",
      });
      return;
    }

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        toast.success("Installation successful", {
          description: "The app has been installed successfully!",
        });
      }
    } catch (error) {
      console.error("Installation error:", error);
      toast.error("Installation failed", {
        description: "There was an error installing the app. Please try again.",
      });
    } finally {
      setDeferredPrompt(null);
      setIsInstalling(false);
    }
  };

  if (!deferredPrompt) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      disabled={isInstalling}
      size="sm"
      variant="outline"
      className="flex rounded-full items-center gap-1 bg-transparent opacity-60"
    >
      <Download className="h-4 w-4" />
      <span>{isInstalling ? "Installing..." : "Install App"}</span>
    </Button>
  );
}
