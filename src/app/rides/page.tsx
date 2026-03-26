import { searchRides } from "@/lib/db";
import { cities } from "@/lib/cities";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}

export default async function RidesPage({ searchParams }: Props) {
  const params = await searchParams;
  const rides = await searchRides(params.from, params.to, params.date);
  const hasFilters = params.from || params.to || params.date;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Filters */}
      <form method="GET" className="bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-white/5 p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">From</label>
            <select
              name="from"
              defaultValue={params.from || ""}
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition"
            >
              <option value="">Any city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">To</label>
            <select
              name="to"
              defaultValue={params.to || ""}
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition"
            >
              <option value="">Any city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={params.date || ""}
              className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 transition"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-2.5 px-4 rounded-lg hover:shadow-lg hover:shadow-accent/25 transition-all cursor-pointer"
            >
              Search
            </button>
            <a
              href="/rides"
              className="py-2.5 px-3 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition text-center"
            >
              Clear
            </a>
          </div>
        </div>
      </form>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          {hasFilters ? "Search Results" : "All Rides"}
          <span className="text-gray-600 font-normal text-lg ml-2">
            ({rides.length})
          </span>
        </h1>
        <a
          href="/rides/new"
          className="bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-lg hover:bg-accent/20 transition text-sm font-medium"
        >
          + Post a Ride
        </a>
      </div>

      {/* Ride Cards */}
      {rides.length === 0 ? (
        <div className="text-center py-20 bg-dark-800/40 rounded-2xl border border-white/5">
          <p className="text-gray-500 text-lg mb-4">No rides found.</p>
          <a href="/rides/new" className="text-accent font-medium hover:underline">
            Be the first to post a ride!
          </a>
        </div>
      ) : (
        <div className="grid gap-3">
          {rides.map((ride) => (
            <a
              key={ride.id}
              href={`/rides/${ride.id}`}
              className="block bg-dark-800/60 rounded-xl border border-white/5 hover:border-accent/20 hover:bg-dark-800 transition-all p-5 group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                    <span className="text-white">{ride.from_city}</span>
                    <span className="text-accent group-hover:translate-x-1 transition-transform inline-block">→</span>
                    <span className="text-white">{ride.to_city}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(ride.date).toLocaleDateString("en-IN", {
                      weekday: "short", year: "numeric", month: "short", day: "numeric",
                    })}{" "}
                    at {ride.time}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="bg-dark-700 border border-white/5 px-3 py-1 rounded-full text-gray-400">
                    {ride.bike_model || "Bike"}
                  </span>
                  <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full font-semibold">
                    ₹{ride.fuel_cost}
                  </span>
                  <span className="font-medium text-gray-300">{ride.name}</span>
                </div>
              </div>
              {ride.note && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">{ride.note}</p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
