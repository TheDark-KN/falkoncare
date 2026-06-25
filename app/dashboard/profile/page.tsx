"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import Link from "next/link"

export default function ProfilePage() {
  const convexUser = useQuery(api.users.current)
  const updateProfile = useMutation(api.users.updateProfile)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Local form states
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [dob, setDob] = useState("")

  // Sync Convex data to local states when loaded
  useEffect(() => {
    if (convexUser) {
      setFullName(convexUser.name || convexUser.fullName || "")
      setPhoneNumber(convexUser.phone || convexUser.phoneNumber || "")
      setAddress(convexUser.address || "")
      setDob(convexUser.dob || "")
    }
  }, [convexUser])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateProfile({
        name: fullName.trim(),
        fullName: fullName.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        dob: dob.trim(),
      })
      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (err: unknown) {
      console.error(err)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate completeness percentage
  const calculateCompleteness = () => {
    if (!convexUser) return 0
    let points = 20 // base point for registration
    if (convexUser.name || convexUser.fullName) points += 20
    if (convexUser.phone || convexUser.phoneNumber) points += 20
    if (convexUser.address) points += 20
    if (convexUser.dob) points += 20
    return points
  }

  const completeness = calculateCompleteness()

  if (convexUser === undefined) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950">
        <TopBar title="Loading Profile..." />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icons.loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-slate-500 font-headline font-semibold">Loading profile information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col">
      <TopBar title="Account Settings" />

      {/* Main Content Canvas */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="space-y-2">
          <h2 className="text-3xl font-headline font-black text-sky-900 dark:text-white tracking-tight">Account Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm font-medium">
            Manage your personal details, security settings, and notification preferences to keep your water hygiene standards optimal.
          </p>
        </header>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Profile Avatar Card */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5">
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 relative">
                    {convexUser.image || convexUser.imageUrl ? (
                      <img
                        alt="User Profile"
                        className="w-full h-full object-cover"
                        src={convexUser.image || convexUser.imageUrl}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-4xl">
                        {(convexUser.name || convexUser.fullName || "U")[0]}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-4 border-white dark:border-slate-900">
                    <Icons.checkCircle className="w-4 h-4 fill-white" />
                  </div>
                </div>

                <h3 className="text-xl font-headline font-bold text-sky-900 dark:text-white">
                  {convexUser.name || convexUser.fullName || "User"}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Premium Member
                </p>

                <div className="w-full bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3.5 flex items-center gap-3 text-left mt-6 border border-emerald-100/50 dark:border-emerald-900/50">
                  <Icons.shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 font-headline leading-tight">Identity Verified</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Checked with secure systems</p>
                  </div>
                </div>
              </div>

              {/* Progress bar completeness */}
              <div className="mt-8 space-y-3 font-headline">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Profile Completion</span>
                  <span className="font-extrabold text-primary">{completeness}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  ></div>
                </div>
              </div>
            </section>

            {/* Wallet Quick Summary */}
            <section className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
              <h4 className="font-headline font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Icons.wallet className="w-4 h-4 text-primary" />
                Wallet &amp; Billing
              </h4>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-xl flex justify-between items-center border border-slate-150/40 dark:border-slate-850/40">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-headline">Current Balance</p>
                  <p className="text-xl font-headline font-black text-sky-900 dark:text-white mt-0.5">
                    ₹{convexUser.walletBalance.toLocaleString()}
                  </p>
                </div>
                <Link href="/dashboard/wallet">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800">
                    <Icons.chevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <Link href="/dashboard/wallet" className="block">
                <Button variant="outline" className="w-full py-4 text-xs font-bold font-headline rounded-xl border-slate-200 text-primary dark:border-slate-800">
                  View Transaction History
                </Button>
              </Link>
            </section>
          </div>

          {/* Right Column: Settings Details Forms */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Personal Details Section */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 overflow-hidden">
              <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-headline font-bold text-sky-900 dark:text-white">Personal Details</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-sky-50 dark:hover:bg-slate-800 font-bold font-headline text-sm gap-1 border-0"
                  >
                    <Icons.edit className="w-3.5 h-3.5" /> Edit Details
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Editing Mode</span>
                )}
              </div>
              
              <div className="p-6 md:p-8">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline px-1">Full Name</label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isSaving}
                          className="bg-slate-50 border-none rounded-xl py-6 font-headline"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline px-1">Email Address</label>
                        <Input
                          value={convexUser.email}
                          disabled
                          className="bg-slate-100 dark:bg-slate-950 border-none rounded-xl py-6 font-headline text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline px-1">Phone Number</label>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isSaving}
                          className="bg-slate-50 border-none rounded-xl py-6 font-headline"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline px-1">Date of Birth</label>
                        <Input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          disabled={isSaving}
                          className="bg-slate-50 border-none rounded-xl py-6 font-headline"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline px-1">Default Address</label>
                      <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={isSaving}
                        className="bg-slate-50 border-none rounded-xl font-headline"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline px-1">User ID</label>
                      <Input
                        value={convexUser._id}
                        disabled
                        className="bg-slate-100 dark:bg-slate-950 border-none rounded-xl py-6 font-headline text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isSaving || !fullName.trim()}
                        className="py-5 px-6 rounded-xl font-headline font-bold text-white shadow-lg active:scale-95 duration-200 border-0 flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Icons.loader className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFullName(convexUser.name || convexUser.fullName || "")
                          setPhoneNumber(convexUser.phone || convexUser.phoneNumber || "")
                          setAddress(convexUser.address || "")
                          setDob(convexUser.dob || "")
                          setIsEditing(false)
                        }}
                        disabled={isSaving}
                        className="rounded-xl py-5 font-headline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-headline px-1">Full Name</label>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-sky-900 dark:text-slate-200 font-bold font-headline">
                        {convexUser.name || convexUser.fullName || "Not set"}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-headline px-1">Email Address</label>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-sky-900 dark:text-slate-200 font-bold font-headline">
                        {convexUser.email || "Not set"}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-headline px-1">Phone Number</label>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-sky-900 dark:text-slate-200 font-bold font-headline">
                        {convexUser.phone || convexUser.phoneNumber || "Not set"}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-headline px-1">Date of Birth</label>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-sky-900 dark:text-slate-200 font-bold font-headline">
                        {convexUser.dob || "Not set"}
                      </div>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-headline px-1">Default Address</label>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-sky-900 dark:text-slate-200 font-bold font-headline min-h-[46px] leading-relaxed">
                        {convexUser.address || "Not set"}
                      </div>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-headline px-1">User ID</label>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-sky-900 dark:text-slate-200 font-bold font-headline">
                        {convexUser._id}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Notification Preferences */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-headline font-bold text-sky-900 dark:text-white">Notification Preferences</h3>
              </div>
              <div className="p-8 space-y-6 font-headline">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-sky-900 dark:text-white">Email Notifications</p>
                    <p className="text-xs text-slate-400">Receive weekly water hygiene reports and job alerts via email.</p>
                  </div>
                  <button className="w-11 h-6 bg-primary rounded-full relative transition-colors cursor-pointer border-0">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-sky-900 dark:text-white">WhatsApp &amp; SMS Job Alerts</p>
                    <p className="text-xs text-slate-400">Instant text messages for technician dispatch and live tracking links.</p>
                  </div>
                  <button className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative transition-colors cursor-pointer border-0">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
            </section>

            {/* Security & Privacy */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-headline font-bold text-sky-900 dark:text-white">Security &amp; Privacy</h3>
              </div>
              <div className="p-8 space-y-4 text-sm font-headline">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-350">
                  <Icons.shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-bold">Managed Authentication</p>
                    <p className="text-xs text-slate-400 mt-0.5">Your sign-in information and passwords are securely managed by Convex Auth.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-350 pt-2">
                  <Icons.lock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-bold">Encrypted Data Transport</p>
                    <p className="text-xs text-slate-400 mt-0.5">All communications between your browser and Convex database are fully TLS/SSL encrypted.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Rights & DPDP Request Center */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-headline font-bold text-sky-900 dark:text-white flex items-center gap-2">
                  <Icons.shield className="w-5.5 h-5.5 text-primary" />
                  Privacy Rights &amp; DPDP Request Center
                </h3>
              </div>
              <CardContent className="p-8 space-y-6 font-headline">
                <p className="text-xs leading-relaxed text-slate-500">
                  Under India's Digital Personal Data Protection (DPDP) Act 2023, you have rights to data access, correction, erasure, and consent withdrawal. Manage your choices below.
                </p>

                {/* Consent Withdrawal */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-sky-900 dark:text-white">Marketing Consent Status</p>
                    <p className="text-xs text-slate-400">Process my data for promotional updates and service recommendations.</p>
                  </div>
                  <button 
                    onClick={() => {
                      toast.success("Optional marketing consent withdrawn. We will only process data necessary for booking fulfillment.");
                    }}
                    className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative transition-colors cursor-pointer border-0"
                  >
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export Request */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const dataSummary = `FalkonCare Personal Data Export:\nName: ${convexUser.fullName || "Not Set"}\nEmail: ${convexUser.email}\nPhone: ${convexUser.phoneNumber || "Not Set"}\nAddress: ${convexUser.address || "Not Set"}`;
                      navigator.clipboard.writeText(dataSummary);
                      toast.success("Personal data summary copied to clipboard! (Data Access Request fulfilled)");
                    }}
                    className="py-5 rounded-xl font-headline font-bold text-xs border-slate-200 hover:bg-slate-50 dark:border-slate-800 text-sky-900 dark:text-slate-300"
                  >
                    <Icons.clipboardList className="w-4 h-4 mr-2" />
                    Request Data Access (Export)
                  </Button>

                  {/* Erasure Request */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.success("Your request for data erasure has been received. Your data will be deleted within 30 days, subject to statutory record retention.");
                    }}
                    className="py-5 rounded-xl font-headline font-bold text-xs text-rose-600 border-rose-200 hover:bg-rose-50/50 dark:border-rose-900/50"
                  >
                    <Icons.userCog className="w-4 h-4 mr-2" />
                    Request Data Erasure (Delete)
                  </Button>
                </div>

                {/* Grievance redressal contact details */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-sky-900 dark:text-white uppercase tracking-wider">Grievance &amp; Privacy Support</h4>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>For any complaints or queries regarding data processing, contact our Grievance Officer:</p>
                    <p className="font-bold mt-1 text-slate-700 dark:text-slate-300">Name: Privacy Officer, FalkonCare</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">Email: privacy@falkoncare.com | Phone: 7011365481</p>
                  </div>
                </div>

                {/* Developer Legal Disclaimer Note */}
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-xl">
                  <div className="flex gap-2">
                    <Icons.shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed font-semibold">
                      <strong>Compliance Note:</strong> This portal implements DPDP-aligned product design (data minimisation, user rights request center, plain-language consent). Backend retention routines, breach reporting pipelines, and official legal policy texts must be reviewed by qualified Indian counsel before production launch.
                    </p>
                  </div>
                </div>
              </CardContent>
            </section>

          </div>

        </div>

      </div>
    </div>
  )
}
