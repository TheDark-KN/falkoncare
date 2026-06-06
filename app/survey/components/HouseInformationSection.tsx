"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { HouseInformation, FloorType } from "@/types/survey";

interface HouseInformationSectionProps {
  data: HouseInformation;
  onChange: (data: HouseInformation) => void;
}

const FLOOR_OPTIONS: FloorType[] = ["Ground", "1st", "2nd", "3rd", "4th+"];

export default function HouseInformationSection({
  data,
  onChange,
}: HouseInformationSectionProps) {
  const handleHouseNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...data, houseFlatNumber: e.target.value });
    },
    [data, onChange]
  );

  const handleFloorSelect = useCallback(
    (floor: FloorType) => {
      onChange({ ...data, floor });
    },
    [data, onChange]
  );

  return (
    <Card className="border-l-4 border-l-[#00AEEF]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003087] text-sm font-bold text-white"
            aria-hidden="true"
          >
            2
          </span>
          <span className="text-lg" aria-hidden="true">
            🏠
          </span>
          <span className="text-lg">House Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* House/Flat Number */}
        <div className="space-y-2">
          <Label htmlFor="house-flat-number">
            House / Flat Number
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="house-flat-number"
            type="text"
            placeholder="e.g. A-101"
            value={data.houseFlatNumber}
            onChange={handleHouseNumberChange}
            required
            aria-label="House or flat number"
            aria-required="true"
            className="h-11"
          />
        </div>

        {/* Floor Selection - Pill Buttons */}
        <div className="space-y-2">
          <Label id="floor-label">Floor</Label>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="floor-label"
          >
            {FLOOR_OPTIONS.map((floor) => {
              const isSelected = data.floor === floor;
              return (
                <button
                  key={floor}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Floor ${floor}`}
                  onClick={() => handleFloorSelect(floor)}
                  className={cn(
                    "min-h-[44px] min-w-[44px] rounded-full px-5 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                      ? "bg-[#003087] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  {floor}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
