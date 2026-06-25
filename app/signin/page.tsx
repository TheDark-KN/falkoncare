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

  // Validate a single field dynamically
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

  // Handle onBlur
  const handleBlur = (name: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  // Handle onChange
  const handleChange = (name: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      validateField(name, value)
    }
  }

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({ email: true, password: true })

    try {
      loginSchema.parse(formData)
      setIsSubmitting(true)

      // Call Convex Auth signIn for password flow sign-in
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
          if (path) {
            fieldErrors[path] = issue.message
          }
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
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-primary/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent/10 to-transparent blur-3xl rounded-full opacity-70" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <Icons.droplets className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold font-headline text-sky-900 dark:text-white">FalkonCare</span>
        </Link>

        <Card className="border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-headline font-black text-sky-900 dark:text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Access your FalkonCare profile &amp; bookings
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                    Password
                  </Label>
                  <Link href="/signin/forgot-password" className="text-[11px] text-primary hover:underline font-semibold font-headline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-headline font-bold text-sm rounded-xl active:scale-95 duration-200 border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Icons.login className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* OTP Alternatives */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider font-headline">Or use OTP</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <Link href="/signin/forgot-password" className="block">
              <Button variant="outline" className="w-full h-11 rounded-xl font-headline font-bold text-xs border-slate-200 hover:bg-slate-50 dark:border-slate-800">
                <Icons.mail className="w-4 h-4 mr-2" />
                Sign in with OTP Code
              </Button>
            </Link>

            <div className="mt-6 text-center text-xs font-semibold font-headline text-slate-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
