import type { WorkoutSession } from '../types'
import { formatSessionDate, formatStopwatch } from '../utils/formatters'
import { Icon } from './Icon'

export function RecentActivity({ session }: { session: WorkoutSession | null }) {
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