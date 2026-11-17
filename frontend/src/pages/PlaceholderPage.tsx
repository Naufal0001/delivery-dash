import { Icon } from '../components/Icon'
import { NAVIGATION_ITEMS } from '../components/Sidebar'

export function PlaceholderPage({
  page,
  onBack,
}: {
  page: string
  onBack: () => void
}) {
  const item = NAVIGATION_ITEMS.find((entry) => entry.label === page) ?? NAVIGATION_ITEMS[0]
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