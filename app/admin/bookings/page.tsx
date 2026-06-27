"use client"

import { useState } from "react"
import Image from "next/image"
import { AdminTopBar } from "@/components/admin/admin-top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { useAppStore } from "@/lib/store"
import { mockStaff } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/lib/types"

export default function AdminBookingsPage() {
  const { bookings, staff, updateBookingStatus, assignStaff } = useAppStore()
  const [filter, setFilter] = useState<BookingStatus | "all">("all")
  const [assigningBooking, setAssigningBooking] = useState<string | null>(null)

  const filteredBookings = filter === "all" ? bookings : bookings.filter((b) => b.status === filter)

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status)
  }

  const handleAssignStaff = (bookingId: string, staffId: string) => {
    assignStaff(bookingId, staffId)
    setAssigningBooking(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminTopBar title="Booking Management" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(["all", "pending", "confirmed", "in-progress", "completed", "cancelled"] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
                className={cn(
                  filter === status ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                )}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                {status !== "all" && (
                  <span className="ml-1 text-xs">({bookings.filter((b) => b.status === status).length})</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Booking ID</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Staff</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const assignedStaff = booking.staffId ? mockStaff.find((s) => s.id === booking.staffId) : null
                    const availableStaff = staff.filter((s) => s.status === "available")

                    return (
                      <tr key={booking.id} className="border-b border-border last:border-0">
                        <td className="p-4">
                          <span className="font-mono text-sm text-foreground">{booking.id}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">{booking.serviceName}</p>
                            {booking.tankSize && (
                              <p className="text-sm text-muted-foreground">
                                {booking.tankSize} {booking.tankType}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-foreground">
                              {new Date(booking.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-foreground flex items-center">
                            <Icons.rupee className="w-3 h-3" />
                            {booking.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4">
                          {assigningBooking === booking.id ? (
                            <Select onValueChange={(value) => handleAssignStaff(booking.id, value)}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select Staff" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableStaff.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : assignedStaff ? (
                            <div className="flex items-center gap-2">
                              <Image
                                src={assignedStaff.photo || "/placeholder.svg"}
                                alt={assignedStaff.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-sm text-foreground">{assignedStaff.name}</span>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setAssigningBooking(booking.id)}>
                              Assign Staff
                            </Button>
                          )}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {booking.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-success hover:bg-success/90 text-success-foreground"
                                onClick={() => handleStatusChange(booking.id, "confirmed")}
                              >
                                Confirm
                              </Button>
                            )}
                            {booking.status === "confirmed" && (
                              <Button size="sm" onClick={() => handleStatusChange(booking.id, "in-progress")}>
                                Start
                              </Button>
                            )}
                            {booking.status === "in-progress" && (
                              <Button
                                size="sm"
                                className="bg-success hover:bg-success/90 text-success-foreground"
                                onClick={() => handleStatusChange(booking.id, "completed")}
                              >
                                Complete
                              </Button>
                            )}
                            {["pending", "confirmed"].includes(booking.status) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusChange(booking.id, "cancelled")}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Icons.calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
