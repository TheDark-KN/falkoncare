"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SurveyorRemarks } from "@/types/survey";

interface SurveyorRemarksSectionProps {
  data: SurveyorRemarks;
  onChange: (data: SurveyorRemarks) => void;
}

const MAX_CHARS = 500;
const WARN_THRESHOLD = 450;

export default function SurveyorRemarksSection({
  data,
  onChange,
}: SurveyorRemarksSectionProps) {
  const charCount = data.remarks.length;
  const isNearLimit = charCount > WARN_THRESHOLD;

  function handleRemarksChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      onChange({ remarks: value });
    }
  }

  return (
    <Card className="border-l-4 border-l-[#00AEEF]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00AEEF] text-xs font-bold text-white">
            8
          </span>
          <span className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            Surveyor Remarks
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <Label htmlFor="surveyor-remarks">Remarks</Label>
        <Textarea
          id="surveyor-remarks"
          value={data.remarks}
          onChange={handleRemarksChange}
          placeholder="Enter any additional observations or remarks about the survey..."
          maxLength={MAX_CHARS}
          aria-label="Surveyor remarks"
          className="min-h-[120px] resize-y"
        />
        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs font-medium transition-colors",
              isNearLimit
                ? "text-red-500 dark:text-red-400"
                : "text-muted-foreground"
            )}
            aria-live="polite"
          >
            {charCount} / {MAX_CHARS} characters
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
