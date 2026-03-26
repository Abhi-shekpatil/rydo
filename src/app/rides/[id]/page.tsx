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
      <a href="/rides" className="text-orange-600 hover:underline text-sm mb-4 inline-block">
        ← Back to rides
      </a>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 text-2xl font-bold mb-1">
          <span>{ride.from_city}</span>
          <span className="text-orange-500">→</span>
          <span>{ride.to_city}</span>
        </div>
        <p className="text-gray-500 mb-6">
          {new Date(ride.date).toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}{" "}
          at {ride.time}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Rider</p>
            <p className="font-semibold">{ride.name}</p>
            {riderRating.count > 0 && (
              <p className="text-sm text-yellow-600">
                {riderRating.avg} ★ ({riderRating.count} reviews)
              </p>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Bike</p>
            <p className="font-semibold">{ride.bike_model || "Not specified"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Fuel Cost</p>
            <p className="font-semibold text-orange-600 text-lg">₹{ride.fuel_cost}</p>
            <p className="text-xs text-gray-400">Min quote: ₹{minQuote}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold">{ride.phone}</p>
          </div>
          {rider?.dl_number && (
            <div className="bg-gray-50 rounded-lg p-4 col-span-2">
              <p className="text-sm text-gray-500">Driving License</p>
              <p className="font-semibold">{rider.dl_number}</p>
            </div>
          )}
        </div>

        {ride.note && (
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Note from rider</p>
            <p className="text-gray-800">{ride.note}</p>
          </div>
        )}

        {currentUser && !isOwnRide && !hasQuoted && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-blue-800 mb-2">Send a fuel quote to join this ride</p>
            <p className="text-sm text-blue-600 mb-3">
              Offer between ₹{minQuote} and ₹{ride.fuel_cost}
            </p>
            <QuoteForm rideId={ride.id} minAmount={minQuote} maxAmount={ride.fuel_cost} />
          </div>
        )}

        {hasQuoted && (
          <div className="bg-green-50 rounded-lg p-4 mb-6 text-green-800">
            You have already sent a quote for this ride.
          </div>
        )}

        {isOwnRide && quotes.length > 0 && (
          <div className="mb-6">
            <p className="font-medium mb-3">Quotes received ({quotes.length})</p>
            <div className="space-y-2">
              {quotes.map((q) => {
                const quoterName = q.user_id;
                return (
                  <div key={q.user_id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{quoterName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-600 font-bold text-lg">₹{q.amount}</span>
                      <QuoteActions rideId={ride.id} userId={q.user_id} currentStatus={q.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${ride.phone}`}
            className="flex-1 text-center bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Call {ride.name}
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
          >
            WhatsApp
          </a>
        </div>

        {!currentUser && (
          <p className="text-center text-sm text-gray-500 mt-4">
            <a href="/login" className="text-orange-600 font-medium hover:underline">Login</a>
            {" "}to send a fuel quote and join this ride.
          </p>
        )}
      </div>
    </div>
  );
}
