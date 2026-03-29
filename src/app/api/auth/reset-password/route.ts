import { NextRequest, NextResponse } from "next/server";
import { getUserByPhone } from "@/lib/users";
import { verifyOTP } from "@/lib/otp";
import { supabaseServer } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, otp, newPassword } = body;

  if (!phone || !otp || !newPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const valid = await verifyOTP(phone, otp, "reset");
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  const user = await getUserByPhone(phone);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await supabaseServer
    .from("users")
    .update({ password: hashedPassword })
    .eq("phone", phone);

  return NextResponse.json({ ok: true });
}
