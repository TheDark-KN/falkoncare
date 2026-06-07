"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";

type Booking = Doc<"bookings">;
type Survey = Doc<"surveys">;

const bookingStatuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"] as const;
type BookingStatus = (typeof bookingStatuses)[number];

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

export default function AdminDashboardPage() {
  const bookings = useQuery(api.bookings.get);
  const surveys = useQuery(api.surveys.getAll);
  const updateStatus = useMutation(api.bookings.updateStatus);
  const [search, setSearch] = useState("");

  const isLoading = bookings === undefined || surveys === undefined;

  const bookingRows = useMemo(() => {
    if (!bookings) return [];
    const term = search.trim().toLowerCase();
    if (!term) return bookings;

    return bookings.filter((booking: Booking) =>
      [
        booking.userId,
        booking.serviceName,
        booking.address,
        booking.status,
        booking.time,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [bookings, search]);

  const surveyRows = useMemo(() => {
    if (!surveys) return [];
    const term = search.trim().toLowerCase();
    if (!term) return surveys;

    return surveys.filter((survey: Survey) =>
      [
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
        .toLowerCase()
        .includes(term)
    );
  }, [search, surveys]);

  const stats = useMemo(() => {
    const allBookings = (bookings ?? []) as Booking[];
    const allSurveys = (surveys ?? []) as Survey[];
    return {
      bookings: allBookings.length,
      pending: allBookings.filter((booking) => booking.status === "pending").length,
      surveys: allSurveys.length,
      hotLeads: allSurveys.filter((survey) => survey.leadPriority === "Hot Lead").length,
    };
  }, [bookings, surveys]);

  const handleStatusChange = async (id: Id<"bookings">, status: BookingStatus) => {
    await updateStatus({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Icons.loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Admin Operations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View all booking requests and survey submissions from Convex in one place.
          </p>
        </div>
        <div className="relative w-full md:max-w-sm">
          <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings and surveys..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Bookings" value={stats.bookings} icon={Icons.calendar} />
        <StatCard title="Pending Bookings" value={stats.pending} icon={Icons.clock} />
        <StatCard title="Survey Entries" value={stats.surveys} icon={Icons.clipboardList} />
        <StatCard title="Hot Leads" value={stats.hotLeads} icon={Icons.zap} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingRows.length === 0 ? (
            <div className="py-10 text-center">
              <Icons.calendar className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No bookings found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookingRows.map((booking: Booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="min-w-56">
                      <div className="font-medium text-foreground">{booking.userId}</div>
                      <div className="text-sm text-muted-foreground">{booking.address}</div>
                    </TableCell>
                    <TableCell className="min-w-44">
                      <div className="font-medium text-foreground">{booking.serviceName}</div>
                      <div className="text-sm text-muted-foreground">
                        {[booking.tankSize, booking.tankType].filter(Boolean).join(" ") || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-36">
                      {formatDate(booking.date)} at {booking.time}
                    </TableCell>
                    <TableCell>Rs {booking.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {booking.status === "pending" ? (
                          <>
                            <Button size="sm" onClick={() => handleStatusChange(booking._id, "confirmed")}>
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(booking._id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : null}
                        {booking.status === "confirmed" ? (
                          <Button size="sm" onClick={() => handleStatusChange(booking._id, "in-progress")}>
                            Start
                          </Button>
                        ) : null}
                        {booking.status === "in-progress" ? (
                          <Button size="sm" onClick={() => handleStatusChange(booking._id, "completed")}>
                            Complete
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Survey Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {surveyRows.length === 0 ? (
            <div className="py-10 text-center">
              <Icons.clipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No survey entries found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tank Details</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Surveyor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveyRows.map((survey: Survey) => (
                  <TableRow key={survey._id}>
                    <TableCell className="min-w-36">
                      <div className="font-medium text-foreground">{formatDate(survey.surveyDate)}</div>
                      <div className="text-xs text-muted-foreground">{formatDateTime(survey.createdAt)}</div>
                    </TableCell>
                    <TableCell className="min-w-52">
                      <div className="font-medium text-foreground">{survey.customerName || "Unnamed"}</div>
                      <div className="text-sm text-muted-foreground">{survey.mobileNumber}</div>
                    </TableCell>
                    <TableCell className="min-w-56">
                      <div className="font-medium text-foreground">{survey.societyArea}</div>
                      <div className="text-sm text-muted-foreground">
                        {survey.houseFlatNumber}, {survey.floor}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-60">
                      <div className="font-medium text-foreground">
                        {survey.tankType || "-"} · {survey.totalTanks || "0"} tanks
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {survey.tankCapacity || "-"} · {survey.totalWaterStorage}L
                      </div>
                      <div className="text-xs text-muted-foreground">{formatList(survey.tankMaterials)}</div>
                    </TableCell>
                    <TableCell className="min-w-52">
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
    </div>
  );
}
