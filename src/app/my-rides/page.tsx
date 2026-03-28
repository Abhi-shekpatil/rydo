import { getSessionUser } from "@/lib/auth";
import { getRidesByUserId } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MyRidesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const rides = await getRidesByUserId(user.id);

  const ownRides = rides.filter((r) => r.rider_id === user.id);
  const joinedRides = rides.filter((r) => r.rider_id !== user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">My Rides</h1>

      {/* Posted by me */}
      <h2 className="text-lg font-semibold text-white mb-3">
        Posted by me
        <span className="text-gray-600 font-normal text-sm ml-2">({ownRides.length})</span>
      </h2>
      {ownRides.length === 0 ? (
        <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-8 text-center text-gray-500 mb-8">
          You haven{"'"}t posted any rides yet.{" "}
          <a href="/rides/new" className="text-accent hover:underline">Post one now!</a>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {ownRides.map((ride) => {
            const quotes = ride.quotes || [];
            const accepted = quotes.find((q) => q.status === "accepted");
            const pending = quotes.filter((q) => q.status === "pending").length;
            return (
              <a
                key={ride.id}
                href={`/rides/${ride.id}`}
                className="block bg-dark-800/60 rounded-xl border border-white/5 hover:border-accent/20 transition-all p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">
                        {ride.from_city} <span className="text-accent">→</span> {ride.to_city}
                      </span>
                      {accepted ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal/15 text-teal border border-teal/25">✓ Confirmed</span>
                      ) : pending > 0 ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{pending} quote{pending > 1 ? "s" : ""}</span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-royal/10 text-royal border border-royal/20">Open</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(ride.date).toLocaleDateString("en-IN", {
                        weekday: "short", month: "short", day: "numeric",
                      })}{" "}at {ride.time}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-accent font-bold">₹{ride.fuel_cost}</span>
                    <p className="text-xs text-teal font-medium mt-0.5">
                      {ride.vehicle_type === "car" ? "🚗" : "🏍️"} Your ride
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Joined as pillion */}
      <h2 className="text-lg font-semibold text-white mb-3">
        Joined as co-rider
        <span className="text-gray-600 font-normal text-sm ml-2">({joinedRides.length})</span>
      </h2>
      {joinedRides.length === 0 ? (
        <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-8 text-center text-gray-500">
          You haven{"'"}t joined any rides yet.{" "}
          <a href="/rides" className="text-accent hover:underline">Browse rides!</a>
        </div>
      ) : (
        <div className="space-y-2">
          {joinedRides.map((ride) => (
            <a
              key={ride.id}
              href={`/rides/${ride.id}`}
              className="block bg-dark-800/60 rounded-xl border border-white/5 hover:border-royal/20 transition-all p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white">
                    {ride.from_city} <span className="text-royal">→</span> {ride.to_city}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(ride.date).toLocaleDateString("en-IN", {
                      weekday: "short", month: "short", day: "numeric",
                    })}{" "}at {ride.time} · with {ride.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-accent font-bold">₹{ride.fuel_cost}</span>
                  <p className="text-xs text-royal font-medium mt-0.5">
                    {ride.vehicle_type === "car" ? "🚗" : "🏍️"} Pillion
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
