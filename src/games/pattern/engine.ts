// Visual pattern: fill in the missing cell in an NxN grid

export type Shape = '●' | '■' | '▲' | '★' | '◆' | '♥' | '⬡' | '+'
export type Color = 'purple' | 'cyan' | 'gold' | 'green' | 'red' | 'white'

export interface PatternCell {
  shape: Shape
  color: Color
  size: 'sm' | 'md' | 'lg'
}

export interface PatternPuzzle {
  grid: (PatternCell | null)[][]  // null = missing cell
  missingRow: number
  missingCol: number
  choices: PatternCell[]
  correctIndex: number
}

const SHAPES: Shape[] = ['●', '■', '▲', '★', '◆', '♥', '⬡', '+']
const COLORS: Color[] = ['purple', 'cyan', 'gold', 'green', 'red', 'white']
const SIZES: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg']

function seededRng(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function rngPick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function generatePattern(gridSize: number, choiceCount: number, seed: number): PatternPuzzle {
  const rng = seededRng(seed)

  // Pattern rule: shapes cycle by row, colors cycle by column, sizes follow diagonal
  const rowShapes = Array.from({ length: gridSize }, () => rngPick(rng, SHAPES))
  const colColors = Array.from({ length: gridSize }, () => rngPick(rng, COLORS))
  const sizes = SIZES

  const grid: PatternCell[][] = Array.from({ length: gridSize }, (_, r) =>
    Array.from({ length: gridSize }, (_, c) => ({
      shape: rowShapes[r],
      color: colColors[c],
      size: sizes[(r + c) % 3],
    }))
  )

  // Pick a random cell to hide (not top-left)
  const missingRow = Math.floor(rng() * gridSize)
  const missingCol = Math.floor(rng() * gridSize)
  const correct = grid[missingRow][missingCol]

  // Build wrong choices
  const wrongs: PatternCell[] = []
  while (wrongs.length < choiceCount - 1) {
    const candidate: PatternCell = {
      shape: rngPick(rng, SHAPES),
      color: rngPick(rng, COLORS),
      size: rngPick(rng, SIZES),
    }
    const isDup = wrongs.some(w => w.shape === candidate.shape && w.color === candidate.color)
    const isCorrect = candidate.shape === correct.shape && candidate.color === correct.color
    if (!isDup && !isCorrect) wrongs.push(candidate)
  }

  const choices = [correct, ...wrongs]
  // Shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }
  const correctIndex = choices.indexOf(correct)

  const gridWithHole: (PatternCell | null)[][] = grid.map((row, r) =>
    row.map((cell, c) => (r === missingRow && c === missingCol ? null : cell))
  )

  return { grid: gridWithHole, missingRow, missingCol, choices, correctIndex }
}

export const COLOR_CLASS: Record<Color, string> = {
  purple: 'text-purple-400',
  cyan: 'text-cyan-400',
  gold: 'text-yellow-400',
  green: 'text-green-400',
  red: 'text-red-400',
  white: 'text-white',
}
