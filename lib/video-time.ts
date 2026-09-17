/** Formats seconds as m:ss (or h:mm:ss past one hour). Guards NaN/Infinity to 0:00. */
export function formatVideoTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00"
  const total = Math.floor(totalSeconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes)
  const ss = String(seconds).padStart(2, "0")
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
}
