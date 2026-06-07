"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

const sidebarLinks = [
    {
        title: "Bookings",
        href: "/admin",
        icon: "calendar",
    },
    {
        title: "Surveys",
        href: "/admin/surveys",
        icon: "clipboardList",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col p-4">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="p-1.5 bg-primary rounded-md">
                    <Icons.shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>

            <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href
                    const Icon = Icons[link.icon as keyof typeof Icons] || Icons.fileText

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {link.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-border">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <Icons.arrowLeft className="w-4 h-4" />
                    Back to App
                </Link>
            </div>
        </aside>
    )
}
