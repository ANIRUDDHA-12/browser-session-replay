import { PlayCircle, Flame, LayoutDashboard, Settings, Book, LifeBuoy, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { label: 'Sessions', icon: PlayCircle, path: '/sessions' },
    { label: 'Heatmaps', icon: Flame, path: '/heatmaps' },
    { label: 'Dashboards', icon: LayoutDashboard, path: '/dashboards' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <div className="w-64 flex flex-col justify-between h-full bg-white/5 border-r border-white/10 backdrop-blur-md shadow-xl p-4">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-wide text-zinc-100">GAZE</h1>
            <p className="text-xs text-zinc-500">Production</p>
          </div>
        </div>

        <button className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg py-2 flex items-center justify-center gap-2 mb-6 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Dashboard</span>
        </button>

        <nav className="flex flex-col gap-1">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-indigo-500/15 text-indigo-300 shadow-[inset_2px_0_0_0_rgba(129,140,248,1)]" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5 opacity-80" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors">
          <Book className="w-5 h-5 opacity-80" />
          Docs
        </button>
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors">
          <LifeBuoy className="w-5 h-5 opacity-80" />
          Support
        </button>
      </div>
    </div>
  )
}
