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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Filters */}
      <form method="GET" className="bg-white rounded-xl shadow p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <select
              name="from"
              defaultValue={params.from || ""}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Any city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <select
              name="to"
              defaultValue={params.to || ""}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Any city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={params.date || ""}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition cursor-pointer"
            >
              Search
            </button>
            <a
              href="/rides"
              className="py-2 px-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition text-center"
            >
              Clear
            </a>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {hasFilters ? "Search Results" : "All Rides"}
          <span className="text-gray-400 font-normal text-lg ml-2">
            ({rides.length} {rides.length === 1 ? "ride" : "rides"})
          </span>
        </h1>
        <a
          href="/rides/new"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm font-medium"
        >
          + Post a Ride
        </a>
      </div>

      {rides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg mb-4">No rides found.</p>
          <a href="/rides/new" className="text-orange-600 font-medium hover:underline">
            Be the first to post a ride!
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {rides.map((ride) => (
            <a
              key={ride.id}
              href={`/rides/${ride.id}`}
              className="block bg-white rounded-xl shadow hover:shadow-md transition p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                    <span>{ride.from_city}</span>
                    <span className="text-orange-500">→</span>
                    <span>{ride.to_city}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(ride.date).toLocaleDateString("en-IN", {
                      weekday: "short", year: "numeric", month: "short", day: "numeric",
                    })}{" "}
                    at {ride.time}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    {ride.bike_model || "Bike"}
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                    ₹{ride.fuel_cost}
                  </span>
                  <span className="font-medium text-gray-800">{ride.name}</span>
                </div>
              </div>
              {ride.note && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-1">{ride.note}</p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
