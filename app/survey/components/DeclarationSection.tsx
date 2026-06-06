"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Declaration } from "@/types/survey";

interface DeclarationSectionProps {
  data: Declaration;
  onChange: (data: Declaration) => void;
  surveyorName: string;
}

export default function DeclarationSection({
  data,
  onChange,
  surveyorName,
}: DeclarationSectionProps) {
  function handleToggleAccepted() {
    onChange({ ...data, accepted: !data.accepted });
  }

  return (
    <Card className="border-l-4 border-l-[#003087]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003087] text-xs font-bold text-white">
            9
          </span>
          <span className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            Declaration
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Declaration Text */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
            I confirm that the above information has been collected during the
            Water Tank Inspection under Jal Jeevan Swachhata Abhyan.
          </p>
        </div>

        {/* Acceptance Checkbox */}
        <div
          role="checkbox"
          tabIndex={0}
          aria-checked={data.accepted}
          aria-label="I accept the above declaration"
          onClick={handleToggleAccepted}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggleAccepted();
            }
          }}
          className={cn(
            "flex min-h-[56px] cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 transition-all select-none",
            data.accepted
              ? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950/30"
              : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
          )}
        >
          {/* Checkbox Indicator */}
          <div
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
              data.accepted
                ? "border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-500"
                : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
            )}
          >
            {data.accepted && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              data.accepted
                ? "text-green-700 dark:text-green-300"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            I accept the above declaration
          </span>
        </div>

        {/* Digital Signature */}
        <div className="space-y-2">
          <Label htmlFor="digital-signature">Digital Signature</Label>
          <Input
            id="digital-signature"
            type="text"
            value={surveyorName}
            readOnly
            aria-label="Digital signature"
            className="min-h-[44px] italic text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* Declaration Date */}
        <div className="space-y-2">
          <Label htmlFor="declaration-date">Date</Label>
          <Input
            id="declaration-date"
            type="text"
            value={data.declarationDate}
            readOnly
            aria-label="Declaration date"
            className="min-h-[44px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
