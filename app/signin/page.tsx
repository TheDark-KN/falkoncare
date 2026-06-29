"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

type AuthTab = "password" | "otp";
type OtpStep = "email" | "code";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const convex = useConvex();

  // Tab state
  const [tab, setTab] = useState<AuthTab>("password");

  // Password tab state
  const [pwEmail, setPwEmail] = useState("");
  const [pwPassword, setPwPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwPending, setPwPending] = useState(false);

  // OTP tab state
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpPending, setOtpPending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Password sign in ──
  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!pwEmail || !pwPassword) {
      setPwError("Please enter email and password");
      return;
    }
    setPwError("");
    setPwPending(true);
    try {
      const isRegistered = await convex.query(api.users.checkEmailRegistered, { email: pwEmail.trim() });
      if (!isRegistered) {
        toast.error("This email is not registered. Please sign up first.");
        router.push("/signup");
        return;
      }
      await signIn("password", { email: pwEmail.trim(), password: pwPassword, flow: "signIn" });
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      setPwError("Incorrect email or password. Please try again.");
    } finally {
      setPwPending(false);
    }
  }

  // ── OTP: send code ──
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpEmail.trim()) {
      setOtpError("Enter your email address");
      return;
    }
    setOtpError("");
    setOtpPending(true);
    try {
      const isRegistered = await convex.query(api.users.checkEmailRegistered, { email: otpEmail.trim() });
      if (!isRegistered) {
        toast.error("This email is not registered. Please sign up first.");
        router.push("/signup");
        return;
      }
      await signIn("resend-otp", { email: otpEmail.trim() });
      setOtpStep("code");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      toast.success("Code sent! Check your email.");
    } catch (err: any) {
      setOtpError(err?.message ?? "Failed to send code. Please try again.");
    } finally {
      setOtpPending(false);
    }
  }

  // ── OTP: verify code ──
  async function handleVerifyOtp() {
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Enter the full 6-digit code");
      return;
    }
    setOtpError("");
    setOtpPending(true);
    try {
      await signIn("resend-otp", { email: otpEmail, code });
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      setOtpError("Incorrect code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setOtpPending(false);
    }
  }

  function handleOtpKey(i: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[i] = value;
    setOtp(next);
    if (value && i < 5) {
      otpRefs.current[i + 1]?.focus();
    }
    if (next.join("").length === 6) {
      setTimeout(handleVerifyOtp, 80);
    }
  }

  function handleOtpBackspace(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  async function handleResend() {
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpPending(true);
    try {
      await signIn("resend-otp", { email: otpEmail });
      setResendTimer(60);
      toast.success("New code sent!");
    } catch {
      toast.error("Failed to resend. Try again.");
    } finally {
      setOtpPending(false);
    }
  }

  const isPending = pwPending || otpPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden font-sans">
      {/* Background blobs for premium styling */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Icons.shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-headline bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              FalkonCare
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900 dark:text-slate-50 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Welcome back! Choose your preferred login method
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl mb-6">
            {(["password", "otp"] as AuthTab[]).map(t => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setPwError("");
                  setOtpError("");
                }}
                disabled={isPending}
                className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  tab === t
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {t === "password" ? "Password" : "OTP Login"}
              </button>
            ))}
          </div>

          {/* ── PASSWORD TAB ── */}
          {tab === "password" && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={pwEmail}
                  onChange={e => {
                    setPwEmail(e.target.value);
                    setPwError("");
                  }}
                  placeholder="you@example.com"
                  autoFocus
                  autoComplete="email"
                  disabled={pwPending}
                  className="w-full min-h-[44px] text-base border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-slate-900 dark:text-slate-100 transition-shadow"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Password
                  </label>
                  <Link
                    href="/signin/forgot-password"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={pwPassword}
                    onChange={e => {
                      setPwPassword(e.target.value);
                      setPwError("");
                    }}
                    placeholder="Your password"
                    autoComplete="current-password"
                    disabled={pwPending}
                    className="w-full min-h-[44px] text-base border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-950 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-slate-900 dark:text-slate-100 transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    disabled={pwPending}
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

              {pwError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                  <Icons.alertCircle className="w-4 h-4 shrink-0" />
                  <span>{pwError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={pwPending}
                className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {pwPending ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in with Password"
                )}
              </Button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Create one
                  </Link>
                </span>
              </div>
            </form>
          )}

          {/* ── OTP TAB ── */}
          {tab === "otp" && otpStep === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={otpEmail}
                  onChange={e => {
                    setOtpEmail(e.target.value);
                    setOtpError("");
                  }}
                  placeholder="you@example.com"
                  autoFocus
                  disabled={otpPending}
                  className="w-full min-h-[44px] text-base border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-slate-900 dark:text-slate-100 transition-shadow"
                />
              </div>

              {otpError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                  <Icons.alertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={otpPending}
                className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {otpPending ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP Code"
                )}
              </Button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Create one
                  </Link>
                </span>
              </div>
            </form>
          )}

          {tab === "otp" && otpStep === "code" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Code sent to <span className="text-slate-800 dark:text-slate-200">{otpEmail}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setOtpStep("email")}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ← Change email
                </button>
              </div>

              {/* 6 OTP boxes */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpKey(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Backspace") {
                        handleOtpBackspace(i, e);
                      }
                    }}
                    onFocus={e => e.target.select()}
                    autoFocus={i === 0}
                    disabled={otpPending}
                    className="w-12 h-14 text-center text-xl font-extrabold text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 focus:outline-none transition-colors dark:bg-slate-950"
                  />
                ))}
              </div>

              {otpError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                  <Icons.alertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otpPending}
                  className="w-full min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {otpPending ? (
                    <>
                      <Icons.loader className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0 || otpPending}
                  className="w-full min-h-[44px] text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Didn't get a code? Resend"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
