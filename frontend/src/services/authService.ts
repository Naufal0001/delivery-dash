import type { AuthUser } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const AUTH_STORAGE_KEY = 'deliverydash.auth_user'

export async function loginManualApi(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Gagal melakukan login')
  }
  return data
}

export async function loginRfidApi(rfidUid: string): Promise<AuthUser> {
  const response = await fetch(`${BASE_URL}/auth/rfid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rfidUid }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Kartu RFID tidak valid')
  }
  return data
}

export function getSavedAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}