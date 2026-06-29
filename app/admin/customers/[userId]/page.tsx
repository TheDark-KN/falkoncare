"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Id } from "@/convex/_generated/dataModel";

export default function CustomerDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const user = useQuery(api.admin.getUserDetail, { userId: userId as Id<"users"> }) as any;

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Icons.loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading customer profile...</p>
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-slate-500 dark:text-slate-400 font-semibold">Customer not found.</p>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl">
          ← Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold -ml-2"
      >
        ← Back to Customers
      </Button>

      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl border border-blue-100/50 dark:border-blue-900/30 shrink-0">
              {user.name?.[0]?.toUpperCase() ?? user.fullName?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black font-headline text-slate-900 dark:text-white">
                {user.name ?? user.fullName ?? "No name"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 uppercase font-black tracking-wider block">Phone</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {user.phone ?? "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-black tracking-wider block">Total Bookings</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {user.bookingCount ?? 0}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-black tracking-wider block">Total Spent</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                ₹{((user.totalSpent ?? 0) / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-black tracking-wider block">Role</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {user.role ?? "customer"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-black tracking-wider block">Address</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {user.address ?? "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-black tracking-wider block">Member Since</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {new Date(user._creationTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomerBookings userId={userId as Id<"users">} />
    </div>
  );
}

function CustomerBookings({ userId }: { userId: Id<"users"> }) {
  const bookings = useQuery(api.admin.getUserBookings, { userId });

  if (bookings === undefined) {
    return (
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <CardContent className="p-8 text-center">
          <Icons.loader className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading booking history...</p>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">No bookings yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-base font-bold font-headline text-slate-900 dark:text-slate-50">
          Booking History ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 pl-6">Service</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Date</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 text-right pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id} className="border-b border-slate-100 dark:border-slate-800">
                  <TableCell className="pl-6 py-4 font-semibold text-sm text-slate-700 dark:text-slate-300">
                    {b.serviceName}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(b.date).toLocaleDateString("en-IN")}
                    <span className="ml-2 text-xs">{b.time}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="text-right pr-6 font-bold text-sm text-slate-900 dark:text-slate-100">
                    ₹{b.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
