import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import FilterBar from '../components/FilterBar'
import SessionCard from '../components/SessionCard'

export default function SessionsPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    async function fetchSessions() {
      try {
        const token = await getToken()
        const res = await fetch('http://localhost:3000/api/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          // Map DB rows to the props SessionCard expects
          const mapped = data.map(dbSession => {
            const totalMs = dbSession.duration_ms || 0;
            const m = Math.floor(totalMs / 60000);
            const s = Math.floor((totalMs % 60000) / 1000);
            return {
              id: dbSession.id,
              user: dbSession.user_agent.substring(0, 20) + '...',
              isStarred: false,
              time: new Date(dbSession.created_at).toLocaleTimeString(),
              device: dbSession.user_agent.toLowerCase().includes('mobi') ? 'mobile' : 'desktop',
              browser: dbSession.user_agent.toLowerCase().includes('chrome') ? 'chrome' : 'other',
              duration: totalMs > 0 ? `${m}m ${s}s` : 'Live',
              pages: 1,
              hasRageClicks: dbSession.has_rage_clicks || false,
              hasErrors: dbSession.has_errors || false,
            };
          });
          setSessions(mapped)
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [getToken])

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4 pb-12">
      <FilterBar count={sessions.length} />
      
      {loading ? (
        <div className="text-zinc-500 text-center py-12">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-zinc-500 text-center py-12">No sessions found. Install the GAZE SDK to start tracking.</div>
      ) : (
        <div className="flex flex-col gap-3 mt-2">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}
