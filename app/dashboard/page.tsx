"use client"

import { TopBar } from "@/components/dashboard/top-bar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { BookingCard } from "@/components/dashboard/booking-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
// import { useAppStore } from "@/lib/store"
import Link from "next/link"
// import { LocalBookingManager } from "@/lib/local-storage"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function DashboardPage() {
  const { isLoaded } = useUser()

  // Use Convex queries
  const bookings = useQuery(api.bookings.getByUser)
  const convexUser = useQuery(api.users.current)

  // Show loading state while user is loading
  if (!isLoaded || bookings === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar title="Dashboard" />
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Icons.loader className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Format bookings for display (handle _id)
  const formattedBookings = (bookings || []).map(b => ({
    ...b,
    id: b._id,
    tankSize: b.tankSize || undefined,
    tankType: b.tankType || undefined
  }))

  const activeBookings = formattedBookings.filter((b) => ["pending", "confirmed", "in-progress"].includes(b.status))
  const completedBookings = formattedBookings.filter((b) => b.status === "completed")
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Premium Welcome Section */}
        <div className="relative rounded-3xl p-8 overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0891b2] to-[#14b8a6] border border-white/20 shadow-2xl">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
              Ask Falkon, {convexUser?.fullName?.split(" ")[0] || "User"}! <Icons.sparkles className="w-6 h-6 text-amber-300" />
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-xl">
              Your water tanks are in expert hands. Secure scheduling, instant tracking, and guaranteed purity.
            </p>
            <div className="flex gap-4">
               <Link href="/dashboard/services">
                 <Button className="bg-white text-[#0891b2] hover:bg-white/90 shadow-lg rounded-full px-8 font-semibold transition-all hover:scale-105 active:scale-95">
                   Book New Service
                   <Icons.arrowRight className="w-4 h-4 ml-2" />
                 </Button>
               </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Active Bookings" value={activeBookings.length} icon={Icons.calendar} />
          <StatsCard title="Completed Services" value={completedBookings.length} icon={Icons.checkCircle} />
          <StatsCard
            title="Wallet Balance"
            value={`₹${convexUser?.walletBalance?.toLocaleString() || 0}`}
            icon={Icons.wallet}
          />
          <StatsCard title="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={Icons.trending} />
        </div>

        {/* Upcoming Bookings */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Upcoming Bookings</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <Icons.chevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeBookings.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {activeBookings.slice(0, 2).map((booking) => (
                  // @ts-ignore
                  <BookingCard key={booking.id} booking={booking as any} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icons.calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                <Link href="/dashboard/services">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Book a Service</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/services">
            <Card className="bg-card border-border hover:border-primary/30 cursor-pointer transition-colors h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icons.droplets className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Book Service</h3>
                  <p className="text-sm text-muted-foreground">Schedule tank cleaning</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/wallet">
            <Card className="bg-card border-border hover:border-primary/30 cursor-pointer transition-colors h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Icons.wallet className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Add Money</h3>
                  <p className="text-sm text-muted-foreground">Recharge your wallet</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/profile">
            <Card className="bg-card border-border hover:border-primary/30 cursor-pointer transition-colors h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Icons.user className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Profile</h3>
                  <p className="text-sm text-muted-foreground">Update your details</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
