"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "phone" | "otp";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose: "reset" }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to send OTP");
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, newPassword }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Reset failed");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  async function resendOtp() {
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose: "reset" }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to resend OTP");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-500">
          {step === "phone"
            ? "Enter your registered phone number"
            : <>OTP sent to <span className="text-white">+91 {phone}</span></>}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending OTP..." : "Send OTP →"}
          </button>
          <p className="text-center text-sm text-gray-500">
            <a href="/login" className="text-accent font-medium hover:underline">Back to login</a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleReset} className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">6-digit OTP</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-3 text-white text-center text-2xl tracking-widest placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
              className="text-gray-500 hover:text-white transition"
            >
              ← Change number
            </button>
            <button
              type="button"
              onClick={resendOtp}
              className="text-accent hover:underline"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
