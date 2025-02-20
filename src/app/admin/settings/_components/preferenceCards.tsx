"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateSettings } from "../_actions/preferences";
import { toast } from "sonner";
import { Settings } from "@prisma/client";
import { useState } from "react";

export default function PreferenceCards({ settings }: { settings: Settings }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferences, setPreferences] = useState({
    customerMandatory: settings.customerMandatory,
    supplierMandatory: settings.supplierMandatory,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Saving changes...");

    try {
      const result = await updateSettings(
        preferences.customerMandatory,
        preferences.supplierMandatory
      );

      if (result.success) {
        toast.success("Settings updated successfully", { id: loadingToast });
      } else {
        toast.error(result.error || "Failed to update settings.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = (name: string) => (checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="flex flex-col gap-6 mt-6">
        <PreferenceToggle
          title="Customer Selection Required"
          description="Make customer selection mandatory when updating stock"
          name="customerMandatory"
          checked={preferences.customerMandatory}
          onCheckedChange={handleToggle("customerMandatory")}
        />
        <PreferenceToggle
          title="Supplier Selection Required"
          description="Make supplier selection mandatory when updating stock"
          name="supplierMandatory"
          checked={preferences.supplierMandatory}
          onCheckedChange={handleToggle("supplierMandatory")}
        />
      </CardContent>

      <CardFooter className="flex justify-end">
        <div className="flex justify-end px-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardFooter>
    </form>
  );
}

function PreferenceToggle({
  title,
  description,
  name,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor={name} className="text-base font-semibold">
            {title}
          </Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch
          id={name}
          name={name}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
    </Card>
  );
}
