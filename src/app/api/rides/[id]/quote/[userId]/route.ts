import { NextRequest, NextResponse } from "next/server";
import { getRideById, updateQuoteStatus } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const { id, userId } = await params;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const ride = await getRideById(id);
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  if (ride.rider_id !== user.id) {
    return NextResponse.json({ error: "Only the rider can accept/reject quotes" }, { status: 403 });
  }

  const { action } = await request.json();
  if (action !== "accepted" && action !== "rejected") {
    return NextResponse.json({ error: "Action must be 'accepted' or 'rejected'" }, { status: 400 });
  }

  const quote = ride.quotes?.find((q) => q.user_id === userId);
  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  if (quote.status !== "pending") {
    return NextResponse.json({ error: "Quote already " + quote.status }, { status: 409 });
  }

  try {
    await updateQuoteStatus(id, userId, action);
    const message =
      action === "accepted"
        ? `Your quote of ₹${quote.amount} was accepted for ${ride.from_city} → ${ride.to_city}`
        : `Your quote was not accepted for ${ride.from_city} → ${ride.to_city}`;
    await createNotification(userId, action, message, id);
    const updated = await getRideById(id);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update quote" },
      { status: 500 }
    );
  }
}
