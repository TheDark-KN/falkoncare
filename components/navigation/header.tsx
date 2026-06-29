"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { NotificationBell } from "@/components/notifications/NotificationBell"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#coverage", label: "Coverage" },
  { href: "/about", label: "About" },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuthActions()
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth()
  const convexUser = useQuery(api.users.current)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    if (!profileDropdownOpen) return
    const handleClickOutside = () => setProfileDropdownOpen(false)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [profileDropdownOpen])

  const handleLogout = async () => {
    await signOut()
    toastNotify("Signed out successfully.")
    router.push("/")
  }

  const toastNotify = (msg: string) => {
    // Lazy notify via standard console or simple alert if toast isn't imported, but toast from 'sonner' is safe
    import("sonner").then(({ toast }) => toast.success(msg))
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-150/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src="/icon.png"
                    alt="FalkonCare Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold font-headline text-sky-900 dark:text-white tracking-tight">
                  FalkonCare
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links (>=1024px) */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-blue-600 font-headline",
                    pathname === link.href ? "text-blue-600 font-semibold" : "text-gray-600 dark:text-slate-300"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Authed / Not Authed Actions (>=1024px) */}
            <div className="hidden lg:flex items-center gap-4">
              {!isAuthLoading && isAuthenticated ? (
                <div className="flex items-center gap-3 relative">
                  {/* Book Now Button */}
                  <Link href="/dashboard/services">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-headline font-bold">
                      Book Now
                    </Button>
                  </Link>

                  <NotificationBell />

                  {/* Profile Dropdown Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setProfileDropdownOpen(!profileDropdownOpen)
                    }}
                    className="flex items-center gap-1.5 focus:outline-none"
                  >
                    {convexUser?.image || convexUser?.imageUrl ? (
                      <Image
                        src={convexUser.image || convexUser.imageUrl}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover border border-blue-100"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-headline font-bold text-sm border border-blue-100">
                        {(convexUser?.name || convexUser?.fullName || "U")[0]}
                      </div>
                    )}
                  </button>

                  {/* Desktop Dropdown Card */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-12 w-48 rounded-xl border border-gray-100 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 space-y-1">
                      <div className="px-3 py-1.5 border-b border-gray-50 dark:border-slate-800">
                        <p className="text-xs font-bold text-sky-950 dark:text-white truncate">
                          {convexUser?.name || convexUser?.fullName || "User"}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {convexUser?.email || ""}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/signin" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors font-headline">
                    Sign In
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-headline font-bold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburg Trigger (<1024px) */}
            <div className="flex lg:hidden items-center">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 focus:outline-none"
                aria-label="Toggle menu"
              >
                <Icons.menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen slide-in menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 flex flex-col justify-between">
            {/* Top Logo + Close */}
            <div>
              <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <div className="relative w-7 h-7">
                    <Image
                      src="/icon.png"
                      alt="FalkonCare Logo"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-base font-bold font-headline text-sky-950 dark:text-white">
                    FalkonCare
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-50"
                >
                  <Icons.x className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col py-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex h-14 items-center px-6 text-base font-medium border-b border-gray-50 dark:border-slate-900 transition-colors font-headline",
                      pathname === link.href
                        ? "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/10"
                        : "text-gray-800 dark:text-slate-200"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Authed Dashboard Links */}
                {!isAuthLoading && isAuthenticated && (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex h-14 items-center px-6 text-base font-medium border-b border-gray-50 dark:border-slate-900 transition-colors font-headline",
                        pathname.startsWith("/dashboard") ? "text-blue-600 font-bold bg-blue-50/50" : "text-gray-800 dark:text-slate-200"
                      )}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex h-14 items-center px-6 text-base font-medium border-b border-gray-50 dark:border-slate-900 text-gray-800 dark:text-slate-200 font-headline"
                    >
                      Profile Settings
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 space-y-3">
              {!isAuthLoading && isAuthenticated ? (
                <>
                  <Link href="/dashboard/services" onClick={() => setMenuOpen(false)} className="block">
                    <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-headline font-bold text-base min-h-[44px]">
                      Book Now
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-rose-600 font-headline font-bold text-sm min-h-[44px]"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setMenuOpen(false)} className="block">
                    <Button variant="outline" className="w-full py-6 rounded-xl font-headline font-semibold text-sm border-gray-200 min-h-[44px]">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="block">
                    <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-headline font-bold text-sm shadow-md min-h-[44px]">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
