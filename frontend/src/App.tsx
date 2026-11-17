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
    setWorkoutStartedAt(null)
    setWorkoutElapsedSeconds(0)
    setSessions([])
  }

  const saveProfile = (nextProfile: UserProfile) => {
    if (!authUser) return
    saveProfileToStorage(authUser.email, nextProfile)
    setProfile(nextProfile)
  }

  const toggleWorkout = () => {
    if (!authUser) return
    if (workoutStartedAt) {
      const durationSec =
        workoutElapsedSeconds + Math.floor((Date.now() - workoutStartedAt) / 1000)
      const completedSession: WorkoutSession = {
        id: crypto.randomUUID(),
        startTime: new Date(workoutStartedAt).toISOString(),
        endTime: new Date().toISOString(),
        durationSec,
        estimatedCalories: null,
      }
      const nextSessions = [completedSession, ...sessions]
      setSessions(nextSessions)
      saveSessionsToStorage(authUser.email, nextSessions)
      setWorkoutElapsedSeconds(durationSec)
      setWorkoutStartedAt(null)
    } else {
      setWorkoutElapsedSeconds(0)
      setWorkoutStartedAt(Date.now())
    }
  }

  // 1. Belum Login -> Tampilkan Gerbang Autentikasi Satu Pintu
  if (!authUser) {
    return <AuthPage onLogin={handleLogin} />
  }

  // 2. Role ADMIN -> Arahkan ke Workspace Admin
  if (authUser.role === 'ADMIN') {
    return <AdminDashboardPlaceholder admin={authUser} onLogout={handleLogout} />
  }

  // 3. Role USER -> Tampilkan Dashboard Pengguna
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