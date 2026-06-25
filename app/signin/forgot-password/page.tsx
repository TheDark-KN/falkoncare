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

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { signIn } = useAuthActions()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  
  const [step, setStep] = useState<"request" | "verify">("request")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [touched, setTouched] = useState(false)

  // Validate Email
  const handleBlurEmail = () => {
    setTouched(true)
    try {
      emailSchema.parse({ email })
      setError(undefined)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message)
      }
    }
  }

  const handleChangeEmail = (value: string) => {
    setEmail(value)
    if (touched) {
      try {
        emailSchema.parse({ email: value })
        setError(undefined)
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.errors[0]?.message)
        }
      }
    }
  }

  // Request OTP code
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    try {
      emailSchema.parse({ email })
      setIsSubmitting(true)

      // Send OTP to email using resend-otp provider
      await signIn("resend-otp", { email })
      
      toast.success("Verification code sent to your email!")
      setStep("verify")
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message)
        toast.error("Please enter a valid email address.")
      } else {
        console.error("OTP send error:", err)
        
        let friendlyMessage = "Failed to send code. Please try again."
        try {
          // Parse stringified JSON errors returned by Resend/Convex backend
          const parsed = JSON.parse(err.message)
          if (parsed.message) {
            friendlyMessage = parsed.message
          }
        } catch {
          if (err.message) {
            friendlyMessage = err.message
          }
        }

        // Catch specific Resend Sandbox / Environment configuration warnings
        if (friendlyMessage.toLowerCase().includes("sandbox mode")) {
          friendlyMessage = "Resend Sandbox Mode: You can only send to your own registered developer email. Please test with your registered email or set up a custom domain on Resend."
        } else if (friendlyMessage.toLowerCase().includes("api key") || friendlyMessage.toLowerCase().includes("unauthorized")) {
          friendlyMessage = "Resend API Key Error: Please check that AUTH_RESEND_KEY is correctly set in your Convex environment variables."
        }

        toast.error(friendlyMessage, { duration: 6000 })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verify OTP code
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.trim().length !== 6) {
      toast.error("Please enter a 6-digit code.")
      return
    }

    try {
      setIsSubmitting(true)

      // Submit code using same provider
      await signIn("resend-otp", { email, code })

      toast.success("Successfully authenticated!")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("OTP verify error:", err)
      toast.error(err.message || "Invalid verification code. Please try again.")
    } finally {
      setIsSubmitting(false)
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
            <CardTitle className="text-2xl font-headline font-black text-sky-900 dark:text-white">
              {step === "request" ? "OTP Sign In" : "Verify Code"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {step === "request"
                ? "Enter your email to receive a 6-digit verification code"
                : `We sent a code to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            {step === "request" ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => handleChangeEmail(e.target.value)}
                    onBlur={handleBlurEmail}
                    disabled={isSubmitting}
                    className={cn(
                      "bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 font-headline focus:ring-2 focus:ring-primary",
                      touched && error && "ring-2 ring-red-500 focus:ring-red-500 bg-red-50/20"
                    )}
                  />
                  {touched && error && (
                    <p className="text-[11px] text-red-500 font-headline font-semibold flex items-center gap-1">
                      ⚠️ {error}
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
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Icons.mail className="w-4 h-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {/* Verification Code */}
                <div className="space-y-1.5">
                  <Label htmlFor="code" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">
                    6-Digit Code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    disabled={isSubmitting}
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 font-headline text-center tracking-widest text-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || code.length !== 6}
                  className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-headline font-bold text-sm rounded-xl active:scale-95 duration-200 border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Icons.loader className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Icons.check className="w-4 h-4" />
                      Verify &amp; Log In
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("request")}
                  disabled={isSubmitting}
                  className="w-full h-11 font-headline font-semibold text-xs text-slate-500 hover:bg-slate-100"
                >
                  Back to email request
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-xs font-semibold font-headline text-slate-400">
              Return to{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Password Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
