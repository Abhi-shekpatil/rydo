"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuoteActions({
  rideId,
  userId,
  currentStatus,
}: {
  rideId: string;
  userId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  async function handleAction(action: "accepted" | "rejected") {
    setLoading(action);
    await fetch(`/api/rides/${rideId}/quote/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading("");
    router.refresh();
  }

  if (currentStatus !== "pending") {
    return (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          currentStatus === "accepted"
            ? "bg-teal/10 text-teal border border-teal/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}
      >
        {currentStatus === "accepted" ? "Accepted" : "Rejected"}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("accepted")}
        disabled={!!loading}
        className="bg-teal/10 text-teal border border-teal/20 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-teal/20 transition disabled:opacity-50 cursor-pointer"
      >
        {loading === "accepted" ? "..." : "Accept"}
      </button>
      <button
        onClick={() => handleAction("rejected")}
        disabled={!!loading}
        className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition disabled:opacity-50 cursor-pointer"
      >
        {loading === "rejected" ? "..." : "Reject"}
      </button>
    </div>
  );
}
