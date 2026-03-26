"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cities } from "@/lib/cities";

export default function NewRidePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) router.push("/login");
      else setLoggedIn(true);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      fromCity: form.get("fromCity"),
      toCity: form.get("toCity"),
      date: form.get("date"),
      time: form.get("time"),
      fuelCost: Number(form.get("fuelCost")),
      note: form.get("note"),
    };

    if (data.fromCity === data.toCity) {
      setError("From and To cities cannot be the same.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to post ride");
      }
      router.push("/rides");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (loggedIn === null) {
    return <div className="text-center py-20 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Post a Ride</h1>
        <p className="text-gray-500">Share your journey with fellow riders</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 space-y-5">
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">From City *</label>
            <select name="fromCity" required className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition">
              <option value="">Select city</option>
              {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">To City *</label>
            <select name="toCity" required className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition">
              <option value="">Select city</option>
              {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Date *</label>
            <input type="date" name="date" required className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Time *</label>
            <input type="time" name="time" required className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Fuel Cost (₹) *</label>
          <input type="number" name="fuelCost" required min="50" max="10000" placeholder="e.g. 500"
            className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
          />
          <p className="text-xs text-gray-600 mt-1">Pillion riders can offer 80–100% of this amount.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Note (optional)</label>
          <textarea name="note" rows={3} placeholder="Stops, helmet availability, fuel sharing..."
            className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 transition"
          />
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Posting..." : "Post Ride"}
        </button>
      </form>
    </div>
  );
}
