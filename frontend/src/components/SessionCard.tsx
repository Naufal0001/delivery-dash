export function SessionCard({ active }: { active: boolean }) {
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