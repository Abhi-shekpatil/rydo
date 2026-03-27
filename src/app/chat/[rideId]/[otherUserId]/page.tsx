import { getSessionUser } from "@/lib/auth";
import { getRideById } from "@/lib/db";
import { getUserById } from "@/lib/users";
import { getConversation, markAsRead } from "@/lib/messages";
import { notFound, redirect } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ rideId: string; otherUserId: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { rideId, otherUserId } = await params;

  const currentUser = await getSessionUser();
  if (!currentUser) redirect("/login");

  const [ride, otherUser] = await Promise.all([
    getRideById(rideId),
    getUserById(otherUserId),
  ]);

  if (!ride || !otherUser) notFound();

  // Can't chat with yourself
  if (currentUser.id === otherUserId) redirect(`/rides/${rideId}`);

  // Mark incoming messages as read
  await markAsRead(rideId, otherUserId, currentUser.id);

  const initialMessages = await getConversation(rideId, currentUser.id, otherUserId);

  const rideSummary = `${ride.from_city} → ${ride.to_city} · ${new Date(ride.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`;

  return (
    <div
      className="max-w-2xl mx-auto flex flex-col"
      style={{ height: "calc(100vh - 57px)" }}
    >
      <ChatWindow
        initialMessages={initialMessages}
        currentUserId={currentUser.id}
        currentUserPhone={currentUser.phone}
        currentUserName={currentUser.name}
        rideId={rideId}
        otherUserId={otherUserId}
        otherUserName={otherUser.name}
        rideSummary={rideSummary}
      />
    </div>
  );
}
