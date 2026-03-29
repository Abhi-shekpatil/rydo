"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cities } from "@/lib/cities";

type Step = "form" | "otp";

interface FormData {
  name: string;
  phone: string;
  password: string;
  aadhaarNumber: string;
  dlNumber: string;
  bikeModel: string;
  city: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: FormData = {
      name: form.get("name") as string,
      phone: form.get("phone") as string,
      password: form.get("password") as string,
      aadhaarNumber: form.get("aadhaarNumber") as string,
      dlNumber: form.get("dlNumber") as string,
      bikeModel: form.get("bikeModel") as string,
      city: form.get("city") as string,
    };

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: data.phone, purpose: "register" }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to send OTP");
      setLoading(false);
      return;
    }

    setFormData(data);
    setStep("otp");
    setLoading(false);
  }

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, otp }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Registration failed");
      setLoading(false);
      return;
    }

    router.push("/rides");
    router.refresh();
  }

  async function resendOtp() {
    if (!formData) return;
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formData.phone, purpose: "register" }),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to resend OTP");
    }
  }

  if (step === "otp" && formData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Verify Phone</h1>
          <p className="text-gray-500">
            OTP sent to <span className="text-white">+91 {formData.phone}</span>
          </p>
        </div>

        <form onSubmit={handleOtpSubmit} className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Enter 6-digit OTP</label>
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

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => { setStep("form"); setOtp(""); setError(""); }}
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
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Join Rydo</h1>
        <p className="text-gray-500">Create your account to start riding together</p>
      </div>

      <form onSubmit={handleFormSubmit} className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 space-y-5">
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Full Name *</label>
            <input
              type="text" name="name" required placeholder="Rahul Sharma"
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Phone *</label>
            <input
              type="tel" name="phone" required pattern="[0-9]{10}" placeholder="9876543210"
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Password *</label>
          <input
            type="password" name="password" required minLength={6} placeholder="Minimum 6 characters"
            className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
          />
        </div>

        <div className="border-t border-white/5 pt-5">
          <p className="text-xs font-medium text-accent uppercase tracking-wider mb-3">Identity Verification</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Aadhaar Number *</label>
              <input
                type="text" name="aadhaarNumber" required placeholder="1234 5678 9012"
                pattern="\d{4}\s\d{4}\s\d{4}" title="Format: 1234 5678 9012"
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Driving License *</label>
              <input
                type="text" name="dlNumber" required placeholder="MH02 20190045678"
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-5">
          <p className="text-xs font-medium text-teal uppercase tracking-wider mb-3">Bike & City</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Bike Model</label>
              <input
                type="text" name="bikeModel" placeholder="e.g. Royal Enfield Classic 350"
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">City</label>
              <select
                name="city"
                className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition"
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Sending OTP..." : "Send OTP →"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-accent font-medium hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
