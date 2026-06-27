"use client"

import { AdminTopBar } from "@/components/admin/admin-top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useAppStore } from "@/lib/store"
import { serviceItems } from "@/lib/mock-data"
import { RevenueMetrics } from "@/components/admin/revenue-metrics"
import Image from "next/image"
import dynamic from "next/dynamic"
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
)

export default function AdminReportsPage() {
  const { bookings, staff, feedback } = useAppStore()

  const completedBookings = bookings.filter((b) => b.status === "completed")
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0)
  const averageRating =
    feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : 0
  const averageBookingValue = bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0
  const pendingPayments = bookings
    .filter((b) => b.status === "pending" || b.status === "in-progress")
    .reduce((sum, b) => sum + b.amount, 0)

  // Service popularity
  const serviceCounts = serviceItems
    .map((service) => ({
      ...service,
      count: bookings.filter((b) => b.serviceId === service.id).length,
    }))
    .sort((a, b) => b.count - a.count)

  const weeklyRevenueData = [
    { name: "Mon", revenue: 2400, bookings: 8 },
    { name: "Tue", revenue: 3210, bookings: 12 },
    { name: "Wed", revenue: 2290, bookings: 6 },
    { name: "Thu", revenue: 2000, bookings: 9 },
    { name: "Fri", revenue: 2181, bookings: 11 },
    { name: "Sat", revenue: 2500, bookings: 14 },
    { name: "Sun", revenue: 2100, bookings: 7 },
  ]

  const monthlyBookingData = [
    { name: "Week 1", completed: 12, pending: 3, cancelled: 1 },
    { name: "Week 2", completed: 15, pending: 5, cancelled: 2 },
    { name: "Week 3", completed: 18, pending: 4, cancelled: 1 },
    { name: "Week 4", completed: 20, pending: 6, cancelled: 2 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminTopBar title="Reports & Analytics" />

      <div className="p-6 space-y-6">
        <RevenueMetrics
          totalRevenue={totalRevenue}
          monthlyGrowth={12}
          averageBookingValue={averageBookingValue}
          pendingPayments={pendingPayments}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <AnalyticsChart
            title="Weekly Revenue Trend"
            data={weeklyRevenueData}
            chartType="line"
            dataKey="revenue"
            color="#10b981"
          />
          <AnalyticsChart
            title="Booking Status Distribution"
            data={monthlyBookingData}
            chartType="bar"
            dataKey="completed"
            dataKey2="pending"
            color="#0ea5e9"
            color2="#f59e0b"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popular Services */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceCounts.slice(0, 5).map((service, index) => {
                  const maxCount = serviceCounts[0].count || 1
                  const percentage = (service.count / maxCount) * 100

                  return (
                    <div key={service.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground flex items-center">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary mr-2">
                            {index + 1}
                          </span>
                          {service.name}
                        </span>
                        <span className="text-sm font-semibold text-primary">{service.count} bookings</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Staff Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Staff Performance Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff
                  .map((member) => {
                    const memberBookings = bookings.filter((b) => b.staffId === member.id && b.status === "completed")
                    return { ...member, completedJobs: memberBookings.length }
                  })
                  .sort((a, b) => b.completedJobs - a.completedJobs)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <Image
                          src={member.photo || "/placeholder.svg"}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <div className="flex items-center gap-1">
                            <Icons.star className="w-3 h-3 fill-warning text-warning" />
                            <span className="text-xs text-muted-foreground">{member.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{member.completedJobs}</p>
                        <p className="text-xs text-muted-foreground">completed</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Status Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Booking Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { status: "pending", label: "Pending", color: "warning", icon: Icons.clock },
                { status: "confirmed", label: "Confirmed", color: "primary", icon: Icons.checkCircle },
                { status: "in-progress", label: "In Progress", color: "accent", icon: Icons.activity },
                { status: "completed", label: "Completed", color: "success", icon: Icons.check },
                { status: "cancelled", label: "Cancelled", color: "destructive", icon: Icons.x },
              ].map(({ status, label, color, icon: IconComponent }) => {
                const count = bookings.filter((b) => b.status === status).length
                const percentage = bookings.length > 0 ? ((count / bookings.length) * 100).toFixed(0) : 0

                return (
                  <div key={status} className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                    <div
                      className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center mx-auto mb-2`}
                    >
                      <IconComponent className={`w-5 h-5 text-${color}`} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-sm text-muted-foreground mt-1">{label}</p>
                    <p className="text-xs text-muted-foreground">{percentage}%</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Customer Satisfaction & Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2 flex items-center justify-center">
                  {averageRating}
                  <Icons.star className="w-8 h-8 fill-warning text-warning ml-2" />
                </div>
                <p className="text-muted-foreground">{feedback.length} total reviews</p>
              </div>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const starFeedback = feedback.filter((f) => f.rating === stars).length
                  const percentage = feedback.length > 0 ? ((starFeedback / feedback.length) * 100).toFixed(0) : 0

                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warning rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{starFeedback}</span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2">
                <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                  <p className="text-3xl font-bold text-success mb-1">{feedback.filter((f) => f.rating >= 4).length}</p>
                  <p className="text-sm text-muted-foreground">Positive reviews (4-5 stars)</p>
                </div>
                <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
                  <p className="text-3xl font-bold text-warning mb-1">
                    {feedback.filter((f) => f.rating === 3).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Neutral reviews (3 stars)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
