"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, KeyRound, ShieldCheck, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Step = "email" | "otp" | "newpassword" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  // Step 1 - Email
  const [email, setEmail] = useState("");

  // Step 2 - OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));

  // Step 3 - New Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: Send OTP ────────────────────────────────────────────
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // Simulate sending OTP email
    setTimeout(() => {
      console.log(`[DEV] OTP for ${email}: ${generatedOtp}`);
      setLoading(false);
      setStep("otp");
    }, 1500);
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    // Auto-focus next box
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const entered = otp.join("");
    if (entered.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (entered === generatedOtp) {
        setStep("newpassword");
      } else {
        setError("Incorrect OTP. Please try again.");
      }
    }, 1000);
  };

  // ── Step 3: Reset Password ──────────────────────────────────────
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Simulate password reset API call
    setTimeout(() => {
      // In production: call backend to update password
      setLoading(false);
      setStep("success");
    }, 1500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background Blurs */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24">
        <div className="mx-auto w-full max-w-md">

          {/* Logo */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">S</div>
              <span className="text-xl">Super Mandi</span>
            </Link>
          </div>

          {/* Step Indicator */}
          {step !== "success" && (
            <div className="flex items-center justify-center gap-3 mb-8">
              {(["email", "otp", "newpassword"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s 
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                      : ["email", "otp", "newpassword"].indexOf(step) > i
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}>
                    {["email", "otp", "newpassword"].indexOf(step) > i ? "✓" : i + 1}
                  </div>
                  {i < 2 && <div className={`h-0.5 w-8 rounded-full transition-all ${["email", "otp", "newpassword"].indexOf(step) > i ? "bg-emerald-400" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
          )}

          <Card className="rounded-3xl border-0 bg-white shadow-sm">
            <CardContent className="p-8">

              {/* ── STEP 1: Email ── */}
              {step === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-7 w-7 text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
                    <p className="text-sm text-slate-500">Enter your registered email and we'll send you a 6-digit OTP.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Remember your password?{" "}
                    <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">Sign In</Link>
                  </p>
                </form>
              )}

              {/* ── STEP 2: OTP Verification ── */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="h-7 w-7 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Enter OTP</h1>
                    <p className="text-sm text-slate-500">
                      We've sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                      [DEV MODE] OTP: {generatedOtp}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="h-12 w-12 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all bg-slate-50"
                      />
                    ))}
                  </div>

                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Didn't receive it?{" "}
                    <button type="button" onClick={() => setStep("email")} className="font-semibold text-orange-600 hover:text-orange-700">
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}

              {/* ── STEP 3: New Password ── */}
              {step === "newpassword" && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
                    <p className="text-sm text-slate-500">Create a strong new password for your account.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="w-full h-12 px-4 pr-12 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {/* Password strength bar */}
                      {newPassword && (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                                newPassword.length >= i * 3
                                  ? newPassword.length >= 12 ? "bg-emerald-500" : newPassword.length >= 8 ? "bg-amber-400" : "bg-red-400"
                                  : "bg-slate-200"
                              }`} />
                            ))}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {newPassword.length < 8 ? "Too short" : newPassword.length < 12 ? "Medium strength" : "Strong password ✓"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="w-full h-12 px-4 pr-12 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                          {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {confirmPassword && (
                        <p className={`text-[11px] font-medium ${newPassword === confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
                          {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </form>
              )}

              {/* ── STEP 4: Success ── */}
              {step === "success" && (
                <div className="text-center space-y-6 py-4">
                  <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Password Reset!</h1>
                    <p className="text-sm text-slate-500">
                      Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/login")}
                    className="h-12 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Back link */}
          {step !== "success" && (
            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-400">
            © 2026 Super Mandi. India's Agricultural Operating System.
          </div>

        </div>
      </div>
    </main>
  );
}
