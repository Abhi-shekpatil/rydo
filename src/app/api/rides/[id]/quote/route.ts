import { NextRequest, NextResponse } from "next/server";
import { getRideById, addQuote } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const ride = await getRideById(id);
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  if (ride.rider_id === user.id) {
    return NextResponse.json({ error: "Cannot quote your own ride" }, { status: 400 });
  }

  const { amount } = await request.json();
  const minAmount = Math.ceil(ride.fuel_cost * 0.8);

  if (!amount || amount < minAmount) {
    return NextResponse.json(
      { error: `Minimum quote is ₹${minAmount} (80% of ₹${ride.fuel_cost})` },
      { status: 400 }
    );
  }

  if (amount > ride.fuel_cost) {
    return NextResponse.json(
      { error: `Quote cannot exceed fuel cost of ₹${ride.fuel_cost}` },
      { status: 400 }
    );
  }

  const existing = ride.quotes?.find((q) => q.user_id === user.id);
  if (existing) {
    return NextResponse.json({ error: "You already quoted on this ride" }, { status: 409 });
  }

  try {
    await addQuote(id, user.id, amount);
    const updated = await getRideById(id);
    return NextResponse.json(updated, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add quote" },
      { status: 500 }
    );
  }
}
