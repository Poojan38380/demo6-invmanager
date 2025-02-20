import BackButton from "../../_components/sidebar/back-button";
import { getCachedSettings } from "../_actions/preferences"; // Import the function to fetch settings

import { Card, CardHeader } from "@/components/ui/card";
import PreferenceCards from "../_components/preferenceCards";

export default async function PreferencesPage() {
  // Fetch the current settings from the backend
  const settings = await getCachedSettings();

  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader className="py-2 mt-2">
        <BackButton title="Preferences" />
      </CardHeader>
      <PreferenceCards settings={settings} />
    </Card>
  );
}
