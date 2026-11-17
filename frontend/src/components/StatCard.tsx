import type { IconName } from '../types'
import { Icon } from './Icon'

export function StatCard({
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