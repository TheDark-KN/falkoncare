"use client"

import { useAppStore } from "@/lib/store"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface TopBarProps {
  title: string
  onMenuClick?: () => void
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const { user } = useUser()
  const convexUser = useQuery(api.users.current)
  const { notifications } = useAppStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 py-4 shadow-sm shadow-sky-900/5">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onMenuClick}
          >
            <Icons.menu className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-lg lg:text-xl font-bold font-headline text-sky-900 dark:text-white leading-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Wallet Balance */}
        {convexUser && (
          <Link href="/dashboard/wallet">
            <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-100/50 dark:border-sky-900/50 rounded-full cursor-pointer hover:bg-sky-100/50 dark:hover:bg-sky-900/40 transition-all duration-200">
              <Icons.wallet className="w-4 h-4 text-[#006194]" />
              <span className="text-sm font-bold text-[#006194] dark:text-sky-300 font-headline flex items-center gap-0.5">
                ₹{convexUser.walletBalance.toLocaleString()}
              </span>
            </div>
          </Link>
        )}

        {/* Notifications */}
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full w-10 h-10">
            <Icons.bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </Button>
        </Link>

        {/* Profile Details */}
        <Link href="/dashboard/profile">
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer group">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-sky-900 dark:text-white group-hover:text-primary transition-colors font-headline">
                {convexUser?.fullName || user?.fullName || "User"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                {convexUser?.role === "admin" ? "Administrator" : "Customer"}
              </p>
            </div>
            {convexUser?.imageUrl || user?.imageUrl ? (
              <img
                src={convexUser?.imageUrl || user?.imageUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all font-headline font-bold">
                {(convexUser?.fullName || user?.fullName || "U")[0]}
              </div>
            )}
          </div>
        </Link>
      </div>
    </header>
  )
}
