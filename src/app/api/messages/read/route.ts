import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { markAsRead } from "@/lib/messages";

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { rideId, otherUserId } = await request.json();
  if (!rideId || !otherUserId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await markAsRead(rideId, otherUserId, user.id);
  return NextResponse.json({ ok: true });
}
