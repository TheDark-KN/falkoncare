"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Define the validation schema using Zod
const profileSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  dob: z.string().refine(val => {
    const age = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }, "You must be at least 18 years old"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function CompleteProfilePage() {
  const router = useRouter()
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const convexUser = useQuery(api.users.current)
  const updateProfile = useMutation(api.users.updateProfile)

  const [formData, setFormData] = useState({
    phone: "",
    dob: "",
  })
  
  const [touched, setTouched] = useState({
    phone: false,
    dob: false,
  })

  const [errors, setErrors] = useState<{
    phone?: string
    dob?: string
  }>({})

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/complete-profile")
    }
  }, [isLoaded, isSignedIn, router])

  // Redirect if profile is already complete
  useEffect(() => {
    if (convexUser && convexUser.phoneNumber && convexUser.dob) {
      toast.info("Your profile is already complete!")
      router.push("/dashboard/services")
    }
  }, [convexUser, router])

  // Validate a single field
  const validateField = (name: keyof ProfileFormData, value: string) => {
    try {
      const fieldSchema = profileSchema.shape[name]
      fieldSchema.parse(value)
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.errors[0]?.message
        setErrors((prev) => ({ ...prev, [name]: fieldError }))
      }
    }
  }

  // Handle input blur events
  const handleBlur = (name: keyof ProfileFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  // Handle input changes
  const handleChange = (name: keyof ProfileFormData, value: string) => {
    let cleanedValue = value
    if (name === "phone") {
      // Remove any non-digits
      cleanedValue = value.replace(/\D/g, "").slice(0, 10)
    }
    
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }))
    
    // Only validate if already touched
    if (touched[name]) {
      validateField(name, cleanedValue)
    }
  }

  // Submit complete-profile form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Touch all fields to trigger validation
    setTouched({ phone: true, dob: true })
    
    try {
      // Validate complete schema
      profileSchema.parse(formData)
      
      setIsSubmitting(true)
      
      // Save details to database via Convex mutation
      await updateProfile({
        phoneNumber: `+91${formData.phone}`,
        dob: formData.dob,
      })

      toast.success("Profile completed successfully!")
      router.push("/dashboard/services")
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { phone?: string; dob?: string } = {}
        err.errors.forEach((issue) => {
          const path = issue.path[0] as "phone" | "dob"
          if (path) {
            fieldErrors[path] = issue.message
          }
        })
        setErrors(fieldErrors)
        toast.error("Please resolve the validation errors.")
      } else {
        console.error(err)
        toast.error("Failed to update profile. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || convexUser === undefined) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col justify-center items-center">
        <Icons.loader className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-headline font-semibold">Loading profile configuration...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Icons.droplets className="w-10 h-10 text-primary" />
          <span className="text-2xl font-bold font-headline text-sky-900 dark:text-white">FalkonCare</span>
        </Link>

        <Card className="border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-headline font-black text-sky-900 dark:text-white">Complete Profile</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              We require your phone number and age verification to fulfill bookings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                  Mobile Number
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold font-headline select-none">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    disabled={isSubmitting}
                    className={cn(
                      "pl-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-12 font-headline focus:ring-2 focus:ring-primary",
                      touched.phone && errors.phone && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                    )}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-xs text-red-500 font-headline font-semibold flex items-center gap-1 animate-fade-in">
                    ⚠️ {errors.phone}
                  </p>
                )}
              </div>

              {/* Date of Birth Input */}
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  onBlur={() => handleBlur("dob")}
                  disabled={isSubmitting}
                  className={cn(
                    "bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-12 font-headline focus:ring-2 focus:ring-primary",
                    touched.dob && errors.dob && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                  )}
                />
                {touched.dob && errors.dob && (
                  <p className="text-xs text-red-500 font-headline font-semibold flex items-center gap-1 animate-fade-in">
                    ⚠️ {errors.dob}
                  </p>
                )}
              </div>

              {/* DPDP Consent Callout */}
              <div className="p-4 bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100/50 dark:border-sky-900/30 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                By submitting this form, you consent to the storage and processing of your phone number and age group in compliance with the DPDP Act 2023 for booking fulfillment purposes.
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-headline font-bold text-sm rounded-xl active:scale-95 duration-200 border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10"
              >
                {isSubmitting ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  <>
                    <Icons.check className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
