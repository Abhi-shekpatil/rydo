import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { addReview, hasReviewed } from "@/lib/reviews";
import { getRideById } from "@/lib/db";

export async function POST(request: NextRequest) {
  const currentUser = await getSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { rideId, toUserId, rating, comment } = body;

  if (!rideId || !toUserId || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  if (currentUser.id === toUserId) {
    return NextResponse.json({ error: "Cannot review yourself" }, { status: 400 });
  }

  const ride = await getRideById(rideId);
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  // Ride must be in the past
  if (new Date(ride.date) >= new Date(new Date().toDateString())) {
    return NextResponse.json({ error: "Can only review after the ride date" }, { status: 400 });
  }

  const quotes = ride.quotes || [];
  const acceptedQuote = quotes.find((q) => q.status === "accepted");

  // Verify the reviewer was involved in this confirmed ride
  const isRider = ride.rider_id === currentUser.id;
  const isAcceptedCo = acceptedQuote?.user_id === currentUser.id;

  if (!isRider && !isAcceptedCo) {
    return NextResponse.json({ error: "You were not part of this ride" }, { status: 403 });
  }

  // Verify toUserId is the other party
  if (isRider && toUserId !== acceptedQuote?.user_id) {
    return NextResponse.json({ error: "Invalid review target" }, { status: 403 });
  }
  if (isAcceptedCo && toUserId !== ride.rider_id) {
    return NextResponse.json({ error: "Invalid review target" }, { status: 403 });
  }

  const alreadyReviewed = await hasReviewed(currentUser.id, toUserId, rideId);
  if (alreadyReviewed) {
    return NextResponse.json({ error: "You have already reviewed this person for this ride" }, { status: 409 });
  }

  const review = await addReview({
    from_user_id: currentUser.id,
    to_user_id: toUserId,
    ride_id: rideId,
    rating,
    comment: comment || "",
  });

  return NextResponse.json(review, { status: 201 });
}
