"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-400 hover:text-red-600 transition text-sm cursor-pointer"
      title="Logout"
    >
      Logout
    </button>
  );
}
