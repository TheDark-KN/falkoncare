"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";

type Survey = Doc<"surveys"> & { photoUrls?: string[] };


function formatDate(value: number | string) {
  const date = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: number) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "-";
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: typeof Icons.clipboardList;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminSurveysPage() {
  const surveys = useQuery(api.surveys.getAll);
  const [search, setSearch] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<string[] | null>(null);

  const filteredSurveys = useMemo(() => {
    if (!surveys) return [];

    const term = search.trim().toLowerCase();
    if (!term) return surveys;

    return surveys.filter((survey: Survey) => {
      const searchable = [
        survey.customerName,
        survey.mobileNumber,
        survey.houseFlatNumber,
        survey.societyArea,
        survey.surveyorName,
        survey.leadPriority,
        survey.customerDecision,
        ...survey.servicesRequired,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [search, surveys]);

  const stats = useMemo(() => {
    const all = (surveys ?? []) as Survey[];
    return {
      total: all.length,
      hotLeads: all.filter((survey) => survey.leadPriority === "Hot Lead").length,
      bookings: all.filter((survey) => survey.customerDecision === "Book On Spot").length,
      societies: new Set(all.map((survey) => survey.societyArea).filter(Boolean)).size,
    };
  }, [surveys]);

  if (surveys === undefined) {
    return (
      <div className="flex justify-center p-8">
        <Icons.loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Survey Submissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All survey entries submitted from the site and saved in the Convex surveys table.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Surveys" value={stats.total} icon={Icons.clipboardList} />
        <StatCard title="Hot Leads" value={stats.hotLeads} icon={Icons.zap} />
        <StatCard title="On-Spot Bookings" value={stats.bookings} icon={Icons.checkCircle} />
        <StatCard title="Societies Covered" value={stats.societies} icon={Icons.building} />
      </div>

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>All Survey Data</CardTitle>
          <div className="relative w-full md:max-w-sm">
            <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, society, lead..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredSurveys.length === 0 ? (
            <div className="py-12 text-center">
              <Icons.database className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">No survey entries found.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Submit a survey from the site after deploying Convex functions.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tank Details</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Surveyor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurveys.map((survey: Survey) => (
                  <TableRow key={survey._id}>
                    <TableCell className="min-w-36">
                      <div className="font-medium text-foreground">{formatDate(survey.surveyDate)}</div>
                      <div className="text-xs text-muted-foreground">{formatDateTime(survey.createdAt)}</div>
                    </TableCell>
                    <TableCell className="min-w-52">
                      <div className="font-medium text-foreground">{survey.customerName || "Unnamed"}</div>
                      <div className="text-sm text-muted-foreground">{survey.mobileNumber}</div>
                      {survey.emailId ? (
                        <div className="text-xs text-muted-foreground">{survey.emailId}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="min-w-56">
                      <div className="font-medium text-foreground">{survey.societyArea}</div>
                      <div className="text-sm text-muted-foreground">
                        {survey.houseFlatNumber}, {survey.floor}
                      </div>
                      {survey.gpsCoordinates ? (
                        <div className="text-xs text-muted-foreground">
                          {survey.gpsCoordinates.lat.toFixed(5)}, {survey.gpsCoordinates.lng.toFixed(5)}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="min-w-64">
                      <div className="font-medium text-foreground">
                        {survey.tankType || "-"} · {survey.totalTanks || "0"} tanks
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {survey.tankCapacity || "-"} · {survey.totalWaterStorage}L
                      </div>
                      <div className="text-xs text-muted-foreground">{formatList(survey.tankMaterials)}</div>
                    </TableCell>
                    <TableCell className="min-w-36">
                      {survey.photoUrls && survey.photoUrls.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSelectedPhotos(survey.photoUrls || null)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
                        >
                          📸 {survey.photoUrls.length} photo{survey.photoUrls.length !== 1 ? "s" : ""}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">No photos</span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-56">
                      <div className="font-medium text-foreground">{survey.leadPriority}</div>
                      <div className="text-sm text-muted-foreground">{survey.customerDecision || "-"}</div>
                      <div className="text-xs text-muted-foreground">{formatList(survey.servicesRequired)}</div>
                    </TableCell>
                    <TableCell className="min-w-44">
                      <div className="font-medium text-foreground">{survey.surveyorName}</div>
                      <div className="text-xs text-muted-foreground">{survey.submittedBy}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Lightbox / Photo Viewer Overlay */}
      {selectedPhotos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full rounded-xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-250">
            <button
              onClick={() => setSelectedPhotos(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close photo viewer"
            >
              <Icons.x className="h-6 w-6" />
            </button>
            <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
              <span>📸</span> Inspection Photos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
              {selectedPhotos.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block relative aspect-square overflow-hidden rounded-lg border border-border bg-muted group shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Inspection photo ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Icons.externalLink className="h-6 w-6 text-white" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
