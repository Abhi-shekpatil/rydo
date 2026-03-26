import { cities } from "@/lib/cities";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ride Together, Save Together
          </h1>
          <p className="text-lg md:text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Find a co-rider for your next intercity bike trip. Share the journey,
            split the cost, make new friends.
          </p>

          {/* Search Form */}
          <form
            action="/rides"
            method="GET"
            className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <select
                  name="from"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Any city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <select
                  name="to"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Any city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-orange-700 transition cursor-pointer"
                >
                  Search Rides
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-lg mb-2">Post or Search</h3>
            <p className="text-gray-600">
              Post your upcoming ride or search for someone going your way.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-lg mb-2">Connect</h3>
            <p className="text-gray-600">
              Found a match? Call or WhatsApp them directly to plan the ride.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-lg mb-2">Ride Together</h3>
            <p className="text-gray-600">
              Meet up, share the journey, split the fuel cost, make a friend.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
