"use client"

import { useMemo } from "react"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

// Format Date Helper
function formatDate(value: number) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function DashboardPage() {
  const { isLoaded, user } = useUser()
  const bookings = useQuery(api.bookings.getByUser)
  const convexUser = useQuery(api.users.current)

  const isLoading = !isLoaded || bookings === undefined || convexUser === undefined

  // Calculate dynamic stats
  const stats = useMemo(() => {
    if (!bookings) return { total: 0, completed: 0, pending: 0 }
    const total = bookings.length
    const completed = bookings.filter((b: any) => b.status === "completed").length
    const pending = bookings.filter((b: any) => ["pending", "confirmed", "in-progress"].includes(b.status)).length
    return { total, completed, pending }
  }, [bookings])

  // Get recent 3 bookings for table
  const recentBookings = useMemo(() => {
    if (!bookings) return []
    return [...bookings]
      .sort((a: any, b: any) => b.date - a.date)
      .slice(0, 3)
  }, [bookings])

  // Calculate last 6 months activity for chart representation
  const monthlyActivity = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const counts: Record<string, { cleaning: number; testing: number }> = {}

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const mName = monthNames[d.getMonth()]
      counts[mName] = { cleaning: 0, testing: 0 }
    }

    if (bookings) {
      bookings.forEach((b: any) => {
        const date = new Date(b.date)
        const mName = monthNames[date.getMonth()]
        if (counts[mName] !== undefined) {
          if (b.serviceName.toLowerCase().includes("test")) {
            counts[mName].testing++
          } else {
            counts[mName].cleaning++
          }
        }
      })
    }

    return Object.entries(counts).map(([month, data]) => {
      const maxCount = Math.max(...Object.values(counts).map(d => d.cleaning + d.testing), 1)
      const cleaningPercent = Math.min((data.cleaning / maxCount) * 100, 100)
      const testingPercent = Math.min((data.testing / maxCount) * 100, 100)
      const totalPercent = Math.min(((data.cleaning + data.testing) / maxCount) * 100, 100)

      return {
        month,
        cleaningPercent,
        testingPercent,
        totalPercent: totalPercent > 0 ? totalPercent : 8, // Minimum height for visual rendering
        raw: data
      }
    })
  }, [bookings])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950">
        <TopBar title="Dashboard" />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icons.loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-slate-500 font-headline font-semibold">Loading your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col">
      <TopBar title="Dashboard" />

      {/* Page Content */}
      <div className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 font-headline">
          <span className="hover:text-primary cursor-pointer transition-colors">Dashboard</span>
          <Icons.chevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300">Overview</span>
        </nav>

        {/* Welcome Block */}
        <div>
          <h2 className="text-3xl font-headline font-black text-sky-900 dark:text-white tracking-tight">
            Welcome back, {convexUser?.fullName?.split(" ")[0] || user?.firstName || "Aryan"}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium font-headline">
            Your water hygiene status is currently{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Optimal</span>.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Bookings */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 group hover:bg-primary dark:hover:bg-primary transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-sky-50 dark:bg-slate-800 rounded-xl text-primary group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Icons.calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-[#006a61] dark:text-[#89f5e7] group-hover:text-white/80 font-headline">+12%</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-white/70 font-headline transition-colors">Total Bookings</p>
            <h3 className="text-2xl font-headline font-black text-sky-900 dark:text-white mt-1 group-hover:text-white transition-colors">{stats.total}</h3>
          </div>

          {/* Wallet Balance */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 group hover:bg-[#006a61] dark:hover:bg-emerald-800 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-teal-50 dark:bg-slate-800 rounded-xl text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Icons.wallet className="w-5 h-5" />
              </div>
              <Link href="/dashboard/wallet" onClick={(e) => e.stopPropagation()}>
                <button className="text-[10px] font-bold text-primary bg-sky-50 dark:bg-slate-800 px-3 py-1 rounded-full group-hover:bg-white/20 group-hover:text-white transition-colors font-headline border-0 cursor-pointer">
                  Top Up
                </button>
              </Link>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-white/70 font-headline transition-colors">Wallet Balance</p>
            <h3 className="text-2xl font-headline font-black text-sky-900 dark:text-white mt-1 group-hover:text-white transition-colors">
              ₹{(convexUser?.walletBalance || 0).toLocaleString()}
            </h3>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                <Icons.checkCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-headline">Completed Jobs</p>
            <h3 className="text-2xl font-headline font-black text-sky-900 dark:text-white mt-1">{stats.completed}</h3>
          </div>

          {/* Pending Requests */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-amber-600 dark:text-amber-400">
                <Icons.clock className="w-5 h-5" />
              </div>
              {stats.pending > 0 && (
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-headline">Pending Requests</p>
            <h3 className="text-2xl font-headline font-black text-sky-900 dark:text-white mt-1">
              {stats.pending.toString().padStart(2, "0")}
            </h3>
          </div>
        </div>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Main Activity & Table (Left Column) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Booking Table Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-bold text-sky-900 dark:text-white">Recent Bookings</h3>
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-sky-50 dark:hover:bg-slate-800 font-bold font-headline text-sm gap-1">
                    View All
                    <Icons.arrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 dark:border-slate-800">
                        <th className="pb-4 font-headline">Service</th>
                        <th className="pb-4 font-headline">Date</th>
                        <th className="pb-4 font-headline">Amount</th>
                        <th className="pb-4 font-headline">Status</th>
                        <th className="pb-4 text-right font-headline">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-headline">
                      {recentBookings.map((booking) => {
                        const isCompleted = booking.status === "completed"
                        const isInProgress = booking.status === "in-progress"
                        const isCancelled = booking.status === "cancelled"

                        return (
                          <tr key={booking._id} className="group border-b border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all">
                            <td className="py-5">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center",
                                  isCompleted ? "bg-teal-50 dark:bg-teal-950/30 text-emerald-600" :
                                  isInProgress ? "bg-sky-50 dark:bg-sky-950/30 text-primary" :
                                  isCancelled ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" :
                                  "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                )}>
                                  <Icons.droplets className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sky-900 dark:text-slate-200 group-hover:text-primary transition-colors">{booking.serviceName}</span>
                              </div>
                            </td>
                            <td className="py-5 text-slate-500 dark:text-slate-400">{formatDate(booking.date)}</td>
                            <td className="py-5 font-bold text-sky-900 dark:text-slate-200">₹{booking.amount.toLocaleString()}</td>
                            <td className="py-5">
                              <span className={cn(
                                "px-3 py-1 text-[10px] font-black rounded-full uppercase border tracking-wider",
                                isCompleted
                                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50"
                                  : isInProgress
                                  ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200/50"
                                  : isCancelled
                                  ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200/50"
                                  : "bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200/50"
                              )}>
                                {booking.status === "in-progress" ? "In Progress" : booking.status}
                              </span>
                            </td>
                            <td className="py-5 text-right">
                              <Link href={`/dashboard/bookings/${booking._id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                                  <Icons.externalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Icons.calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-headline font-semibold mb-4">No services booked yet</p>
                  <Link href="/dashboard/services">
                    <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl px-6 font-headline font-bold">
                      Book Your First Service
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Service Usage Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-headline font-bold text-sky-900 dark:text-white">Service Usage</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Last 6 months activity overview</p>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary font-headline">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Cleaning
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#006a61] dark:text-[#89f5e7] font-headline">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006a61] dark:bg-[#89f5e7]"></span> Testing / Other
                  </span>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="h-64 flex items-end justify-between gap-4 px-4 pt-4 border-b border-slate-100 dark:border-slate-800">
                {monthlyActivity.map((act, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="w-full max-w-[40px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full min-h-[160px] flex items-end overflow-hidden relative shadow-inner">
                      {/* Cleaning bar */}
                      <div
                        style={{ height: `${act.totalPercent}%` }}
                        className="w-full bg-primary/20 dark:bg-primary/10 rounded-t-lg flex items-end relative"
                      >
                        <div
                          style={{ height: `${act.cleaningPercent || act.totalPercent}%` }}
                          className="w-full bg-primary rounded-t-md hover:bg-primary/90 transition-all duration-300"
                        />
                        {/* Testing bar layered */}
                        {act.raw.testing > 0 && (
                          <div
                            style={{ height: `${act.testingPercent}%` }}
                            className="absolute bottom-0 left-0 w-full bg-[#006a61] dark:bg-[#89f5e7] hover:opacity-90 transition-all duration-300"
                          />
                        )}
                      </div>
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] p-2 rounded shadow-md -top-12 left-1/2 -translate-x-1/2 transition-opacity z-10 pointer-events-none font-headline font-bold whitespace-nowrap">
                        Clean: {act.raw.cleaning} | Test: {act.raw.testing}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors font-headline pb-1">
                      {act.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Activity Timeline (Right Column) */}
          <div className="col-span-12 lg:col-span-4">
            
            {/* Service Activity Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 h-full">
              <h3 className="text-xl font-headline font-bold text-sky-900 dark:text-white mb-8">Service Activity</h3>
              
              {bookings && bookings.length > 0 ? (
                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                  {bookings.slice(0, 4).map((booking: any, idx: number) => {
                    const isCompleted = booking.status === "completed"
                    const isInProgress = booking.status === "in-progress"
                    const isCancelled = booking.status === "cancelled"

                    return (
                      <div key={booking._id} className="relative pl-10">
                        {/* Dot indicator */}
                        <div className={cn(
                          "absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 z-10 transition-colors",
                          isCompleted ? "border-emerald-600" :
                          isInProgress ? "border-primary animate-pulse" :
                          isCancelled ? "border-rose-500" :
                          "border-slate-200 dark:border-slate-800"
                        )}></div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                          <p className={cn(
                            "text-[10px] font-black uppercase tracking-wider mb-1 font-headline",
                            isCompleted ? "text-emerald-600" :
                            isInProgress ? "text-primary" :
                            isCancelled ? "text-rose-500" :
                            "text-slate-400"
                          )}>
                            {booking.status === "in-progress" ? "In Progress" : booking.status}
                          </p>
                          <p className="text-sm font-bold text-sky-900 dark:text-slate-200 font-headline">{booking.serviceName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{booking.address}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold font-headline flex items-center gap-1">
                            <Icons.clock className="w-3 h-3" />
                            {formatDate(booking.date)} at {booking.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                  {/* Default / New User Timeline */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-primary z-10"></div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                      <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1 font-headline">Setup</p>
                      <p className="text-sm font-bold text-sky-900 dark:text-slate-200 font-headline">Welcome to Falkon Care</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your account is successfully configured. You are ready to book services.</p>
                    </div>
                  </div>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 z-10"></div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 font-headline">Action Required</p>
                      <p className="text-sm font-bold text-sky-900 dark:text-slate-200 font-headline">Verify Your Coverage</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ensure your pincode is in our Delhi NCR active service zones.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

// Utility function to merge classes conditionally
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
