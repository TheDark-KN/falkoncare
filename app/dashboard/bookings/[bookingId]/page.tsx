"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Format Date Helper
function formatDate(value: number) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()

  const bookingId = params.bookingId as Id<"bookings">
  const booking = useQuery(api.bookings.getById, { id: bookingId })
  const cancelBooking = useMutation(api.bookings.cancel)
  const rescheduleBooking = useMutation(api.bookings.reschedule)

  const [showReschedule, setShowReschedule] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [isRescheduling, setIsRescheduling] = useState(false)

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast.error("Please pick both a date and a time slot")
      return
    }
    setIsRescheduling(true)
    try {
      await rescheduleBooking({
        id: bookingId,
        date: new Date(newDate).getTime(),
        time: newTime,
      })
      toast.success("Booking rescheduled successfully ✓")
      setShowReschedule(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reschedule booking"
      toast.error(msg)
    } finally {
      setIsRescheduling(false)
    }
  }

  const handleCancelBooking = async () => {
    try {
      await cancelBooking({ id: bookingId })
      toast.success("Booking cancelled successfully")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel booking"
      toast.error(msg)
    }
  }

  if (booking === undefined) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950">
        <TopBar title="Loading Details..." />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icons.loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-slate-500 font-headline font-semibold">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (booking === null) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950">
        <TopBar title="Booking Not Found" />
        <div className="p-8 text-center max-w-md mx-auto mt-20">
          <Icons.alertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-slate-500 font-headline font-semibold">The requested booking does not exist.</p>
          <Button className="mt-6 rounded-xl font-headline font-bold" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Reschedule validation helpers
  const getSlotStartHour = (timeSlot: string): number => {
    const slot = timeSlot.toLowerCase();
    if (slot.includes("morning") || slot.includes("8")) return 8;
    if (slot.includes("noon") || slot.includes("12")) return 12;
    if (slot.includes("evening") || slot.includes("4") || slot.includes("16")) return 16;
    return 9;
  };

  const bookingStartTime = booking.date + getSlotStartHour(booking.time) * 60 * 60 * 1000;
  const now = Date.now();
  const canReschedule = bookingStartTime <= now || (bookingStartTime - now >= 4 * 60 * 60 * 1000);

  // Calculate progress details based on status
  const status = booking.status
  const isCompleted = status === "completed"
  const isInProgress = status === "in-progress"
  const isCancelled = status === "cancelled"
  const isConfirmed = status === "confirmed" || status === "pending"

  // Progress Bar Width
  const progressPercent = isCompleted ? 100 : isInProgress ? 70 : isConfirmed ? 35 : 0

  // Status message
  const statusTitle = 
    isCompleted ? "Service Completed" : 
    isInProgress ? "Service In Progress" : 
    isCancelled ? "Booking Cancelled" : "Booking Confirmed"

  const statusDesc = 
    isCompleted ? `Sanitization complete. Certified by inspector.` : 
    isInProgress ? "Technician is on-site and sterilizing your water storage." : 
    isCancelled ? "This service appointment has been cancelled." :
    `Technician assignment in progress. Arrival scheduled for ${booking.time}.`

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col">
      <TopBar title="Booking Details" />

      {/* Main Content Canvas */}
      <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 font-headline">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Icons.chevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/dashboard/bookings" className="hover:text-primary transition-colors">Bookings</Link>
          <Icons.chevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300">Booking #{booking._id.slice(0, 8)}</span>
        </nav>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column: Status and Map Placeholder */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            
            {/* Live Tracking Status Card */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5">
              <div className="flex justify-between items-start mb-10 flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-headline font-black text-sky-900 dark:text-white tracking-tight">
                    {statusTitle}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 flex items-center gap-2 font-medium">
                    <Icons.clock className="w-4 h-4 text-primary" />
                    {statusDesc}
                  </p>
                </div>
                {!isCancelled && (
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-sky-50 dark:bg-slate-800 text-primary rounded-full text-[10px] font-black tracking-wider flex items-center gap-1.5 font-headline border border-sky-100/50">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      {status === "in-progress" ? "LIVE ON-SITE" : "SCHEDULED"}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Stepper Tracker */}
              <div className="relative pt-1">
                <div className="flex mb-4 items-center justify-between font-headline">
                  
                  {/* Step 1: Confirmed */}
                  <div className="flex-1 text-center">
                    <div className={cn(
                      "w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 border-2",
                      isConfirmed || isInProgress || isCompleted
                        ? "bg-primary border-primary text-white"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                    )}>
                      <Icons.check className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold">Confirmed</p>
                  </div>

                  <div className={cn(
                    "flex-1 h-[2px] mx-2 -mt-6",
                    isInProgress || isCompleted ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                  )}></div>

                  {/* Step 2: En Route */}
                  <div className="flex-1 text-center">
                    <div className={cn(
                      "w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 border-2",
                      isInProgress || isCompleted
                        ? "bg-primary border-primary text-white"
                        : isConfirmed
                        ? "bg-primary/10 border-primary/20 text-primary ring-4 ring-primary/10"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                    )}>
                      <Icons.calendarDays className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold">En Route</p>
                  </div>

                  <div className={cn(
                    "flex-1 h-[2px] mx-2 -mt-6",
                    isCompleted ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                  )}></div>

                  {/* Step 3: Service */}
                  <div className="flex-1 text-center">
                    <div className={cn(
                      "w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 border-2",
                      isCompleted
                        ? "bg-primary border-primary text-white"
                        : isInProgress
                        ? "bg-primary/10 border-primary/20 text-primary ring-4 ring-primary/10"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                    )}>
                      <Icons.droplets className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold">Service</p>
                  </div>

                  <div className={cn(
                    "flex-1 h-[2px] mx-2 -mt-6",
                    isCompleted ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                  )}></div>

                  {/* Step 4: Complete */}
                  <div className="flex-1 text-center">
                    <div className={cn(
                      "w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 border-2",
                      isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                    )}>
                      <Icons.checkCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold">Complete</p>
                  </div>

                </div>

                {/* Progress bar background wrapper */}
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>

            {/* Simulated Map Tracker Box */}
            <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm aspect-[16/9] relative border border-slate-300/30 dark:border-slate-700/30">
              {/* Map mockup background */}
              <div className="absolute inset-0 bg-cover bg-center grayscale-[0.2] opacity-80 bg-slate-50 dark:bg-slate-900">
                {/* Fallback pattern representing streets */}
                <div className="w-full h-full bg-[#f2f4f6] dark:bg-slate-950 flex items-center justify-center relative">
                  <div className="absolute w-[2px] h-full bg-white dark:bg-slate-850 left-1/4"></div>
                  <div className="absolute w-[2px] h-full bg-white dark:bg-slate-850 left-2/3"></div>
                  <div className="absolute w-full h-[2px] bg-white dark:bg-slate-850 top-1/3"></div>
                  <div className="absolute w-full h-[2px] bg-white dark:bg-slate-850 top-3/4"></div>
                  
                  {/* Route tracking path line */}
                  <svg className="absolute w-full h-full top-0 left-0">
                    <path d="M 200 400 L 200 150 L 500 150" fill="none" stroke="#006194" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 5" className="animate-[dash_10s_linear_infinite]" />
                  </svg>
                  
                  {/* Pin location */}
                  <div className="absolute top-[138px] left-[488px] w-6 h-6 bg-primary rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <Icons.mapPin className="w-3 h-3 text-white fill-white" />
                  </div>

                  {/* Technician vehicle icon moving */}
                  <div className="absolute top-[280px] left-[188px] w-10 h-10 bg-[#006a61] rounded-2xl border-2 border-white flex items-center justify-center shadow-2xl animate-bounce">
                    <Icons.wrench className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating Map Details Card */}
              <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center gap-4 border border-white/50 dark:border-slate-800/50">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icons.mapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-headline">Service Destination</p>
                  <p className="font-bold text-sm text-sky-900 dark:text-white font-headline leading-tight truncate max-w-[200px]">
                    {booking.address.split(",")[0] || "Jaipur City"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Appointment & Technician Info */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            
            {/* Technician Profile Card */}
            {!isCancelled && (
              <Card className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm border-t-4 border-primary">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-850 flex items-center justify-center border-2 border-primary/10">
                    <Icons.user className="w-12 h-12 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg text-sky-900 dark:text-white">Marcus Sterling</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Water Hygiene Tech</p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-amber-500">
                    <Icons.star className="w-4 h-4 fill-amber-500" />
                    <Icons.star className="w-4 h-4 fill-amber-500" />
                    <Icons.star className="w-4 h-4 fill-amber-500" />
                    <Icons.star className="w-4 h-4 fill-amber-500" />
                    <Icons.star className="w-4 h-4 fill-amber-500" opacity={0.5} />
                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 ml-1">4.8</span>
                  </div>

                  {/* Actions buttons */}
                  <div className="w-full grid grid-cols-2 gap-3 pt-2">
                    <a href={`tel:+917011365481`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl py-5 font-headline font-bold flex items-center justify-center gap-1.5">
                        <Icons.phone className="w-4 h-4" /> Call
                      </Button>
                    </a>
                    <a href={`https://wa.me/917011365481`} className="flex-1" target="_blank" rel="noreferrer">
                      <Button variant="outline" className="w-full rounded-xl py-5 font-headline font-bold flex items-center justify-center gap-1.5">
                        <Icons.messageCircle className="w-4 h-4" /> Chat
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {/* Service details summary card */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <h4 className="text-base font-bold text-sky-900 dark:text-white font-headline border-b border-slate-100 dark:border-slate-800 pb-3">
                  Service Details
                </h4>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Icons.droplets className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-headline">Service Booked</p>
                      <p className="font-bold text-sm text-sky-900 dark:text-white leading-tight">{booking.serviceName}</p>
                      {booking.tankSize && (
                        <p className="text-xs text-slate-500 mt-0.5">{booking.tankSize} {booking.tankType || "Overhead"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Icons.calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-headline">Scheduled On</p>
                      <p className="font-bold text-sm text-sky-900 dark:text-white leading-tight">{formatDate(booking.date)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Time window: {booking.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Icons.mapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-headline">Address</p>
                      <p className="font-bold text-xs text-slate-700 dark:text-slate-300 leading-normal">{booking.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Icons.wallet className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-headline">Price Paid</p>
                      <p className="font-black text-sm text-sky-900 dark:text-white flex items-center">
                        ₹{booking.amount.toLocaleString()}
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full font-bold ml-2 uppercase tracking-wide border border-emerald-100/50">
                          {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operations CTAs */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {["pending", "confirmed", "rescheduled"].includes(booking.status) && canReschedule && (
                    <Button
                      variant="outline"
                      className="w-full py-5 rounded-xl font-headline font-bold text-sky-600 hover:text-white dark:text-sky-400 border-sky-200 hover:bg-sky-600 dark:border-sky-900 flex items-center justify-center gap-2"
                      onClick={() => setShowReschedule(true)}
                    >
                      <Icons.edit className="w-4 h-4" /> Reschedule Booking
                    </Button>
                  )}

                  {["pending", "confirmed", "rescheduled"].includes(booking.status) && (
                    <Button
                      variant="destructive"
                      className="w-full py-5 rounded-xl font-headline font-bold text-white shadow-md active:scale-95 duration-200 border-0 flex items-center justify-center gap-2"
                      onClick={handleCancelBooking}
                    >
                      <Icons.x className="w-4 h-4" /> Cancel Booking
                    </Button>
                  )}

                  <Link href={`https://wa.me/917011365481?text=I%20need%20help%20with%20booking%20%23${booking._id}`} target="_blank" rel="noreferrer" className="block">
                    <Button
                      variant="outline"
                      className="w-full py-5 rounded-xl font-headline font-bold text-slate-600 hover:text-sky-900 dark:text-slate-300 dark:hover:text-white border-slate-200 hover:bg-slate-50 dark:border-slate-800 flex items-center justify-center gap-2"
                    >
                      <Icons.messageSquare className="w-4 h-4" /> Get Help / Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>

      {showReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-headline font-bold text-sky-900 dark:text-white mb-4 flex items-center gap-2">
              <Icons.calendarDays className="w-5 h-5 text-primary" /> Reschedule Booking
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Pick a Date</label>
                <input
                  type="date"
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Start from tomorrow
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Select Time Window</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: "morning_8_11", label: "Morning (8 AM - 11 AM)" },
                    { value: "noon_12_3", label: "Noon (12 PM - 3 PM)" },
                    { value: "evening_4_7", label: "Evening (4 PM - 7 PM)" }
                  ].map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setNewTime(slot.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-sm font-headline font-bold text-left transition-all duration-200",
                        newTime === slot.value
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      )}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowReschedule(false)}
                className="flex-1 rounded-xl py-5"
                disabled={isRescheduling}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                className="flex-1 rounded-xl py-5 bg-primary hover:bg-primary/90 text-white font-headline font-bold"
                disabled={isRescheduling}
              >
                {isRescheduling ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <Icons.loader className="w-4 h-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Confirm ✓"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
