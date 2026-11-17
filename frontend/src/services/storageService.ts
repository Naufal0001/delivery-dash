import type { UserProfile, WorkoutSession } from '../types'

const SESSION_KEY = 'deliverydash.session'
const profileKey = (email: string) => `deliverydash.profile.${email}`
const sessionsKey = (email: string) => `deliverydash.sessions.${email}`

export const createEmptyProfile = (email = ''): UserProfile => ({
  name: '',
  email,
  accountType: 'USER',
  photo: '',
  birthDate: '',
  weight: '',
  height: '',
})

export function getStoredSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setStoredSession(email: string): void {
  localStorage.setItem(SESSION_KEY, email)
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function loadProfile(email: string): UserProfile {
  try {
    const saved = localStorage.getItem(profileKey(email))
    return saved
      ? { ...createEmptyProfile(email), ...JSON.parse(saved), accountType: 'user' }
      : createEmptyProfile(email)
  } catch {
    return createEmptyProfile(email)
  }
}

export function saveProfileToStorage(email: string, profile: UserProfile): void {
  localStorage.setItem(profileKey(email), JSON.stringify(profile))
}

export function loadSessions(email: string): WorkoutSession[] {
  try {
    const saved = localStorage.getItem(sessionsKey(email))
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveSessionsToStorage(email: string, sessions: WorkoutSession[]): void {
  localStorage.setItem(sessionsKey(email), JSON.stringify(sessions))
}