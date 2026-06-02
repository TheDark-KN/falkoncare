"use client"

import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface AdminTopBarProps {
  title: string
  subtitle?: string
}

export function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  const router = useRouter()
  const { logout } = useAppStore()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Icons.bell className="w-5 h-5 text-muted-foreground" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icons.shield className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
