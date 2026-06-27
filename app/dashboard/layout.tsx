import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { api } from "@/convex/_generated/api"
import { redirect } from "next/navigation"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await convexAuthNextjsToken()

  // Not authenticated → send to signin
  if (!token) {
    redirect("/signin?redirect_url=/dashboard")
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  convex.setAuth(token)

  const user = await convex.query(api.users.current)

  // Authenticated but incomplete profile → complete-profile page
  const hasPhone = user?.phone || user?.phoneNumber
  const hasDob = user?.dob
  if (!hasPhone || !hasDob) {
    redirect("/complete-profile")
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={(user?.role as any) || "customer"} />
      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  )
}
