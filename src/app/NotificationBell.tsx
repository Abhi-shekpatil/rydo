"use client";

import { useState, useRef, useEffect } from "react";

interface Notification {
  id: string;
  type: string;
  message: string;
  ride_id: string | null;
  read: boolean;
  created_at: string;
}

interface Props {
  initialCount: number;
}

export default function NotificationBell({ initialCount }: Props) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleOpen() {
    if (!open && !loaded) {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setLoaded(true);
      }
    }
    if (!open && count > 0) {
      fetch("/api/notifications", { method: "PATCH" });
      setCount(0);
    }
    setOpen((v) => !v);
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative group">
        <button
          onClick={handleOpen}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition cursor-pointer"
          title="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {count > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-yellow-400 text-dark-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
        <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-dark-700 border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
          Notifications
        </span>
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-dark-800 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-white font-semibold text-sm">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-5 text-center">No notifications yet</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <a
                  key={n.id}
                  href={n.ride_id ? `/rides/${n.ride_id}` : "#"}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 px-4 py-3 hover:bg-white/5 transition border-b border-white/5 last:border-0 ${!n.read ? "bg-yellow-400/5" : ""}`}
                >
                  <span className="text-lg shrink-0">
                    {n.type === "accepted" ? "✅" : n.type === "rejected" ? "❌" : "🔔"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{timeAgo(n.created_at)}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
