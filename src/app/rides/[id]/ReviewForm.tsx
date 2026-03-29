"use client";

import { useState } from "react";

interface Props {
  rideId: string;
  toUserId: string;
  toUserName: string;
}

export default function ReviewForm({ rideId, toUserId, toUserName }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rideId, toUserId, rating, comment }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to submit review");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="bg-teal/10 border border-teal/20 rounded-xl px-4 py-3 text-teal text-sm font-medium">
        ✓ Review submitted for {toUserName}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-400">Rate your experience with <span className="text-white">{toUserName}</span></p>

      {error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-lg text-sm">{error}</div>
      )}

      {/* Star rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl transition-transform hover:scale-110"
          >
            <span className={(hovered || rating) >= star ? "text-yellow-400" : "text-gray-600"}>★</span>
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment (optional)"
        rows={2}
        className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:ring-2 focus:ring-accent/50 transition resize-none"
      />

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="bg-gradient-to-r from-accent to-teal text-dark-950 font-bold px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50 text-sm cursor-pointer"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
