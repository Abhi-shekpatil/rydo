import { NextRequest, NextResponse } from "next/server";
import { getUserByPhone, addUser, toPublicUser } from "@/lib/users";
import { setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, phone, password, aadhaarNumber, dlNumber, bikeModel, city } = body;

  if (!name || !phone || !password || !aadhaarNumber || !dlNumber) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!/^\d{4}\s\d{4}\s\d{4}$/.test(aadhaarNumber)) {
    return NextResponse.json({ error: "Aadhaar must be in format: 1234 5678 9012" }, { status: 400 });
  }

  const existing = await getUserByPhone(phone);
  if (existing) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await addUser({
    name,
    phone,
    password: hashedPassword,
    aadhaar_number: aadhaarNumber,
    dl_number: dlNumber,
    bike_model: bikeModel || "",
    city: city || "",
  });

  await setSession(user.id);
  return NextResponse.json(toPublicUser(user), { status: 201 });
}
