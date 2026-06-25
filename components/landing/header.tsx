"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth()
  const convexUser = useQuery(api.users.current)
  const isAdmin = convexUser?.role === "admin"

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm shadow-sky-900/5 border-b border-slate-200/50 transition-all duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Location Select - Left */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 md:w-11 md:h-11 transition-transform group-hover:scale-105">
                <img 
                  src="/icon.png" 
                  alt="Falkon Care Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-primary via-primary/90 to-foreground bg-clip-text text-transparent font-headline">
                Falkon Care
              </span>
            </Link>
            
            {/* Location selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/65 hover:bg-muted/80 text-foreground text-xs sm:text-sm font-semibold rounded-full cursor-pointer transition-colors border border-border/30">
              <Icons.mapPin className="w-3.5 h-3.5 text-primary" />
              <span>Delhi NCR</span>
              <Icons.chevronRight className="w-3 h-3 rotate-90 opacity-70" />
            </div>
          </div>

          {/* Desktop Navigation - Right */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-headline text-sm font-medium">
            <Link
              href="/"
              className={`text-slate-650 hover:text-primary transition-colors ${
                pathname === "/" ? "text-primary font-bold border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
            >
              Process
            </Link>
            <Link
              href="/#pricing"
              className="text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
            >
              Contact
            </Link>

            {/* Auth Block */}
            <div className="flex items-center gap-4 pl-4 border-l border-border/60">
              {!isAuthLoading && !isAuthenticated && (
                <>
                  <Button variant="ghost" size="sm" className="font-semibold text-sm hover:text-primary hover:bg-transparent" asChild>
                    <Link href="/signin">Login</Link>
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-md hover:shadow-lg rounded-xl transition-all" size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
              {!isAuthLoading && isAuthenticated && (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`text-sm font-semibold transition-colors hover:text-primary ${
                        pathname.startsWith("/admin") ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard/bookings"
                    className={`text-sm font-semibold transition-colors hover:text-primary ${
                      isActive("/dashboard/bookings") ? "text-primary font-bold" : "text-muted-foreground"
                    }`}
                  >
                    My Bookings
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold text-sm hover:text-primary hover:bg-transparent"
                    asChild
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Link href="/dashboard/profile" className="flex items-center">
                    {convexUser?.image || convexUser?.imageUrl ? (
                      <img
                        src={convexUser?.image || convexUser?.imageUrl}
                        alt="Profile"
                        className="w-8.5 h-8.5 rounded-full object-cover border border-primary/20 hover:border-primary/50 transition-all"
                      />
                    ) : (
                      <div className="w-8.5 h-8.5 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-all font-headline font-bold text-xs">
                        {(convexUser?.name || convexUser?.fullName || "U")[0]}
                      </div>
                    )}
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          {!mounted ? (
            <button className="md:hidden p-2 hover:bg-muted/50 rounded-lg transition-colors" aria-label="Menu">
              <Icons.menu className="w-5.5 h-5.5 text-foreground" />
            </button>
          ) : (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <Icons.menu className="w-5.5 h-5.5 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2">
                    <div className="relative w-8 h-8">
                      <img 
                        src="/icon.png" 
                        alt="Falkon Care Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    Falkon Care
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Home & Tank Cleaning Services in Delhi NCR
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/"
                      className={`px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between group ${
                        isActive("/") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                      {isActive("/") && <Icons.checkCircle className="w-4 h-4" />}
                    </Link>
                    <Link
                      href="/about"
                      className={`px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between group ${
                        isActive("/about") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register as Partner
                      {isActive("/about") && <Icons.checkCircle className="w-4 h-4" />}
                    </Link>
                    <Link
                      href="/#faq"
                      className="px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between text-muted-foreground hover:bg-muted/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Help
                      <Icons.arrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </nav>
                  
                  <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
                    {!isAuthLoading && !isAuthenticated && (
                      <>
                        <Button variant="outline" className="w-full font-semibold justify-center rounded-xl" asChild>
                          <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        </Button>
                        <Button className="w-full bg-primary text-primary-foreground font-bold justify-center rounded-xl shadow-md" asChild>
                          <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </Button>
                      </>
                    )}
                    {!isAuthLoading && isAuthenticated && (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className={`px-4 py-3 rounded-xl font-medium flex items-center justify-between ${
                              pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Admin
                            <Icons.shield className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href="/dashboard/bookings"
                          className="px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted/50 flex items-center justify-between"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <Button variant="outline" className="w-full font-semibold justify-center rounded-xl" asChild>
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                        </Button>
                        <Link href="/dashboard/profile" className="flex items-center justify-center py-2" onClick={() => setMobileMenuOpen(false)}>
                          {convexUser?.image || convexUser?.imageUrl ? (
                            <img
                              src={convexUser?.image || convexUser?.imageUrl}
                              alt="Profile"
                              className="w-9 h-9 rounded-full object-cover border border-primary/20"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm">
                              {(convexUser?.name || convexUser?.fullName || "U")[0]}
                            </div>
                          )}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
