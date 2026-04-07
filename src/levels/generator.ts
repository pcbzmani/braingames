import type { AnyLevelConfig, Difficulty, GameType } from './types'

// Deterministic seeded random
function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function rngPick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function getDifficulty(id: number): Difficulty {
  if (id <= 150) return 'easy'
  if (id <= 350) return 'medium'
  return 'hard'
}

// Cycle through game types with variety
const GAME_CYCLE: GameType[] = ['memory', 'sequence', 'math', 'wordscramble', 'pattern', 'logic']

function getGameType(id: number): GameType {
  // Use a deterministic but pseudo-varied rotation
  const patterns = [0, 1, 2, 3, 4, 5, 1, 2, 0, 4, 3, 5]
  return GAME_CYCLE[patterns[(id - 1) % patterns.length]]
}

export function generateLevel(id: number): AnyLevelConfig {
  const difficulty = getDifficulty(id)
  const type = getGameType(id)
  const seed = id * 31337
  const rng = seededRng(seed)

  const base = { id, type, difficulty, seed }

  // Time limits (hard levels always have pressure)
  const timeLimit = difficulty === 'easy' ? undefined : difficulty === 'medium' ? 90 : 60

  switch (type) {
    case 'memory': {
      const pairs = difficulty === 'easy' ? rngPick(rng, [4, 6]) : difficulty === 'medium' ? rngPick(rng, [6, 8]) : rngPick(rng, [8, 10, 12])
      return {
        ...base, type, timeLimit,
        pairs,
        showTime: difficulty === 'easy' ? 1200 : difficulty === 'medium' ? 900 : 700,
        starThresholds: [timeLimit ? timeLimit * 0.8 : 60, timeLimit ? timeLimit * 0.5 : 40],
      }
    }
    case 'sequence': {
      const patterns: ('arithmetic' | 'geometric' | 'fibonacci' | 'square' | 'prime' | 'alternating')[] =
        difficulty === 'easy' ? ['arithmetic', 'arithmetic', 'geometric'] :
        difficulty === 'medium' ? ['arithmetic', 'geometric', 'fibonacci', 'square'] :
        ['fibonacci', 'square', 'prime', 'alternating', 'geometric']
      return {
        ...base, type, timeLimit,
        pattern: rngPick(rng, patterns),
        visibleCount: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7,
        missingCount: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        starThresholds: [30, 15],
      }
    }
    case 'math': {
      const ops: ('+' | '-' | '×' | '÷' | 'mixed')[] =
        difficulty === 'easy' ? ['+', '-'] :
        difficulty === 'medium' ? ['+', '-', '×', 'mixed'] :
        ['×', '÷', 'mixed']
      return {
        ...base, type, timeLimit,
        operation: rngPick(rng, ops),
        questionCount: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10,
        maxValue: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100,
        starThresholds: [timeLimit ? timeLimit * 0.7 : 45, timeLimit ? timeLimit * 0.4 : 25],
      }
    }
    case 'wordscramble': {
      const categories = ['animals', 'countries', 'science', 'sports', 'food']
      return {
        ...base, type, timeLimit,
        wordCount: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7,
        category: rngPick(rng, categories),
        starThresholds: [timeLimit ? timeLimit * 0.8 : 50, timeLimit ? timeLimit * 0.5 : 30],
      }
    }
    case 'pattern': {
      return {
        ...base, type, timeLimit,
        gridSize: difficulty === 'hard' ? 4 : 3,
        choices: difficulty === 'easy' ? 4 : 6,
        starThresholds: [20, 10],
      }
    }
    case 'logic': {
      return {
        ...base, type, timeLimit,
        clueCount: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6,
        entityCount: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5,
        starThresholds: [timeLimit ? timeLimit * 0.8 : 80, timeLimit ? timeLimit * 0.5 : 50],
      }
    }
  }
}

// Pre-build all 500 level configs (cached)
let _allLevels: AnyLevelConfig[] | null = null
export function getAllLevels(): AnyLevelConfig[] {
  if (!_allLevels) {
    _allLevels = Array.from({ length: 500 }, (_, i) => generateLevel(i + 1))
  }
  return _allLevels
}

export function getLevel(id: number): AnyLevelConfig {
  return getAllLevels()[id - 1]
}
