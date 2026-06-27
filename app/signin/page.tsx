"use client"

import { useState, useRef, useEffect } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Step = "email" | "otp" | "password"

export default function SignInPage() {
  const { signIn } = useAuthActions()
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // STEP 1 — Send OTP
  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Enter your email address")
      return
    }
    setError("")
    setIsPending(true)
    try {
      await signIn("resend-otp", { email: email.trim() })
      setStep("otp")
      setResendTimer(60)
      toast.success("Code sent! Check your email.")
    } catch (err: any) {
      setError(err?.message ?? "Failed to send code. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  // STEP 2 — Verify OTP
  async function handleVerifyOTP() {
    const code = otp.join("")
    if (code.length < 6) {
      setError("Enter the full 6-digit code")
      return
    }
    setError("")
    setIsPending(true)
    try {
      await signIn("resend-otp", { email, code })
      toast.success("Signed in successfully!")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message ?? "Incorrect code. Please try again.")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsPending(false)
    }
  }

  // STEP 2B — Sign in with password
  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError("Email and password are required")
      return
    }
    setError("")
    setIsPending(true)
    try {
      await signIn("password", { email: email.trim(), password, flow: "signIn" })
      toast.success("Signed in successfully!")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message ?? "Invalid email or password.")
    } finally {
      setIsPending(false)
    }
  }

  // OTP box: auto-advance on digit entry, auto-backspace
  function handleOtpInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return // digits only
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    const code = next.join("")
    if (code.length === 6) {
      // Auto-submit when all 6 digits entered
      setTimeout(() => {
        setIsPending(true)
        setError("")
        signIn("resend-otp", { email, code })
          .then(() => {
            toast.success("Signed in successfully!")
            router.push("/dashboard")
          })
          .catch((err) => {
            setError(err?.message ?? "Incorrect code. Please try again.")
            setOtp(["", "", "", "", "", ""])
            inputRefs.current[0]?.focus()
            setIsPending(false)
          })
      }, 50)
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
      await signIn("resend-otp", { email })
      setResendTimer(60)
      toast.success("New code sent!")
    } catch {
      toast.error("Failed to resend. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="min-h-screen flex bg-background">
      {/* Left Side: Brand Image Section */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 flex-col justify-between">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-primary to-sky-900" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-sky-950/60 to-transparent" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <Icons.droplets className="w-9 h-9 text-white" />
            <h1 className="font-headline font-extrabold text-3xl tracking-tight text-white">Falkon Care</h1>
          </Link>
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
          <span className="text-white/50 text-xs font-medium">© 2026 Falkon Care</span>
          <span className="text-white/50 text-xs font-medium">ISO 9001 Certified</span>
        </div>
      </section>

      {/* Right Side: Form Container */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <Icons.droplets className="w-8 h-8 text-primary" />
            <h1 className="font-headline font-extrabold text-xl tracking-tight text-primary">Falkon Care</h1>
          </div>

          {/* Heading */}
          <div>
            <h3 className="font-headline font-bold text-3xl text-foreground mb-2">
              {step === "otp" ? "Enter Code" : "Welcome Back"}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {step === "email" && "Sign in using a one-time passcode sent to your email."}
              {step === "otp" && `We sent a 6-digit code to ${email}`}
              {step === "password" && "Sign in using your password."}
            </p>
          </div>

          {/* Step 1: Email Form */}
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
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
                    className="pl-12 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all min-h-[44px]"
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
                className="w-full h-12 bg-gradient-to-r from-primary to-sky-600 hover:from-primary/90 hover:to-sky-600/90 text-white font-headline font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-350 active:scale-[0.98] min-h-[44px]"
              >
                {isPending ? (
                  <Icons.loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Send Code"
                )}
              </Button>

              <div className="space-y-3 pt-4 border-t border-border/50 text-center text-xs">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-bold text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
                <p className="text-muted-foreground">
                  Sign in with password instead?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("password")
                      setError("")
                    }}
                    className="font-bold text-primary hover:underline"
                  >
                    Use password
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === "otp" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 block text-center">
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
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary focus:outline-none transition-colors dark:bg-slate-900"
                      autoFocus={i === 0}
                      disabled={isPending}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-[11px] text-red-500 font-semibold flex items-center justify-center gap-1 ml-1">
                    <Icons.alertCircle className="w-3.5 h-3.5" /> {error}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-medium px-1">
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
                onClick={handleVerifyOTP}
                disabled={isPending || otp.join("").length < 6}
                className="w-full h-12 bg-gradient-to-r from-primary to-sky-600 hover:from-primary/90 hover:to-sky-600/90 text-white font-headline font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-350 min-h-[44px]"
              >
                {isPending ? (
                  <Icons.loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Verify & Sign In"
                )}
              </Button>
            </div>
          )}

          {/* Step 3: Password Fallback Form */}
          {step === "password" && (
            <form onSubmit={handlePasswordSignIn} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email-pw" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  Email Address
                </Label>
                <div className="relative group">
                  <Icons.mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email-pw"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    disabled={isPending}
                    className="pl-12 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end px-1">
                  <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Password
                  </Label>
                  <Link href="/signin/forgot-password" className="text-xs font-bold text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Icons.lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    disabled={isPending}
                    className="pl-12 pr-12 bg-muted/50 border-none rounded-xl text-sm font-medium h-12 focus:bg-background focus:ring-2 focus:ring-primary transition-all min-h-[44px]"
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
                {error && (
                  <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 ml-1">
                    <Icons.alertCircle className="w-3.5 h-3.5" /> {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-gradient-to-r from-primary to-sky-600 hover:from-primary/90 hover:to-sky-600/90 text-white font-headline font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-350 active:scale-[0.98] min-h-[44px]"
              >
                {isPending ? (
                  <Icons.loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="space-y-3 pt-4 border-t border-border/50 text-center text-xs">
                <p className="text-muted-foreground">
                  Use email verification code instead?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email")
                      setError("")
                    }}
                    className="font-bold text-primary hover:underline"
                  >
                    Use email code
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Bottom links */}
          <div className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-foreground font-semibold hover:text-primary underline decoration-primary/20 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-foreground font-semibold hover:text-primary underline decoration-primary/20 transition-colors">
              Privacy Policy
            </Link>.
          </div>
        </div>
      </section>
    </main>
  )
}
