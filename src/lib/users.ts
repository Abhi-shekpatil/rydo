import { supabase } from "./supabase";

export interface User {
  id: string;
  name: string;
  phone: string;
  password: string;
  aadhaar_number: string;
  dl_number: string;
  bike_model: string;
  city: string;
  created_at: string;
}

export type PublicUser = Omit<User, "password" | "aadhaar_number">;

export async function getUserById(id: string): Promise<User | null> {
  const { data } = await supabase.from("users").select("*").eq("id", id).single();
  return data;
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const { data } = await supabase.from("users").select("*").eq("phone", phone).single();
  return data;
}

export async function addUser(user: Omit<User, "id" | "created_at">): Promise<User> {
  const { data, error } = await supabase.from("users").insert(user).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export function toPublicUser(user: User): PublicUser {
  const { password, aadhaar_number, ...pub } = user;
  return pub;
}

export async function getAverageRating(userId: string): Promise<{ avg: number; count: number }> {
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("to_user_id", userId);

  if (!data || data.length === 0) return { avg: 0, count: 0 };
  const sum = data.reduce((s, r) => s + r.rating, 0);
  return { avg: Math.round((sum / data.length) * 10) / 10, count: data.length };
}
