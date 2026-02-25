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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-black p-4">
      <div className="w-full max-w-3xl bg-slate-950 rounded-xl shadow-lg border border-emerald-500/30 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-400">Rooms</h1>
            <p className="text-xs text-slate-400 mt-1">
              Create a new room or join an existing one to start drawing.
            </p>
          </div>
          <div className="text-sm text-emerald-300">
            {userName || userEmail ? (
              <span>
                Logged in as{" "}
                <span className="font-semibold">
                  {userName || userEmail}
                </span>
              </span>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 text-center bg-red-950/40 border border-red-900 rounded-md py-2">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-emerald-500/30 rounded-lg p-4 space-y-3 bg-slate-900/70">
            <h2 className="font-medium text-lg text-slate-50">Create a new room</h2>
            <p className="text-sm text-slate-400">
              Choose a unique room name and start drawing with your team.
            </p>
            <input
              className="w-full border border-emerald-500/40 bg-black rounded px-3 py-2 text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              type="text"
              placeholder="Room name (slug)"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button
              className="w-full bg-emerald-500 text-black rounded py-2 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_18px_rgba(16,185,129,0.6)]"
              onClick={handleCreateRoom}
              disabled={loadingCreate}
            >
              {loadingCreate ? "Creating..." : "Create room"}
            </button>
          </div>

          <div className="border border-emerald-500/30 rounded-lg p-4 space-y-3 bg-slate-900/70">
            <h2 className="font-medium text-lg text-slate-50">Search / Join room</h2>
            <p className="text-sm text-slate-400">
              Enter an existing room name to join its canvas in real-time.
            </p>
            <input
              className="w-full border border-emerald-500/40 bg-black rounded px-3 py-2 text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              type="text"
              placeholder="Existing room name"
              value={searchSlug}
              onChange={(e) => setSearchSlug(e.target.value)}
            />
            <button
              className="w-full bg-slate-900 text-emerald-300 rounded py-2 text-sm font-medium hover:bg-emerald-500/10 border border-emerald-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSearchRoom}
              disabled={loadingSearch}
            >
              {loadingSearch ? "Searching..." : "Search & join"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

