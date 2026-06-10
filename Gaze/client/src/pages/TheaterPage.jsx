import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import TacticalStream from '../components/TacticalStream'
import PlayerControls from '../components/PlayerControls'

export default function TheaterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  
  // Dedicated container ref for rrweb-player
  const playerContainerRef = useRef(null)
  const playerInstanceRef = useRef(null)
  
  const [sessionInfo, setSessionInfo] = useState(null)
  const [tacticalEvents, setTacticalEvents] = useState([])
  const [rrwebEvents, setRrwebEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // PHASE 1: Fetch all data securely from APIs
  useEffect(() => {
    async function loadReplayData() {
      try {
        setLoading(true);
        const token = await getToken();
        
        // Fetch session metadata
        const sessionRes = await fetch(`http://localhost:3000/api/sessions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (sessionRes.ok) {
          setSessionInfo(await sessionRes.json());
        }

        // Fetch events
        const eventsRes = await fetch(`http://localhost:3000/api/sessions/${id}/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (eventsRes.ok) {
          const events = await eventsRes.json();
          if (events.length < 2) {
            console.warn("Not enough events to replay");
            return;
          }

          // Extract custom events for TacticalStream
          const customEvents = [];
          const rawRrweb = [];
          
          events.forEach(e => {
            rawRrweb.push(e); 
            if (e.type === 5 && e.data && e.data.tag) { 
              let color = 'bg-indigo-400';
              let label = e.data.tag;
              let detail = '';
              let extra = '';
              
              if (e.data.tag === 'rage-click') {
                color = 'bg-pink-500';
                label = 'Rage Click';
                extra = `${e.data.payload.clickCount} clicks`;
              } else if (e.data.tag === 'console-error') {
                color = 'bg-amber-500';
                label = 'Console Error';
                detail = e.data.payload.message || 'Error';
              } else if (e.data.tag === 'dead-click') {
                color = 'bg-amber-500';
                label = 'Dead Click';
                detail = `<${e.data.payload.tagName.toLowerCase()}>`;
              }
              
              const timeOffset = e.timestamp - events[0].timestamp;
              customEvents.push({ timeOffset, type: e.data.tag, label, detail, extra, color });
            }
          });
          
          setTacticalEvents(customEvents);
          setRrwebEvents(rawRrweb);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadReplayData();
  }, [id, getToken]);

  // PHASE 2: Safely instantiate rrwebPlayer ONLY when data is loaded & target node exists
  useEffect(() => {
    if (loading || rrwebEvents.length === 0) return;

    let timer = setTimeout(() => {
      // CRITICAL SAFETY CHECK: Verify ref is still mounted inside async loop
      if (!playerContainerRef.current) return;

      // Clear previous nodes safely knowing NO React children live here
      playerContainerRef.current.innerHTML = '';
      
      try {
        playerInstanceRef.current = new rrwebPlayer({
          target: playerContainerRef.current,
          props: {
            events: rrwebEvents,
            width: playerContainerRef.current.clientWidth || 1024,
            height: playerContainerRef.current.clientHeight || 576,
            autoPlay: true,
            showController:false,
          }
        });
      } catch (playerError) {
        console.error("rrwebPlayer initialization failed:", playerError);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '';
      }
      playerInstanceRef.current = null;
    };
  }, [loading, rrwebEvents]);

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
        <div className="w-full max-w-6xl aspect-[16/10] bg-[#121218] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
          
          <div className="h-10 border-b border-white/5 bg-[#0d0d12]/50 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white/5 rounded-md px-32 py-1 text-xs text-zinc-400 font-mono flex items-center gap-2 border border-white/5">
                <Lock className="w-3 h-3 opacity-50" />
                {sessionInfo ? sessionInfo.url : 'Loading...'}
              </div>
            </div>
          </div>

          <div className="flex-1 relative bg-[#0a0a0f] flex items-center justify-center">
            {/* FIX: Absolute overlay is completely sibling-isolated from the player element */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f] z-10 text-zinc-500 font-mono text-sm animate-pulse">
                Fetching session events from server...
              </div>
            )}
            
            {/* FIX: Perfectly pristine DOM element containing zero React logic expressions */}
            <div ref={playerContainerRef} className="w-full h-full" />
          </div>

          <TacticalStream events={tacticalEvents} playerInstanceRef={playerInstanceRef} />
        </div>

        <PlayerControls events={tacticalEvents} playerInstanceRef={playerInstanceRef} />
      </div>
    </div>
  )
}