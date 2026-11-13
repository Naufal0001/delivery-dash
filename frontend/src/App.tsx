import { useEffect, useRef, useState, type ReactNode } from 'react'

type IconName =
  | 'activity'
  | 'bike'
  | 'calculator'
  | 'calendar'
  | 'chevron'
  | 'close'
  | 'dashboard'
  | 'distance'
  | 'flame'
  | 'heart'
  | 'history'
  | 'logout'
  | 'menu'
  | 'profile'
  | 'rfid'
  | 'score'
  | 'time'
  | 'weight'

type NavigationItem = {
  label: string
  icon: IconName
}

type UserProfile = {
  name: string
  email: string
  accountType: 'user'
  photo: string
  birthDate: string
  weight: string
  height: string
}

type WorkoutSession = {
  id: string
  startTime: string
  endTime: string
  durationSec: number
  estimatedCalories: number | null
}

const SESSION_KEY = 'deliverydash.session'
const profileKey = (email: string) => `deliverydash.profile.${email}`
const sessionsKey = (email: string) => `deliverydash.sessions.${email}`
const createEmptyProfile = (email = ''): UserProfile => ({
  name: '',
  email,
  accountType: 'user',
  photo: '',
  birthDate: '',
  weight: '',
  height: '',
})

function loadProfile(email: string): UserProfile {
  try {
    const saved = localStorage.getItem(profileKey(email))
    return saved
      ? { ...createEmptyProfile(email), ...JSON.parse(saved), accountType: 'user' }
      : createEmptyProfile(email)
  } catch {
    return createEmptyProfile(email)
  }
}

function loadSessions(email: string): WorkoutSession[] {
  try {
    const saved = localStorage.getItem(sessionsKey(email))
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const navigation: NavigationItem[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Activity History', icon: 'history' },
  { label: 'Calorie Calculator', icon: 'calculator' },
  { label: 'My Profile', icon: 'profile' },
]

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    activity: (
      <>
        <path d="M4 12h3l2.2-6 4.2 12 2.1-6H20" />
        <path d="M5 5.5a9 9 0 1 1-1 11" opacity=".35" />
      </>
    ),
    bike: (
      <>
        <circle cx="5.5" cy="16.5" r="3.5" />
        <circle cx="18.5" cy="16.5" r="3.5" />
        <path d="m5.5 16.5 4-7h4l5 7M9.5 9.5l4 7h-8M8 6h3M15 7h2" />
      </>
    ),
    calculator: (
      <>
        <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
        <path d="M8 6.5h8v3H8zM8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    distance: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5" />
      </>
    ),
    flame: (
      <path d="M13.5 3.2c.6 3.1-.8 4.4-2 5.4-1.2-1-1.7-2.1-1.4-3.7C7.4 6.7 5 9.5 5 13a7 7 0 0 0 14 0c0-3.8-2.2-7.3-5.5-9.8ZM12 20a3.5 3.5 0 0 1-3.5-3.5c0-1.6.9-3 2.3-4 .1 1 .6 1.8 1.3 2.4 1-.8 1.6-1.8 1.6-3.3a5.7 5.7 0 0 1 1.8 4.1A3.5 3.5 0 0 1 12 20Z" />
    ),
    heart: (
      <path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 22l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5M14 8l4 4-4 4M18 12H8" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    rfid: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M7 9h4M7 12h2M15 9.5a3.5 3.5 0 0 1 0 5M17.5 7.5a6.3 6.3 0 0 1 0 9" />
      </>
    ),
    score: (
      <>
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </>
    ),
    time: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    weight: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M8 9a4 4 0 0 1 8 0M12 9l2-2" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {paths[name]}
      </g>
    </svg>
  )
}

function AuthScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [method, setMethod] = useState<'password' | 'rfid'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const submitLogin = () => {
    setError('')
    setNotice('')

    if (email !== 'demo' || password !== '123') {
      setError('Incorrect email or password. Try demo and 123.')
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      localStorage.setItem(SESSION_KEY, email)
      setLoading(false)
      onLogin(email)
    }, 650)
  }

  const submitRegistration = () => {
    setError('')
    if (!email || !password || !confirmPassword) {
      setError('Complete all fields to continue.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setNotice('Registration is not available yet. Use the demo account to log in.')
  }

  const switchView = (nextView: 'login' | 'register') => {
    setView(nextView)
    setMethod('password')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setNotice('')
  }

  return (
    <div className="auth-shell">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <span className="brand-mark">
            <Icon name="bike" size={24} />
          </span>
          <div>
            <strong>DeliveryDash</strong>
            <small>Bicycle activity monitor</small>
          </div>
        </div>
        <div className="auth-brand-panel__copy">
          <p className="section-kicker">Ride. Deliver. Progress.</p>
          <h1>Your cycling activity, all in one place.</h1>
          <p>Monitor your rides, activity history, and personal goals from a focused dashboard.</p>
        </div>
        <div className="auth-brand-panel__status">
          <span className="status-dot" />
          Frontend demonstration
        </div>
      </section>

      <main className="auth-main">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-card__heading">
            <p className="section-kicker">{view === 'login' ? 'Welcome back' : 'Create an account'}</p>
            <h2 id="auth-title">{view === 'login' ? 'Log in to DeliveryDash' : 'Register'}</h2>
            <p>
              {view === 'login'
                ? 'Use the demo account or preview the RFID login state.'
                : 'Set up your account details to preview the registration experience.'}
            </p>
          </div>

          {view === 'login' && (
            <div className="auth-tabs" role="tablist" aria-label="Login method">
              <button
                aria-selected={method === 'password'}
                className={method === 'password' ? 'auth-tab auth-tab--active' : 'auth-tab'}
                onClick={() => {
                  setMethod('password')
                  setError('')
                }}
                role="tab"
                type="button"
              >
                Email & Password
              </button>
              <button
                aria-selected={method === 'rfid'}
                className={method === 'rfid' ? 'auth-tab auth-tab--active' : 'auth-tab'}
                onClick={() => {
                  setMethod('rfid')
                  setError('')
                }}
                role="tab"
                type="button"
              >
                RFID Scan
              </button>
            </div>
          )}

          {view === 'login' && method === 'rfid' ? (
            <div className="rfid-state">
              <div className="rfid-illustration">
                <span className="rfid-wave rfid-wave--one" />
                <span className="rfid-wave rfid-wave--two" />
                <span className="rfid-card">
                  <Icon name="rfid" size={36} />
                </span>
              </div>
              <h3>Tap your RFID card to log in</h3>
              <p>Hold your card near the reader to authenticate.</p>
              <div className="auth-notice">RFID login is not available yet.</div>
            </div>
          ) : (
            <div className="auth-form">
              <label htmlFor="auth-email">Email address</label>
              <input
                autoComplete="email"
                id="auth-email"
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                  setNotice('')
                }}
                placeholder="Enter email address"
                type="email"
                value={email}
              />

              <label htmlFor="auth-password">Password</label>
              <div className="password-field">
                <input
                  autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                  id="auth-password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                    setNotice('')
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && view === 'login' && !loading) submitLogin()
                  }}
                  placeholder="Enter password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {view === 'register' && (
                <>
                  <label htmlFor="auth-confirm-password">Confirm password</label>
                  <input
                    autoComplete="new-password"
                    id="auth-confirm-password"
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setError('')
                      setNotice('')
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') submitRegistration()
                    }}
                    placeholder="Re-enter password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                  />
                </>
              )}

              {error && (
                <p className="auth-message auth-message--error" role="alert">
                  {error}
                </p>
              )}
              {notice && (
                <p className="auth-message auth-message--notice" role="status">
                  {notice}
                </p>
              )}

              <button
                className="primary-button auth-submit"
                disabled={loading}
                onClick={view === 'login' ? submitLogin : submitRegistration}
                type="button"
              >
                {loading ? <span className="button-spinner" /> : <Icon name="profile" size={18} />}
                <span>{loading ? 'Logging in…' : view === 'login' ? 'Log in' : 'Register'}</span>
                {!loading && <Icon name="chevron" size={17} />}
              </button>
            </div>
          )}

          <div className="auth-switch">
            <span>{view === 'login' ? 'New to DeliveryDash?' : 'Already have an account?'}</span>
            <button onClick={() => switchView(view === 'login' ? 'register' : 'login')} type="button">
              {view === 'login' ? 'Register' : 'Back to login'}
            </button>
          </div>

          {view === 'login' && method === 'password' && (
            <div className="demo-credentials">
              <span>Demo credentials</span>
              <code>demo / 123</code>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function IconButton({
  label,
  icon,
  onClick,
  className = '',
}: {
  label: string
  icon: IconName
  onClick: () => void
  className?: string
}) {
  return (
    <button aria-label={label} className={`icon-button ${className}`} onClick={onClick} type="button">
      <Icon name={icon} size={22} />
    </button>
  )
}

function Sidebar({
  expanded,
  activePage,
  onToggle,
  onNavigate,
}: {
  expanded: boolean
  activePage: string
  onToggle: () => void
  onNavigate: (label: string) => void
}) {
  return (
    <>
      {expanded && (
        <button
          aria-label="Close navigation"
          className="navigation-scrim"
          onClick={onToggle}
          type="button"
        />
      )}
      <aside className={`sidebar ${expanded ? 'sidebar--expanded' : ''}`} aria-label="Primary navigation">
        <div className="sidebar__brand">
          <span className="brand-mark">
            <Icon name="bike" size={24} />
          </span>
          <span className="brand-copy">
            <strong>DeliveryDash</strong>
            <small>Activity monitor</small>
          </span>
          {expanded && (
            <IconButton
              className="sidebar__close"
              icon="close"
              label="Collapse navigation"
              onClick={onToggle}
            />
          )}
        </div>

        <nav className="sidebar__nav">
          {navigation.map((item) => {
            const isActive = activePage === item.label
            return (
              <button
                aria-current={isActive ? 'page' : undefined}
                className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
                key={item.label}
                onClick={() => onNavigate(item.label)}
                title={!expanded ? item.label : undefined}
                type="button"
              >
                <span className="nav-item__icon">
                  <Icon name={item.icon} />
                </span>
                <span className="nav-item__label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="connection-dot" />
          <span className="sidebar__footer-copy">System ready</span>
        </div>
      </aside>
    </>
  )
}

function TopBar({
  title,
  displayName,
  profilePhoto,
  onMenu,
  onProfile,
  onLogout,
}: {
  title: string
  displayName: string
  profilePhoto: string
  onMenu: () => void
  onProfile: () => void
  onLogout: () => void
}) {
  return (
    <header className="topbar">
      <div className="topbar__leading">
        <IconButton icon="menu" label="Open navigation" onClick={onMenu} />
        <div>
          <p className="topbar__eyebrow">Bicycle activity</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="topbar__actions">
        <button className="profile-button" onClick={onProfile} type="button">
          <span className="profile-button__avatar">
            {profilePhoto ? (
              <img alt="" src={profilePhoto} />
            ) : (
              <Icon name="profile" size={19} />
            )}
          </span>
          <span className="profile-button__copy">
            <strong>{displayName}</strong>
            <small>View profile</small>
          </span>
          <Icon name="chevron" size={16} />
        </button>
        <button className="logout-button" onClick={onLogout} type="button">
          <Icon name="logout" size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

function SessionCard({ active }: { active: boolean }) {
  return (
    <section
      aria-labelledby="session-title"
      className={`session-card session-card--compact ${active ? 'session-card--active' : ''}`}
    >
      <div className="session-card__indicator">
        <span className={`status-dot ${active ? 'status-dot--active' : 'status-dot--neutral'}`} />
      </div>
      <div className="session-card__content">
        <p className="section-kicker">Session status</p>
        <h2 id="session-title">{active ? 'Active Session' : 'No Active Session'}</h2>
        <p>
          {active
            ? 'Workout timer is running. Live IoT readings will appear when device data is available.'
            : 'Select Start Workout above when you are ready to begin.'}
        </p>
      </div>
    </section>
  )
}

function StatCard({
  label,
  value,
  unit,
  icon,
  detail,
}: {
  label: string
  value: string
  unit: string
  icon: IconName
  detail: string
}) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__icon">
          <Icon name={icon} size={21} />
        </span>
        <span className="stat-card__label">{label}</span>
      </div>
      <div className="stat-card__value">
        <strong>{value}</strong>
        {unit && <span>{unit}</span>}
      </div>
      <p>{detail}</p>
    </article>
  )
}

function formatSessionDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function RecentActivity({ session }: { session: WorkoutSession | null }) {
  const fields = session
    ? [
        ['Start time', formatSessionDate(session.startTime)],
        ['End time', formatSessionDate(session.endTime)],
        ['Duration', formatStopwatch(session.durationSec)],
        [
          'Estimated calories burned',
          session.estimatedCalories === null ? '--' : `${session.estimatedCalories} kcal`,
        ],
      ]
    : [
        ['Start time', '--'],
        ['End time', '--'],
        ['Duration', '--'],
        ['Estimated calories burned', '--'],
      ]

  return (
    <section className="panel recent-activity" aria-labelledby="recent-title">
      <div className="panel__header">
        <div>
          <p className="section-kicker">Session history</p>
          <h2 id="recent-title">Recent Activity</h2>
        </div>
        <span className="subtle-chip">Latest session</span>
      </div>
      {!session && (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Icon name="calendar" size={27} />
          </span>
          <div>
            <h3>No cycling activity yet</h3>
            <p>Complete your first session to see your progress here.</p>
          </div>
        </div>
      )}
      <div className="activity-fields" aria-label="Session fields">
        {fields.map(([label, value]) => (
          <div className="activity-field" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivityHistory({ sessions }: { sessions: WorkoutSession[] }) {
  return (
    <div className="history-page">
      <section className="calculator-intro">
        <div className="calculator-intro__icon">
          <Icon name="history" size={27} />
        </div>
        <div>
          <p className="section-kicker">Completed workouts</p>
          <h2>Activity History</h2>
          <p>Review the sessions completed with your current account.</p>
        </div>
      </section>

      <section className="panel history-panel" aria-labelledby="history-list-title">
        <div className="panel__header">
          <div>
            <p className="section-kicker">Session records</p>
            <h2 id="history-list-title">Your sessions</h2>
          </div>
          <span className="subtle-chip">
            {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state history-empty">
            <span className="empty-state__icon">
              <Icon name="history" size={27} />
            </span>
            <div>
              <h3>No completed sessions</h3>
              <p>Start and stop a workout from the Dashboard to add it here.</p>
            </div>
          </div>
        ) : (
          <div className="history-list">
            <div className="history-list__header" aria-hidden="true">
              <span>Start time</span>
              <span>End time</span>
              <span>Duration</span>
              <span>Estimated calories burned</span>
            </div>
            {sessions.map((session) => (
              <article className="history-row" key={session.id}>
                <div data-label="Start time">
                  <span>Start time</span>
                  <strong>{formatSessionDate(session.startTime)}</strong>
                </div>
                <div data-label="End time">
                  <span>End time</span>
                  <strong>{formatSessionDate(session.endTime)}</strong>
                </div>
                <div data-label="Duration">
                  <span>Duration</span>
                  <strong>{formatStopwatch(session.durationSec)}</strong>
                </div>
                <div data-label="Estimated calories burned">
                  <span>Estimated calories burned</span>
                  <strong>
                    {session.estimatedCalories === null ? '--' : `${session.estimatedCalories} kcal`}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function formatStopwatch(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

function Dashboard({
  profile,
  latestSession,
  workoutStartedAt,
  workoutElapsedSeconds,
  onToggleWorkout,
}: {
  profile: UserProfile
  latestSession: WorkoutSession | null
  workoutStartedAt: number | null
  workoutElapsedSeconds: number
  onToggleWorkout: () => void
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    workoutStartedAt
      ? workoutElapsedSeconds + Math.floor((Date.now() - workoutStartedAt) / 1000)
      : workoutElapsedSeconds,
  )
  const sessionActive = workoutStartedAt !== null

  useEffect(() => {
    if (!workoutStartedAt) {
      setElapsedSeconds(workoutElapsedSeconds)
      return
    }

    const updateElapsed = () =>
      setElapsedSeconds(
        Math.max(
          0,
          workoutElapsedSeconds + Math.floor((Date.now() - workoutStartedAt) / 1000),
        ),
      )
    updateElapsed()
    const timer = window.setInterval(updateElapsed, 1000)
    return () => window.clearInterval(timer)
  }, [workoutElapsedSeconds, workoutStartedAt])

  const statistics: Array<{
    label: string
    value: string
    unit: string
    icon: IconName
    detail: string
  }> = [
    {
      label: 'Weight',
      value: profile.weight || '--',
      unit: 'kg',
      icon: 'weight',
      detail: profile.weight ? 'From your profile' : 'Add weight in profile',
    },
    {
      label: 'Speed',
      value: '--',
      unit: 'km/h',
      icon: 'activity',
      detail: 'Waiting for IoT data',
    },
    {
      label: 'Time',
      value: formatStopwatch(elapsedSeconds),
      unit: '',
      icon: 'time',
      detail: sessionActive ? 'Workout in progress' : 'Starts with your workout',
    },
    {
      label: 'Heart Rate',
      value: '--',
      unit: 'BPM',
      icon: 'heart',
      detail: 'Waiting for IoT data',
    },
    {
      label: 'Calories Burned',
      value: '--',
      unit: 'kcal',
      icon: 'flame',
      detail: 'No workout data',
    },
  ]

  return (
    <div className="dashboard">
      <section aria-labelledby="stats-title">
        <div className="section-heading section-heading--workout">
          <div>
            <p className="section-kicker">Workout session</p>
            <h2 id="stats-title">Activity Statistics</h2>
          </div>
          <span className="data-note">
            {sessionActive ? 'Workout currently active' : 'IoT values appear when available'}
          </span>
        </div>
        <div className="stats-grid">
          {statistics.map((stat) => (
            <StatCard {...stat} key={stat.label} />
          ))}
        </div>
        <button
          className={`workout-session-button ${sessionActive ? 'workout-session-button--stop' : ''}`}
          onClick={onToggleWorkout}
          type="button"
        >
          <Icon name={sessionActive ? 'close' : 'bike'} size={19} />
          <span>{sessionActive ? 'Stop Session' : 'Start Workout'}</span>
        </button>
      </section>

      <SessionCard active={sessionActive} />

      <RecentActivity session={latestSession} />
    </div>
  )
}

const ESTIMATED_CALORIES_PER_MINUTE_PER_KMH = 0.4

function formatRideTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    hours > 0 ? `${hours} hr` : '',
    minutes > 0 ? `${minutes} min` : '',
    seconds > 0 ? `${seconds} sec` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function calculateAge(birthDate: string) {
  if (!birthDate) return '-'
  const birth = new Date(`${birthDate}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return '-'
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const birthdayPending =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  if (birthdayPending) age -= 1
  return age >= 0 ? String(age) : '-'
}

function CalorieCalculator({ profile }: { profile: UserProfile }) {
  const [calories, setCalories] = useState('')
  const [speed, setSpeed] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    const targetCalories = Number(calories)
    const cyclingSpeed = Number(speed)

    if (!calories || !Number.isFinite(targetCalories) || targetCalories <= 0) {
      setError('Enter a calorie target greater than zero.')
      setResult(null)
      return
    }

    if (targetCalories > 10000) {
      setError('Enter a calorie target of 10,000 or less.')
      setResult(null)
      return
    }

    if (!speed || !Number.isFinite(cyclingSpeed) || cyclingSpeed <= 0) {
      setError('Enter a cycling speed greater than zero.')
      setResult(null)
      return
    }

    if (cyclingSpeed > 100) {
      setError('Enter a cycling speed of 100 km/h or less.')
      setResult(null)
      return
    }

    const estimatedCaloriesPerMinute = cyclingSpeed * ESTIMATED_CALORIES_PER_MINUTE_PER_KMH

    setError('')
    setResult(Math.ceil((targetCalories / estimatedCaloriesPerMinute) * 60))
  }

  return (
    <div className="calculator-page">
      <section className="calculator-intro">
        <div className="calculator-intro__icon">
          <Icon name="calculator" size={27} />
        </div>
        <div>
          <p className="section-kicker">Plan your next ride</p>
          <h2>Calorie Calculator</h2>
          <p>
            Enter your calorie goal and expected cycling speed to estimate the total ride time.
          </p>
        </div>
      </section>

      <section className="calculator-profile" aria-labelledby="calculator-profile-title">
        <div>
          <p className="section-kicker">Saved rider profile</p>
          <h2 id="calculator-profile-title">Your data</h2>
        </div>
        <div className="calculator-profile__grid">
          {[
            ['Name', profile.name || '-'],
            ['Age', calculateAge(profile.birthDate)],
            ['Weight (kg)', profile.weight || '-'],
            ['Height (cm)', profile.height || '-'],
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="calculator-layout">
        <section className="panel calculator-card" aria-labelledby="calculator-form-title">
          <div className="panel__header">
            <div>
              <p className="section-kicker">Target calories</p>
              <h2 id="calculator-form-title">Set your goal</h2>
            </div>
            <span className="mission-icon">
              <Icon name="score" />
            </span>
          </div>

          <label className="calculator-label" htmlFor="calorie-target">
            Calories to burn
          </label>
          <div className={`calculator-input-wrap ${error ? 'calculator-input-wrap--error' : ''}`}>
            <input
              aria-describedby={error ? 'calculator-error' : 'calculator-help'}
              id="calorie-target"
              inputMode="decimal"
              max="10000"
              min="1"
              onChange={(event) => {
                setCalories(event.target.value)
                if (error) setError('')
                if (result !== null) setResult(null)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') calculate()
              }}
              placeholder="e.g. 300"
              step="1"
              type="number"
              value={calories}
            />
            <span>kcal</span>
          </div>

          <label className="calculator-label calculator-label--speed" htmlFor="cycling-speed">
            Cycling speed
          </label>
          <div className={`calculator-input-wrap ${error ? 'calculator-input-wrap--error' : ''}`}>
            <input
              aria-describedby={error ? 'calculator-error' : 'calculator-help'}
              id="cycling-speed"
              inputMode="decimal"
              max="100"
              min="1"
              onChange={(event) => {
                setSpeed(event.target.value)
                if (error) setError('')
                if (result !== null) setResult(null)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') calculate()
              }}
              placeholder="e.g. 20"
              step="0.1"
              type="number"
              value={speed}
            />
            <span>km/h</span>
          </div>

          {error ? (
            <p className="calculator-message calculator-message--error" id="calculator-error" role="alert">
              {error}
            </p>
          ) : (
            <p className="calculator-message" id="calculator-help">
              Enter your calorie goal and expected average cycling speed.
            </p>
          )}

          <button className="primary-button calculator-button" onClick={calculate} type="button">
            <Icon name="calculator" size={19} />
            <span>Calculate</span>
            <Icon name="chevron" size={17} />
          </button>
        </section>

        <section
          aria-live="polite"
          className={`calculator-result ${result !== null ? 'calculator-result--ready' : ''}`}
        >
          <p className="section-kicker">Estimated ride time</p>
          {result !== null ? (
            <>
              <div className="calculator-result__time">
                <Icon name="time" size={24} />
                <strong>{formatRideTime(result)}</strong>
              </div>
              <p>
                To burn approximately <strong>{Number(calories).toLocaleString()} calories</strong>,
                plan to ride at <strong>{Number(speed).toLocaleString()} km/h</strong> for this amount
                of time.
              </p>
            </>
          ) : (
            <>
              <div className="calculator-result__empty">
                <Icon name="time" size={27} />
                <span>Your estimate will appear here</span>
              </div>
              <p>Enter a calorie target and cycling speed, then select Calculate to see the estimate.</p>
            </>
          )}
          <div className="calculator-assumption">
            <span className="status-dot status-dot--neutral" />
            <p>
              Estimate uses speed × {ESTIMATED_CALORIES_PER_MINUTE_PER_KMH} to approximate calories
              burned per minute. Actual results vary by rider, terrain, bicycle, and effort.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function ProfilePage({
  profile,
  onSave,
}: {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
}) {
  const [draft, setDraft] = useState(profile)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().slice(0, 10)

  const updateField = (field: keyof UserProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setError('')
    setMessage('')
  }

  const selectPhoto = (file: File | undefined) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.')
      setMessage('')
      return
    }
    if (file.size > 1024 * 1024) {
      setError('Choose an image smaller than 1 MB.')
      setMessage('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('photo', reader.result)
      }
    }
    reader.onerror = () => {
      setError('The selected image could not be read.')
      setMessage('')
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    const weight = Number(draft.weight)
    const height = Number(draft.height)

    if (!draft.weight || !Number.isFinite(weight) || weight <= 0) {
      setError('Weight must be a positive number.')
      setMessage('')
      return
    }
    if (!draft.height || !Number.isFinite(height) || height <= 0) {
      setError('Height must be a positive number.')
      setMessage('')
      return
    }
    if (draft.birthDate && draft.birthDate > today) {
      setError('Date of birth cannot be in the future.')
      setMessage('')
      return
    }
    if (!draft.email.trim()) {
      setError('Email address is required.')
      setMessage('')
      return
    }

    onSave({ ...draft, email: draft.email.trim(), accountType: 'user' })
    setError('')
    setMessage('Profile saved successfully.')
  }

  return (
    <div className="profile-page">
      <section className="calculator-intro">
        <div className="calculator-intro__icon">
          <Icon name="profile" size={27} />
        </div>
        <div>
          <p className="section-kicker">Personal details</p>
          <h2>My Profile</h2>
          <p>Keep your rider information up to date for your local dashboard experience.</p>
        </div>
      </section>

      <section className="panel profile-card" aria-labelledby="profile-form-title">
        <div className="panel__header">
          <div>
            <p className="section-kicker">Rider information</p>
            <h2 id="profile-form-title">Profile details</h2>
          </div>
          <span className="mission-icon">
            <Icon name="profile" />
          </span>
        </div>

        <div className="profile-photo-editor">
          <span className="profile-photo-editor__preview">
            {draft.photo ? (
              <img alt="Selected profile preview" src={draft.photo} />
            ) : (
              <Icon name="profile" size={30} />
            )}
          </span>
          <div>
            <strong>Profile photo</strong>
            <p>JPG, PNG, or WebP. Maximum file size 1 MB.</p>
            <button
              className="photo-upload-button"
              onClick={() => photoInputRef.current?.click()}
              type="button"
            >
              Change profile photo
            </button>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="visually-hidden"
              id="profile-photo"
              onChange={(event) => selectPhoto(event.target.files?.[0])}
              ref={photoInputRef}
              type="file"
            />
          </div>
        </div>

        <div className="profile-form">
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Enter your name"
            type="text"
            value={draft.name}
          />

          <label htmlFor="profile-email">Email address</label>
          <input
            autoComplete="email"
            id="profile-email"
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="Enter email address"
            type="email"
            value={draft.email}
          />

          <label htmlFor="profile-account-type">Account type</label>
          <input
            aria-readonly="true"
            className="profile-readonly"
            id="profile-account-type"
            readOnly
            type="text"
            value={draft.accountType}
          />

          <label htmlFor="profile-birth-date">Date of Birth</label>
          <input
            id="profile-birth-date"
            max={today}
            onChange={(event) => updateField('birthDate', event.target.value)}
            type="date"
            value={draft.birthDate}
          />

          <div className="profile-form__row">
            <div>
              <label htmlFor="profile-weight">Weight (kg)</label>
              <input
                id="profile-weight"
                inputMode="decimal"
                min="0.1"
                onChange={(event) => updateField('weight', event.target.value)}
                placeholder="Enter weight"
                step="0.1"
                type="number"
                value={draft.weight}
              />
            </div>
            <div>
              <label htmlFor="profile-height">Height (cm)</label>
              <input
                id="profile-height"
                inputMode="decimal"
                min="0.1"
                onChange={(event) => updateField('height', event.target.value)}
                placeholder="Enter height"
                step="0.1"
                type="number"
                value={draft.height}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="profile-message profile-message--error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="profile-message profile-message--success" role="status">
            {message}
          </p>
        )}

        <button className="primary-button profile-save" onClick={save} type="button">
          <Icon name="profile" size={18} />
          <span>Save Profile</span>
        </button>
      </section>
    </div>
  )
}

function PlaceholderPage({
  page,
  onBack,
}: {
  page: string
  onBack: () => void
}) {
  const item = navigation.find((entry) => entry.label === page) ?? navigation[0]
  return (
    <div className="placeholder-page">
      <span className="placeholder-page__icon">
        <Icon name={item.icon} size={30} />
      </span>
      <p className="section-kicker">Prototype destination</p>
      <h2>{page}</h2>
      <p>
        This destination is intentionally left as a labeled placeholder. The current prototype focuses on
        the Dashboard experience.
      </p>
      <button className="secondary-button" onClick={onBack} type="button">
        Back to Dashboard
      </button>
    </div>
  )
}

export default function App() {
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem(SESSION_KEY))
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [workoutStartedAt, setWorkoutStartedAt] = useState<number | null>(null)
  const [workoutElapsedSeconds, setWorkoutElapsedSeconds] = useState(0)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const activeUsername = localStorage.getItem(SESSION_KEY)
    return activeUsername ? loadProfile(activeUsername) : createEmptyProfile()
  })
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const activeUsername = localStorage.getItem(SESSION_KEY)
    return activeUsername ? loadSessions(activeUsername) : []
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

  const login = (nextUsername: string) => {
    setUsername(nextUsername)
    setProfile(loadProfile(nextUsername))
    setSessions(loadSessions(nextUsername))
    setActivePage('Dashboard')
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUsername(null)
    setProfile(createEmptyProfile())
    setActivePage('Dashboard')
    setSidebarExpanded(false)
    setWorkoutStartedAt(null)
    setWorkoutElapsedSeconds(0)
    setSessions([])
  }

  const saveProfile = (nextProfile: UserProfile) => {
    if (!username) return
    localStorage.setItem(profileKey(username), JSON.stringify(nextProfile))
    setProfile(nextProfile)
  }

  const toggleWorkout = () => {
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
      localStorage.setItem(sessionsKey(username!), JSON.stringify(nextSessions))
      setWorkoutElapsedSeconds(durationSec)
      setWorkoutStartedAt(null)
    } else {
      setWorkoutElapsedSeconds(0)
      setWorkoutStartedAt(Date.now())
    }
  }

  if (!username) {
    return <AuthScreen onLogin={login} />
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
          displayName={profile.name || username}
          onLogout={logout}
          onMenu={() => setSidebarExpanded(true)}
          onProfile={() => navigate('My Profile')}
          profilePhoto={profile.photo}
          title={activePage}
        />
        <main>
          {activePage === 'Dashboard' ? (
            <Dashboard
              latestSession={sessions[0] ?? null}
              onToggleWorkout={toggleWorkout}
              profile={profile}
              workoutElapsedSeconds={workoutElapsedSeconds}
              workoutStartedAt={workoutStartedAt}
            />
          ) : activePage === 'Calorie Calculator' ? (
            <CalorieCalculator profile={profile} />
          ) : activePage === 'Activity History' ? (
            <ActivityHistory sessions={sessions} />
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
