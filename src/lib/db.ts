import { supabaseServer as supabase } from "./supabase-server";

export interface Quote {
  id: string;
  ride_id: string;
  user_id: string;
  amount: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface Ride {
  id: string;
  rider_id: string;
  name: string;
  phone: string;
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  bike_model: string;
  vehicle_type: "bike" | "car";
  seats: number;
  fuel_cost: number;
  note: string;
  created_at: string;
  quotes?: Quote[];
}

export async function getAllRides(): Promise<Ride[]> {
  const expiryDate = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("rides")
    .select("*, quotes(*)")
    .gte("created_at", expiryDate)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getRideById(id: string): Promise<Ride | null> {
  const { data } = await supabase
    .from("rides")
    .select("*, quotes(*)")
    .eq("id", id)
    .single();
  return data;
}

export async function addRide(ride: Omit<Ride, "id" | "created_at" | "quotes">): Promise<Ride> {
  const { data, error } = await supabase.from("rides").insert(ride).select("*, quotes(*)").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function searchRides(from?: string, to?: string, date?: string, vehicleType?: string): Promise<Ride[]> {
  const expiryDate = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  let query = supabase.from("rides").select("*, quotes(*)").gte("created_at", expiryDate).order("created_at", { ascending: false });
  if (from) query = query.ilike("from_city", from);
  if (to) query = query.ilike("to_city", to);
  if (date) query = query.eq("date", date);
  if (vehicleType && vehicleType !== "all") query = query.eq("vehicle_type", vehicleType);
  const { data } = await query;
  return data || [];
}

export async function getRidesByUserId(userId: string): Promise<Ride[]> {
  // Get rides where user is the rider
  const { data: ownRides } = await supabase
    .from("rides")
    .select("*, quotes(*)")
    .eq("rider_id", userId)
    .order("created_at", { ascending: false });

  // Get rides where user has an accepted quote
  const { data: acceptedQuotes } = await supabase
    .from("quotes")
    .select("ride_id")
    .eq("user_id", userId)
    .eq("status", "accepted");

  let joinedRides: Ride[] = [];
  if (acceptedQuotes && acceptedQuotes.length > 0) {
    const rideIds = acceptedQuotes.map((q) => q.ride_id);
    const { data } = await supabase
      .from("rides")
      .select("*, quotes(*)")
      .in("id", rideIds)
      .order("created_at", { ascending: false });
    joinedRides = data || [];
  }

  const allRides = [...(ownRides || []), ...joinedRides];
  const seen = new Set<string>();
  return allRides.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

export async function addQuote(rideId: string, userId: string, amount: number): Promise<Quote> {
  const { data, error } = await supabase
    .from("quotes")
    .insert({ ride_id: rideId, user_id: userId, amount, status: "pending" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateQuoteStatus(
  rideId: string,
  userId: string,
  status: "accepted" | "rejected"
): Promise<Quote> {
  const { data, error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("ride_id", rideId)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
