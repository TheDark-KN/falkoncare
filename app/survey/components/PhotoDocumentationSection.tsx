"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PhotoDocumentation, PhotoCategory, PhotoFile } from "@/types/survey";

interface PhotoDocumentationSectionProps {
  data: PhotoDocumentation;
  onChange: (data: PhotoDocumentation) => void;
}

const PHOTO_CATEGORIES: PhotoCategory[] = [
  "Tank Exterior",
  "Tank Interior",
  "Lid Condition",
  "Leakage/Damage",
  "Water Quality Condition",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export default function PhotoDocumentationSection({
  data,
  onChange,
}: PhotoDocumentationSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: PhotoFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!ACCEPTED_TYPES.includes(file.type)) continue;
      if (file.size > MAX_FILE_SIZE) continue;

      newPhotos.push({
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      });
    }

    onChange({
      ...data,
      photos: [...data.photos, ...newPhotos],
    });

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDeletePhoto(id: string) {
    const photoToDelete = data.photos.find((p) => p.id === id);
    if (photoToDelete) {
      URL.revokeObjectURL(photoToDelete.preview);
    }
    onChange({
      ...data,
      photos: data.photos.filter((p) => p.id !== id),
    });
  }

  function handleToggleCategory(category: PhotoCategory) {
    const isSelected = data.photoCategories.includes(category);
    const updated = isSelected
      ? data.photoCategories.filter((c) => c !== category)
      : [...data.photoCategories, category];
    onChange({ ...data, photoCategories: updated });
  }

  function handleConsentChange(value: boolean) {
    onChange({ ...data, customerConsent: value });
  }

  return (
    <Card className="border-l-4 border-l-[#00AEEF]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00AEEF] text-xs font-bold text-white">
            6
          </span>
          <span className="flex items-center gap-2">
            <span className="text-lg">📸</span>
            Photo Documentation
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="space-y-2">
          <Label>Upload Tank Photos</Label>
          <div
            role="button"
            tabIndex={0}
            aria-label="Tap to upload tank photos"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#00AEEF] hover:bg-blue-50/50 active:bg-blue-50 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-[#00AEEF] dark:hover:bg-blue-950/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tap to upload
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              JPG or PNG, max 5MB each
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            className="hidden"
            aria-label="Upload tank photos file input"
            onChange={handleFileSelect}
          />
        </div>

        {/* Thumbnail Previews */}
        {data.photos.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {data.photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square">
                  <img
                    src={photo.preview}
                    alt="Tank photo preview"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    aria-label={`Delete photo ${photo.id}`}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-90 shadow-md transition-opacity hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Photo Count Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#00AEEF]/10 px-3 py-1 text-xs font-semibold text-[#00AEEF]">
                {data.photos.length} photo{data.photos.length !== 1 ? "s" : ""}{" "}
                taken
              </span>
            </div>
          </div>
        )}

        {/* Photo Categories */}
        <div className="space-y-2">
          <Label>Photo Category</Label>
          <div className="flex flex-wrap gap-2">
            {PHOTO_CATEGORIES.map((category) => {
              const isSelected = data.photoCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`Photo category: ${category}`}
                  onClick={() => handleToggleCategory(category)}
                  className={cn(
                    "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    isSelected
                      ? "border-[#00AEEF] bg-[#00AEEF]/10 text-[#00AEEF] dark:bg-[#00AEEF]/20"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  {isSelected && (
                    <span className="mr-1.5">✓</span>
                  )}
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Consent */}
        <div className="space-y-2">
          <Label>Customer Consent for Photo</Label>
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Customer consent: Yes"
              onClick={() => handleConsentChange(true)}
              className={cn(
                "min-h-[44px] flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                data.customerConsent === true
                  ? "border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-950/40 dark:text-green-400"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
              )}
            >
              Yes
            </button>
            <button
              type="button"
              aria-label="Customer consent: No"
              onClick={() => handleConsentChange(false)}
              className={cn(
                "min-h-[44px] flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                data.customerConsent === false
                  ? "border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950/40 dark:text-red-400"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
              )}
            >
              No
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
