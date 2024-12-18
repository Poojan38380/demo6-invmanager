import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MeasurementUnit } from "@prisma/client";
import { getCachedUnits } from "../_actions/selector-data";

interface UnitSelectorProps {
  onUnitChange: (unitName: string) => void;
  defaultValue?: string;
  label?: string;
}

export function UnitSelector({
  onUnitChange,
  defaultValue = "pcs",
}: UnitSelectorProps) {
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await getCachedUnits();
        setUnits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchUnits();
  }, []);

  const [selectedUnit, setSelectedUnit] = useState<string | undefined>(
    defaultValue
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedUnit(defaultValue);
    }
  }, [defaultValue]);

  const handleUnitChange = (unitName: string) => {
    setSelectedUnit(unitName);
    onUnitChange(unitName);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Select value={selectedUnit} onValueChange={handleUnitChange}>
        <SelectTrigger id="unit-select">
          <SelectValue placeholder="Select a unit" />
        </SelectTrigger>
        <SelectContent>
          {units.map((unit) => (
            <SelectItem key={unit.name} value={unit.name}>
              {unit.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
