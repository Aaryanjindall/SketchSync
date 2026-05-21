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
    <div className="w-screen h-screen flex justify-center items-center bg-[#050505] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="w-full max-w-md p-8 m-4 bg-white/[0.02] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl space-y-6 relative z-10">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            SS
          </div>
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
            {isSignin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-slate-400">
            {isSignin ? "Enter your credentials to continue" : "Join us to start collaborating"}
          </p>
        </div>

        <div className="space-y-4 pt-4">
          {!isSignin && (
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Full Name</label>
              <input
                className="w-full border border-white/10 bg-black/50 rounded-lg px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Email Address</label>
            <input
              className="w-full border border-white/10 bg-black/50 rounded-lg px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Password</label>
            <input
              className="w-full border border-white/10 bg-black/50 rounded-lg px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-1">
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            className="w-full bg-indigo-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400 border-t border-white/5 pt-6">
          {isSignin ? (
            <span>
              Don&apos;t have an account?{" "}
              <button
                className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors"
                onClick={() => router.push("/signup")}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors"
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