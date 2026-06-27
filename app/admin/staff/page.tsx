"use client"

import { useEffect, useState } from "react"
import { AdminTopBar } from "@/components/admin/admin-top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface StaffMember {
  id: string
  fullName: string
  email: string
  phone: string
  status: string
  role: string
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const staffMembers = users.filter((u: Record<string, string>) => u.role === "staff")
      setStaff(staffMembers)
    } catch (err) {
      console.error("Error fetching staff:", err)
      setError("Failed to load staff")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleStatusChange = (staffId: string, newStatus: string) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: Record<string, string>) => (u.id === staffId ? { ...u, status: newStatus } : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      setStaff(staff.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s)))
    } catch (err) {
      console.error("Error updating staff status:", err)
      setError("Failed to update staff status")
    }
  }

  const stats = [
    { label: "Total Staff", value: staff.length, icon: Icons.users },
    { label: "Available", value: staff.filter((s) => s.status === "available").length, icon: Icons.checkCircle },
    { label: "Busy", value: staff.filter((s) => s.status === "busy").length, icon: Icons.clock },
    { label: "Off Duty", value: staff.filter((s) => s.status === "off-duty").length, icon: Icons.xCircle },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminTopBar title="Staff Management" />
        <div className="flex items-center justify-center h-96">
          <Icons.loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <AdminTopBar title="Staff Management" subtitle={`Total: ${staff.length}`} />

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Staff Grid */}
      {staff.length === 0 ? (
        <div className="text-center py-16">
          <Icons.users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No staff members found</p>
        </div>
      ) : (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icons.user className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{member.fullName}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={member.status || "available"}
                      onChange={(e) => handleStatusChange(member.id, e.target.value)}
                      className={cn(
                        "text-xs px-3 py-1 rounded-full font-medium border bg-background",
                        member.status === "available" && "bg-success/10 text-success border-success/30",
                        member.status === "busy" && "bg-warning/10 text-warning border-warning/30",
                        member.status === "off-duty" && "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="off-duty">Off Duty</option>
                    </select>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
