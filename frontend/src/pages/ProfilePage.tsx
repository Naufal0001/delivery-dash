import { useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import type { UserProfile } from '../types'

export function ProfilePage({
  profile,
  onSave,
}: {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
}) {
  const [draft, setDraft] = useState(profile)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().slice(0, 10)

  const updateField = (field: keyof UserProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setError('')
    setMessage('')
  }

  const selectPhoto = (file: File | undefined) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.')
      setMessage('')
      return
    }
    if (file.size > 1024 * 1024) {
      setError('Choose an image smaller than 1 MB.')
      setMessage('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('photo', reader.result)
      }
    }
    reader.onerror = () => {
      setError('The selected image could not be read.')
      setMessage('')
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    const weight = Number(draft.weight)
    const height = Number(draft.height)

    if (!draft.weight || !Number.isFinite(weight) || weight <= 0) {
      setError('Weight must be a positive number.')
      setMessage('')
      return
    }
    if (!draft.height || !Number.isFinite(height) || height <= 0) {
      setError('Height must be a positive number.')
      setMessage('')
      return
    }
    if (draft.birthDate && draft.birthDate > today) {
      setError('Date of birth cannot be in the future.')
      setMessage('')
      return
    }
    if (!draft.email.trim()) {
      setError('Email address is required.')
      setMessage('')
      return
    }

    onSave({ ...draft, email: draft.email.trim(), accountType: 'USER' })
    setError('')
    setMessage('Profile saved successfully.')
  }

  return (
    <div className="profile-page">
      <section className="calculator-intro">
        <div className="calculator-intro__icon">
          <Icon name="profile" size={27} />
        </div>
        <div>
          <p className="section-kicker">Personal details</p>
          <h2>My Profile</h2>
          <p>Keep your rider information up to date for your local dashboard experience.</p>
        </div>
      </section>

      <section className="panel profile-card" aria-labelledby="profile-form-title">
        <div className="panel__header">
          <div>
            <p className="section-kicker">Rider information</p>
            <h2 id="profile-form-title">Profile details</h2>
          </div>
          <span className="mission-icon">
            <Icon name="profile" />
          </span>
        </div>

        <div className="profile-photo-editor">
          <span className="profile-photo-editor__preview">
            {draft.photo ? (
              <img alt="Selected profile preview" src={draft.photo} />
            ) : (
              <Icon name="profile" size={30} />
            )}
          </span>
          <div>
            <strong>Profile photo</strong>
            <p>JPG, PNG, or WebP. Maximum file size 1 MB.</p>
            <button
              className="photo-upload-button"
              onClick={() => photoInputRef.current?.click()}
              type="button"
            >
              Change profile photo
            </button>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="visually-hidden"
              id="profile-photo"
              onChange={(event) => selectPhoto(event.target.files?.[0])}
              ref={photoInputRef}
              type="file"
            />
          </div>
        </div>

        <div className="profile-form">
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Enter your name"
            type="text"
            value={draft.name}
          />

          <label htmlFor="profile-email">Email address</label>
          <input
            autoComplete="email"
            id="profile-email"
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="Enter email address"
            type="email"
            value={draft.email}
          />

          <label htmlFor="profile-account-type">Account type</label>
          <input
            aria-readonly="true"
            className="profile-readonly"
            id="profile-account-type"
            readOnly
            type="text"
            value={draft.accountType}
          />

          <label htmlFor="profile-birth-date">Date of Birth</label>
          <input
            id="profile-birth-date"
            max={today}
            onChange={(event) => updateField('birthDate', event.target.value)}
            type="date"
            value={draft.birthDate}
          />

          <div className="profile-form__row">
            <div>
              <label htmlFor="profile-weight">Weight (kg)</label>
              <input
                id="profile-weight"
                inputMode="decimal"
                min="0.1"
                onChange={(event) => updateField('weight', event.target.value)}
                placeholder="Enter weight"
                step="0.1"
                type="number"
                value={draft.weight}
              />
            </div>
            <div>
              <label htmlFor="profile-height">Height (cm)</label>
              <input
                id="profile-height"
                inputMode="decimal"
                min="0.1"
                onChange={(event) => updateField('height', event.target.value)}
                placeholder="Enter height"
                step="0.1"
                type="number"
                value={draft.height}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="profile-message profile-message--error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="profile-message profile-message--success" role="status">
            {message}
          </p>
        )}

        <button className="primary-button profile-save" onClick={save} type="button">
          <Icon name="profile" size={18} />
          <span>Save Profile</span>
        </button>
      </section>
    </div>
  )
}