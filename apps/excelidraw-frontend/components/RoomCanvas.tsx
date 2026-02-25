"use client";

import { HTTP_BACKEND, WS_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";

type UserInfo = {
  id: string;
  email: string;
  name: string;
};

export function RoomCanvas({ roomSlug }: { roomSlug: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    let ws: WebSocket | null = null;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        const [meRes, roomRes] = await Promise.all([
          axios.get(`${HTTP_BACKEND}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${HTTP_BACKEND}/room/${encodeURIComponent(roomSlug)}`),
        ]);

        const me: UserInfo | null = meRes.data?.user ?? null;
        const room = roomRes.data?.room;

        if (!room) {
          setError("Room not found");
          router.push("/rooms");
          return;
        }

        setUser(me);
        const numericRoomId = String(room.id);
        setRoomId(numericRoomId);

        if (me && room.adminId === me.id) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
          setSocket(ws);
          const data = JSON.stringify({
            type: "join_room",
            roomId: numericRoomId,
          });
          ws.send(data);
        };

        ws.onclose = () => {
          setSocket(null);
        };
      } catch (e: any) {
        console.error(e);
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load room or user info"
        );
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    init();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomSlug, router]);

  async function handleClearBoard() {
    if (!socket || !roomId || !isAdmin) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        router.push("/signin");
        return;
      }

      socket.send(
        JSON.stringify({
          type: "clear",
          roomId,
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  if (loading || !roomId || !socket) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        <p>Connecting to room...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-b from-black via-slate-950 to-black">
      <header className="px-4 py-3 bg-black/90 border-b border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            SS
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-emerald-400">
              Room
            </div>
            <div className="text-lg font-semibold text-slate-50">
              {roomSlug}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <span className="text-slate-400">User</span>
              <span className="font-semibold">
                {user.name || user.email}
              </span>
              {isAdmin && (
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-black">
                  Admin
                </span>
              )}
            </div>
          )}
          {isAdmin && (
            <button
              className="px-3 py-1.5 rounded-md bg-red-500/90 hover:bg-red-600 text-xs font-medium text-white border border-red-400/60"
              onClick={handleClearBoard}
            >
              Clear board
            </button>
          )}
        </div>
      </header>
      <main className="flex-1">
        <Canvas roomId={roomId} socket={socket} />
      </main>
    </div>
  );
}