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

  const [activeUsers, setActiveUsers] = useState<{id: string, name: string}[]>([]);

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

        setIsAdmin(me?.id === room.adminId);

        ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
          setSocket(ws);
          const data = JSON.stringify({
            type: "join_room",
            roomId: numericRoomId,
          });
          ws?.send(data);
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
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0c10] relative overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse mb-4 z-10">
            SS
        </div>
        <p className="text-slate-300 font-medium">Establishing secure connection...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0a0c10] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none" />
      
      {/* Blackboard Dotted Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

      {/* Header Overlay */}
      <header className="px-6 py-3 border-b border-white/10 flex items-center justify-between z-20 bg-white/[0.02] backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            SS
          </div>
          <div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
               <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
                 Live Session
               </div>
            </div>
            <div className="text-xl font-bold text-slate-50 tracking-tight">
              {roomSlug}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Active Users Section for Admin */}
          {isAdmin && activeUsers.length > 0 && (
            <div className="flex items-center gap-2 group relative">
              <div className="flex -space-x-2 mr-2">
                {activeUsers.slice(0, 3).map((u, i) => (
                  <div key={u.id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#050505] shadow-sm ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {activeUsers.length > 3 && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-slate-700 border-2 border-[#050505] shadow-sm">
                    +{activeUsers.length - 3}
                  </div>
                )}
              </div>
              
              {/* Tooltip for Active Users List */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto p-2 z-50">
                <div className="text-xs font-semibold text-slate-400 px-2 pb-2 mb-2 border-b border-white/10 uppercase tracking-wider">
                  Active Users ({activeUsers.length})
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {activeUsers.map(u => (
                    <div key={u.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md transition-colors text-sm text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="truncate">{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-black/40 border border-white/5 hidden sm:flex">
              <span className="text-slate-400">Collaborator:</span>
              <span className="font-semibold text-slate-200">
                {user.name || user.email}
              </span>
              {isAdmin && (
                <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                  Admin
                </span>
              )}
            </div>
          )}
          {isAdmin && (
            <button
              className="px-4 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm font-semibold text-red-400 border border-red-500/20 transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              onClick={handleClearBoard}
            >
              Clear Canvas
            </button>
          )}
        </div>
      </header>
      
      <main className="flex-1 relative z-10">
        <Canvas roomId={roomId} socket={socket} onUsersUpdate={setActiveUsers} />
      </main>
    </div>
  );
}