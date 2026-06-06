"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  CustomerResponse,
  CustomerDecision,
  ServiceRequired,
  LeadPriority,
} from "@/types/survey";

interface CustomerResponseSectionProps {
  data: CustomerResponse;
  onChange: (data: CustomerResponse) => void;
}

const DECISION_OPTIONS: {
  value: CustomerDecision;
  label: string;
  activeClasses: string;
}[] = [
  {
    value: "Book On Spot",
    label: "Book On Spot",
    activeClasses:
      "border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-950/40 dark:text-green-400",
  },
  {
    value: "Need More Information",
    label: "Need More Information",
    activeClasses:
      "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    value: "Call Later",
    label: "Call Later",
    activeClasses:
      "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    value: "Not Interested",
    label: "Not Interested",
    activeClasses:
      "border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950/40 dark:text-red-400",
  },
];

const SERVICE_OPTIONS: ServiceRequired[] = [
  "Tank Cleaning",
  "Tank Repair",
  "Lid Replacement",
  "Water Quality Check",
  "Not Required",
];

const LEAD_OPTIONS: {
  value: LeadPriority;
  label: string;
  icon: string;
  activeClasses: string;
}[] = [
  {
    value: "Hot Lead",
    label: "Hot Lead",
    icon: "🔴",
    activeClasses: "bg-red-500 text-white shadow-md dark:bg-red-600",
  },
  {
    value: "Warm Lead",
    label: "Warm Lead",
    icon: "🟡",
    activeClasses: "bg-yellow-400 text-yellow-900 shadow-md dark:bg-yellow-500",
  },
  {
    value: "Cold Lead",
    label: "Cold Lead",
    icon: "🔵",
    activeClasses: "bg-blue-500 text-white shadow-md dark:bg-blue-600",
  },
];

export default function CustomerResponseSection({
  data,
  onChange,
}: CustomerResponseSectionProps) {
  const isNotInterested = data.customerDecision === "Not Interested";

  function handleDecisionChange(decision: CustomerDecision) {
    const updates: Partial<CustomerResponse> = {
      customerDecision: decision,
    };
    // Clear preferred date when Not Interested is selected
    if (decision === "Not Interested") {
      updates.preferredServiceDate = "";
    }
    onChange({ ...data, ...updates });
  }

  function handleToggleService(service: ServiceRequired) {
    const isSelected = data.servicesRequired.includes(service);
    const updated = isSelected
      ? data.servicesRequired.filter((s) => s !== service)
      : [...data.servicesRequired, service];
    onChange({ ...data, servicesRequired: updated });
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...data, preferredServiceDate: e.target.value });
  }

  function handleLeadPriorityChange(priority: LeadPriority) {
    onChange({ ...data, leadPriority: priority });
  }

  return (
    <Card className="border-l-4 border-l-[#003087]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003087] text-xs font-bold text-white">
            7
          </span>
          <span className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            Customer Response
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Customer Decision */}
        <div className="space-y-2">
          <Label>Customer Decision</Label>
          <div className="grid grid-cols-2 gap-2">
            {DECISION_OPTIONS.map((option) => {
              const isSelected = data.customerDecision === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Customer decision: ${option.label}`}
                  onClick={() => handleDecisionChange(option.value)}
                  className={cn(
                    "min-h-[44px] rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all",
                    isSelected
                      ? option.activeClasses
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Required */}
        <div className="space-y-2">
          <Label>Service Required</Label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((service) => {
              const isSelected = data.servicesRequired.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`Service: ${service}`}
                  onClick={() => handleToggleService(service)}
                  className={cn(
                    "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    isSelected
                      ? "border-[#003087] bg-[#003087]/10 text-[#003087] dark:bg-[#003087]/20 dark:text-blue-300"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  {isSelected && <span className="mr-1.5">✓</span>}
                  {service}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Service Date */}
        <div className="space-y-2">
          <Label
            htmlFor="preferred-service-date"
            className={cn(isNotInterested && "opacity-50")}
          >
            Preferred Service Date
          </Label>
          <div className="relative">
            <Input
              id="preferred-service-date"
              type="date"
              value={data.preferredServiceDate}
              onChange={handleDateChange}
              disabled={isNotInterested}
              aria-label="Preferred service date"
              className={cn(
                "min-h-[44px]",
                isNotInterested && "opacity-50"
              )}
            />
            {isNotInterested && (
              <p className="mt-1.5 text-xs text-gray-400 italic dark:text-gray-500">
                N/A — Customer Not Interested
              </p>
            )}
          </div>
        </div>

        {/* Lead Priority */}
        <div className="space-y-2">
          <Label>Lead Priority</Label>
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            {LEAD_OPTIONS.map((option) => {
              const isSelected = data.leadPriority === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Lead priority: ${option.label}`}
                  onClick={() => handleLeadPriorityChange(option.value)}
                  className={cn(
                    "flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
                    isSelected
                      ? option.activeClasses
                      : "text-gray-500 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-gray-700/60"
                  )}
                >
                  <span>{option.icon}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">
                    {option.value.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
