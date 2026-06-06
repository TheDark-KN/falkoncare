"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TankHealthCheck, WaterCondition } from "@/types/survey";

interface TankHealthCheckSectionProps {
  data: TankHealthCheck;
  onChange: (data: TankHealthCheck) => void;
}

interface YesNoQuestion {
  key: keyof Pick<
    TankHealthCheck,
    "isDirty" | "isLidBroken" | "isDamaged" | "isMosquitoPresent"
  >;
  label: string;
}

const YES_NO_QUESTIONS: YesNoQuestion[] = [
  { key: "isDirty", label: "Is Any Tank Dirty?" },
  { key: "isLidBroken", label: "Is Any Lid Broken/Missing?" },
  { key: "isDamaged", label: "Is Any Tank Damaged/Leaking?" },
  { key: "isMosquitoPresent", label: "Is Mosquito/Insect Presence Visible?" },
];

interface WaterConditionOption {
  value: WaterCondition;
  emoji: string;
  activeClasses: string;
}

const WATER_CONDITIONS: WaterConditionOption[] = [
  {
    value: "Clear",
    emoji: "🟢",
    activeClasses:
      "border-green-500 bg-green-50 text-green-800 dark:border-green-400 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    value: "Slightly Dirty",
    emoji: "🟡",
    activeClasses:
      "border-yellow-500 bg-yellow-50 text-yellow-800 dark:border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    value: "Dirty",
    emoji: "🟠",
    activeClasses:
      "border-orange-500 bg-orange-50 text-orange-800 dark:border-orange-400 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    value: "Bad Smell",
    emoji: "🔴",
    activeClasses:
      "border-red-500 bg-red-50 text-red-800 dark:border-red-400 dark:bg-red-900/30 dark:text-red-300",
  },
];

export default function TankHealthCheckSection({
  data,
  onChange,
}: TankHealthCheckSectionProps) {
  const update = useCallback(
    (patch: Partial<TankHealthCheck>) => {
      onChange({ ...data, ...patch });
    },
    [data, onChange]
  );

  const handleYesNo = useCallback(
    (key: YesNoQuestion["key"], value: boolean) => {
      // Toggle off if same value clicked again
      update({ [key]: data[key] === value ? null : value });
    },
    [data, update]
  );

  const handleWaterCondition = useCallback(
    (condition: WaterCondition) => {
      update({
        waterCondition: data.waterCondition === condition ? "" : condition,
      });
    },
    [data.waterCondition, update]
  );

  return (
    <Card className="border-l-4 border-l-[#003087] overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003087] text-sm font-bold text-white"
            aria-hidden="true"
          >
            5
          </span>
          <CardTitle className="flex items-center gap-2 text-lg">
            <span aria-hidden="true">🔍</span>
            Tank Health Check
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        {/* Yes/No Questions */}
        <fieldset>
          <Label asChild>
            <legend className="sr-only">Tank Health Questions</legend>
          </Label>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {YES_NO_QUESTIONS.map((question) => {
              const currentValue = data[question.key];
              return (
                <div
                  key={question.key}
                  className="flex min-h-[52px] items-center justify-between gap-3 py-3"
                >
                  <Label
                    className="text-sm font-medium leading-snug"
                    id={`label-${question.key}`}
                  >
                    {question.label}
                  </Label>
                  <div
                    className="flex shrink-0 gap-2"
                    role="radiogroup"
                    aria-labelledby={`label-${question.key}`}
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={currentValue === true}
                      aria-label={`${question.label} Yes`}
                      onClick={() => handleYesNo(question.key, true)}
                      className={cn(
                        "min-h-[44px] min-w-[56px] rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50",
                        currentValue === true
                          ? "border-green-500 bg-green-500 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                      )}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={currentValue === false}
                      aria-label={`${question.label} No`}
                      onClick={() => handleYesNo(question.key, false)}
                      className={cn(
                        "min-h-[44px] min-w-[56px] rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50",
                        currentValue === false
                          ? "border-gray-400 bg-gray-200 text-gray-800 shadow-sm dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                      )}
                    >
                      No
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Water Condition */}
        <fieldset className="pt-6">
          <Label asChild>
            <legend className="mb-2 text-sm font-medium">
              Water Condition
            </legend>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {WATER_CONDITIONS.map((option) => {
              const isActive = data.waterCondition === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Water condition: ${option.value}`}
                  onClick={() => handleWaterCondition(option.value)}
                  className={cn(
                    "min-h-[44px] rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/50",
                    isActive
                      ? option.activeClasses
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  <span aria-hidden="true" className="mr-1.5">
                    {option.emoji}
                  </span>
                  {option.value}
                </button>
              );
            })}
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}
