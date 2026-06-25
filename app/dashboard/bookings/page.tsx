"use client"

import { useState } from "react"
import { TopBar } from "@/components/dashboard/top-bar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { BookingCard } from "@/components/dashboard/booking-card"
// import { LocalBookingManager, LocalBooking } from "@/lib/local-storage"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { DisplayBooking } from "@/lib/types"
import type { Doc } from "@/convex/_generated/dataModel"

type FilterType = "all" | "active" | "completed" | "cancelled"

export default function BookingsPage() {
  const bookings = useQuery(api.bookings.getByUser)
  const [filter, setFilter] = useState<FilterType>("all")

  // Map Convex bookings to DisplayBooking shape
  const formattedBookings: DisplayBooking[] = (bookings || []).map((b: Doc<"bookings">) => ({
    ...b,
    id: b._id as string,
    tankSize: b.tankSize || undefined,
    tankType: b.tankType || undefined
  }))

  const isLoading = bookings === undefined

  const filteredBookings = formattedBookings.filter((booking) => {
    if (filter === "all") return true
    if (filter === "active") return ["pending", "confirmed", "in-progress"].includes(booking.status)
    if (filter === "completed") return booking.status === "completed"
    if (filter === "cancelled") return booking.status === "cancelled"
    return true
  })

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ]



  return (
    <div className="min-h-screen bg-background">
      <TopBar title="My Bookings" />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.value)}
                className={cn(
                  filter === f.value ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                )}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <Link href="/dashboard/services">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Icons.plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Icons.loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Icons.calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all" ? "You haven't made any bookings yet." : `No ${filter} bookings found.`}
            </p>
            <Link href="/dashboard/services">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Book Your First Service
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
