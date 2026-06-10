import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 border-l border-white/5">
        <Header />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
