import { getSessionUser } from "@/lib/auth";
import { toPublicUser, getAverageRating, getUserById } from "@/lib/users";
import { getRidesByUserId } from "@/lib/db";
import { getReviewsForUser } from "@/lib/reviews";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const publicUser = toPublicUser(user);
  const rating = await getAverageRating(user.id);
  const rides = await getRidesByUserId(user.id);
  const reviews = await getReviewsForUser(user.id);

  // Fetch reviewer names
  const reviewerNames: Record<string, string> = {};
  for (const review of reviews) {
    if (!reviewerNames[review.from_user_id]) {
      const reviewer = await getUserById(review.from_user_id);
      reviewerNames[review.from_user_id] = reviewer?.name || "Unknown";
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{publicUser.name}</h2>
            <p className="text-gray-500">{publicUser.phone}</p>
            <p className="text-gray-500">{publicUser.city}</p>
          </div>
          <div className="text-right">
            {rating.count > 0 ? (
              <div>
                <span className="text-2xl font-bold text-orange-600">{rating.avg}</span>
                <span className="text-yellow-500 ml-1">★</span>
                <p className="text-sm text-gray-500">{rating.count} reviews</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No ratings yet</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Bike</p>
            <p className="font-medium">{publicUser.bike_model || "Not set"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">DL Number</p>
            <p className="font-medium">{publicUser.dl_number}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Ride History ({rides.length})</h2>
      {rides.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No rides yet.{" "}
          <a href="/rides/new" className="text-orange-600 hover:underline">Post your first ride!</a>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {rides.map((ride) => (
            <a
              key={ride.id}
              href={`/rides/${ride.id}`}
              className="block bg-white rounded-xl shadow hover:shadow-md transition p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    {ride.from_city} <span className="text-orange-500">→</span> {ride.to_city}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(ride.date).toLocaleDateString("en-IN", {
                      weekday: "short", month: "short", day: "numeric",
                    })}{" "}
                    at {ride.time}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-orange-600 font-bold">₹{ride.fuel_cost}</span>
                  {ride.rider_id === user.id ? (
                    <p className="text-xs text-green-600 font-medium">Your ride</p>
                  ) : (
                    <p className="text-xs text-blue-600 font-medium">Pillion</p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{reviewerNames[review.from_user_id]}</span>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
