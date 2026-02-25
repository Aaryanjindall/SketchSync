import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  Pencil,
  Share2,
  Users2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-emerald-500/20">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-slate-50">
              SketchSync
              <span className="text-emerald-400 block mt-2 text-3xl sm:text-4xl">
                Realtime Whiteboard Rooms
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-300">
              Create shared sketch boards, invite your team with a room link,
              and sync every stroke in real time.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-4">
              <Link href={"/signin"}>
                <Button
                  variant={"primary"}
                  size="lg"
                  className="h-11 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 rounded-full border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-slate-950/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card className="p-6 border border-emerald-500/30 bg-slate-900/70 hover:border-emerald-400/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/15">
                  <Share2 className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Collaboration</h3>
              </div>
              <p className="mt-4 text-slate-300 text-sm">
                Work together with your team in real-time. Share your drawings instantly with a simple link.
              </p>
            </Card>

            <Card className="p-6 border border-emerald-500/30 bg-slate-900/70 hover:border-emerald-400/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/15">
                  <Users2 className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold">Multiplayer Editing</h3>
              </div>
              <p className="mt-4 text-slate-300 text-sm">
                Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time.
              </p>
            </Card>

            <Card className="p-6 border border-emerald-500/30 bg-slate-900/70 hover:border-emerald-400/80 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/15">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold">Smart Drawing</h3>
              </div>
              <p className="mt-4 text-slate-300 text-sm">
                Intelligent shape recognition and drawing assistance helps you create perfect diagrams.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section (for scroll + clarity) */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-black border-t border-emerald-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-50">
              How SketchSync works
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Three simple steps to get a synced whiteboard with your team.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border border-emerald-500/30 rounded-lg p-4 bg-slate-900/60">
              <div className="text-emerald-400 text-xs font-mono mb-2">
                STEP 01
              </div>
              <h3 className="font-semibold text-slate-50 mb-1">
                Sign in
              </h3>
              <p className="text-xs text-slate-400">
                Create an account or sign in with your email to get your personal dashboard.
              </p>
            </div>
            <div className="border border-emerald-500/30 rounded-lg p-4 bg-slate-900/60">
              <div className="text-emerald-400 text-xs font-mono mb-2">
                STEP 02
              </div>
              <h3 className="font-semibold text-slate-50 mb-1">
                Create a room
              </h3>
              <p className="text-xs text-slate-400">
                Pick a room slug, share the link with your team, and control access as admin.
              </p>
            </div>
            <div className="border border-emerald-500/30 rounded-lg p-4 bg-slate-900/60">
              <div className="text-emerald-400 text-xs font-mono mb-2">
                STEP 03
              </div>
              <h3 className="font-semibold text-slate-50 mb-1">
                Sketch in sync
              </h3>
              <p className="text-xs text-slate-400">
                Use the canvas tools to draw shapes while everyone in the room sees updates instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-500/20">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} SketchSync. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              Built for realtime collaborative drawing in a hacker‑style dark UI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;