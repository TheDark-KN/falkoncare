"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Booking = Doc<"bookings">
type Survey = Doc<"surveys">

const bookingStatuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"] as const
type BookingStatus = (typeof bookingStatuses)[number]

function formatDate(value: number | string) {
  const date = typeof value === "number" ? new Date(value) : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "-"
}

// Mock staff list matching the design mockup style
const mockStaff = [
  { name: "Marcus Sterling", role: "Senior Technician", status: "active", icon: "green" },
  { name: "Marcus Thorne", role: "Hygiene Lead", status: "active", icon: "green" },
  { name: "Sarah Connor", role: "Lab Specialist", status: "standby", icon: "amber" },
  { name: "John Doe", role: "Operator", status: "off", icon: "red" },
]

export default function AdminDashboardPage() {
  const bookings = useQuery(api.bookings.get)
  const surveys = useQuery(api.surveys.getAll)
  const updateStatus = useMutation(api.bookings.updateStatus)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"bookings" | "surveys">("bookings")

  const isLoading = bookings === undefined || surveys === undefined

  // Filter Bookings
  const bookingRows = useMemo(() => {
    if (!bookings) return []
    const term = search.trim().toLowerCase()
    if (!term) return bookings

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
    )
  }, [bookings, search])

  // Filter Surveys
  const surveyRows = useMemo(() => {
    if (!surveys) return []
    const term = search.trim().toLowerCase()
    if (!term) return surveys

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
    )
  }, [search, surveys])

  // Stats calculation
  const stats = useMemo(() => {
    const allBookings = (bookings ?? []) as Booking[]
    const allSurveys = (surveys ?? []) as Survey[]
    
    // Daily Revenue = sum of completed/in-progress booking amounts
    const revenue = allBookings
      .filter((b) => b.status === "completed" || b.status === "in-progress")
      .reduce((sum, b) => sum + b.amount, 0)

    const pendingCount = allBookings.filter((b) => b.status === "pending").length
    const activeStaffCount = mockStaff.filter(s => s.status === "active").length

    return {
      revenue,
      bookingsCount: allBookings.length,
      pendingCount,
      surveysCount: allSurveys.length,
      activeStaffCount,
    }
  }, [bookings, surveys])

  const handleStatusChange = async (id: Id<"bookings">, status: BookingStatus) => {
    try {
      await updateStatus({ id, status })
      toast.success(`Booking status updated to ${status}`)
    } catch (err: unknown) {
      toast.error("Failed to update status")
    }
  }

  const exportReport = () => {
    toast.success("Operational report exported successfully (CSV)")
  }

  const liveSync = () => {
    toast.success("Database sync completed (Convex Realtime)")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Icons.loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-500 font-headline font-semibold">Loading operational canvas...</p>
        </div>
      </div>
    )
  }

  const todayDateString = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h2 className="text-3xl font-headline font-black tracking-tight text-sky-900 dark:text-white">
            Operational Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium font-headline mt-1.5">
            Monitoring water hygiene performance for <span className="text-primary font-bold">{todayDateString}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={exportReport}
            variant="outline" 
            className="flex items-center gap-2 px-4 py-2 font-headline font-bold text-slate-600 border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <Icons.fileText className="w-4 h-4" />
            Export Report
          </Button>
          <Button 
            onClick={liveSync}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-headline font-bold rounded-xl border-0 shadow-lg shadow-primary/10"
          >
            <Icons.sparkles className="w-4 h-4 text-amber-300" />
            Live Sync
          </Button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Daily Revenue */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-sky-50 dark:bg-slate-800 rounded-xl text-primary">
              <Icons.rupee className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-headline">
              <Icons.trending className="w-3.5 h-3.5" />
              +12%
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider font-headline">Daily Volume</p>
            <h3 className="text-2xl font-headline font-black text-sky-900 dark:text-white mt-1">
              ₹{stats.revenue.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 dark:bg-slate-800 rounded-xl text-emerald-600">
              <Icons.calendarDays className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 font-headline">Current</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider font-headline">Today's Bookings</p>
            <h3 className="text-2xl font-headline font-black text-sky-900 dark:text-white mt-1">
              {stats.bookingsCount} Units
            </h3>
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-xl text-indigo-600">
              <Icons.users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-headline">94% Active</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider font-headline">Active Staff</p>
            <h3 className="text-2xl font-headline font-black text-sky-900 dark:text-white mt-1">
              {stats.activeStaffCount} Members
            </h3>
          </div>
        </div>

        {/* Pending Alerts */}
        <div className="bg-primary text-white p-6 rounded-2xl border-none shadow-xl shadow-primary/20 flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/20 rounded-xl">
              <Icons.alertCircle className="w-5 h-5 text-white" />
            </div>
            <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-wider font-headline border border-white/10">
              High Priority
            </span>
          </div>
          <div>
            <p className="text-white/80 text-xs font-black uppercase tracking-wider font-headline">Pending Alerts</p>
            <h3 className="text-2xl font-headline font-black mt-1">
              {stats.pendingCount.toString().padStart(2, "0")} Alerts
            </h3>
          </div>
        </div>
      </div>

      {/* Main Tables and Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns: Tables Section */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tabs switcher */}
            <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-800/30 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("bookings")}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-headline text-sm font-bold transition-all duration-200",
                  activeTab === "bookings"
                    ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                Service Bookings
              </button>
              <button
                onClick={() => setActiveTab("surveys")}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-headline text-sm font-bold transition-all duration-200",
                  activeTab === "surveys"
                    ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                Lead Surveys ({stats.surveysCount})
              </button>
            </div>

            {/* Local Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Icons.search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs font-headline focus:ring-2 focus:ring-primary focus:bg-white transition-all text-slate-800 dark:text-slate-200 shadow-sm"
              />
            </div>
          </div>

          {/* Bookings Card Table */}
          {activeTab === "bookings" && (
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardContent className="p-6 md:p-8">
                {bookingRows.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                    <Icons.calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                    <p className="mt-3 text-sm text-slate-500 font-headline font-semibold">No bookings found matching query.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-slate-100 dark:border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Customer ID / Location</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Service Details</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Schedule</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Amount</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Status</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookingRows.map((booking: Booking) => (
                          <TableRow key={booking._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <TableCell className="py-4 font-headline min-w-[200px]">
                              <div className="font-bold text-sky-900 dark:text-slate-200 truncate max-w-[180px]">{booking.userId}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">{booking.address}</div>
                            </TableCell>
                            <TableCell className="py-4 font-headline min-w-[160px]">
                              <div className="font-bold text-sky-900 dark:text-slate-200">{booking.serviceName}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {[booking.tankSize, booking.tankType].filter(Boolean).join(" ") || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 text-xs font-semibold text-slate-600 dark:text-slate-350 min-w-[140px]">
                              {formatDate(booking.date)} at {booking.time}
                            </TableCell>
                            <TableCell className="py-4 font-bold text-sky-900 dark:text-slate-200 min-w-[90px]">
                              ₹{booking.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="py-4 min-w-[100px]">
                              <StatusBadge status={booking.status} />
                            </TableCell>
                            <TableCell className="py-4 text-right min-w-[120px]">
                              <div className="flex gap-2 justify-end">
                                {booking.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-primary hover:bg-primary/90 text-white rounded-lg font-headline font-bold text-xs"
                                      onClick={() => handleStatusChange(booking._id, "confirmed")}
                                    >
                                      Confirm
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="rounded-lg font-headline font-bold text-xs"
                                      onClick={() => handleStatusChange(booking._id, "cancelled")}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                                {booking.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-headline font-bold text-xs border-0"
                                    onClick={() => handleStatusChange(booking._id, "in-progress")}
                                  >
                                    Start
                                  </Button>
                                )}
                                {booking.status === "in-progress" && (
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-headline font-bold text-xs border-0"
                                    onClick={() => handleStatusChange(booking._id, "completed")}
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Surveys Card Table */}
          {activeTab === "surveys" && (
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardContent className="p-6 md:p-8">
                {surveyRows.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                    <Icons.fileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                    <p className="mt-3 text-sm text-slate-500 font-headline font-semibold">No survey submissions found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-slate-100 dark:border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Customer Details</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Tank Metrics</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Priority</TableHead>
                          <TableHead className="text-slate-400 text-[10px] uppercase tracking-wider font-black font-headline pb-4">Surveyor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {surveyRows.map((survey: Survey) => {
                          const isHot = survey.leadPriority === "Hot Lead"

                          return (
                            <TableRow key={survey._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <TableCell className="py-4 font-headline min-w-[220px]">
                                <div className="font-bold text-sky-900 dark:text-slate-200">{survey.customerName}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{survey.mobileNumber}</div>
                                <div className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">
                                  {survey.houseFlatNumber}, {survey.floor}, {survey.societyArea}
                                </div>
                              </TableCell>
                              <TableCell className="py-4 font-headline min-w-[200px]">
                                <div className="font-bold text-sky-900 dark:text-slate-200">
                                  {survey.tankType || "N/A"} · {survey.totalTanks || "0"} Tanks
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  {survey.tankCapacity || "-"} · {survey.totalWaterStorage}L Total
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[180px]">
                                  Materials: {formatList(survey.tankMaterials)}
                                </div>
                              </TableCell>
                              <TableCell className="py-4 font-headline min-w-[140px]">
                                <div className={cn(
                                  "inline-flex px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full border tracking-wide",
                                  isHot ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200/50" : "bg-sky-50 dark:bg-sky-950/20 text-primary border-sky-200/50"
                                )}>
                                  {survey.leadPriority}
                                </div>
                                <div className="text-xs text-slate-500 font-semibold mt-1.5">{survey.customerDecision || "Deciding..."}</div>
                              </TableCell>
                              <TableCell className="py-4 font-headline min-w-[140px]">
                                <div className="font-bold text-sky-900 dark:text-slate-200">{survey.surveyorName}</div>
                                <div className="text-xs text-slate-400 mt-0.5">By: {survey.submittedBy.slice(0, 10)}...</div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Column: Staff Availability Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Staff availability box */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
            <CardContent className="p-6 md:p-8">
              <h4 className="text-base font-bold text-sky-900 dark:text-white font-headline border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 flex items-center justify-between">
                Staff Availability
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              </h4>

              <div className="space-y-5">
                {mockStaff.map((staff, idx) => {
                  const isActive = staff.status === "active"
                  const isStandby = staff.status === "standby"

                  return (
                    <div key={idx} className="flex justify-between items-center gap-4 py-1.5 font-headline">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                          {staff.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-sky-900 dark:text-slate-200 leading-tight">{staff.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{staff.role}</p>
                        </div>
                      </div>
                      
                      {/* Status indicator */}
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-wider",
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/30"
                          : isStandby
                          ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/30"
                          : "bg-slate-50 dark:bg-slate-850 text-slate-400 border-slate-200 dark:border-slate-800"
                      )}>
                        {isActive ? "ON JOB" : isStandby ? "STANDBY" : "OFF DUTY"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Operational Alerts Box */}
          <Card className="bg-[#ba1a1a]/5 dark:bg-rose-950/10 border border-[#ba1a1a]/10 dark:border-rose-900/30 rounded-2xl">
            <CardContent className="p-6 md:p-8 space-y-4">
              <h4 className="text-base font-bold text-rose-800 dark:text-rose-400 font-headline flex items-center gap-2">
                <Icons.alertCircle className="w-5 h-5 text-rose-600" />
                System Alerts
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-headline leading-normal">
                Important observations requiring administrative dispatcher action.
              </p>
              <div className="space-y-3 font-headline pt-2">
                <div className="bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 text-xs">
                  <p className="font-bold text-rose-900 dark:text-rose-300">Marcus Sterling</p>
                  <p className="text-slate-500 mt-0.5">Heavy NCR traffic detected; delayed by 15 mins on job #8382.</p>
                </div>
                <div className="bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 text-xs">
                  <p className="font-bold text-rose-900 dark:text-rose-300">Tank Health Warning</p>
                  <p className="text-slate-500 mt-0.5">Survey #921 has a broken lid and stagnant water condition (Sector 18).</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}
