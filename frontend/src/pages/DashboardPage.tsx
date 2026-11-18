import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { RecentActivity } from '../components/RecentActivity'
import { SessionCard } from '../components/SessionCard'
import { StatCard } from '../components/StatCard'
import { fetchLatestTelemetryApi, type LiveTelemetry } from '../services/sessionService'
import type { IconName, UserProfile, WorkoutSession } from '../types'
import { formatStopwatch } from '../utils/formatters'

export function DashboardPage({
  profile,
  latestSession,
  activeSessionId,
  workoutStartedAt,
  workoutElapsedSeconds,
  onToggleWorkout,
}: {
  profile: UserProfile
  latestSession: WorkoutSession | null
  activeSessionId: number | null
  workoutStartedAt: number | null
  workoutElapsedSeconds: number
  onToggleWorkout: () => void
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    workoutStartedAt
      ? workoutElapsedSeconds + Math.floor((Date.now() - workoutStartedAt) / 1000)
      : workoutElapsedSeconds,
  )
  const [liveData, setLiveData] = useState<LiveTelemetry | null>(null)
  const sessionActive = workoutStartedAt !== null

  useEffect(() => {
    if (!workoutStartedAt) {
      setElapsedSeconds(workoutElapsedSeconds)
      setLiveData(null)
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

  // Tarik data BPM & RPM terbaru dari database setiap 2 detik saat sesi aktif
  useEffect(() => {
    if (!sessionActive || !activeSessionId) return

    const pollTelemetry = async () => {
      try {
        const data = await fetchLatestTelemetryApi(activeSessionId)
        setLiveData(data)
      } catch {
        // Abaikan error sementara saat polling
      }
    }

    pollTelemetry()
    const interval = window.setInterval(pollTelemetry, 2000)
    return () => window.clearInterval(interval)
  }, [sessionActive, activeSessionId])

  // Estimasi kecepatan km/h dari RPM sepeda (asumsi keliling roda ~2.1m)
  const speedKmh =
    liveData?.rpm !== null && liveData?.rpm !== undefined
      ? (liveData.rpm * 0.126).toFixed(1)
      : '--'

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
      value: sessionActive ? speedKmh : '--',
      unit: 'km/h',
      icon: 'activity',
      detail:
        sessionActive && liveData?.rpm !== null && liveData?.rpm !== undefined
          ? `${liveData.rpm} RPM live`
          : 'Waiting for IoT data',
    },
    {
      label: 'Time',
      value: formatStopwatch(elapsedSeconds),
      unit: '',
      icon: 'time',
      detail: sessionActive ? `Session #${activeSessionId ?? '-'}` : 'Starts with your workout',
    },
    {
      label: 'Heart Rate',
      value:
        sessionActive && liveData?.bpm !== null && liveData?.bpm !== undefined
          ? String(liveData.bpm)
          : '--',
      unit: 'BPM',
      icon: 'heart',
      detail:
        sessionActive && liveData?.bpm !== null && liveData?.bpm !== undefined
          ? 'Live from sensor'
          : 'Waiting for IoT data',
    },
    {
      label: 'Calories Burned',
      value:
        latestSession?.estimatedCalories !== null && latestSession?.estimatedCalories !== undefined
          ? String(latestSession.estimatedCalories)
          : '--',
      unit: 'kcal',
      icon: 'flame',
      detail: latestSession ? 'Last completed session' : 'No workout data',
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
            {sessionActive
              ? `Active DB Session #${activeSessionId} • ${liveData?.totalPoints ?? 0} data points`
              : 'IoT values appear when available'}
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