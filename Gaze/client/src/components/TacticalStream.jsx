import clsx from 'clsx'

export default function TacticalStream({ events }) {
  return (
    <div className="absolute right-4 top-14 bottom-32 w-80 bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden z-20">
      <div className="px-5 py-4 border-b border-white/5">
        <h3 className="text-xs font-bold tracking-wider text-zinc-300">TACTICAL STREAM</h3>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {events.map((ev, i) => (
          <div 
            key={i}
            className={clsx(
              "relative pl-6 pr-4 py-3 rounded-lg mb-1 transition-colors hover:bg-white/5 cursor-pointer",
              ev.type === 'rage-click' && "bg-pink-500/5 border border-pink-500/20"
            )}
          >
            {/* Timeline Line */}
            {i !== events.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-[-16px] w-px bg-white/10"></div>
            )}
            
            {/* Dot */}
            <div className={clsx(
              "absolute left-2 top-4 w-2.5 h-2.5 rounded-full border border-[#121218] shadow-[0_0_8px_currentColor]",
              ev.color
            )}></div>

            <div className="flex items-center justify-between mb-1">
              <span className={clsx("text-sm font-medium", ev.type === 'rage-click' ? "text-pink-500" : ev.type === 'dead-click' || ev.type === 'error' ? "text-amber-500" : "text-zinc-200")}>
                {ev.label}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {new Date(ev.timeOffset).toISOString().substring(14, 19)}.{Math.floor((ev.timeOffset % 1000)/10)}
              </span>
            </div>
            
            <p className="text-xs font-mono text-zinc-400 break-words mb-1.5">{ev.detail}</p>
            
            {ev.extra && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500/20 text-pink-500 border border-pink-500/30">
                {ev.extra}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
