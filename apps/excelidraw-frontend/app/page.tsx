import { Button } from "@repo/ui/button";
import {
  Pencil,
  Share2,
  Users2,
  Sparkles,
  ArrowRight,
  Palette,
  Layers,
  Zap
} from "lucide-react";
import Link from "next/link";

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-5xl mx-auto flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">Introducing SketchSync 2.0</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
              Where Ideas Take Shape, <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
                Together in Real-Time.
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
              Create infinitely scalable sketch boards, invite your team with a single link,
              and watch creativity unfold with zero latency synchronization.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href={"/signin"} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 bg-indigo-600 rounded-full hover:bg-indigo-500 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-0.5">
                  Start Drawing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-slate-300 transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white hover:-translate-y-0.5 backdrop-blur-sm">
                  Create Account
                </button>
              </Link>
            </div>
            
            {/* Interactive Preview Mockup */}
            <div className="w-full max-w-4xl mt-20 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative rounded-2xl bg-slate-950/80 ring-1 ring-white/10 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
                <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="mx-auto px-4 py-1 rounded-md bg-white/5 text-xs text-slate-400 font-mono border border-white/5">
                    sketchsync.app/room/creative-brainstorm
                  </div>
                </div>
                <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
                   {/* Decorative mock canvas */}
                   <div className="absolute w-32 h-32 border-2 border-indigo-400 rounded-lg top-20 left-32 -rotate-12 opacity-80 shadow-[0_0_30px_rgba(99,102,241,0.2)]" />
                   <div className="absolute w-40 h-40 border-2 border-purple-400 rounded-full bottom-20 right-40 opacity-80 shadow-[0_0_30px_rgba(168,85,247,0.2)]" />
                   <svg className="absolute w-full h-full" style={{ pointerEvents: 'none' }}>
                     <path d="M 150 150 Q 300 50 450 250 T 700 200" fill="none" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                   </svg>
                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-medium text-slate-200">3 Users Active</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-slate-950/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-4">Engineered for Workflow</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to capture ideas seamlessly without the friction of traditional design tools.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Zero-Latency Sync</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Built on a highly optimized WebSocket architecture. Watch your teammates' cursors and strokes render instantly across the globe.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Infinite Canvas</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Never run out of space. Our boundless board allows your ideas to expand organically in any direction without constraints.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Instant Access</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                No complex onboarding. Generate a secure room URL and drop it in your chat. Anyone with the link joins the session instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="w-full md:w-1/2 space-y-8">
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-50 leading-tight">
                From concept to <br/><span className="text-indigo-400">canvas in seconds.</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-mono text-sm">1</div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-200 mb-1">Authenticate securely</h4>
                    <p className="text-slate-400 text-sm">Sign in to access your personal dashboard and room history.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-300 font-mono text-sm">2</div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-200 mb-1">Spin up a room</h4>
                    <p className="text-slate-400 text-sm">Create a unique room slug. You have full admin controls to clear the board anytime.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-300 font-mono text-sm">3</div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-200 mb-1">Sketch away</h4>
                    <p className="text-slate-400 text-sm">Utilize geometric shapes and freehand tools to map out your architecture.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl" />
                <div className="space-y-4 relative">
                  <div className="h-10 w-full bg-white/5 rounded-lg border border-white/5 animate-pulse" />
                  <div className="h-10 w-3/4 bg-white/5 rounded-lg border border-white/5 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="h-10 w-5/6 bg-white/5 rounded-lg border border-white/5 animate-pulse" style={{ animationDelay: '300ms' }} />
                  <div className="h-32 w-full bg-white/5 rounded-lg border border-white/5 mt-8 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#020202] py-12 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                 <span className="text-[10px] font-bold text-white">SS</span>
               </div>
               <span className="text-lg font-bold tracking-tight text-slate-200">SketchSync</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} SketchSync Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;