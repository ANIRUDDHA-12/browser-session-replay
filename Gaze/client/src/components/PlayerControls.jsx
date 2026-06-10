import { Play, Pause, SkipForward, Rewind, FastForward } from 'lucide-react'

export default function PlayerControls({ events }) {
  // Mock total duration
  const totalDuration = 135000 // 2:15

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl flex flex-col items-center gap-4 z-20">
      {/* Timeline Bar */}
      <div className="w-full bg-[#0d0d12]/80 backdrop-blur-md border border-white/10 rounded-full h-8 flex items-center px-4 relative shadow-xl">
        <span className="text-[10px] font-mono text-zinc-500 w-10">00:42</span>
        <div className="flex-1 mx-4 h-1 bg-white/10 rounded-full relative">
          {/* Progress fill mock */}
          <div className="absolute left-0 top-0 bottom-0 w-[31%] bg-indigo-500/50 rounded-full"></div>
          
          {/* Event Markers */}
          {events.map((ev, i) => {
            const leftPct = (ev.timeOffset / totalDuration) * 100
            return (
              <div 
                key={i}
                className={`absolute top-1/2 -translate-y-1/2 w-1 rounded-full ${ev.color} opacity-80`}
                style={{ 
                  left: `${leftPct}%`, 
                  height: ev.type === 'rage-click' ? '14px' : '8px',
                  boxShadow: `0 0 8px ${ev.type === 'rage-click' ? '#ec4899' : ev.type === 'dead-click' || ev.type === 'error' ? '#f59e0b' : '#818cf8'}`
                }}
              ></div>
            )
          })}
        </div>
        <span className="text-[10px] font-mono text-zinc-500 w-10 text-right">02:15</span>
      </div>

      {/* Control Pill */}
      <div className="bg-[#0d0d12]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 flex items-center gap-6 shadow-2xl">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Rewind className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(165,180,252,0.6)]">
          <Pause className="w-5 h-5 text-indigo-900 fill-indigo-900" />
        </button>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-white/10"></div>

        <button className="text-xs font-mono font-medium text-zinc-300 hover:text-white flex items-center gap-1">
          <FastForward className="w-4 h-4 opacity-70" />
          1.5x
        </button>
        <button className="text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 opacity-70">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Skip
        </button>
      </div>
    </div>
  )
}
