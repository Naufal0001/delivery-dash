import { Icon } from '../components/Icon'
import type { WorkoutSession } from '../types'
import { formatSessionDate, formatStopwatch } from '../utils/formatters'

export function ActivityHistoryPage({ sessions }: { sessions: WorkoutSession[] }) {
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