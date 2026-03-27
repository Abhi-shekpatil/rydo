"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/lib/messages";

interface Props {
  initialMessages: Message[];
  currentUserId: string;
  rideId: string;
  otherUserId: string;
  otherUserName: string;
  rideSummary: string;
}

export default function ChatWindow({
  initialMessages,
  currentUserId,
  rideId,
  otherUserId,
  otherUserName,
  rideSummary,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${rideId}:${[currentUserId, otherUserId].sort().join(":")}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `ride_id=eq.${rideId}` },
        (payload) => {
          const msg = payload.new as Message;
          const relevant =
            (msg.sender_id === currentUserId && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === currentUserId);
          if (!relevant) return;

          setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });

          // Mark as read if we're the receiver
          if (msg.receiver_id === currentUserId) {
            fetch("/api/messages/read", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rideId, otherUserId: msg.sender_id }),
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [rideId, currentUserId, otherUserId]);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rideId, receiverId: otherUserId, content: input.trim() }),
    });

    setInput("");
    setSending(false);
    inputRef.current?.focus();
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
  }

  function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString("en-IN", {
      weekday: "short", month: "short", day: "numeric",
    });
  }

  // Group messages by date
  const grouped: { date: string; msgs: Message[] }[] = [];
  for (const msg of messages) {
    const d = formatDate(msg.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.date === d) last.msgs.push(msg);
    else grouped.push({ date: d, msgs: [msg] });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-dark-800/80 border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <a href="/rides" className="text-gray-500 hover:text-accent transition text-sm">←</a>
        <div>
          <p className="font-semibold text-white">{otherUserName}</p>
          <p className="text-xs text-gray-500">{rideSummary}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-2xl mb-2">💬</p>
            <p>No messages yet. Say hello!</p>
          </div>
        )}

        {grouped.map(({ date, msgs }) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-gray-600">{date}</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {msgs.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? "bg-accent/15 border border-accent/20 text-white rounded-br-sm"
                        : "bg-dark-700/80 border border-white/5 text-gray-300 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMine ? "text-accent/50" : "text-gray-600"} text-right`}>
                      {formatTime(msg.created_at)}
                      {isMine && (
                        <span className="ml-1">{msg.is_read ? "✓✓" : "✓"}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-dark-800/80 px-4 py-3">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${otherUserName}...`}
            maxLength={1000}
            className="flex-1 bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition text-sm"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="bg-gradient-to-r from-accent to-teal text-dark-950 font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-40 cursor-pointer"
          >
            {sending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
