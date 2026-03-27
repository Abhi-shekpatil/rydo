import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getConversation, sendMessage } from "@/lib/messages";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const rideId = searchParams.get("rideId");
  const otherUserId = searchParams.get("otherUserId");

  if (!rideId || !otherUserId) {
    return NextResponse.json({ error: "rideId and otherUserId required" }, { status: 400 });
  }

  const messages = await getConversation(rideId, user.id, otherUserId);
  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { rideId, receiverId, content } = await request.json();

  if (!rideId || !receiverId || !content?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (user.id === receiverId) {
    return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
  }

  try {
    const message = await sendMessage(rideId, user.id, receiverId, content.trim());
    return NextResponse.json(message, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send message" },
      { status: 500 }
    );
  }
}
