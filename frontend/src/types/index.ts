export type IconName =
  | 'activity'
  | 'bike'
  | 'calculator'
  | 'calendar'
  | 'chevron'
  | 'close'
  | 'dashboard'
  | 'distance'
  | 'flame'
  | 'heart'
  | 'history'
  | 'logout'
  | 'menu'
  | 'profile'
  | 'rfid'
  | 'score'
  | 'time'
  | 'weight'

export type UserRole = 'USER' | 'ADMIN'

export type NavigationItem = {
  label: string
  icon: IconName
}

export type AuthUser = {
  id: number
  name: string
  email: string
  role: UserRole
  weightKg?: number | null
  heightCm?: number | null
  birthDate?: string | null
}

export type UserProfile = {
  name: string
  email: string
  accountType: UserRole
  photo: string
  birthDate: string
  weight: string
  height: string
}

export type WorkoutSession = {
  id: string
  startTime: string
  endTime: string
  durationSec: number
  estimatedCalories: number | null
}