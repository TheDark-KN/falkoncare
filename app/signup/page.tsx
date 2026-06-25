"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
  const [showPassword, setShowPassword] = useState(false)

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

  const handleBlur = (name: keyof SignupFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, phone: true, dob: true })

    try {
      signupSchema.parse(formData)
      setIsSubmitting(true)

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
          if (path) fieldErrors[path] = issue.message
        })
        setErrors(fieldErrors)
        toast.error("Please resolve the validation errors.")
      } else {
        console.error("Sign-up error:", err)
        if (err.message && err.message.includes("ConvexError")) {
          toast.error("Sign-up failed: Please check entered details.")
        } else {
          toast.error(err.message || "Failed to create account. Email may already be in use.")
        }
      }
    }
  }

  return (
    <main className="flex min-h-screen">
      {/* Left Side: Visual/Branding Panel */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 flex-col justify-between">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-primary to-sky-900" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-sky-950/60 to-transparent" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Icons.droplets className="w-9 h-9 text-white" />
            <h1 className="font-headline font-extrabold text-3xl tracking-tight text-white">Falkon Care</h1>
          </div>
        </div>

        {/* Center: Tagline */}
        <div className="relative z-10 max-w-lg">
          <h2 className="font-headline font-bold text-5xl leading-tight text-white mb-6">
            Join the clean water revolution.
          </h2>
          <p className="text-xl text-sky-200 leading-relaxed opacity-90">
            Create your account to book professional water tank cleaning and home hygiene services across Delhi NCR.
          </p>

          {/* Stats */}
          <div className="mt-12 flex gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/10">
              <p className="text-3xl font-headline font-bold text-white">500+</p>
              <p className="text-xs text-sky-300 font-medium mt-1">Happy Customers</p>
            </div>
            <div className="p-5 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/10">
              <p className="text-3xl font-headline font-bold text-white">4.9★</p>
              <p className="text-xs text-sky-300 font-medium mt-1">Average Rating</p>
            </div>
            <div className="p-5 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/10">
              <p className="text-3xl font-headline font-bold text-white">24hr</p>
              <p className="text-xs text-sky-300 font-medium mt-1">Quick Service</p>
            </div>
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 flex gap-8">
          <span className="text-white/50 text-xs font-medium">© 2025 Falkon Care</span>
          <span className="text-white/50 text-xs font-medium">Delhi NCR Service Area</span>
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Icons.droplets className="w-8 h-8 text-primary" />
            <h1 className="font-headline font-extrabold text-xl tracking-tight text-primary">Falkon Care</h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h3 className="font-headline font-bold text-3xl text-foreground mb-2">Create your account</h3>
            <p className="text-muted-foreground">Book professional water hygiene services in minutes.</p>
          </div>

          {/* Auth Toggle Pill */}
          <div className="bg-muted p-1 rounded-full flex mb-8">
            <Link
              href="/signin"
              className="flex-1 py-2.5 text-sm font-semibold rounded-full text-muted-foreground hover:text-foreground text-center transition-all duration-200"
            >
              Login
            </Link>
            <div className="flex-1 py-2.5 text-sm font-semibold rounded-full bg-background text-primary shadow-sm text-center cursor-default transition-all duration-200">
              Sign up
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Full Name
              </Label>
              <div className="relative group">
                <Icons.user className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  disabled={isSubmitting}
                  className={cn(
                    "pl-12 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all",
                    touched.name && errors.name && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/30"
                  )}
                />
              </div>
              {touched.name && errors.name && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                  <Icons.alertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Icons.mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={isSubmitting}
                  className={cn(
                    "pl-12 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all",
                    touched.email && errors.email && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/30"
                  )}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                  <Icons.alertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Password
              </Label>
              <div className="relative group">
                <Icons.lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  disabled={isSubmitting}
                  className={cn(
                    "pl-12 pr-12 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all",
                    touched.password && errors.password && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/30"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? <Icons.eyeOff className="w-4.5 h-4.5" /> : <Icons.eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                  <Icons.alertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Mobile Number
              </Label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/80 text-sm font-bold select-none">+91</span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  disabled={isSubmitting}
                  className={cn(
                    "pl-14 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all",
                    touched.phone && errors.phone && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/30"
                  )}
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                  <Icons.alertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <Label htmlFor="dob" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Date of Birth
              </Label>
              <div className="relative group">
                <Icons.calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  onBlur={() => handleBlur("dob")}
                  disabled={isSubmitting}
                  className={cn(
                    "pl-12 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all",
                    touched.dob && errors.dob && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/30"
                  )}
                />
              </div>
              {touched.dob && errors.dob && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                  <Icons.alertCircle className="w-3 h-3" /> {errors.dob}
                </p>
              )}
            </div>

            {/* DPDP Consent */}
            <div className="p-3 bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100/50 dark:border-sky-900/30 rounded-xl text-[11px] text-muted-foreground leading-relaxed">
              <Icons.shield className="w-3.5 h-3.5 inline mr-1 text-primary/60" />
              By registering, you confirm you are 18+ and consent to the secure collection and processing of your details under India&apos;s DPDP Act 2023 for scheduling cleanings.
            </div>

            {/* CTA */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-primary to-sky-600 hover:from-primary/90 hover:to-sky-600/90 text-white font-headline font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98] mt-1"
            >
              {isSubmitting ? (
                <>
                  <Icons.loader className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms-of-service" className="text-foreground font-semibold hover:text-primary underline decoration-primary/20 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-foreground font-semibold hover:text-primary underline decoration-primary/20 transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
