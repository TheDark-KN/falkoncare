"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

function formatCurrency(amount: any) {
  const val = Number(amount);
  if (Number.isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

function formatDate(timestamp: any) {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return String(timestamp);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBookingsPage() {
  const bookings = useQuery(api.admin.getAllBookings, {});
  const rawUsers = useQuery(api.admin.getAllUsers);
  const users = useMemo(() => rawUsers ?? [], [rawUsers]);
  const updateStatus = useMutation(api.admin.updateBookingStatus);
  const assignStaffMutation = useMutation(api.admin.assignStaff);

  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<string | "all">("all");

  const isLoading = bookings === undefined;

  const staffMembers = useMemo(() => {
    return users.filter((u: any) => u.role === "staff");
  }, [users]);

  const uniqueServices = useMemo(() => {
    if (!bookings) return [];
    const services = bookings.map((b) => b.serviceName);
    return Array.from(new Set(services));
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchService = serviceFilter === "all" || b.serviceName === serviceFilter;
      return matchStatus && matchService;
    });
  }, [bookings, statusFilter, serviceFilter]);

  const handleStatusUpdate = async (bookingId: Id<"bookings">, newStatus: BookingStatus) => {
    try {
      await updateStatus({ bookingId, status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (e) {
      toast.error("Failed to update booking status");
    }
  };

  const handleStaffAssign = async (bookingId: Id<"bookings">, staffId: string) => {
    try {
      await assignStaffMutation({ bookingId, staffId: staffId as Id<"users"> });
      toast.success("Staff assigned to booking successfully");
    } catch (e) {
      toast.error("Failed to assign staff to booking");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Icons.loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading bookings canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
          Booking Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review, confirm, track, or cancel water tank cleaning service bookings
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as any)}
          >
            <SelectTrigger className="w-[160px] min-h-[40px] border-slate-200 dark:border-slate-800 rounded-lg">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Type</label>
          <Select
            value={serviceFilter}
            onValueChange={setServiceFilter}
          >
            <SelectTrigger className="w-[180px] min-h-[40px] border-slate-200 dark:border-slate-800 rounded-lg">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectItem value="all">All Services</SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold font-headline text-slate-900 dark:text-slate-50">
            Bookings List
          </CardTitle>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Showing {filteredBookings.length} bookings
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 pl-6">Booking ID</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Customer</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Service</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Slot</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Assigned Staff</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 text-right">Amount</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 pr-6 text-right">Status Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">
                      No bookings match selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((b) => (
                    <TableRow key={b._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <TableCell className="pl-6 py-4 font-mono text-xs font-semibold text-slate-400">
                        {b._id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {b.user?.name}
                          </div>
                          <div className="text-xs text-slate-400">{b.user?.email}</div>
                          <div className="text-xs text-slate-400">{b.user?.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                          {b.serviceName}
                        </div>
                        <div className="text-xs text-slate-400 max-w-[200px] truncate">{b.address}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {formatDate(b.date)}
                        </div>
                        <div className="text-xs text-slate-400">{b.time}</div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={b.staff?.id || "unassigned"}
                          onValueChange={(val) => handleStaffAssign(b._id, val)}
                        >
                          <SelectTrigger className="w-[140px] min-h-[36px] h-9 text-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg">
                            <SelectValue placeholder="Assign Staff" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                             <SelectItem value="unassigned">Unassigned</SelectItem>
                             {staffMembers.map((member: any) => (
                               <SelectItem key={member._id || member.email} value={member._id || "unassigned"}>
                                 {member.name || member.fullName || "Staff Member"}
                               </SelectItem>
                             ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                      <TableCell className="text-right font-bold text-sm text-slate-900 dark:text-slate-100">
                        {formatCurrency(b.amount)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Select
                          value={b.status}
                          onValueChange={(val) => handleStatusUpdate(b._id, val as BookingStatus)}
                        >
                          <SelectTrigger className="w-[130px] min-h-[36px] h-9 text-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
