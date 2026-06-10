import { useState, useEffect } from 'react'
import { Play, Pause, SkipForward, Rewind, FastForward } from 'lucide-react'

export default function PlayerControls({ events, playerInstanceRef }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)

  // Sync state cleanly via native rrwebPlayer events
  useEffect(() => {
    let intervalId;

    const syncPlayerState = () => {
      const player = playerInstanceRef?.current;
      if (player && typeof player.getMetaData === 'function') {
        try {
          const meta = player.getMetaData();
          setTotalDuration(meta.totalTime || 0);
          
          // rrweb-player internal replayer exposes state
          if (player.getReplayer) {
            const replayer = player.getReplayer();
            setCurrentTime(replayer.timer.timeOffset || 0);
            
            const isPlayingNow = replayer.service.state.matches('playing');
            setIsPlaying(isPlayingNow);
          }
        } catch (e) {
          // safe fail
        }
      }
    };

    // Poll gracefully since rrwebPlayer event bindings can sometimes detach
    intervalId = setInterval(syncPlayerState, 100);
    return () => clearInterval(intervalId);
  }, [playerInstanceRef]);

  // Handle Play / Pause State Alterations via native underlying properties
  const handleTogglePlay = () => {
    if (!playerInstanceRef || !playerInstanceRef.current) return;
    
    try {
      playerInstanceRef.current.toggle();
      setIsPlaying(!isPlaying);
    } catch (e) {
      console.error(e);
    }
  }

  // Handle Playback Velocity Alterations
  const handleSpeedChange = () => {
    if (!playerInstanceRef || !playerInstanceRef.current) return;
    const newSpeed = playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1;
    
    try {
      playerInstanceRef.current.setSpeed(newSpeed);
      setPlaybackSpeed(newSpeed);
    } catch(e) {
      console.error(e);
    }
  }

  // Helper utility to convert milliseconds into highly clean display formatting string
  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate true exact percentage fill for tracking timeline completion
  const progressPercentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl flex flex-col items-center gap-4 z-20 pointer-events-none">
      
      {/* Dynamic Timeline Bar */}
      <div className="w-full bg-[#0d0d12]/80 backdrop-blur-md border border-white/10 rounded-full h-8 flex items-center px-4 relative shadow-xl pointer-events-auto">
        <span className="text-[10px] font-mono text-zinc-500 w-12">{formatTime(currentTime)}</span>
        
        <div className="flex-1 mx-4 h-1 bg-white/10 rounded-full relative">
          {/* True runtime Progress Fill */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full transition-all duration-100 linear"
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* Dynamic Event Markers projected cleanly relative to true track duration boundary bounds */}
          {totalDuration > 0 && events.map((ev, i) => {
            const leftPct = (ev.timeOffset / totalDuration) * 100;
            if (leftPct > 100) return null; // Guard boundary overflow
            
            return (
              <div 
                key={i}
                className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${ev.color} opacity-90 cursor-pointer transform hover:scale-150 transition-transform`}
                style={{ 
                  left: `${leftPct}%`,
                  boxShadow: `0 0 8px ${
                    ev.type === 'rage-click' ? '#ec4899' : 
                    ev.type === 'dead-click' || ev.type === 'console-error' ? '#f59e0b' : '#818cf8'
                  }`
                }}
                title={`${ev.label}: ${ev.detail || ev.extra || ''}`}
              />
            )
          })}
        </div>
        
        <span className="text-[10px] font-mono text-zinc-500 w-12 text-right">{formatTime(totalDuration)}</span>
      </div>

      {/* Controller Button System Pill */}
      <div className="bg-[#0d0d12]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 flex items-center gap-6 shadow-2xl pointer-events-auto">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Rewind className="w-5 h-5" />
        </button>
        
        <button 
          onClick={handleTogglePlay}
          className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(165,180,252,0.6)]"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-indigo-900 fill-indigo-900" />
          ) : (
            <Play className="w-5 h-5 text-indigo-900 fill-indigo-900 ml-1" />
          )}
        </button>
        
        <button className="text-zinc-400 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-white/10"></div>

        <button 
          onClick={handleSpeedChange}
          className="text-xs font-mono font-medium text-zinc-300 hover:text-white flex items-center gap-1"
        >
          <FastForward className="w-4 h-4 opacity-70" />
          {playbackSpeed}x
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