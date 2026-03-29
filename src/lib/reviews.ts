import { supabaseServer as supabase } from "./supabase-server";

export interface Review {
  id: string;
  from_user_id: string;
  to_user_id: string;
  ride_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("to_user_id", userId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function addReview(review: Omit<Review, "id" | "created_at">): Promise<Review> {
  const { data, error } = await supabase.from("reviews").insert(review).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function hasReviewed(fromUserId: string, toUserId: string, rideId: string): Promise<boolean> {
  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("from_user_id", fromUserId)
    .eq("to_user_id", toUserId)
    .eq("ride_id", rideId)
    .limit(1)
    .single();
  return !!data;
}
