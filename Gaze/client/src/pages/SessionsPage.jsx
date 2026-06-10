import { useState } from 'react'
import FilterBar from '../components/FilterBar'
import SessionCard from '../components/SessionCard'

export default function SessionsPage() {
  // Mock data for UI development based on the design
  const [sessions] = useState([
    {
      id: 'session-1',
      user: 'usr_9x2b...',
      isStarred: true,
      time: '14:22 PM local',
      device: 'desktop',
      browser: 'chrome',
      country: 'US',
      duration: '12m 04s',
      pages: 4,
      hasRageClicks: true,
      hasErrors: false,
    },
    {
      id: 'session-2',
      user: 'Anonymous',
      isStarred: false,
      time: '14:18 PM local',
      device: 'desktop',
      browser: 'edge',
      country: 'DE',
      duration: '02m 15s',
      pages: 1,
      hasRageClicks: false,
      hasErrors: true,
    }
  ])

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4 pb-12">
      <FilterBar count={124} />
      
      <div className="flex flex-col gap-3 mt-2">
        {sessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  )
}
