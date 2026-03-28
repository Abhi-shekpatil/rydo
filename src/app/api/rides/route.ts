import { NextRequest, NextResponse } from "next/server";
import { getAllRides, addRide, searchRides } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const date = searchParams.get("date") || undefined;

  if (from || to || date) {
    return NextResponse.json(await searchRides(from, to, date));
  }
  return NextResponse.json(await getAllRides());
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await request.json();
  const { fromCity, toCity, date, time, fuelCost, vehicleType, note } = body;

  if (!fromCity || !toCity || !date || !time || !fuelCost) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ride = await addRide({
    rider_id: user.id,
    name: user.name,
    phone: user.phone,
    from_city: fromCity,
    to_city: toCity,
    date,
    time,
    bike_model: user.bike_model,
    vehicle_type: vehicleType === "car" ? "car" : "bike",
    seats: 1,
    fuel_cost: Number(fuelCost),
    note: note || "",
  });

  return NextResponse.json(ride, { status: 201 });
}
