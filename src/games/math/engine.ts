import type { MathOp } from '@/levels/types'

export interface MathQuestion {
  a: number
  b: number
  op: '+' | '-' | '×' | '÷'
  answer: number
  display: string
  choices: number[]
}

function seededRng(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function makeQuestion(op: '+' | '-' | '×' | '÷', maxVal: number, rng: () => number): MathQuestion {
  let a: number, b: number, answer: number

  if (op === '+') {
    a = Math.floor(rng() * maxVal) + 1
    b = Math.floor(rng() * maxVal) + 1
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(rng() * maxVal) + 1
    b = Math.floor(rng() * a) + 1  // ensure positive result
    answer = a - b
  } else if (op === '×') {
    const half = Math.ceil(Math.sqrt(maxVal))
    a = Math.floor(rng() * half) + 2
    b = Math.floor(rng() * half) + 2
    answer = a * b
  } else {
    b = Math.floor(rng() * 10) + 2
    answer = Math.floor(rng() * 10) + 1
    a = b * answer
  }

  // Wrong choices — near the right answer
  const offsets = [-3, -2, -1, 1, 2, 3, 4, 5, -4, -5]
  const wrong: Set<number> = new Set()
  for (const off of offsets) {
    const w = answer + off
    if (w > 0 && w !== answer) wrong.add(w)
    if (wrong.size >= 3) break
  }
  const choices = [answer, ...Array.from(wrong).slice(0, 3)]
  // Shuffle choices
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }

  return { a, b, op, answer, display: `${a} ${op} ${b} = ?`, choices }
}

export function generateQuestions(operation: MathOp, count: number, maxVal: number, seed: number): MathQuestion[] {
  const rng = seededRng(seed)
  const ops: ('+' | '-' | '×' | '÷')[] = operation === 'mixed' ? ['+', '-', '×', '÷'] : [operation]
  return Array.from({ length: count }, (_, i) => {
    const op = ops[i % ops.length]
    return makeQuestion(op, maxVal, rng)
  })
}
