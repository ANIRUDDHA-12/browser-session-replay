import { Calendar, Plus, ChevronDown } from 'lucide-react'

export default function FilterBar({ count }) {
  return (
    <div className="bg-[#18181b] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-sm font-medium text-zinc-300 px-3 py-1.5 rounded border border-white/5 transition-colors">
          <Calendar className="w-4 h-4 opacity-70" />
          Last 24 Hours
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>

        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-sm font-medium text-zinc-300 px-3 py-1.5 rounded border border-white/5 transition-colors">
          <Plus className="w-4 h-4 opacity-70" />
          Add Filter
        </button>

        <div className="h-4 w-px bg-white/10 mx-2"></div>

        <button className="flex items-center gap-2 bg-[#0d0d12] text-sm font-medium text-zinc-300 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
          Has Rage Clicks
        </button>
        
        <button className="flex items-center gap-2 bg-[#0d0d12] text-sm font-medium text-zinc-300 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
          Has Errors
        </button>
      </div>

      <div className="text-sm text-zinc-500 font-medium">
        Showing <span className="text-zinc-300">{count}</span> sessions
      </div>
    </div>
  )
}
