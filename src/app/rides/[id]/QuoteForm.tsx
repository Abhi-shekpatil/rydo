"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuoteForm({
  rideId,
  minAmount,
  maxAmount,
}: {
  rideId: string;
  minAmount: number;
  maxAmount: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(minAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/rides/${rideId}/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to send quote");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={minAmount}
          max={maxAmount}
          className="w-full bg-dark-700 border border-royal/30 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal/50 focus:border-royal/50 transition"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-royal text-white font-medium px-5 py-2 rounded-lg hover:bg-royal/80 transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Sending..." : "Send Quote"}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}
