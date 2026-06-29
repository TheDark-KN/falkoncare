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

  if (!user) {
    redirect("/signup")
  }

  // Authenticated but incomplete profile → complete-profile page
  const hasPhone = user.phone || user.phoneNumber
  const hasDob = user.dob
  if (!hasPhone || !hasDob) {
    redirect("/complete-profile")
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col lg:pl-60 md:pl-16 pl-0 pb-20 md:pb-0 pt-0">
      <Sidebar userRole={(user?.role as any) || "customer"} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
