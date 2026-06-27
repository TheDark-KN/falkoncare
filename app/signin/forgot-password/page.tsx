"use client"

import { useState, useRef, useEffect } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Step = "email" | "reset"

export default function ForgotPasswordPage() {
  const { signIn } = useAuthActions()
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // STEP 1 — Request reset code
  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Enter your email address")
      return
    }
    setError("")
    setIsPending(true)
    try {
      await signIn("password", { email: email.trim(), flow: "reset" })
      setStep("reset")
      setResendTimer(60)
      toast.success("Reset code sent! Check your email.")
    } catch (err: any) {
      // Always show the same step/message to prevent email enumeration
      setStep("reset")
      setResendTimer(60)
      toast.success("If this email is registered, you'll receive a reset code.")
    } finally {
      setIsPending(false)
    }
  }

  // STEP 2 — Verify OTP + set new password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    const code = otp.join("")
    if (code.length < 6) {
      setError("Enter the full 6-digit code")
      return
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter")
      return
    }
    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain at least one number")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError("")
    setIsPending(true)
    try {
      await signIn("password", {
        email,
        code,
        newPassword,
        flow: "reset-verification",
      })
      toast.success("Password reset successful! You are now signed in.")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message ?? "Invalid or expired code. Please request a new one.")
    } finally {
      setIsPending(false)
    }
  }

  function handleOtpInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return
    setOtp(["", "", "", "", "", ""])
    setError("")
    setIsPending(true)
    try {
      await signIn("password", { email, flow: "reset" })
      setResendTimer(60)
      toast.success("New reset code sent!")
    } catch {
      toast.error("Failed to resend. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-accent/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-primary/10 to-transparent blur-3xl rounded-full opacity-70" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center">
          <Link href="/signin" className="text-xs font-bold text-slate-500 hover:text-primary inline-flex items-center gap-1.5 mb-6">
            <Icons.arrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 mb-2">
            <Icons.droplets className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold font-headline text-sky-900 dark:text-white">FalkonCare</span>
          </Link>
        </div>

        <Card className="border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-headline font-black text-sky-900 dark:text-white">
              {step === "email" ? "Forgot Password?" : "Reset Password"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {step === "email"
                ? "Enter your email and we'll send a reset code."
                : `Enter the 6-digit code sent to ${email} and choose a new password.`}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            {step === "email" ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider ml-1">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Icons.mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      disabled={isPending}
                      className="pl-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 focus:ring-2 focus:ring-primary min-h-[44px]"
                      required
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                      <Icons.alertCircle className="w-3.5 h-3.5" /> {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-headline font-bold text-sm rounded-xl active:scale-95 duration-200 border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 mt-2 min-h-[44px]"
                >
                  {isPending ? (
                    <Icons.loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* OTP Boxes */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider ml-1 block text-center">
                    Verification Code
                  </Label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputRefs.current[i] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        className="w-11 h-13 text-center text-lg font-bold border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary focus:outline-none transition-colors dark:bg-slate-900"
                        autoFocus={i === 0}
                        disabled={isPending}
                      />
                    ))}
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider ml-1">
                    New Password
                  </Label>
                  <div className="relative group">
                    <Icons.lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setError("")
                      }}
                      disabled={isPending}
                      className="pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 focus:ring-2 focus:ring-primary min-h-[44px]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <Icons.eyeOff className="w-4 h-4" /> : <Icons.eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider ml-1">
                    Confirm New Password
                  </Label>
                  <div className="relative group">
                    <Icons.checkCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setError("")
                      }}
                      disabled={isPending}
                      className="pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold h-11 focus:ring-2 focus:ring-primary min-h-[44px]"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                      <Icons.alertCircle className="w-3.5 h-3.5" /> {error}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-medium px-1 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email")
                      setError("")
                    }}
                    className="text-slate-500 hover:text-primary flex items-center gap-1"
                    disabled={isPending}
                  >
                    <Icons.arrowLeft className="w-3.5 h-3.5" /> Change email
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || isPending}
                    className={cn(
                      "font-bold transition-colors",
                      resendTimer > 0
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-primary hover:underline"
                    )}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isPending || otp.join("").length < 6}
                  className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-headline font-bold text-sm rounded-xl active:scale-95 duration-200 border-0 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 mt-2 min-h-[44px]"
                >
                  {isPending ? (
                    <Icons.loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Reset Password & Sign In"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
