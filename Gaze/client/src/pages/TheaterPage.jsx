import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import TacticalStream from '../components/TacticalStream'
import PlayerControls from '../components/PlayerControls'

export default function TheaterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const playerContainerRef = useRef(null)
  const [replayer, setReplayer] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // We'll mock the events structure to map to our TacticalStream
  const mockTacticalEvents = [
    { timeOffset: 12040, type: 'action', label: 'Clicked button', detail: 'button.login-btn', color: 'bg-indigo-400' },
    { timeOffset: 15800, type: 'action', label: 'Navigated', detail: '/pricing/checkout', color: 'bg-indigo-400' },
    { timeOffset: 38050, type: 'dead-click', label: 'Dead Click', detail: 'img.static-banner', color: 'bg-amber-500' },
    { timeOffset: 42100, type: 'rage-click', label: 'Rage Click', detail: 'div.pricing-tier > button', extra: '5 clicks / 600ms', color: 'bg-pink-500' },
    { timeOffset: 43020, type: 'error', label: 'Console Error', detail: 'TypeError: Cannot read...', color: 'bg-amber-500' },
  ]

  // Initialize rrweb-player inside the container
  useEffect(() => {
    // In reality, fetch events from /api/sessions/:id
    // Here we use mock empty events for UI structure
    if (!playerContainerRef.current) return

    // Since we don't have real rrweb events, we just simulate the UI wrapper.
    // If we had real events, we would do:
    // const p = new rrwebPlayer({ target: playerContainerRef.current, props: { events } })
    // setReplayer(p)
  }, [id])

  return (
    <div className="h-screen bg-[#0d0d12] flex flex-col overflow-hidden font-sans text-zinc-100">
      <header className="h-14 border-b border-white/5 flex items-center px-4 bg-[#0d0d12]">
        <button 
          onClick={() => navigate('/sessions')}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Theater
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Floating Browser Window Wrapper */}
        <div className="w-full max-w-6xl aspect-[16/10] bg-[#121218] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
          
          {/* Fake Browser Chrome */}
          <div className="h-10 border-b border-white/5 bg-[#0d0d12]/50 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white/5 rounded-md px-32 py-1 text-xs text-zinc-400 font-mono flex items-center gap-2 border border-white/5">
                <Lock className="w-3 h-3 opacity-50" />
                https://app.forensicui.com/pricing/checkout?session=us_xt_9821
              </div>
            </div>
          </div>

          {/* Replayer DOM Target */}
          <div className="flex-1 relative bg-[#0a0a0f] flex items-center justify-center">
            {/* Mocking the DOM replay screen for the UI design */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#020617] flex items-center justify-center text-zinc-500 font-mono text-sm">
              <p>rrweb.Replayer DOM Mount Point</p>
              
              {/* Fake cursor for Rage Click visualization */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 z-50 pointer-events-none">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 drop-shadow-md z-10 relative">
                  <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.5.5 0 00.35-.85L5.5 3.21z" />
                </svg>
                <div className="absolute inset-0 bg-pink-500 rounded-full blur-xl opacity-60 mix-blend-screen scale-150 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Tactical Stream Panel */}
          <TacticalStream events={mockTacticalEvents} />
        </div>

        {/* Player Controls Panel */}
        <PlayerControls events={mockTacticalEvents} />
      </div>
    </div>
  )
}
