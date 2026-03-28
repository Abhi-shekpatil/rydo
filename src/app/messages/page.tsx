import { getSessionUser } from "@/lib/auth";
import { getConversationList } from "@/lib/messages";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const conversations = await getConversationList(user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-12 text-center">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-gray-400 font-medium mb-1">No conversations yet</p>
          <p className="text-gray-600 text-sm">
            Browse a ride and chat with a rider to get started.
          </p>
          <a
            href="/rides"
            className="inline-block mt-6 bg-accent/10 text-accent border border-accent/20 px-5 py-2 rounded-lg hover:bg-accent/20 transition text-sm font-medium"
          >
            Browse Rides
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <a
              key={`${conv.ride_id}-${conv.other_user_id}`}
              href={`/chat/${conv.ride_id}/${conv.other_user_id}`}
              className="flex items-center gap-4 bg-dark-800/60 rounded-xl border border-white/5 hover:border-royal/20 hover:bg-dark-800 transition-all p-4 group"
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-royal/15 border border-royal/20 flex items-center justify-center shrink-0 text-royal font-bold text-lg">
                {conv.other_user_name.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="font-semibold text-white truncate">{conv.other_user_name}</p>
                  <span className="text-xs text-gray-600 shrink-0">
                    {new Date(conv.last_message_at).toLocaleDateString("en-IN", {
                      month: "short", day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  {conv.from_city} → {conv.to_city}
                </p>
                <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
              </div>

              {/* Unread badge */}
              {conv.unread_count > 0 && (
                <span className="shrink-0 bg-royal text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {conv.unread_count > 9 ? "9+" : conv.unread_count}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
