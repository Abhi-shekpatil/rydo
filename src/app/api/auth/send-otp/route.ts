import { NextRequest, NextResponse } from "next/server";
import { getUserByPhone } from "@/lib/users";
import { createOTP, sendOTPSMS } from "@/lib/otp";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, purpose } = body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "Valid 10-digit phone number required" }, { status: 400 });
  }

  if (!purpose || !["register", "reset"].includes(purpose)) {
    return NextResponse.json({ error: "Invalid purpose" }, { status: 400 });
  }

  const existing = await getUserByPhone(phone);

  if (purpose === "register" && existing) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  if (purpose === "reset" && !existing) {
    return NextResponse.json({ error: "No account found with this phone number" }, { status: 404 });
  }

  // Rate limit: check for unused OTP created within last 60 seconds
  const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString();
  const { data: recentOtp } = await supabaseServer
    .from("otp_codes")
    .select("id")
    .eq("phone", phone)
    .eq("purpose", purpose)
    .eq("used", false)
    .gte("created_at", sixtySecondsAgo)
    .limit(1)
    .single();

  if (recentOtp) {
    return NextResponse.json({ error: "Please wait before requesting another OTP" }, { status: 429 });
  }

  const code = await createOTP(phone, purpose);
  await sendOTPSMS(phone, code);

  return NextResponse.json({ ok: true });
}
