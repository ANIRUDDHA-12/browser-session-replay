import React from 'react';
import { Play, MousePointer2, Activity, ShieldAlert, FileCode2, Rewind, FastForward } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const glassClass = "bg-white/[0.03] border border-white/[0.08] backdrop-blur-md";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B0B10] to-[#050508] text-white font-sans antialiased selection:bg-indigo-500/30 flex flex-col">
      {/* A. Navigation Bar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-lg">G</div>
          <span className="font-bold text-xl tracking-tight">GAZE</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Solutions</a>
          <a href="#documentation" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Documentation</a>
          <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/sessions" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-2 py-2">
            Sign In
          </Link>
          <Link to="/sessions" className="text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-indigo-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start pt-16 md:pt-24 pb-20 px-6 z-10">
        {/* B. Hero Section */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 ${glassClass}`}>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
            <span className="text-xs font-semibold tracking-wider text-zinc-300">OBSERVED INTELLIGENCE PLATFORM</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-tight">
            See exactly what your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">users see.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl text-center mb-10 leading-relaxed">
            Session replay, rage click detection, and tactical DOM telemetry—all in a beautifully dark glassmorphic interface.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/sessions" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-full px-6 py-3 transition-all shadow-lg shadow-indigo-500/25">
              <Play className="w-4 h-4 fill-current" />
              Start Free Trial
            </Link>
            <a href="#features" className={`flex items-center gap-2 text-white font-medium rounded-full px-6 py-3 transition-colors hover:bg-white/[0.08] ${glassClass}`}>
              Explore Features
            </a>
          </div>
        </div>

        {/* C. The Browser Mockup */}
        <div className="w-full max-w-5xl mx-auto mt-20 md:mt-32 relative">
          {/* Ambient Glow */}
          <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-600/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

          <div className="w-full bg-[#121217] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10 flex flex-col">
            {/* Top Bar */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 bg-white/[0.02]">
              <div className="flex gap-2 w-1/3">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="w-1/3 flex justify-center">
                <div className="bg-[#0B0B10] border border-white/5 rounded-md px-3 py-1.5 flex items-center shadow-inner">
                  <span className="text-xs text-zinc-500 font-mono">app.gaze.io/session/re_1234b</span>
                </div>
              </div>
              <div className="w-1/3"></div>
            </div>
            
            {/* Player Canvas */}
            <div className="w-full aspect-video bg-[#0d0d12] relative flex items-center justify-center p-8 overflow-hidden">
              {/* Wireframe UI */}
              <div className="w-full h-full border border-white/5 rounded-lg flex gap-6 p-6 opacity-30">
                <div className="w-1/4 h-full border border-white/10 rounded border-dashed"></div>
                <div className="flex-1 flex flex-col gap-6">
                  <div className="h-16 border border-white/10 rounded border-dashed w-full"></div>
                  <div className="flex-1 border border-white/10 rounded border-dashed w-full"></div>
                </div>
              </div>
              
              {/* The Cursor */}
              <div className="absolute top-1/2 left-1/2 z-20">
                <div className="absolute -inset-8 border border-pink-500/40 rounded-full animate-ping"></div>
                <div className="absolute -inset-4 border-2 border-pink-500/60 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <MousePointer2 className="w-8 h-8 text-white fill-black -ml-3 -mt-3 drop-shadow-lg" />
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="h-16 border-t border-white/10 bg-[#121217] flex items-center px-4 gap-4">
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white">
                  <Rewind className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white">
                  <Play className="w-5 h-5 fill-current" />
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white">
                  <FastForward className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-zinc-400 ml-2 hidden sm:inline">01:24 / 04:30</span>
              </div>
              
              <div className="flex-1 flex items-center px-4">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.8)]"></span>
                  <span className="text-[10px] font-medium text-pink-400">2 Errors</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]"></span>
                  <span className="text-[10px] font-medium text-amber-400">1 Warning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* D. Feature Grid */}
        <div id="features" className="w-full max-w-6xl mx-auto mt-32 md:mt-48">
          <div className="mb-12 text-left w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Deep Telemetry Insights</h2>
            <p className="text-lg text-zinc-400 max-w-2xl">Everything you need to diagnose UX friction instantly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-xl p-6 transition-all hover:bg-white/[0.05] ${glassClass} bg-[#121217]`}>
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 shadow-[inset_0_0_15px_rgba(236,72,153,0.1)]">
                <Activity className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Rage Click Detection</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Automatically surface moments of extreme user frustration. Identify broken buttons, confusing layouts, or dead zones instantly with AI-driven detection.
              </p>
            </div>
            
            <div className={`rounded-xl p-6 transition-all hover:bg-white/[0.05] ${glassClass} bg-[#121217]`}>
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Console Error Capture</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Synchronize frontend JavaScript errors perfectly with the session playback. See exactly what state the application was in right before the crash.
              </p>
            </div>
            
            <div className={`rounded-xl p-6 transition-all hover:bg-white/[0.05] ${glassClass} bg-[#121217]`}>
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-[inset_0_0_15px_rgba(99,102,241,0.1)]">
                <FileCode2 className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Tactical DOM Stream</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Reconstruct the exact DOM state at any given millisecond. Inspect elements retroactively and debug CSS or network issues seamlessly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* E. Minimal Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-white/10 bg-white/5 flex items-center justify-center font-bold text-xs">G</div>
            <span className="font-bold text-sm tracking-tight text-white">GAZE</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Security</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Status</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Twitter</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">GitHub</a>
          </div>
          
          <div className="text-xs text-zinc-500">
            © 2024 GAZE Intelligence. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
