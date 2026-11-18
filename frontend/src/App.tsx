import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { ActivityHistoryPage } from './pages/ActivityHistoryPage'
import { AdminDashboardPlaceholder } from './pages/AdminDashboardPlaceholder'
import { AuthPage } from './pages/AuthPage'
import { CalorieCalculatorPage } from './pages/CalorieCalculatorPage'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProfilePage } from './pages/ProfilePage'
import { clearAuthUser, getSavedAuthUser } from './services/authService'
import { startWorkoutSessionApi, stopWorkoutSessionApi } from './services/sessionService'
import {
  createEmptyProfile,
  loadProfile,
  loadSessions,
  saveProfileToStorage,
  saveSessionsToStorage,
} from './services/storageService'
import type { AuthUser, UserProfile, WorkoutSession } from './types'

function buildInitialProfile(user: AuthUser): UserProfile {
  const local = loadProfile(user.email)
  return {
    ...local,
    name: local.name || user.name,
    email: user.email,
    accountType: user.role,
    weight: local.weight || (user.weightKg ? String(user.weightKg) : ''),
    height: local.height || (user.heightCm ? String(user.heightCm) : ''),
    birthDate: local.birthDate || user.birthDate || '',
  }
}

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getSavedAuthUser())
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [workoutStartedAt, setWorkoutStartedAt] = useState<number | null>(null)
  const [workoutElapsedSeconds, setWorkoutElapsedSeconds] = useState(0)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = getSavedAuthUser()
    return saved ? buildInitialProfile(saved) : createEmptyProfile()
  })
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const saved = getSavedAuthUser()
    return saved ? loadSessions(saved.email) : []
  })

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarExpanded(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const navigate = (page: string) => {
    setActivePage(page)
    setSidebarExpanded(false)
  }

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user)
    setProfile(buildInitialProfile(user))
    setSessions(loadSessions(user.email))
    setActivePage('Dashboard')
  }

  const handleLogout = () => {
    clearAuthUser()
    setAuthUser(null)
    setProfile(createEmptyProfile())
    setActivePage('Dashboard')
    setSidebarExpanded(false)
    setActiveSessionId(null)
    setWorkoutStartedAt(null)
    setWorkoutElapsedSeconds(0)
    setSessions([])
  }

  const saveProfile = (nextProfile: UserProfile) => {
    if (!authUser) return
    saveProfileToStorage(authUser.email, nextProfile)
    setProfile(nextProfile)
  }

  const toggleWorkout = async () => {
    if (!authUser) return

    if (workoutStartedAt) {
      const durationSec =
        workoutElapsedSeconds + Math.floor((Date.now() - workoutStartedAt) / 1000)

      let estimatedCalories: number | null = null
      if (activeSessionId) {
        try {
          const result = await stopWorkoutSessionApi(activeSessionId, durationSec)
          estimatedCalories = result.caloriesKcal
        } catch (err) {
          console.error('Gagal menutup sesi di server:', err)
        }
      }

      const completedSession: WorkoutSession = {
        id: activeSessionId ? String(activeSessionId) : crypto.randomUUID(),
        startTime: new Date(workoutStartedAt).toISOString(),
        endTime: new Date().toISOString(),
        durationSec,
        estimatedCalories,
      }
      const nextSessions = [completedSession, ...sessions]
      setSessions(nextSessions)
      saveSessionsToStorage(authUser.email, nextSessions)
      setWorkoutElapsedSeconds(durationSec)
      setWorkoutStartedAt(null)
      setActiveSessionId(null)
    } else {
      try {
        const res = await startWorkoutSessionApi(authUser.id)
        setActiveSessionId(res.sessionId)
        setWorkoutElapsedSeconds(0)
        setWorkoutStartedAt(Date.now())
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal terhubung ke server backend')
      }
    }
  }

  if (!authUser) {
    return <AuthPage onLogin={handleLogin} />
  }

  if (authUser.role === 'ADMIN') {
    return <AdminDashboardPlaceholder admin={authUser} onLogout={handleLogout} />
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        expanded={sidebarExpanded}
        onNavigate={navigate}
        onToggle={() => setSidebarExpanded((value) => !value)}
      />
      <div className="app-content">
        <TopBar
          displayName={profile.name || authUser.name}
          onLogout={handleLogout}
          onMenu={() => setSidebarExpanded(true)}
          onProfile={() => navigate('My Profile')}
          profilePhoto={profile.photo}
          title={activePage}
        />
        <main>
          {activePage === 'Dashboard' ? (
            <DashboardPage
              activeSessionId={activeSessionId}
              latestSession={sessions[0] ?? null}
              onToggleWorkout={toggleWorkout}
              profile={profile}
              workoutElapsedSeconds={workoutElapsedSeconds}
              workoutStartedAt={workoutStartedAt}
            />
          ) : activePage === 'Calorie Calculator' ? (
            <CalorieCalculatorPage profile={profile} />
          ) : activePage === 'Activity History' ? (
            <ActivityHistoryPage sessions={sessions} />
          ) : activePage === 'My Profile' ? (
            <ProfilePage onSave={saveProfile} profile={profile} />
          ) : (
            <PlaceholderPage page={activePage} onBack={() => navigate('Dashboard')} />
          )}
        </main>
      </div>
    </div>
  )
}