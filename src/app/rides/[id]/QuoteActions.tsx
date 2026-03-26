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
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          currentStatus === "accepted"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
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
        className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
      >
        {loading === "accepted" ? "..." : "Accept"}
      </button>
      <button
        onClick={() => handleAction("rejected")}
        disabled={!!loading}
        className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-200 transition disabled:opacity-50 cursor-pointer"
      >
        {loading === "rejected" ? "..." : "Reject"}
      </button>
    </div>
  );
}
