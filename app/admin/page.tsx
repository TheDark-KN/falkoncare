"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import Link from "next/link";

// Lazy load the chart component to avoid SSR hydration mismatches
const BookingsChart = dynamic(
  () => import("@/components/admin/bookings-chart").then((mod) => mod.BookingsChart),
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-sm text-slate-500">Loading chart canvas...</div> }
);

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const stats = useQuery(api.admin.getDashboardStats);
  const allBookings = useQuery(api.admin.getAllBookings);

  const isLoading = stats === undefined || allBookings === undefined;

  const chartData = useMemo(() => {
    if (!stats || !stats.bookingsByStatus) return [];
    return Object.entries(stats.bookingsByStatus).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: count as number,
    }));
  }, [stats]);

  const recentBookings = useMemo(() => {
    if (!allBookings) return [];
    return allBookings.slice(0, 10);
  }, [allBookings]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Icons.loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading operational stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Users
            </CardTitle>
            <Icons.users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline text-slate-900 dark:text-white">
              {stats?.totalUsers ?? 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active customer database</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Bookings
            </CardTitle>
            <Icons.calendar className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline text-slate-900 dark:text-white">
              {stats?.totalBookings ?? 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              +{stats?.bookingsThisWeek ?? 0} scheduled this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Revenue
            </CardTitle>
            <Icons.creditCard className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline text-slate-900 dark:text-white">
              {formatCurrency(stats?.totalRevenue ?? 0)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">From completed orders</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Actions
            </CardTitle>
            <Icons.alertCircle className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-headline text-slate-900 dark:text-white">
              {stats?.bookingsByStatus?.pending ?? 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bookings awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution Chart */}
        <Card className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-lg font-bold font-headline text-slate-900 dark:text-slate-50">
              Bookings by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <BookingsChart data={chartData} />
          </CardContent>
        </Card>

        {/* Recent Bookings Table */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold font-headline text-slate-900 dark:text-slate-50">
              Recent Bookings
            </CardTitle>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all bookings →
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 dark:border-slate-800 hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">ID</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Customer</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Service</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Date</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Status</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentBookings.map((b: any) => (
                      <TableRow key={b._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <TableCell className="font-mono text-xs font-semibold text-slate-400">
                          {b._id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {b.user?.name}
                            </div>
                            <div className="text-xs text-slate-400">{b.user?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                          {b.serviceName}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(b._creationTime)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={b.status} />
                        </TableCell>
                        <TableCell className="text-right font-bold text-sm text-slate-900 dark:text-slate-100">
                          {formatCurrency(b.amount)}
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
    </div>
  );
}
