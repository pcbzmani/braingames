export interface LevelResult {
  stars: number      // 1-3
  attempts: number
  bestTime?: number  // ms
}

export interface Progress {
  completedLevels: Record<number, LevelResult>
  unlockedLevel: number
  totalStars: number
}

const KEY = 'braingames_progress'
const TOTAL_LEVELS = 500

function empty(): Progress {
  return { completedLevels: {}, unlockedLevel: 1, totalStars: 0 }
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    return JSON.parse(raw) as Progress
  } catch {
    return empty()
  }
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function completeLevel(levelId: number, stars: number, timeMs: number): Progress {
  const p = loadProgress()
  const prev = p.completedLevels[levelId]
  const isImprovement = !prev || stars > prev.stars

  p.completedLevels[levelId] = {
    stars: Math.max(stars, prev?.stars ?? 0),
    attempts: (prev?.attempts ?? 0) + 1,
    bestTime: prev?.bestTime ? Math.min(prev.bestTime, timeMs) : timeMs,
  }

  if (isImprovement) {
    p.totalStars = Object.values(p.completedLevels).reduce((s, r) => s + r.stars, 0)
  }

  const next = Math.min(levelId + 1, TOTAL_LEVELS)
  if (next > p.unlockedLevel) p.unlockedLevel = next

  saveProgress(p)
  return p
}

export function getStars(levelId: number): number {
  return loadProgress().completedLevels[levelId]?.stars ?? 0
}

export function resetProgress(): void {
  localStorage.removeItem(KEY)
}

export function getProgressStats(): { completed: number; totalStars: number; maxStreak: number } {
  const p = loadProgress()
  const completed = Object.keys(p.completedLevels).length
  // Calculate max consecutive streak
  let maxStreak = 0, streak = 0
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    if (p.completedLevels[i]) { streak++; maxStreak = Math.max(maxStreak, streak) }
    else streak = 0
  }
  return { completed, totalStars: p.totalStars, maxStreak }
}
