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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function SigninPage() {
  const router = useRouter()
  const { signIn } = useAuthActions()

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateField = (name: keyof LoginFormData, value: string) => {
    try {
      const fieldSchema = loginSchema.shape[name]
      fieldSchema.parse(value)
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: err.errors[0]?.message }))
      }
    }
  }

  const handleBlur = (name: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  const handleChange = (name: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    try {
      loginSchema.parse(formData)
      setIsSubmitting(true)

      await signIn("password", {
        flow: "signIn",
        email: formData.email,
        password: formData.password,
      })

      toast.success("Successfully logged in!")
      router.push("/dashboard")
    } catch (err: any) {
      setIsSubmitting(false)
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
        err.errors.forEach((issue) => {
          const path = issue.path[0] as keyof LoginFormData
          if (path) fieldErrors[path] = issue.message
        })
        setErrors(fieldErrors)
        toast.error("Please resolve the validation errors.")
      } else {
        console.error("Sign-in error:", err)
        toast.error(err.message || "Invalid email or password. Please try again.")
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
            Purity through precision.
          </h2>
          <p className="text-xl text-sky-200 leading-relaxed opacity-90">
            The next generation of water hygiene management. Engineered for professionals who demand excellence in safety and compliance.
          </p>

          {/* Compliance Meter */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-xl rounded-xl inline-flex items-center gap-6 shadow-xl border border-white/10">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-white/20 stroke-current"
                  cx="18" cy="18" r="15.915"
                  fill="none" strokeWidth="3"
                />
                <circle
                  className="text-emerald-400 stroke-current"
                  cx="18" cy="18" r="15.915"
                  fill="none" strokeWidth="3"
                  strokeDasharray="85, 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">85%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-headline font-bold text-white">Compliance Rate</p>
              <p className="text-xs text-sky-300">System Status: Optimal</p>
            </div>
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 flex gap-8">
          <span className="text-white/50 text-xs font-medium">© 2025 Falkon Care</span>
          <span className="text-white/50 text-xs font-medium">ISO 9001 Certified</span>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Icons.droplets className="w-8 h-8 text-primary" />
            <h1 className="font-headline font-extrabold text-xl tracking-tight text-primary">Falkon Care</h1>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h3 className="font-headline font-bold text-3xl text-foreground mb-2">Welcome back</h3>
            <p className="text-muted-foreground">Manage your water hygiene services with ease.</p>
          </div>

          {/* Auth Toggle Pill */}
          <div className="bg-muted p-1 rounded-full flex mb-8">
            <div className="flex-1 py-2.5 text-sm font-semibold rounded-full bg-background text-primary shadow-sm text-center cursor-default transition-all duration-200">
              Login
            </div>
            <Link
              href="/signup"
              className="flex-1 py-2.5 text-sm font-semibold rounded-full text-muted-foreground hover:text-foreground text-center transition-all duration-200"
            >
              Sign up
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-between items-end">
                <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  Password
                </Label>
                <Link href="/signin/forgot-password" className="text-xs font-bold text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Icons.lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            {/* CTA */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-primary to-sky-600 hover:from-primary/90 hover:to-sky-600/90 text-white font-headline font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98] mt-2"
            >
              {isSubmitting ? (
                <>
                  <Icons.loader className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in to Dashboard"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-4 my-6">
            <div className="flex-grow h-px bg-border" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">or use OTP</span>
            <div className="flex-grow h-px bg-border" />
          </div>

          {/* OTP Button */}
          <Link href="/signin/forgot-password" className="block">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold text-sm border-border/50 hover:bg-muted/50 transition-all duration-200"
            >
              <Icons.mail className="w-4 h-4 mr-2" />
              Sign in with Email OTP
            </Button>
          </Link>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
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
