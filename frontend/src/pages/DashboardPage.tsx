import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { RecentActivity } from '../components/RecentActivity'
import { SessionCard } from '../components/SessionCard'
import { StatCard } from '../components/StatCard'
import type { IconName, UserProfile, WorkoutSession } from '../types'
import { formatStopwatch } from '../utils/formatters'

export function DashboardPage({
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