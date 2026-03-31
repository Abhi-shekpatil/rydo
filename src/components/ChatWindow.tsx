"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/lib/messages";

const CONTACT_PREFIX = "__CONTACT__:";

function parseContact(content: string): { phone: string; name: string } | null {
  if (!content.startsWith(CONTACT_PREFIX)) return null;
  const rest = content.slice(CONTACT_PREFIX.length);
  const colonIdx = rest.indexOf(":");
  if (colonIdx === -1) return null;
  return { phone: rest.slice(0, colonIdx), name: rest.slice(colonIdx + 1) };
}

interface Props {
  initialMessages: Message[];
  currentUserId: string;
  currentUserPhone: string;
  currentUserName: string;
  rideId: string;
  otherUserId: string;
  otherUserName: string;
  rideSummary: string;
}

export default function ChatWindow({
  initialMessages,
  currentUserId,
  currentUserPhone,
  currentUserName,
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

  const alreadySharedContact = messages.some(
    (m) => m.sender_id === currentUserId && m.content.startsWith(CONTACT_PREFIX)
  );

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

  async function postMessage(content: string) {
    setSending(true);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rideId, receiverId: otherUserId, content }),
    });
    setSending(false);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    await postMessage(text);
    inputRef.current?.focus();
  }

  async function handleShareContact() {
    if (sending || alreadySharedContact) return;
    await postMessage(`${CONTACT_PREFIX}${currentUserPhone}:${currentUserName}`);
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
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
      <div className="bg-dark-800/80 border-b border-white/5 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <a href="/messages" className="text-gray-500 hover:text-accent transition text-sm shrink-0">←</a>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{otherUserName}</p>
            <p className="text-xs text-gray-500 truncate">{rideSummary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShareContact}
            disabled={sending || alreadySharedContact}
            title={alreadySharedContact ? "Contact already shared" : "Share your phone number"}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
              alreadySharedContact
                ? "border-white/5 text-gray-600 cursor-default"
                : "border-teal/30 text-teal hover:bg-teal/10 cursor-pointer"
            }`}
          >
            {alreadySharedContact ? "Shared ✓" : "Share Contact"}
          </button>
          <a
            href="tel:+916260718348"
            title="Emergency SOS"
            className="bg-red-600/80 hover:bg-red-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition ring-1 ring-red-500/40"
          >
            SOS
          </a>
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
              const contact = parseContact(msg.content);

              if (contact) {
                const waLink = `https://wa.me/91${contact.phone}?text=${encodeURIComponent(
                  `Hi ${contact.name}, connecting via Rydon!`
                )}`;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
                    <div className="max-w-[75%] rounded-2xl border border-teal/20 bg-teal/5 px-4 py-3">
                      <p className="text-xs text-teal uppercase tracking-wider mb-1 font-semibold">
                        📱 Contact Shared
                      </p>
                      <p className="text-white font-semibold">{contact.name}</p>
                      <p className="text-gray-400 text-sm mb-3">{contact.phone}</p>
                      <div className="flex gap-2">
                        <a
                          href={`tel:+91${contact.phone}`}
                          className="flex-1 text-center text-xs font-bold py-1.5 rounded-lg bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition"
                        >
                          Call
                        </a>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center text-xs font-bold py-1.5 rounded-lg bg-emerald-600/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/25 transition"
                        >
                          WhatsApp
                        </a>
                      </div>
                      <p className={`text-xs mt-2 ${isMine ? "text-teal/40" : "text-gray-600"} text-right`}>
                        {formatTime(msg.created_at)}
                        {isMine && <span className="ml-1">{msg.is_read ? "✓✓" : "✓"}</span>}
                      </p>
                    </div>
                  </div>
                );
              }

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
                      {isMine && <span className="ml-1">{msg.is_read ? "✓✓" : "✓"}</span>}
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
