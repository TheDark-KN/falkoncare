"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type {
  SurveyInformation,
  SocietyOption,
} from "@/types/survey";

interface SurveyInformationSectionProps {
  data: SurveyInformation;
  onChange: (data: SurveyInformation) => void;
  societies: SocietyOption[];
}

type GpsStatus = "idle" | "capturing" | "captured" | "error";

export default function SurveyInformationSection({
  data,
  onChange,
  societies,
}: SurveyInformationSectionProps) {
  const [societySearch, setSocietySearch] = useState(data.societyArea);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>(
    data.gpsCoordinates ? "captured" : "idle"
  );
  const [gpsError, setGpsError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format today as DD/MM/YYYY
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  // Set survey date on mount
  useEffect(() => {
    if (data.surveyDate !== formattedDate) {
      onChange({ ...data, surveyDate: formattedDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-capture GPS on mount
  useEffect(() => {
    if (data.gpsCoordinates) return;

    if (!navigator.geolocation) {
      setGpsStatus("error");
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setGpsStatus("capturing");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        onChange({ ...data, gpsCoordinates: coords });
        setGpsStatus("captured");
      },
      (error) => {
        setGpsStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError("Location information unavailable");
            break;
          case error.TIMEOUT:
            setGpsError("Location request timed out");
            break;
          default:
            setGpsError("Failed to capture location");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSocieties = societies.filter((society) => {
    const query = societySearch.toLowerCase();
    return (
      society.name.toLowerCase().includes(query) ||
      society.area.toLowerCase().includes(query)
    );
  });

  const handleSocietySelect = useCallback(
    (society: SocietyOption) => {
      const value = `${society.name} - ${society.area}`;
      setSocietySearch(value);
      onChange({ ...data, societyArea: value });
      setIsDropdownOpen(false);
    },
    [data, onChange]
  );

  const handleSocietySearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSocietySearch(value);
      onChange({ ...data, societyArea: value });
      setIsDropdownOpen(true);
    },
    [data, onChange]
  );

  return (
    <Card className="border-l-4 border-l-[#003087] overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003087] text-sm font-bold text-white"
            aria-hidden="true"
          >
            1
          </span>
          <span className="text-lg" aria-hidden="true">
            📋
          </span>
          <span className="text-lg">Survey Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Survey Date */}
        <div className="space-y-2">
          <Label htmlFor="survey-date">Survey Date</Label>
          <Input
            id="survey-date"
            type="text"
            value={formattedDate}
            readOnly
            aria-label="Survey date"
            className="h-11 bg-muted cursor-not-allowed"
          />
        </div>

        {/* Surveyor Name (read-only badge) */}
        <div className="space-y-2">
          <Label>Surveyor Name</Label>
          <div
            className={cn(
              "flex h-11 items-center rounded-md border border-input bg-muted px-3",
              "text-sm font-medium text-foreground"
            )}
            aria-label="Surveyor name"
          >
            <span className="mr-2 inline-flex h-6 items-center rounded-full bg-[#003087] px-2.5 text-xs font-semibold text-white">
              Surveyor
            </span>
            {data.surveyorName || "—"}
          </div>
        </div>

        {/* Society/Area searchable dropdown */}
        <div className="relative space-y-2" ref={dropdownRef}>
          <Label htmlFor="society-area">Society / Area</Label>
          <Input
            id="society-area"
            type="text"
            placeholder="Search society or area..."
            value={societySearch}
            onChange={handleSocietySearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            aria-label="Society or area search"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            autoComplete="off"
            className="h-11"
          />
          {isDropdownOpen && filteredSocieties.length > 0 && (
            <div
              role="listbox"
              aria-label="Society options"
              className={cn(
                "absolute z-50 mt-1 w-full overflow-y-auto rounded-md border border-input bg-card shadow-lg",
                "max-h-[200px]"
              )}
            >
              {filteredSocieties.map((society) => (
                <button
                  key={society._id}
                  type="button"
                  role="option"
                  aria-selected={
                    data.societyArea ===
                    `${society.name} - ${society.area}`
                  }
                  className={cn(
                    "flex w-full cursor-pointer items-center px-3 py-3 text-left text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    data.societyArea ===
                      `${society.name} - ${society.area}` &&
                      "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSocietySelect(society)}
                >
                  <span className="font-medium">{society.name}</span>
                  <span className="ml-2 text-muted-foreground">
                    — {society.area}
                  </span>
                </button>
              ))}
            </div>
          )}
          {isDropdownOpen &&
            societySearch.length > 0 &&
            filteredSocieties.length === 0 && (
              <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-card p-3 text-center text-sm text-muted-foreground shadow-lg">
                No societies found
              </div>
            )}
        </div>

        {/* GPS Location */}
        <div className="space-y-2">
          <Label>GPS Location</Label>
          <div className="flex min-h-[44px] items-center gap-2">
            {gpsStatus === "capturing" && (
              <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Capturing…
              </span>
            )}
            {gpsStatus === "captured" && data.gpsCoordinates && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                📍 Location Captured
                <span className="ml-1 text-xs text-green-600 dark:text-green-500">
                  ({data.gpsCoordinates.lat.toFixed(5)},{" "}
                  {data.gpsCoordinates.lng.toFixed(5)})
                </span>
              </span>
            )}
            {gpsStatus === "error" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                ⚠️ {gpsError}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
