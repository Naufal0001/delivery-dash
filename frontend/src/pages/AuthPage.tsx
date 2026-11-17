import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { loginManualApi, loginRfidApi, saveAuthUser } from '../services/authService'
import type { AuthUser } from '../types'

export function AuthPage({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [method, setMethod] = useState<'password' | 'rfid'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rfidUid, setRfidUid] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const rfidInputRef = useRef<HTMLInputElement>(null)

  // Otomatis fokus ke input RFID saat tab RFID dipilih agar alat reader langsung terbaca
  useEffect(() => {
    if (method === 'rfid') {
      rfidInputRef.current?.focus()
    }
  }, [method])

  const submitManualLogin = async () => {
    setError('')
    if (!email.trim() || !password) {
      setError('Masukkan email dan password Anda.')
      return
    }

    setLoading(true)
    try {
      const user = await loginManualApi(email.trim(), password)
      saveAuthUser(user)
      onLogin(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login.')
    } finally {
      setLoading(false)
    }
  }

  const submitRfidLogin = async () => {
    setError('')
    if (!rfidUid.trim()) {
      setError('Tempelkan kartu RFID atau masukkan UID kartu.')
      return
    }

    setLoading(true)
    try {
      const user = await loginRfidApi(rfidUid.trim())
      saveAuthUser(user)
      onLogin(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Autentikasi RFID gagal.')
      setRfidUid('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <span className="brand-mark">
            <Icon name="bike" size={24} />
          </span>
          <div>
            <strong>DeliveryDash</strong>
            <small>Bicycle activity monitor</small>
          </div>
        </div>
        <div className="auth-brand-panel__copy">
          <p className="section-kicker">Ride. Deliver. Progress.</p>
          <h1>Your cycling activity, all in one place.</h1>
          <p>Satu pintu akses untuk memantau aktivitas latihan pengguna maupun pengelolaan sistem.</p>
        </div>
        <div className="auth-brand-panel__status">
          <span className="status-dot" />
          Connected to Backend API
        </div>
      </section>

      <main className="auth-main">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-card__heading">
            <p className="section-kicker">Welcome back</p>
            <h2 id="auth-title">Log in to DeliveryDash</h2>
            <p>Masuk menggunakan akun User atau Admin Anda.</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Login method">
            <button
              aria-selected={method === 'password'}
              className={method === 'password' ? 'auth-tab auth-tab--active' : 'auth-tab'}
              onClick={() => {
                setMethod('password')
                setError('')
              }}
              role="tab"
              type="button"
            >
              Email & Password
            </button>
            <button
              aria-selected={method === 'rfid'}
              className={method === 'rfid' ? 'auth-tab auth-tab--active' : 'auth-tab'}
              onClick={() => {
                setMethod('rfid')
                setError('')
              }}
              role="tab"
              type="button"
            >
              RFID (Opsional)
            </button>
          </div>

          {method === 'rfid' ? (
            <div className="auth-form">
              <div className="rfid-state" style={{ minHeight: '210px' }}>
                <div className="rfid-illustration">
                  <span className="rfid-wave rfid-wave--one" />
                  <span className="rfid-wave rfid-wave--two" />
                  <span className="rfid-card">
                    <Icon name="rfid" size={36} />
                  </span>
                </div>
                <h3>Tempelkan Kartu RFID</h3>
                <p>Dekatkan kartu ke RFID Reader atau ketik UID secara manual di bawah.</p>
              </div>

              <label htmlFor="auth-rfid">UID Kartu RFID</label>
              <input
                id="auth-rfid"
                onChange={(e) => {
                  setRfidUid(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) submitRfidLogin()
                }}
                placeholder="Contoh: RFID-152024190"
                ref={rfidInputRef}
                type="text"
                value={rfidUid}
              />

              {error && (
                <p className="auth-message auth-message--error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="primary-button auth-submit"
                disabled={loading}
                onClick={submitRfidLogin}
                type="button"
              >
                {loading ? <span className="button-spinner" /> : <Icon name="rfid" size={18} />}
                <span>{loading ? 'Memverifikasi RFID…' : 'Masuk dengan RFID'}</span>
                {!loading && <Icon name="chevron" size={17} />}
              </button>
            </div>
          ) : (
            <div className="auth-form">
              <label htmlFor="auth-email">Email address</label>
              <input
                autoComplete="email"
                id="auth-email"
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                placeholder="nama@email.com"
                type="email"
                value={email}
              />

              <label htmlFor="auth-password">Password</label>
              <div className="password-field">
                <input
                  autoComplete="current-password"
                  id="auth-password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !loading) submitManualLogin()
                  }}
                  placeholder="Masukkan password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {error && (
                <p className="auth-message auth-message--error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="primary-button auth-submit"
                disabled={loading}
                onClick={submitManualLogin}
                type="button"
              >
                {loading ? <span className="button-spinner" /> : <Icon name="profile" size={18} />}
                <span>{loading ? 'Memproses…' : 'Log in'}</span>
                {!loading && <Icon name="chevron" size={17} />}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}