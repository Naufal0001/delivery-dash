import { Icon } from '../components/Icon'
import type { AuthUser } from '../types'

export function AdminDashboardPlaceholder({
  admin,
  onLogout,
}: {
  admin: AuthUser
  onLogout: () => void
}) {
  return (
    <div className="app-content" style={{ paddingLeft: 0 }}>
      <header className="topbar">
        <div className="topbar__leading">
          <span className="brand-mark">
            <Icon name="bike" size={22} />
          </span>
          <div>
            <p className="topbar__eyebrow">Administrator Workspace</p>
            <h1>Admin Panel</h1>
          </div>
        </div>
        <div className="topbar__actions">
          <span className="subtle-chip">Role: {admin.role}</span>
          <button className="logout-button" onClick={onLogout} type="button">
            <Icon name="logout" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main>
        <div className="placeholder-page">
          <span className="placeholder-page__icon">
            <Icon name="dashboard" size={30} />
          </span>
          <p className="section-kicker">Autentikasi Admin Berhasil</p>
          <h2>Halo, {admin.name}</h2>
          <p>
            Anda berhasil masuk menggunakan akun <strong>ADMIN</strong> ({admin.email}). Modul
            dashboard manajemen pengguna, perangkat IoT, dan log sistem sedang dalam tahap
            pengembangan dan akan ditempatkan di halaman ini.
          </p>
        </div>
      </main>
    </div>
  )
}