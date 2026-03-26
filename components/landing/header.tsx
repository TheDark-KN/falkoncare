"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => pathname === path
  const isHashActive = (hash: string) => false // Hash navigation is harder to track server-side, keeping simple for now

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Improved logo styling with better visual weight */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 group-hover:shadow-lg transition-shadow">
              <img 
                src="/icon.png" 
                alt="Falkon Care Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Falkon Care
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/services"
              className={`px-4 py-2 transition-colors font-medium relative group ${isActive("/services") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Services
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 ${isActive("/services") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
              />
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 transition-colors font-medium relative group ${isActive("/about") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              About
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 ${isActive("/about") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
              />
            </Link>
            <Link
              href="/careers"
              className={`px-4 py-2 transition-colors font-medium relative group ${isActive("/careers") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Careers
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 ${isActive("/careers") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
              />
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Button variant="ghost" className="font-semibold" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground font-semibold" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                  variant="ghost"
                  className="font-semibold"
                  asChild
                >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button - Replaced with Sheet */}
          {!mounted ? (
            // Fallback for SSR - simple button without Sheet
            <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Menu">
              <Icons.menu className="w-6 h-6 text-foreground" />
            </button>
          ) : (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
                  <Icons.menu className="w-6 h-6 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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
                    Professional Water Tank Cleaning
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/services"
                      className={`px-4 py-3 rounded-md transition-colors font-medium select-none flex items-center justify-between group ${isActive("/services")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Services
                      {isActive("/services") ? <Icons.checkCircle className="w-4 h-4" /> : <Icons.arrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </Link>
                    <Link
                      href="/about"
                      className={`px-4 py-3 rounded-md transition-colors font-medium select-none flex items-center justify-between group ${isActive("/about")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                      {isActive("/about") && <Icons.checkCircle className="w-4 h-4" />}
                    </Link>
                    <Link
                      href="/careers"
                      className={`px-4 py-3 rounded-md transition-colors font-medium select-none flex items-center justify-between group ${isActive("/careers")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Careers
                      {isActive("/careers") && <Icons.checkCircle className="w-4 h-4" />}
                    </Link>
                  </nav>
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    <SignedOut>
                      <Button variant="outline" className="w-full font-semibold justify-center" asChild>
                        <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold justify-center shadow-lg shadow-primary/20" asChild>
                        <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                      </Button>
                    </SignedOut>
                    <SignedIn>
                      <Button variant="outline" className="w-full font-semibold justify-center" asChild>
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                      </Button>
                      <div className="flex items-center justify-center py-4">
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </SignedIn>
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
