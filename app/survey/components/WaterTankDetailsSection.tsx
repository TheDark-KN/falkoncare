"use client";

import { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  WaterTankDetails,
  TankType,
  TankMaterial,
  TotalTanks,
  TankCapacity,
  LastCleaning,
} from "@/types/survey";

interface WaterTankDetailsSectionProps {
  data: WaterTankDetails;
  onChange: (data: WaterTankDetails) => void;
}

const TANK_TYPES: TankType[] = ["Overhead", "Underground", "Both"];
const TANK_MATERIALS: TankMaterial[] = [
  "Plastic",
  "RCC/Cement",
  "Steel",
  "FRP/Fibre",
  "Other",
];
const TOTAL_TANKS_OPTIONS: TotalTanks[] = ["1", "2", "3", "4", "5+"];
const TANK_CAPACITY_OPTIONS: TankCapacity[] = [
  "500L",
  "1000L",
  "2000L",
  "5000L",
  "Above 5000L",
];
const LAST_CLEANING_OPTIONS: LastCleaning[] = [
  "Within 6 Months",
  "6–12 Months Ago",
  "More Than 1 Year Ago",
  "Never Cleaned",
];

function parseTankCount(value: TotalTanks | ""): number {
  if (value === "") return 0;
  if (value === "5+") return 5;
  return parseInt(value, 10);
}

function parseCapacityLitres(value: TankCapacity | ""): number {
  if (value === "") return 0;
  if (value === "Above 5000L") return 5000;
  return parseInt(value.replace("L", ""), 10);
}

export default function WaterTankDetailsSection({
  data,
  onChange,
}: WaterTankDetailsSectionProps) {
  const update = useCallback(
    (patch: Partial<WaterTankDetails>) => {
      const next = { ...data, ...patch };
      // Recalculate total water storage whenever tanks or capacity changes
      const tanks = parseTankCount(
        patch.totalTanks !== undefined ? patch.totalTanks : data.totalTanks
      );
      const capacity = parseCapacityLitres(
        patch.tankCapacity !== undefined ? patch.tankCapacity : data.tankCapacity
      );
      next.totalWaterStorage = tanks * capacity;
      onChange(next);
    },
    [data, onChange]
  );

  const handleTankTypeSelect = useCallback(
    (type: TankType) => {
      if (type === "Both") {
        update({ tankType: data.tankType === "Both" ? "" : "Both" });
      } else {
        if (data.tankType === type) {
          update({ tankType: "" });
        } else {
          update({ tankType: type });
        }
      }
    },
    [data.tankType, update]
  );

  const handleMaterialToggle = useCallback(
    (material: TankMaterial) => {
      const current = data.tankMaterials;
      const isSelected = current.includes(material);
      const next = isSelected
        ? current.filter((m) => m !== material)
        : [...current, material];
      const patch: Partial<WaterTankDetails> = { tankMaterials: next };
      // Clear otherMaterial if "Other" is deselected
      if (material === "Other" && isSelected) {
        patch.otherMaterial = "";
      }
      update(patch);
    },
    [data.tankMaterials, update]
  );

  const formattedStorage = useMemo(() => {
    if (data.totalWaterStorage <= 0) return null;
    return `${data.totalWaterStorage.toLocaleString()} Litres`;
  }, [data.totalWaterStorage]);

  const getCleaningPillClasses = useCallback(
    (option: LastCleaning) => {
      const isActive = data.lastCleaning === option;
      if (!isActive) {
        return "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700";
      }
      switch (option) {
        case "Within 6 Months":
          return "border-green-400 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300";
        case "6–12 Months Ago":
          return "border-yellow-400 bg-yellow-50 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300";
        case "More Than 1 Year Ago":
          return "border-orange-400 bg-orange-50 text-orange-800 dark:border-orange-600 dark:bg-orange-900/30 dark:text-orange-300";
        case "Never Cleaned":
          return "border-red-400 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300";
        default:
          return "";
      }
    },
    [data.lastCleaning]
  );

  return (
    <Card className="border-l-4 border-l-[#00AEEF] overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003087] text-sm font-bold text-white"
            aria-hidden="true"
          >
            4
          </span>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span aria-hidden="true">🪣</span>
            Water Tank Details
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tank Type */}
        <fieldset>
          <Label asChild>
            <legend className="mb-2 text-sm font-medium">Tank Type</legend>
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TANK_TYPES.map((type) => {
              const isActive = data.tankType === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="checkbox"
                  aria-checked={isActive}
                  aria-label={`Tank type: ${type}`}
                  onClick={() => handleTankTypeSelect(type)}
                  className={cn(
                    "min-h-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/50",
                    isActive
                      ? "border-[#003087] bg-[#003087] text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Tank Material */}
        <fieldset>
          <Label asChild>
            <legend className="mb-2 text-sm font-medium">
              Tank Material{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (select all that apply)
              </span>
            </legend>
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TANK_MATERIALS.map((material) => {
              const isActive = data.tankMaterials.includes(material);
              return (
                <button
                  key={material}
                  type="button"
                  role="checkbox"
                  aria-checked={isActive}
                  aria-label={`Tank material: ${material}`}
                  onClick={() => handleMaterialToggle(material)}
                  className={cn(
                    "min-h-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/50",
                    isActive
                      ? "border-[#003087] bg-[#003087] text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  {material}
                </button>
              );
            })}
          </div>
          {data.tankMaterials.includes("Other") && (
            <div className="mt-3">
              <Input
                type="text"
                placeholder="Specify other material..."
                aria-label="Other tank material"
                value={data.otherMaterial}
                onChange={(e) => update({ otherMaterial: e.target.value })}
                className="max-w-sm"
              />
            </div>
          )}
        </fieldset>

        {/* Total Number of Tanks */}
        <fieldset>
          <Label asChild>
            <legend className="mb-2 text-sm font-medium">
              Total Number of Tanks
            </legend>
          </Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TOTAL_TANKS_OPTIONS.map((option) => {
              const isActive = data.totalTanks === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Total tanks: ${option}`}
                  onClick={() =>
                    update({ totalTanks: isActive ? "" : option })
                  }
                  className={cn(
                    "min-h-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/50",
                    isActive
                      ? "border-[#003087] bg-[#003087] text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Tank Capacity (Per Tank) */}
        <fieldset>
          <Label asChild>
            <legend className="mb-2 text-sm font-medium">
              Tank Capacity{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (per tank)
              </span>
            </legend>
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TANK_CAPACITY_OPTIONS.map((option) => {
              const isActive = data.tankCapacity === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Tank capacity: ${option}`}
                  onClick={() =>
                    update({ tankCapacity: isActive ? "" : option })
                  }
                  className={cn(
                    "min-h-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/50",
                    isActive
                      ? "border-[#003087] bg-[#003087] text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Total Water Storage Capacity */}
        <div>
          <Label className="mb-2 text-sm font-medium">
            Total Water Storage Capacity
          </Label>
          <div
            className={cn(
              "mt-1 rounded-lg border px-4 py-2 text-center font-bold transition-colors",
              formattedStorage
                ? "border-[#00AEEF]/30 bg-[#00AEEF]/10 text-[#003087] dark:border-[#00AEEF]/40 dark:bg-[#00AEEF]/15 dark:text-[#00AEEF]"
                : "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
            )}
            aria-live="polite"
            aria-label="Total water storage capacity"
          >
            {formattedStorage ?? "Select tanks & capacity to calculate"}
          </div>
        </div>

        {/* Last Tank Cleaning */}
        <fieldset>
          <Label asChild>
            <legend className="mb-2 text-sm font-medium">
              Last Tank Cleaning
            </legend>
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
            {LAST_CLEANING_OPTIONS.map((option) => {
              const isActive = data.lastCleaning === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Last cleaning: ${option}`}
                  onClick={() =>
                    update({ lastCleaning: isActive ? "" : option })
                  }
                  className={cn(
                    "min-h-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/50",
                    getCleaningPillClasses(option)
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}
