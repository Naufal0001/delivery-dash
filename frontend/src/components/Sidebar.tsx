import type { NavigationItem } from '../types'
import { Icon, IconButton } from './Icon'

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Activity History', icon: 'history' },
  { label: 'Calorie Calculator', icon: 'calculator' },
  { label: 'My Profile', icon: 'profile' },
]

export function Sidebar({
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
          {NAVIGATION_ITEMS.map((item) => {
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