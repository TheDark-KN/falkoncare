"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CustomerDetails } from "@/types/survey";

interface CustomerDetailsSectionProps {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
  errors: Record<string, string>;
}

export default function CustomerDetailsSection({
  data,
  onChange,
  errors,
}: CustomerDetailsSectionProps) {
  const handleMobileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
      onChange({ ...data, mobileNumber: value });
    },
    [data, onChange]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...data, customerName: e.target.value });
    },
    [data, onChange]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...data, emailId: e.target.value });
    },
    [data, onChange]
  );

  const mobileError = errors.mobileNumber;
  const emailError = errors.emailId;

  return (
    <Card className="border-l-4 border-l-[#003087]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003087] text-sm font-bold text-white"
            aria-hidden="true"
          >
            3
          </span>
          <span className="text-lg" aria-hidden="true">
            👤
          </span>
          <span className="text-lg">Customer Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Mobile / WhatsApp Number */}
        <div className="space-y-2">
          <Label htmlFor="mobile-number">
            Mobile / WhatsApp Number
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="mobile-number"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={data.mobileNumber}
            onChange={handleMobileChange}
            required
            maxLength={10}
            aria-label="Mobile or WhatsApp number"
            aria-required="true"
            aria-invalid={!!mobileError}
            aria-describedby={mobileError ? "mobile-error" : undefined}
            className={cn(
              "h-11",
              mobileError &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
            )}
          />
          {mobileError && (
            <p
              id="mobile-error"
              className="text-sm font-medium text-red-500 dark:text-red-400"
              role="alert"
            >
              {mobileError}
            </p>
          )}
        </div>

        {/* Customer Name */}
        <div className="space-y-2">
          <Label htmlFor="customer-name">Customer Name</Label>
          <Input
            id="customer-name"
            type="text"
            placeholder="Full name"
            value={data.customerName}
            onChange={handleNameChange}
            aria-label="Customer name"
            className="h-11"
          />
        </div>

        {/* Email ID */}
        <div className="space-y-2">
          <Label htmlFor="email-id">Email ID</Label>
          <Input
            id="email-id"
            type="email"
            placeholder="email@example.com"
            value={data.emailId}
            onChange={handleEmailChange}
            aria-label="Email address"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            className={cn(
              "h-11",
              emailError &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
            )}
          />
          {emailError && (
            <p
              id="email-error"
              className="text-sm font-medium text-red-500 dark:text-red-400"
              role="alert"
            >
              {emailError}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
