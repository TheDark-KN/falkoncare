"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
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
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  dob: z.string().refine(val => {
    if (!val) return false;
    const age = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }, "You must be at least 18 years old"),
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const { signIn } = useAuthActions()

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
  })

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
    dob: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate a single field dynamically
  const validateField = (name: keyof SignupFormData, value: string) => {
    try {
      const fieldSchema = signupSchema.shape[name]
      fieldSchema.parse(value)
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: err.errors[0]?.message }))
      }
    }
  }

  // Handle onBlur validation
  const handleBlur = (name: keyof SignupFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  // Handle onChange
  const handleChange = (name: keyof SignupFormData, value: string) => {
    let cleanedValue = value
    if (name === "phone") {
      cleanedValue = value.replace(/\D/g, "").slice(0, 10)
    }
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }))

    if (touched[name]) {
      validateField(name, cleanedValue)
    }
  }

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Touch all fields to trigger validation
    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
      dob: true,
    })

    try {
      // Validate schema
      signupSchema.parse(formData)
      setIsSubmitting(true)

      // Call Convex Auth signIn for password flow sign-up
      await signIn("password", {
        flow: "signUp",
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
      })

      toast.success("Account created successfully!")
      router.push("/dashboard")
    } catch (err: any) {
      setIsSubmitting(false)
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {}
        err.errors.forEach((issue) => {
          const path = issue.path[0] as keyof SignupFormData
          if (path) {
            fieldErrors[path] = issue.message
          }
        })
        setErrors(fieldErrors)
        toast.error("Please resolve the validation errors.")
      } else {
        console.error("Sign-up error:", err)
        // Extract Convex custom errors if thrown by auth.ts
        if (err.message && err.message.includes("ConvexError")) {
          toast.error("Sign-up failed: Please check entered details.")
        } else {
          toast.error(err.message || "Failed to create account. Email may already be in use.")
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-accent/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-primary/10 to-transparent blur-3xl rounded-full opacity-70" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <Icons.droplets className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold font-headline text-sky-900 dark:text-white">FalkonCare</span>
        </Link>

        <Card className="border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-headline font-black text-sky-900 dark:text-white">Create Account</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Join FalkonCare for pure water hygiene &amp; home services
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  disabled={isSubmitting}
                  className={cn(
                    "bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 font-headline focus:ring-2 focus:ring-primary",
                    touched.name && errors.name && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                  )}
                />
                {touched.name && errors.name && (
                  <p className="text-[11px] text-red-500 font-headline font-semibold flex items-center gap-1">
                    ⚠️ {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={isSubmitting}
                  className={cn(
                    "bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 font-headline focus:ring-2 focus:ring-primary",
                    touched.email && errors.email && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                  )}
                />
                {touched.email && errors.email && (
                  <p className="text-[11px] text-red-500 font-headline font-semibold flex items-center gap-1">
                    ⚠️ {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  disabled={isSubmitting}
                  className={cn(
                    "bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 font-headline focus:ring-2 focus:ring-primary",
                    touched.password && errors.password && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                  )}
                />
                {touched.password && errors.password && (
                  <p className="text-[11px] text-red-500 font-headline font-semibold flex items-center gap-1">
                    ⚠️ {errors.password}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                  Mobile Number
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 text-sm font-bold font-headline select-none">
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
                      "pl-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 font-headline focus:ring-2 focus:ring-primary",
                      touched.phone && errors.phone && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                    )}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-[11px] text-red-500 font-headline font-semibold flex items-center gap-1">
                    ⚠️ {errors.phone}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
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
                    "bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 font-headline focus:ring-2 focus:ring-primary",
                    touched.dob && errors.dob && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                  )}
                />
                {touched.dob && errors.dob && (
                  <p className="text-[11px] text-red-500 font-headline font-semibold flex items-center gap-1">
                    ⚠️ {errors.dob}
                  </p>
                )}
              </div>

              {/* Privacy/Consent Notice */}
              <div className="p-3 bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100/50 dark:border-sky-900/30 rounded-xl text-[10px] text-slate-550 leading-relaxed">
                By registering, you confirm you are 18+ and consent to the secure collection and processing of your details under India's DPDP Act 2023 for scheduling cleanings.
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-headline font-bold text-sm rounded-xl active:scale-95 duration-200 border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Icons.check className="w-4 h-4" />
                    Register
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs font-semibold font-headline text-slate-400">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
