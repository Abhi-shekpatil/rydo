import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getNotifications, markAllNotificationsRead } from "@/lib/notifications";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notifications = await getNotifications(user.id);
  return NextResponse.json(notifications);
}

export async function PATCH() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await markAllNotificationsRead(user.id);
  return NextResponse.json({ ok: true });
}
