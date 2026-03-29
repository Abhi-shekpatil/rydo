import { supabaseServer as supabase } from "./supabase-server";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  ride_id: string | null;
  read: boolean;
  created_at: string;
}

export async function createNotification(
  userId: string,
  type: string,
  message: string,
  rideId?: string
): Promise<void> {
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    message,
    ride_id: rideId || null,
  });
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return data || [];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return count ?? 0;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}
