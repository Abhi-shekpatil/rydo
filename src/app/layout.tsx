import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/messages";
import ProfileDropdown from "./ProfileDropdown";
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
        <div className="flex items-center gap-2 text-sm font-medium">
          {/* Search rides icon */}
          <div className="relative group">
            <a
              href="/rides"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </a>
            <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-dark-700 border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Search Rides
            </span>
          </div>

          {user ? (
            <>
              {/* Post a ride icon */}
              <div className="relative group">
                <a
                  href="/rides/new"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </a>
                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-dark-700 border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Post a Ride
                </span>
              </div>

              {/* Chat icon */}
              <div className="relative group">
                <a
                  href="/messages"
                  className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-royal hover:bg-royal/10 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {unread > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-royal text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </a>
                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-dark-700 border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Messages
                </span>
              </div>

              <ProfileDropdown name={user.name} unread={unread} />
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
      </body>
    </html>
  );
}
