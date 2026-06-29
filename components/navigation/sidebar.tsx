"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"

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

const customerTabs = [
  { href: "/dashboard", label: "Home", icon: Icons.home },
  { href: "/dashboard/services", label: "Services", icon: Icons.clipboardList },
  { href: "/dashboard/bookings", label: "Orders", icon: Icons.calendar },
  { href: "/dashboard/wallet", label: "Wallet", icon: Icons.wallet },
  { href: "/dashboard/profile", label: "Profile", icon: Icons.user },
]

const adminTabs = [
  { href: "/admin", label: "Home", icon: Icons.home },
  { href: "/admin/bookings", label: "Bookings", icon: Icons.calendar },
  { href: "/admin/staff", label: "Staff", icon: Icons.users },
  { href: "/admin/customers", label: "Customers", icon: Icons.user },
  { href: "/admin/reports", label: "Reports", icon: Icons.barChart },
]

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { notifications } = useAppStore()
  const { signOut } = useAuthActions()
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isAdminPath = pathname.startsWith("/admin")
  const navItems = isAdminPath ? adminNavItems : customerNavItems
  const tabs = isAdminPath ? adminTabs : customerTabs
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return
    const handler = () => {
      const isShrunk = window.visualViewport!.height < window.innerHeight * 0.85
      setKeyboardOpen(isShrunk)
    }
    window.visualViewport.addEventListener("resize", handler)
    return () => window.visualViewport?.removeEventListener("resize", handler)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <>
      {/* 1. Desktop Sidebar (>=1024px) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 xl:w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 flex-col z-40 p-4 justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <Icons.droplets className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <h1 className="text-base font-black text-sky-950 dark:text-white leading-tight font-headline">FalkonCare</h1>
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold font-headline">Water Hygiene Pro</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              const showBadge = item.label === "Notifications" && unreadCount > 0

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-headline text-sm font-semibold transition-all duration-200 relative",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {showBadge && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-red-500 text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom logout */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
          {!isAdminPath && (
            <Link href="/dashboard/services" className="block">
              <Button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-headline font-bold text-xs shadow-md shadow-blue-500/10 active:scale-95 duration-200 flex items-center justify-center gap-1.5 border-0">
                <Icons.plus className="w-4 h-4" /> Book Service
              </Button>
            </Link>
          )}
          {!isAdminPath && userRole === "admin" && (
            <Link href="/admin" className="block">
              <Button className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-headline font-bold text-xs shadow-md shadow-rose-500/10 active:scale-95 duration-200 flex items-center justify-center gap-1.5 border-0">
                <Icons.shield className="w-4 h-4" /> Admin Panel
              </Button>
            </Link>
          )}
          {isAdminPath && userRole === "admin" && (
            <Link href="/dashboard" className="block">
              <Button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-headline font-bold text-xs shadow-md shadow-indigo-500/10 active:scale-95 duration-200 flex items-center justify-center gap-1.5 border-0">
                <Icons.user className="w-4 h-4" /> Customer View
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 font-headline font-semibold rounded-xl"
          >
            <Icons.logout className="w-5 h-5 text-slate-500 hover:text-red-600" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* 2. Tablet Sidebar (768px-1023px) */}
      <aside className="hidden md:flex lg:hidden fixed left-0 top-0 h-screen w-16 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 flex-col z-40 p-3 justify-between items-center">
        <div className="space-y-6 w-full flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
            <Icons.droplets className="w-5 h-5 fill-white text-white" />
          </Link>

          {/* Navigation icons */}
          <nav className="space-y-2 w-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              const showBadge = item.label === "Notifications" && unreadCount > 0

              return (
                <div key={item.href} className="relative group flex justify-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 relative",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                    )}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {showBadge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </Link>

                  {/* Tooltip on hover */}
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold font-headline rounded-lg px-2.5 py-1.5 shadow-md scale-0 group-hover:scale-100 transition-all origin-left whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom logout icon */}
        <div className="w-full flex flex-col items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          {!isAdminPath && (
            <Link href="/dashboard/services" className="relative group">
              <button className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 duration-200">
                <Icons.plus className="w-5 h-5" />
              </button>
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold font-headline rounded-lg px-2.5 py-1.5 shadow-md scale-0 group-hover:scale-100 transition-all origin-left whitespace-nowrap z-50">
                Book Service
              </div>
            </Link>
          )}
          {!isAdminPath && userRole === "admin" && (
            <Link href="/admin" className="relative group">
              <button className="w-11 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 duration-200">
                <Icons.shield className="w-5 h-5" />
              </button>
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold font-headline rounded-lg px-2.5 py-1.5 shadow-md scale-0 group-hover:scale-100 transition-all origin-left whitespace-nowrap z-50">
                Admin Panel
              </div>
            </Link>
          )}
          {isAdminPath && userRole === "admin" && (
            <Link href="/dashboard" className="relative group">
              <button className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 duration-200">
                <Icons.user className="w-5 h-5" />
              </button>
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold font-headline rounded-lg px-2.5 py-1.5 shadow-md scale-0 group-hover:scale-100 transition-all origin-left whitespace-nowrap z-50">
                Customer View
              </div>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 relative group transition-colors"
          >
            <Icons.logout className="w-5 h-5" />
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold font-headline rounded-lg px-2.5 py-1.5 shadow-md scale-0 group-hover:scale-100 transition-all origin-left whitespace-nowrap z-50">
              Logout
            </div>
          </button>
        </div>
      </aside>

      {/* 3. Mobile Bottom Tab Bar (<768px) */}
      {!keyboardOpen && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-950 border-t border-slate-150/80 dark:border-slate-850/80 flex items-center justify-around z-40 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            const IconComponent = tab.icon

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-semibold mt-1 font-headline tracking-tight">{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </>
  )
}
