import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/messages";
import LogoutButton from "./LogoutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rydo - Intercity Bike Ride Pooling",
  description:
    "Find a co-rider for your next intercity bike trip. Share the ride, split the cost, enjoy the journey.",
};

async function Navbar() {
  const user = await getSessionUser();
  const unread = user ? await getUnreadCount(user.id) : 0;

  return (
    <nav className="bg-dark-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-accent">Ry</span>
          <span className="text-white">do</span>
        </a>
        <div className="flex items-center gap-3 text-sm font-medium">
          <a
            href="/rides"
            className="text-gray-400 hover:text-accent transition px-3 py-1.5"
          >
            Browse Rides
          </a>
          {user ? (
            <>
              <a
                href="/rides/new"
                className="bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-lg hover:bg-accent/20 transition"
              >
                + Post a Ride
              </a>
              <a
                href="/profile"
                className="relative text-gray-400 hover:text-white transition"
              >
                {user.name.split(" ")[0]}
                {unread > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-royal text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </a>
              <LogoutButton />
            </>
          ) : (
            <a
              href="/login"
              className="bg-gradient-to-r from-accent to-teal text-dark-950 font-semibold px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-accent/20 transition"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <main>{children}</main>

        {/* SOS Button */}
        <a
          href="tel:+916260718348"
          className="fixed bottom-6 right-6 bg-red-600/90 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-red-900/40 hover:bg-red-500 hover:scale-105 transition-all text-xs font-bold z-50 ring-2 ring-red-500/30"
          title="Emergency SOS"
        >
          SOS
        </a>
      </body>
    </html>
  );
}
