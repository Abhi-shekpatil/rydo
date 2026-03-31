import { cities } from "@/lib/cities";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function getStats() {
  const [{ count: rideCount }, { count: userCount }] = await Promise.all([
    supabaseServer.from("rides").select("*", { count: "exact", head: true }),
    supabaseServer.from("users").select("*", { count: "exact", head: true }),
  ]);
  return { rides: rideCount ?? 0, users: userCount ?? 0 };
}

export default async function Home() {
  const stats = await getStats();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-royal/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-block bg-accent/10 text-accent text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-accent/20">
            India&apos;s Intercity Bike Ride Pool
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
            <span className="text-white">Ride Together,</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-teal to-royal bg-clip-text text-transparent">
              Save Together
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Find a co-rider for your next intercity bike trip. Share the journey,
            split the fuel cost, make new friends on the highway.
          </p>

          {/* Search Form */}
          <form
            action="/rides"
            method="GET"
            className="bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6 max-w-3xl mx-auto text-left shadow-2xl shadow-dark-950/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                  Vehicle
                </label>
                <select
                  name="vehicle"
                  className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
                >
                  <option value="all">🚗🏍️ All</option>
                  <option value="bike">🏍️ Bike</option>
                  <option value="car">🚗 Car</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                  From
                </label>
                <select
                  name="from"
                  className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
                >
                  <option value="">Any city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                  To
                </label>
                <select
                  name="to"
                  className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
                >
                  <option value="">Any city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full bg-dark-700 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-2.5 px-6 rounded-lg hover:shadow-lg hover:shadow-accent/25 transition-all cursor-pointer"
                >
                  Search Rides
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-3 text-white">How It Works</h2>
        <p className="text-gray-500 text-center mb-12">Three simple steps to your next ride</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Post or Search", desc: "Post your upcoming ride or search for someone going your way.", color: "accent" },
            { num: "02", title: "Connect", desc: "Found a match? Call or WhatsApp them directly to plan the ride.", color: "teal" },
            { num: "03", title: "Ride Together", desc: "Meet up, share the journey, split the fuel cost, make a friend.", color: "royal" },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-dark-800/60 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition group"
            >
              <div className={`text-${step.color} text-3xl font-bold mb-4 opacity-60 group-hover:opacity-100 transition`}>
                {step.num}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-accent">{cities.length}</p>
            <p className="text-gray-500 text-sm mt-1">Cities</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-teal">{stats.rides}</p>
            <p className="text-gray-500 text-sm mt-1">Active Rides</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-royal">{stats.users}</p>
            <p className="text-gray-500 text-sm mt-1">Riders</p>
          </div>
        </div>
      </section>
    </div>
  );
}
