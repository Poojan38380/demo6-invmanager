import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BackButton from "../../_components/sidebar/back-button";

export default async function PreferencesPage() {
  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader className="py-2 mt-2">
        <BackButton title="Preferences" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6 mt-6">
        <PreferenceToggle
          title="Customer Selection Required"
          description="Make customer selection mandatory when updating stock"
        />
        <PreferenceToggle
          title="Supplier Selection Required"
          description="Make supplier selection mandatory when updating stock"
        />
      </CardContent>
    </Card>
  );
}

function PreferenceToggle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor={title} className="text-base font-semibold">
            {title}
          </Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch id={title} />
      </div>
    </Card>
  );
}
