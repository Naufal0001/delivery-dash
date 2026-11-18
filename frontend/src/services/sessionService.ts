const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export type LiveTelemetry = {
  totalPoints: number
  bpm: number | null
  rpm: number | null
  recordedAt: string | null
}

export async function startWorkoutSessionApi(userId: number): Promise<{ sessionId: number; startTime: string }> {
  const response = await fetch(`${BASE_URL}/sessions/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Gagal memulai sesi di server')
  }
  return data
}

export async function stopWorkoutSessionApi(
  sessionId: number,
  durationSec: number,
): Promise<{ caloriesKcal: number; avgBpm: number; avgRpm: number }> {
  const response = await fetch(`${BASE_URL}/sessions/${sessionId}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ durationSec }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengakhiri sesi di server')
  }
  return data
}

export async function fetchLatestTelemetryApi(sessionId: number): Promise<LiveTelemetry> {
  const response = await fetch(`${BASE_URL}/sessions/${sessionId}/latest`)
  if (!response.ok) {
    throw new Error('Gagal mengambil data telemetri terbaru')
  }
  return response.json()
}