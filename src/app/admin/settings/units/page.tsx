import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { getCachedUnits } from "../../_actions/selector-data";
import CreateUnitForm from "../_components/create-unit";

export default async function UnitSettings() {
  const units = await getCachedUnits();
  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Measurement Units</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="gap-6 flex flex-wrap">
          <CreateUnitForm />
          <Badge variant={"outline"}>Available Units :</Badge>
          {!units ? (
            <p className="text-sm text-muted-foreground">Loading units...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {units?.map((unit) => (
                <Badge key={unit.id}>{unit.name}</Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
