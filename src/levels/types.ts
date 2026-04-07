export type GameType = 'memory' | 'sequence' | 'math' | 'wordscramble' | 'pattern' | 'logic'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface LevelConfig {
  id: number
  type: GameType
  difficulty: Difficulty
  seed: number
  timeLimit?: number      // seconds — undefined = no limit
  starThresholds: [number, number]  // [2-star time, 3-star time] in seconds
}

// ── Memory Match ──────────────────────────────────────────────────────────────
export interface MemoryConfig extends LevelConfig {
  type: 'memory'
  pairs: number           // 4, 6, 8, 10, 12
  showTime: number        // ms cards stay visible
}

// ── Number Sequence ───────────────────────────────────────────────────────────
export type SeqPattern = 'arithmetic' | 'geometric' | 'fibonacci' | 'square' | 'prime' | 'alternating'
export interface SequenceConfig extends LevelConfig {
  type: 'sequence'
  pattern: SeqPattern
  visibleCount: number    // how many terms shown
  missingCount: number    // how many to fill in
}

// ── Math Challenge ────────────────────────────────────────────────────────────
export type MathOp = '+' | '-' | '×' | '÷' | 'mixed'
export interface MathConfig extends LevelConfig {
  type: 'math'
  operation: MathOp
  questionCount: number
  maxValue: number
}

// ── Word Scramble ─────────────────────────────────────────────────────────────
export interface WordScrambleConfig extends LevelConfig {
  type: 'wordscramble'
  wordCount: number
  category: string
}

// ── Visual Pattern ────────────────────────────────────────────────────────────
export interface PatternConfig extends LevelConfig {
  type: 'pattern'
  gridSize: number        // 3x3 or 4x4
  choices: number         // 4 or 6
}

// ── Logic Deduction ───────────────────────────────────────────────────────────
export interface LogicConfig extends LevelConfig {
  type: 'logic'
  clueCount: number
  entityCount: number
}

export type AnyLevelConfig = MemoryConfig | SequenceConfig | MathConfig | WordScrambleConfig | PatternConfig | LogicConfig
