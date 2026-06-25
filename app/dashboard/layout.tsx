"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="customer" />
      <main className="lg:ml-64 min-h-screen">{children}</main>
    </div>
  )
}
