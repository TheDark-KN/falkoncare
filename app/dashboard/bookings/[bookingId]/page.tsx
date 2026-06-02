"use client"

import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoaded } = useUser()

  const bookingId = params.bookingId as Id<"bookings">
  const booking = useQuery(api.bookings.getById, { id: bookingId })
  const cancelBooking = useMutation(api.bookings.cancel)


  if (!isLoaded || booking === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar title="Loading..." />
        <div className="flex items-center justify-center py-16">
          <Icons.loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (booking === null) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar title="Booking Not Found" />
        <div className="p-6 text-center">
          <p className="text-muted-foreground">The requested booking was not found.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/bookings")}>
            View All Bookings
          </Button>
        </div>
      </div>
    )
  }

  const handleCancelBooking = async () => {
    await cancelBooking({ id: bookingId })
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Booking Details" />

      <div className="p-6 max-w-2xl">
        <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground mb-6">
          <Icons.arrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Status Banner */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                <p className="font-mono text-foreground">{booking._id}</p>
              </div>
              <StatusBadge status={booking.status} className="text-sm px-4 py-1" />
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icons.droplets className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{booking.serviceName}</h3>
                {booking.tankSize && (
                  <p className="text-sm text-muted-foreground">
                    {booking.tankSize} {booking.tankType}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Icons.calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icons.clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <p className="font-medium text-foreground">{booking.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icons.mapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Service Address</p>
                  <p className="font-medium text-foreground">{booking.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-xl font-bold text-foreground flex items-center">
                <Icons.rupee className="w-5 h-5" />
                {booking.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-success">
              <Icons.checkCircle className="w-4 h-4" />
              <span className="text-sm">Paid via Wallet</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {booking.status === "completed" && (
            <Link href={`/dashboard/bookings/${booking._id}/feedback`} className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Icons.star className="w-4 h-4 mr-2" />
                Rate Service
              </Button>
            </Link>
          )}

          {["pending", "confirmed"].includes(booking.status) && (
            <Button variant="destructive" className="flex-1" onClick={handleCancelBooking}>
              <Icons.x className="w-4 h-4 mr-2" />
              Cancel Booking
            </Button>
          )}

          <Button variant="outline" className="flex-1 bg-transparent">
            <Icons.messageSquare className="w-4 h-4 mr-2" />
            Get Help
          </Button>
        </div>
      </div>
    </div>
  )
}
