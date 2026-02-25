"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!email || !password || (!isSignin && !name)) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (isSignin) {
        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });

        const token = res.data?.token;
        if (!token) {
          throw new Error("No token received from server");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }

        router.push("/rooms");
      } else {
        await axios.post(`${HTTP_BACKEND}/signup`, {
          username: email,
          password,
          name,
        });

        const signinRes = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });

        const token = signinRes.data?.token;
        if (!token) {
          throw new Error("No token received after signup");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }

        router.push("/rooms");
      }
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-black via-slate-950 to-black">
      <div className="w-full max-w-md p-6 m-2 bg-slate-950 border border-emerald-500/30 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.35)] space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            SS
          </div>
          <h1 className="text-xl font-semibold text-slate-50">
            {isSignin ? "Sign in to SketchSync" : "Create your SketchSync account"}
          </h1>
          <p className="text-xs text-slate-400">
            Use your email and password to {isSignin ? "continue" : "get started"}.
          </p>
        </div>

        {!isSignin && (
          <div className="pt-2">
            <input
              className="w-full border border-emerald-500/40 bg-black rounded px-3 py-2 text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="pt-2">
          <input
            className="w-full border border-emerald-500/40 bg-black rounded px-3 py-2 text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="pt-1">
          <input
            className="w-full border border-emerald-500/40 bg-black rounded px-3 py-2 text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="pt-1">
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded px-3 py-2">
              {error}
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            className="w-full bg-emerald-500 text-black rounded-md py-2 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.6)]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>

        <div className="mt-2 text-center text-xs text-slate-400">
          {isSignin ? (
            <span>
              Don&apos;t have an account?{" "}
              <button
                className="text-emerald-400 hover:underline"
                onClick={() => router.push("/signup")}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                className="text-emerald-400 hover:underline"
                onClick={() => router.push("/signin")}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}