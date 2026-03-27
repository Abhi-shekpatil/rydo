import { supabase } from "./supabase";

export interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationSummary {
  ride_id: string;
  from_city: string;
  to_city: string;
  ride_date: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export async function getConversation(
  rideId: string,
  userA: string,
  userB: string
): Promise<Message[]> {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("ride_id", rideId)
    .or(
      `and(sender_id.eq.${userA},receiver_id.eq.${userB}),and(sender_id.eq.${userB},receiver_id.eq.${userA})`
    )
    .order("created_at", { ascending: true });
  return data || [];
}

export async function sendMessage(
  rideId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ ride_id: rideId, sender_id: senderId, receiver_id: receiverId, content })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function markAsRead(
  rideId: string,
  otherUserId: string,
  currentUserId: string
): Promise<void> {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("ride_id", rideId)
    .eq("sender_id", otherUserId)
    .eq("receiver_id", currentUserId)
    .eq("is_read", false);
}

export async function getConversationList(userId: string): Promise<ConversationSummary[]> {
  const { data, error } = await supabase.rpc("get_conversation_list", {
    p_user_id: userId,
  });
  if (error) {
    console.error("getConversationList error:", error.message);
    return [];
  }
  return data || [];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .eq("is_read", false);
  return count || 0;
}
