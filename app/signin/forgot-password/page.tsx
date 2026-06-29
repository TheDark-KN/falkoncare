"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const convex = useConvex();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // STEP 1 — Request reset code
  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address");
      return;
    }
    setError("");
    setIsPending(true);
    try {
      // Check if user is registered first
      const isRegistered = await convex.query(api.users.checkEmailRegistered, { email: email.trim() });
      if (!isRegistered) {
        toast.error("This email is not registered. Please sign up first.");
        router.push("/signup");
        return;
      }

      await signIn("password", { email: email.trim(), flow: "reset" });
      setStep("reset");
      setResendTimer(60);
      toast.success("Reset code sent! Check your email.");
    } catch (err: any) {
      // Direct enumeration protection or fallback
      setStep("reset");
      setResendTimer(60);
      toast.success("If this email is registered, you'll receive a reset code.");
    } finally {
      setIsPending(false);
    }
  }

  // STEP 2 — Reset password with code
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter the 6-digit verification code");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError("Password must contain at least one number");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsPending(true);
    try {
      await signIn("password", {
        email: email.trim(),
        code,
        newPassword,
        flow: "reset-verification",
      });
      toast.success("Password reset! Signing you in...");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Failed to reset password. Please verify the code and try again.");
    } finally {
      setIsPending(false);
    }
  }

  function handleOtpInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleResendCode() {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setIsPending(true);
    try {
      await signIn("password", { email: email.trim(), flow: "reset" });
      setResendTimer(60);
      toast.success("New reset code sent!");
    } catch {
      toast.error("Failed to resend reset code.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        <div className="text-center mb-8">
          <Link href="/signin" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors mb-4">
            <Icons.arrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900 dark:text-slate-50 tracking-tight">
            Reset password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Recover access to your FalkonCare account
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl p-6 sm:p-8">
          {step === "email" ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  autoFocus
                  disabled={isPending}
                  className="w-full min-h-[44px] text-base border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-slate-900 dark:text-slate-100 transition-shadow"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                  <Icons.alertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {isPending ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Sending Reset Code...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 text-center">
                  Enter the code sent to <span className="text-slate-800 dark:text-slate-200">{email}</span>
                </p>

                {/* 6 OTP boxes */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={el => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onFocus={e => e.target.select()}
                      autoFocus={i === 0}
                      disabled={isPending}
                      className="w-12 h-14 text-center text-xl font-extrabold text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 focus:outline-none transition-colors dark:bg-slate-950"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPassword}
                    onChange={e => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Minimum 8 characters"
                    disabled={isPending}
                    className="w-full min-h-[44px] text-base border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-950 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-slate-900 dark:text-slate-100 transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    disabled={isPending}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPw ? (
                      <Icons.eyeOff className="w-4 h-4" />
                    ) : (
                      <Icons.eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Re-enter new password"
                  disabled={isPending}
                  className="w-full min-h-[44px] text-base border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-slate-900 dark:text-slate-100 transition-shadow"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                  <Icons.alertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {isPending ? (
                    <>
                      <Icons.loader className="w-4 h-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || isPending}
                  className="w-full min-h-[44px] text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Didn't get a code? Resend"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
