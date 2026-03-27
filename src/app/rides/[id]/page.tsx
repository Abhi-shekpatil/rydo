import { getRideById } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getUserById, getAverageRating } from "@/lib/users";
import { notFound } from "next/navigation";
import QuoteForm from "./QuoteForm";
import QuoteActions from "./QuoteActions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RideDetailPage({ params }: Props) {
  const { id } = await params;
  const ride = await getRideById(id);

  if (!ride) notFound();

  const currentUser = await getSessionUser();
  const rider = await getUserById(ride.rider_id);
  const riderRating = await getAverageRating(ride.rider_id);
  const minQuote = Math.ceil(ride.fuel_cost * 0.8);
  const quotes = ride.quotes || [];

  const whatsappLink = `https://wa.me/91${ride.phone}?text=${encodeURIComponent(
    `Hi ${ride.name}, I saw your ride from ${ride.from_city} to ${ride.to_city} on Rydo. I'm interested in joining!`
  )}`;

  const isOwnRide = currentUser?.id === ride.rider_id;
  const hasQuoted = currentUser
    ? quotes.some((q) => q.user_id === currentUser.id)
    : false;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <a href="/rides" className="text-accent hover:text-accent-light text-sm mb-4 inline-flex items-center gap-1 transition">
        ← Back to rides
      </a>

      <div className="bg-dark-800/60 rounded-2xl border border-white/5 p-6">
        {/* Route Header */}
        <div className="flex items-center gap-3 text-2xl font-bold mb-1">
          <span className="text-white">{ride.from_city}</span>
          <span className="text-accent">→</span>
          <span className="text-white">{ride.to_city}</span>
        </div>
        <p className="text-gray-500 mb-6">
          {new Date(ride.date).toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}{" "}
          at {ride.time}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-dark-700/80 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rider</p>
            <p className="font-semibold text-white">{ride.name}</p>
            {riderRating.count > 0 && (
              <p className="text-sm text-yellow-500 mt-0.5">
                {riderRating.avg} ★ <span className="text-gray-500">({riderRating.count})</span>
              </p>
            )}
          </div>
          <div className="bg-dark-700/80 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bike</p>
            <p className="font-semibold text-white">{ride.bike_model || "Not specified"}</p>
          </div>
          <div className="bg-dark-700/80 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fuel Cost</p>
            <p className="font-bold text-accent text-xl">₹{ride.fuel_cost}</p>
            <p className="text-xs text-gray-600">Min quote: ₹{minQuote}</p>
          </div>
          <div className="bg-dark-700/80 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
            <p className="font-semibold text-white">{ride.phone}</p>
          </div>
          {rider?.dl_number && (
            <div className="bg-dark-700/80 border border-white/5 rounded-xl p-4 col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Driving License</p>
              <p className="font-semibold text-white">{rider.dl_number}</p>
            </div>
          )}
        </div>

        {/* Note */}
        {ride.note && (
          <div className="bg-accent/5 border border-accent/10 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Note from rider</p>
            <p className="text-gray-300">{ride.note}</p>
          </div>
        )}

        {/* Quote Section */}
        {currentUser && !isOwnRide && !hasQuoted && (
          <div className="bg-royal/5 border border-royal/15 rounded-xl p-4 mb-6">
            <p className="font-medium text-royal mb-2">Send a fuel quote to join this ride</p>
            <p className="text-sm text-gray-500 mb-3">
              Offer between ₹{minQuote} and ₹{ride.fuel_cost}
            </p>
            <QuoteForm rideId={ride.id} minAmount={minQuote} maxAmount={ride.fuel_cost} />
          </div>
        )}

        {hasQuoted && (
          <div className="bg-teal/5 border border-teal/15 rounded-xl p-4 mb-6 text-teal">
            You have already sent a quote for this ride.
          </div>
        )}

        {isOwnRide && quotes.length > 0 && (
          <div className="mb-6">
            <p className="font-medium text-white mb-3">Quotes received ({quotes.length})</p>
            <div className="space-y-2">
              {quotes.map((q) => (
                <div key={q.user_id} className="bg-dark-700/80 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-300">{q.user_id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-accent font-bold text-lg">₹{q.amount}</span>
                    <QuoteActions rideId={ride.id} userId={q.user_id} currentStatus={q.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact + Chat Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${ride.phone}`}
            className="flex-1 text-center bg-gradient-to-r from-accent to-teal text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all"
          >
            Call {ride.name}
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-semibold py-3 rounded-xl hover:bg-emerald-600/30 transition"
          >
            WhatsApp
          </a>
        </div>

        {/* Chat Button */}
        {currentUser && !isOwnRide && (
          <a
            href={`/chat/${ride.id}/${ride.rider_id}`}
            className="mt-3 w-full text-center bg-royal/10 text-royal border border-royal/20 font-semibold py-3 rounded-xl hover:bg-royal/20 transition block"
          >
            💬 Chat with {ride.name}
          </a>
        )}

        {/* Rider sees chat links per quoter */}
        {isOwnRide && quotes.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Open chat with</p>
            {quotes.map((q) => (
              <a
                key={q.user_id}
                href={`/chat/${ride.id}/${q.user_id}`}
                className="flex items-center justify-between bg-dark-700/60 border border-white/5 hover:border-royal/20 rounded-xl px-4 py-2.5 transition group"
              >
                <span className="text-gray-300 text-sm">{q.user_id}</span>
                <span className="text-royal text-xs group-hover:translate-x-1 transition-transform">Chat →</span>
              </a>
            ))}
          </div>
        )}

        {!currentUser && (
          <p className="text-center text-sm text-gray-600 mt-4">
            <a href="/login" className="text-accent font-medium hover:underline">Login</a>
            {" "}to send a fuel quote and join this ride.
          </p>
        )}
      </div>
    </div>
  );
}
