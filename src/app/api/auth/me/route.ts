import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { toPublicUser, getAverageRating } from "@/lib/users";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const rating = await getAverageRating(user.id);
  return NextResponse.json({ ...toPublicUser(user), rating });
}
