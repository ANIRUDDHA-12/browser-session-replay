import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import DashboardLayout from './layouts/DashboardLayout'
import SessionsPage from './pages/SessionsPage'
import TheaterPage from './pages/TheaterPage'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <div className="min-h-screen w-full bg-[#0d0d12] text-zinc-100 font-sans antialiased overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <SignedIn>
                <Navigate to="/sessions" replace />
              </SignedIn>
              <SignedOut>
                <LandingPage />
              </SignedOut>
            </>
          } />
          
          <Route path="/sessions" element={
            <>
              <SignedIn>
                <DashboardLayout>
                  <SessionsPage />
                </DashboardLayout>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />

          <Route path="/sessions/:id" element={
            <>
              <SignedIn>
                <TheaterPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
