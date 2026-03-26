"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cities } from "@/lib/cities";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      phone: form.get("phone"),
      password: form.get("password"),
      aadhaarNumber: form.get("aadhaarNumber"),
      dlNumber: form.get("dlNumber"),
      bikeModel: form.get("bikeModel"),
      city: form.get("city"),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Join Rydo</h1>
        <p className="text-gray-500">Create your account to start riding together</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 space-y-5">
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-accent font-medium hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
