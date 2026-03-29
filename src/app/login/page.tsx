"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.get("phone"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Login failed");
      setLoading(false);
      return;
    }

    router.push("/rides");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-500">Login to your Rydo account</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 space-y-4">
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">
            {error}{" "}
            <a href="/forgot-password" className="underline font-medium hover:text-red-300 transition">
              Forgot password?
            </a>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            pattern="[0-9]{10}"
            placeholder="9876543210"
            className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex flex-col gap-2 text-sm text-center">
          <a href="/forgot-password" className="text-accent font-medium hover:underline">Forgot password?</a>
          <p className="text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-accent font-medium hover:underline">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}
