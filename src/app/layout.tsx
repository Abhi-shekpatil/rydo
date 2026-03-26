import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rydo - Intercity Bike Ride Pooling",
  description:
    "Find a co-rider for your next intercity bike trip. Share the ride, split the cost, enjoy the journey.",
};

async function Navbar() {
  const user = await getSessionUser();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-orange-600">
          Rydo
        </a>
        <div className="flex items-center gap-3 text-sm font-medium">
          <a
            href="/rides"
            className="text-gray-600 hover:text-orange-600 transition"
          >
            Browse Rides
          </a>
          {user ? (
            <>
              <a
                href="/rides/new"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Post a Ride
              </a>
              <a
                href="/profile"
                className="text-gray-600 hover:text-orange-600 transition"
              >
                {user.name.split(" ")[0]}
              </a>
              <LogoutButton />
            </>
          ) : (
            <a
              href="/login"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
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
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        <main>{children}</main>

        {/* SOS Button */}
        <a
          href="tel:6260718348"
          className="fixed bottom-6 right-6 bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition text-xs font-bold z-50"
          title="Emergency SOS"
        >
          SOS
        </a>
      </body>
    </html>
  );
}
