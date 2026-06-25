"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"

interface SidebarProps {
  userRole: "customer" | "admin" | "staff"
}

const customerNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Icons.home },
  { href: "/dashboard/bookings", label: "My Bookings", icon: Icons.calendar },
  { href: "/dashboard/services", label: "Book Service", icon: Icons.clipboardList },
  { href: "/dashboard/wallet", label: "Wallet", icon: Icons.wallet },
  { href: "/dashboard/profile", label: "Profile", icon: Icons.user },
  { href: "/dashboard/notifications", label: "Notifications", icon: Icons.bell },
]

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: Icons.home },
  { href: "/admin/bookings", label: "All Bookings", icon: Icons.calendar },
  { href: "/admin/staff", label: "Staff Management", icon: Icons.users },
  { href: "/admin/services", label: "Services", icon: Icons.clipboardList },
  { href: "/admin/customers", label: "Customers", icon: Icons.user },
  { href: "/admin/reports", label: "Reports", icon: Icons.barChart },
]

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  /* const { logout, notifications } = useAppStore() */
  const { notifications } = useAppStore()
  const { signOut } = useClerk()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = userRole === "admin" ? adminNavItems : customerNavItems
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const handleToggle = () => {
    setCollapsed(!collapsed)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-slate-50 dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-40 p-4",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64",
        )}
      >
        {/* Brand Area / Logo */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
              <Icons.droplets className="w-5 h-5 fill-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-black text-sky-900 dark:text-white leading-tight font-headline">Falkon Care</h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-headline">Water Hygiene Pro</p>
              </div>
            )}
          </Link>
          <button
            onClick={handleToggle}
            className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-slate-500"
          >
            {collapsed ? <Icons.chevronRight className="w-4 h-4" /> : <Icons.arrowLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              const showBadge = item.label === "Notifications" && unreadCount > 0

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg font-headline text-sm font-semibold transition-all duration-300 ease-in-out relative",
                      isActive
                        ? "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300"
                        : "text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50",
                    )}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                    {showBadge && (
                      <span
                        className={cn(
                          "absolute flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-destructive text-destructive-foreground",
                          collapsed ? "top-0 right-0" : "ml-auto",
                        )}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* New Cleaning Job CTA & Logout */}
        <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          {!collapsed && (
            <Link href="/dashboard/services">
              <Button className="w-full py-5 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/95 hover:to-primary/75 text-white rounded-xl font-headline font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 duration-200 flex items-center justify-center gap-2 border-0">
                <Icons.plus className="w-4 h-4" />
                New Cleaning Job
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-slate-500 hover:text-destructive hover:bg-destructive/10 font-headline font-semibold",
              collapsed && "justify-center px-2",
            )}
            onClick={handleLogout}
          >
            <Icons.logout className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
