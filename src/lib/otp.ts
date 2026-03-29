import { supabaseServer } from "./supabase-server";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOTP(phone: string, purpose: "register" | "reset"): Promise<string> {
  // invalidate previous unused OTPs
  await supabaseServer.from("otp_codes").update({ used: true })
    .eq("phone", phone).eq("purpose", purpose).eq("used", false);
  const code = generateCode();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  await supabaseServer.from("otp_codes").insert({ phone, code, purpose, expires_at });
  return code;
}

export async function verifyOTP(phone: string, code: string, purpose: "register" | "reset"): Promise<boolean> {
  const { data } = await supabaseServer.from("otp_codes").select("id")
    .eq("phone", phone).eq("code", code).eq("purpose", purpose)
    .eq("used", false).gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false }).limit(1).single();
  if (!data) return false;
  await supabaseServer.from("otp_codes").update({ used: true }).eq("id", data.id);
  return true;
}

export async function sendOTPSMS(phone: string, code: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log(`[DEV OTP] ${phone}: ${code}`);
    return;
  }
  const url = new URL("https://www.fast2sms.com/dev/bulkV2");
  url.searchParams.set("authorization", apiKey);
  url.searchParams.set("route", "otp");
  url.searchParams.set("variables_values", code);
  url.searchParams.set("numbers", phone);
  await fetch(url.toString());
}
