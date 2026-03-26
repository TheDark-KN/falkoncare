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
          "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-40",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                 <img src="/icon.png" alt="Falkon Care" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Falkon Care</span>
            </Link>
          )}
          <button
            onClick={handleToggle}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
          >
            {collapsed ? <Icons.chevronRight className="w-5 h-5" /> : <Icons.arrowLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              const showBadge = item.label === "Notifications" && unreadCount > 0

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
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

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
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
