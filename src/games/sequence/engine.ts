import type { SeqPattern } from '@/levels/types'

function primes(n: number): number[] {
  const result: number[] = []
  let num = 2
  while (result.length < n) {
    if (Array.from({ length: num - 2 }, (_, i) => i + 2).every(d => num % d !== 0)) result.push(num)
    num++
  }
  return result
}

export function generateSequence(pattern: SeqPattern, length: number, seed: number): number[] {
  let s = seed
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }

  switch (pattern) {
    case 'arithmetic': {
      const start = Math.floor(rng() * 10) + 1
      const diff = Math.floor(rng() * 9) + 2
      return Array.from({ length }, (_, i) => start + i * diff)
    }
    case 'geometric': {
      const start = Math.floor(rng() * 3) + 1
      const ratio = Math.floor(rng() * 3) + 2
      return Array.from({ length }, (_, i) => start * Math.pow(ratio, i))
    }
    case 'fibonacci': {
      const a = Math.floor(rng() * 5) + 1
      const b = Math.floor(rng() * 5) + 1
      const seq = [a, b]
      for (let i = 2; i < length; i++) seq.push(seq[i - 1] + seq[i - 2])
      return seq
    }
    case 'square': {
      const offset = Math.floor(rng() * 5) + 1
      return Array.from({ length }, (_, i) => Math.pow(i + offset, 2))
    }
    case 'prime': {
      return primes(length)
    }
    case 'alternating': {
      const a = Math.floor(rng() * 5) + 2
      const b = Math.floor(rng() * 5) + 10
      return Array.from({ length }, (_, i) => i % 2 === 0 ? a * (Math.floor(i / 2) + 1) : b + i)
    }
  }
}

export function getPatternLabel(pattern: SeqPattern): string {
  const labels: Record<SeqPattern, string> = {
    arithmetic: 'Arithmetic', geometric: 'Geometric', fibonacci: 'Fibonacci',
    square: 'Perfect Squares', prime: 'Prime Numbers', alternating: 'Alternating'
  }
  return labels[pattern]
}
