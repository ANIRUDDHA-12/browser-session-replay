import { Monitor, Globe, Play, User, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

export default function SessionCard({ session }) {
  const navigate = useNavigate()

  return (
    <div 
      onClick={() => navigate(`/sessions/${session.id}`)}
      className="group relative bg-[#18181b] border border-white/5 rounded-xl p-4 flex items-center shadow-md hover:bg-[#1f1f23] transition-all cursor-pointer overflow-hidden"
    >
      {/* Accent Border based on status */}
      <div className={clsx(
        "absolute left-0 top-0 bottom-0 w-1",
        session.hasRageClicks ? "bg-pink-500" : 
        session.hasErrors ? "bg-amber-500" : "bg-indigo-500"
      )}></div>

      <div className="flex-1 flex items-center justify-between pl-2">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
            {session.user === 'Anonymous' ? <User className="w-5 h-5" /> : <div className="w-5 h-5 bg-zinc-700 rounded-full mask-avatar"></div>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-200">{session.user}</span>
              {session.isStarred && <Star className="w-3.5 h-3.5 text-zinc-400 fill-zinc-400" />}
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">{session.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-1/6 text-zinc-400">
          <Monitor className="w-4 h-4" />
          <Globe className="w-4 h-4" />
          <span className="text-sm" title={session.country}>{session.country === 'US' ? '🇺🇸' : '🇩🇪'}</span>
        </div>

        <div className="flex items-center gap-6 w-1/4 text-sm text-zinc-400 font-mono">
          <span>{session.duration}</span>
          <span>{session.pages} page{session.pages !== 1 && 's'}</span>
        </div>

        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Mini Timeline Graphic Mockup */}
          <div className="w-48 h-1 bg-white/5 rounded-full relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
            {session.hasRageClicks && <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.8)]"></div>}
            {session.hasErrors && <div className="absolute top-1/2 -translate-y-1/2 left-[80%] w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]"></div>}
          </div>

          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors group-hover:bg-indigo-500/20 group-hover:text-indigo-300 group-hover:border-indigo-500/30">
            <Play className="w-4 h-4 fill-current" />
            Play
          </button>
        </div>
      </div>
    </div>
  )
}
