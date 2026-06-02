"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { useAppStore } from "@/lib/store"

export default function ProfilePage() {
  const { customer, updateCustomer } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  })

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      setFormData({
        fullName: currentUser.fullName || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
      })
    } catch (err) {
      setError("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      const updatedUser = { ...currentUser, ...formData }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: Record<string, string>) => u.id === updatedUser.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem("users", JSON.stringify(users))
      }

      updateCustomer({
        name: formData.fullName,
        mobile: formData.phone,
        email: formData.email,
        address: formData.address,
      })

      setIsEditing(false)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar title="My Profile" />
        <div className="flex items-center justify-center h-96">
          <Icons.loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <TopBar title="My Profile" />

      <Card className="mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Icons.user className="w-10 h-10 text-primary" />
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing || isSaving}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input id="email" type="email" value={formData.email} disabled className="bg-background border-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing || isSaving}
                className="bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">
                Address
              </Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-background border-input"
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground py-2 flex items-start gap-2">
                  <Icons.mapPin className="w-4 h-4 mt-0.5" />
                  {formData.address || "Not set"}
                </p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                  <Icons.edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90">
                    {isSaving ? (
                      <>
                        <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card className="bg-card border-border mt-6">
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="text-lg font-semibold text-foreground flex items-center">
                <Icons.rupee className="w-4 h-4" />0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
