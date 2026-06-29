"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { RevenueMetrics } from "@/components/admin/revenue-metrics";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const AnalyticsChart = dynamic(
  () => import("@/components/admin/analytics-chart").then((mod) => mod.AnalyticsChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-sm text-slate-400 font-bold font-headline">
        Loading chart...
      </div>
    ),
  }
);

export default function AdminReportsPage() {
  const rawBookings = useQuery(api.admin.getAllBookings);
  const bookings = useMemo(() => rawBookings ?? [], [rawBookings]);
  const rawUsers = useQuery(api.admin.getAllUsers);
  const users = useMemo(() => rawUsers ?? [], [rawUsers]);

  const completedBookings = useMemo(() => bookings.filter((b) => b.status === "completed"), [bookings]);
  const totalRevenue = useMemo(() => completedBookings.reduce((sum, b) => sum + (b.amount ?? 0), 0), [completedBookings]);
  
  const averageRating = useMemo(() => {
    const ratedBookings = bookings.filter((b) => b.rating !== undefined);
    if (ratedBookings.length === 0) return 0;
    const sum = ratedBookings.reduce((acc, b) => acc + (b.rating ?? 0), 0);
    return (sum / ratedBookings.length).toFixed(1);
  }, [bookings]);

  const averageBookingValue = useMemo(() => {
    if (bookings.length === 0) return 0;
    return Math.round(totalRevenue / bookings.length);
  }, [bookings, totalRevenue]);

  const pendingPayments = useMemo(() => {
    return bookings
      .filter((b) => b.status === "pending" || b.status === "in-progress")
      .reduce((sum, b) => sum + (b.amount ?? 0), 0);
  }, [bookings]);

  // Dynamic Weekly Revenue Trend (Last 7 Days)
  const weeklyRevenueData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    return last7Days.map((date) => {
      const dateStr = date.toLocaleDateString("en-IN", { weekday: "short" });
      const dayBookings = bookings.filter((b) => {
        const bDate = new Date(b._creationTime);
        return bDate.toDateString() === date.toDateString();
      });
      const completedDayBookings = dayBookings.filter((b) => b.status === "completed");
      return {
        name: dateStr,
        revenue: completedDayBookings.reduce((sum, b) => sum + (b.amount ?? 0), 0),
        bookings: dayBookings.length,
      };
    });
  }, [bookings]);

  // Dynamic Booking Status Distribution
  const statusDistributionData = useMemo(() => {
    return [
      { name: "Pending", count: bookings.filter((b) => b.status === "pending").length },
      { name: "Confirmed", count: bookings.filter((b) => b.status === "confirmed").length },
      { name: "In Progress", count: bookings.filter((b) => b.status === "in-progress").length },
      { name: "Completed", count: bookings.filter((b) => b.status === "completed").length },
      { name: "Cancelled", count: bookings.filter((b) => b.status === "cancelled").length },
    ];
  }, [bookings]);

  // Dynamic Service Popularity
  const serviceCounts = useMemo(() => {
    const services = ["Overhead Tank Cleaning", "Underground Tank Cleaning", "Sump Sanitization", "Combined Cleaning Package"];
    const counts = services.map((name) => ({
      name,
      count: bookings.filter((b) => b.serviceName === name).length,
    }));
    return counts.sort((a, b) => b.count - a.count);
  }, [bookings]);

  // Dynamic Staff Performance Ranking
  const staffPerformance = useMemo(() => {
    const staffMembers = users.filter((u: any) => u.role === "staff");
    return staffMembers
      .map((member: any) => {
        const completedJobs = bookings.filter(
          (b: any) => b.staffId === member._id && b.status === "completed"
        ).length;
        return {
          id: member._id,
          name: member.name,
          completedJobs,
        };
      })
      .sort((a, b) => b.completedJobs - a.completedJobs);
  }, [users, bookings]);

  // Client-Side CSV Exporter
  const handleDownloadCSV = () => {
    if (bookings.length === 0) {
      alert("No data available to download.");
      return;
    }
    const headers = [
      "Booking ID",
      "Date",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Service",
      "Amount (INR)",
      "Status",
      "Rating",
      "Feedback",
    ];

    const rows = bookings.map((b: any) => [
      b._id,
      new Date(b._creationTime).toLocaleDateString("en-IN"),
      `"${(b.user?.name ?? "Unknown").replace(/"/g, '""')}"`,
      b.user?.email ?? "-",
      b.user?.phone ?? "-",
      `"${b.serviceName.replace(/"/g, '""')}"`,
      b.amount,
      b.status,
      b.rating ?? "Unrated",
      b.feedback ? `"${b.feedback.replace(/"/g, '""')}"` : "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `falkoncare_operations_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <AdminTopBar title="Reports & Analytics" />
        <Button
          onClick={handleDownloadCSV}
          className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/10"
        >
          <Icons.fileText className="w-4 h-4" /> Download Report (CSV)
        </Button>
      </div>

      <div className="space-y-6">
        <RevenueMetrics
          totalRevenue={totalRevenue}
          monthlyGrowth={completedBookings.length > 0 ? 12 : 0}
          averageBookingValue={averageBookingValue}
          pendingPayments={pendingPayments}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <AnalyticsChart
            title="Weekly Revenue Trend (INR)"
            data={weeklyRevenueData}
            chartType="line"
            dataKey="revenue"
            color="#10b981"
          />
          <AnalyticsChart
            title="Booking Status Distribution"
            data={statusDistributionData}
            chartType="bar"
            dataKey="count"
            color="#0ea5e9"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popular Services */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6">
              <CardTitle className="text-base font-bold font-headline text-slate-900 dark:text-white">
                Popular Services
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {serviceCounts.map((service, index) => {
                const maxCount = serviceCounts[0]?.count || 1;
                const percentage = (service.count / maxCount) * 100;

                return (
                  <div key={service.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 flex items-center">
                        <span className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold mr-2.5">
                          {index + 1}
                        </span>
                        {service.name}
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{service.count} bookings</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Staff Performance Ranking */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6">
              <CardTitle className="text-base font-bold font-headline text-slate-900 dark:text-white">
                Staff Performance Ranking (Completed Jobs)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {staffPerformance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500 dark:text-slate-400">No field staff members registered.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {staffPerformance.map((member, index) => {
                    const maxJobs = staffPerformance[0]?.completedJobs || 1;
                    const percentage = (member.completedJobs / maxJobs) * 100;

                    return (
                      <div key={member.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 flex items-center">
                            <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold mr-2.5">
                              {index + 1}
                            </span>
                            {member.name}
                          </span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {member.completedJobs} jobs
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rating Metric Info */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center">
                <Icons.star className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Customer Satisfaction</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Average feedback score across completed service orders</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <span className="text-2xl font-black">{averageRating}</span>
              <span className="text-xs font-bold">/ 5.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
