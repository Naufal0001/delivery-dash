import { useState } from 'react'
import { Icon } from '../components/Icon'
import type { UserProfile } from '../types'
import {
  calculateAge,
  ESTIMATED_CALORIES_PER_MINUTE_PER_KMH,
  formatRideTime,
} from '../utils/formatters'

export function CalorieCalculatorPage({ profile }: { profile: UserProfile }) {
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