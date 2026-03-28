import { NextRequest, NextResponse } from "next/server";
import { getUserByPhone, toPublicUser } from "@/lib/users";
import { setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { phone, password } = await request.json();

  if (!phone || !password) {
    return NextResponse.json({ error: "Phone and password required" }, { status: 400 });
  }

  const user = await getUserByPhone(phone);
  const passwordValid = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !passwordValid) {
    return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
  }

  await setSession(user.id);
  return NextResponse.json(toPublicUser(user));
}
