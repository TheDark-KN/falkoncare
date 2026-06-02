"use client"

import { useState, useEffect } from "react"
import { AdminTopBar } from "@/components/admin/admin-top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface Customer {
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      setCustomers(
        users.map((user: Record<string, string>) => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          createdAt: new Date().toLocaleDateString(),
        })),
      )
    } catch (err) {
      setError("Failed to load customers")
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <AdminTopBar title="Customers" />
        <div className="flex items-center justify-center h-64">
          <Icons.loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <AdminTopBar title="Customers" subtitle={`Total: ${customers.length}`} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : customers.length === 0 ? (
            <p className="text-muted-foreground">No customers yet</p>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{customer.fullName}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
