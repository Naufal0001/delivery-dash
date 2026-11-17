import { Icon, IconButton } from './Icon'

export function TopBar({
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