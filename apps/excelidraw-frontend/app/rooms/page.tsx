"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomsPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [searchSlug, setSearchSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    async function fetchUser() {
      try {
        const res = await axios.get(`${HTTP_BACKEND}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = res.data?.user;
        if (user) {
          setUserName(user.name ?? null);
          setUserEmail(user.email ?? null);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
  }, [router]);

  function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  async function handleCreateRoom() {
    setError(null);
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    const token = getToken();
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setLoadingCreate(true);
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        {
          name: roomName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const roomId = res.data?.roomId;
      if (!roomId) {
        throw new Error("No room id returned from server");
      }

      // Use slug (room name) in URL
      router.push(`/canvas/${roomName.trim()}`);
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Unable to create room. Please try again.";
      setError(msg);
    } finally {
      setLoadingCreate(false);
    }
  }

  async function handleSearchRoom() {
    setError(null);
    if (!searchSlug.trim()) {
      setError("Please enter a room name to search");
      return;
    }

    try {
      setLoadingSearch(true);
      const res = await axios.get(
        `${HTTP_BACKEND}/room/${encodeURIComponent(searchSlug.trim())}`
      );

      const room = res.data?.room;
      if (!room) {
        setError("Room not found");
        return;
      }

      // Use slug in URL
      router.push(`/canvas/${searchSlug.trim()}`);
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Unable to find room. Please try again.";
      setError(msg);
    } finally {
      setLoadingSearch(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-white/[0.02] rounded-2xl shadow-2xl border border-white/10 p-8 space-y-8 relative z-10 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Rooms Dashboard</h1>
            <p className="text-sm text-slate-400 mt-2">
              Create a new collaborative space or jump back into an existing one.
            </p>
          </div>
          <div className="text-sm">
            {userName || userEmail ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>
                  Logged in as <span className="font-semibold text-indigo-200">{userName || userEmail}</span>
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-1 text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-3">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Create Room Card */}
          <div className="group border border-white/5 rounded-xl p-6 space-y-5 bg-black/40 hover:bg-black/60 hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
            <div className="space-y-2">
               <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                 <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
               </div>
               <h2 className="font-semibold text-xl text-slate-100">Create a new room</h2>
               <p className="text-sm text-slate-400 leading-relaxed">
                 Start a fresh canvas. Choose a unique room name and invite your team to collaborate instantly.
               </p>
            </div>
            <div className="space-y-3 pt-2">
              <input
                className="w-full border border-white/10 bg-white/5 rounded-lg px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                type="text"
                placeholder="e.g. weekly-sync"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button
                className="w-full bg-indigo-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                onClick={handleCreateRoom}
                disabled={loadingCreate}
              >
                {loadingCreate ? "Creating..." : "Create room"}
              </button>
            </div>
          </div>

          {/* Join Room Card */}
          <div className="group border border-white/5 rounded-xl p-6 space-y-5 bg-black/40 hover:bg-black/60 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
            <div className="space-y-2">
               <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/20 group-hover:scale-110 transition-transform">
                 <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <h2 className="font-semibold text-xl text-slate-100">Join existing room</h2>
               <p className="text-sm text-slate-400 leading-relaxed">
                 Enter an existing room slug to jump right into an ongoing session and draw together.
               </p>
            </div>
            <div className="space-y-3 pt-2">
              <input
                className="w-full border border-white/10 bg-white/5 rounded-lg px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600"
                type="text"
                placeholder="e.g. creative-brainstorm"
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
              />
              <button
                className="w-full bg-white/5 text-purple-300 rounded-lg py-3 text-sm font-semibold hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSearchRoom}
                disabled={loadingSearch}
              >
                {loadingSearch ? "Searching..." : "Search & join"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

