import { getSessionUser } from "@/lib/auth";
import { toPublicUser, getAverageRating, getUserById } from "@/lib/users";
import { getRidesByUserId } from "@/lib/db";
import { getReviewsForUser } from "@/lib/reviews";
import { getConversationList } from "@/lib/messages";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const publicUser = toPublicUser(user);
  const rating = await getAverageRating(user.id);
  const rides = await getRidesByUserId(user.id);
  const reviews = await getReviewsForUser(user.id);

  const reviewerNames: Record<string, string> = {};
  for (const review of reviews) {
    if (!reviewerNames[review.from_user_id]) {
      const reviewer = await getUserById(review.from_user_id);
      reviewerNames[review.from_user_id] = reviewer?.name || "Unknown";
    }
  }

  const conversations = await getConversationList(user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-dark-800/60 rounded-2xl border border-white/5 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{publicUser.name}</h2>
            <p className="text-gray-500">{publicUser.phone}</p>
            <p className="text-gray-500">{publicUser.city}</p>
          </div>
          <div className="text-right">
            {rating.count > 0 ? (
              <div>
                <span className="text-3xl font-bold text-accent">{rating.avg}</span>
                <span className="text-yellow-500 ml-1 text-lg">★</span>
                <p className="text-sm text-gray-500">{rating.count} reviews</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No ratings yet</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-dark-700/80 border border-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Bike</p>
            <p className="font-medium text-gray-300 mt-0.5">{publicUser.bike_model || "Not set"}</p>
          </div>
          <div className="bg-dark-700/80 border border-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">DL Number</p>
            <p className="font-medium text-gray-300 mt-0.5">{publicUser.dl_number}</p>
          </div>
        </div>
      </div>

      {/* Ride History */}
      <h2 className="text-xl font-bold text-white mb-4">
        Ride History
        <span className="text-gray-600 font-normal ml-2">({rides.length})</span>
      </h2>
      {rides.length === 0 ? (
        <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-8 text-center text-gray-500 mb-8">
          No rides yet.{" "}
          <a href="/rides/new" className="text-accent hover:underline">Post your first ride!</a>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {rides.map((ride) => (
            <a
              key={ride.id}
              href={`/rides/${ride.id}`}
              className="block bg-dark-800/60 rounded-xl border border-white/5 hover:border-accent/20 transition-all p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    {ride.from_city} <span className="text-accent">→</span> {ride.to_city}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(ride.date).toLocaleDateString("en-IN", {
                      weekday: "short", month: "short", day: "numeric",
                    })}{" "}
                    at {ride.time}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-accent font-bold">₹{ride.fuel_cost}</span>
                  {ride.rider_id === user.id ? (
                    <p className="text-xs text-teal font-medium">Your ride</p>
                  ) : (
                    <p className="text-xs text-royal font-medium">Pillion</p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Reviews */}
      <h2 className="text-xl font-bold text-white mb-4">
        Reviews
        <span className="text-gray-600 font-normal ml-2">({reviews.length})</span>
      </h2>
      {reviews.length === 0 ? (
        <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-8 text-center text-gray-500 mb-8">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-dark-800/60 rounded-xl border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-300">{reviewerNames[review.from_user_id]}</span>
                <span className="text-yellow-500 text-sm">
                  {"★".repeat(review.rating)}
                  <span className="text-gray-700">{"★".repeat(5 - review.rating)}</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Conversations */}
      <h2 className="text-xl font-bold text-white mb-4">
        Messages
        <span className="text-gray-600 font-normal ml-2">({conversations.length})</span>
      </h2>
      {conversations.length === 0 ? (
        <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-8 text-center text-gray-500">
          No conversations yet.
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <a
              key={`${conv.ride_id}-${conv.other_user_id}`}
              href={`/chat/${conv.ride_id}/${conv.other_user_id}`}
              className="flex items-center justify-between bg-dark-800/60 rounded-xl border border-white/5 hover:border-royal/20 transition-all p-4"
            >
              <div>
                <p className="font-semibold text-white">{conv.other_user_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {conv.from_city} → {conv.to_city}
                </p>
                <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">{conv.last_message}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                {conv.unread_count > 0 && (
                  <span className="bg-royal text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {conv.unread_count}
                  </span>
                )}
                <span className="text-xs text-gray-600">
                  {new Date(conv.last_message_at).toLocaleDateString("en-IN", {
                    month: "short", day: "numeric",
                  })}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
