import { Search, Bell, Share, Download, Settings } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'

export default function Header() {
  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md shadow-xl sticky top-0 z-10">
      <nav className="flex gap-6 h-full items-center">
        <button className="text-sm font-medium text-zinc-400 hover:text-zinc-200">Explorer</button>
        <button className="text-sm font-medium text-indigo-400 border-b-2 border-indigo-500 h-full flex items-center translate-y-[1px]">Live</button>
        <button className="text-sm font-medium text-zinc-400 hover:text-zinc-200">Funnels</button>
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 w-64 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Share Session</button>
          <button className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Export</button>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1"></div>

        <div className="flex items-center gap-1">
          <button className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-full hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-full hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="pl-2 flex items-center">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-7 h-7" } }} />
        </div>
      </div>
    </header>
  )
}
