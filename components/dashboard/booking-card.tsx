"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Icons } from "@/components/icons"
import { LocalBooking } from "@/lib/local-storage"
import Link from "next/link"

interface BookingCardProps {
  booking: LocalBooking
  showActions?: boolean
}

export function BookingCard({ booking, showActions = true }: BookingCardProps) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors ">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{booking.serviceName}</h3>
            <p className="text-sm text-muted-foreground">ID: {booking.id.slice(-8)}...</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icons.calendar className="w-4 h-4" />
            <span>
              {formattedDate} at {booking.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icons.mapPin className="w-4 h-4" />
            <span className="line-clamp-1">{booking.address}</span>
          </div>
          {booking.tankSize && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icons.droplets className="w-4 h-4" />
              <span>
                {booking.tankSize} {booking.tankType}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Icons.rupee className="w-4 h-4" />
            <span>₹{booking.amount.toLocaleString()}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Link href={`/dashboard/bookings/${booking.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Details
              </Button>
            </Link>
            {booking.status === "completed" && (
              <Link href={`/dashboard/bookings/${booking.id}/feedback`} className="flex-1">
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Rate Service
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
