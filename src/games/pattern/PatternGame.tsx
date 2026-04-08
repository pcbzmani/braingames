import { useState, useEffect } from 'react'
import type { PatternConfig } from '@/levels/types'
import { generatePattern, COLOR_CLASS, type PatternCell } from './engine'
import { useTimer } from '@/hooks/useTimer'
import { TimerBar } from '@/components/TimerBar'
import { playCorrect, playWrong } from '@/utils/sounds'

interface Props {
  config: PatternConfig
  onComplete: (stars: number, timeMs: number) => void
}

function Cell({ cell, size = 'md' }: { cell: PatternCell; size?: 'sm' | 'md' }) {
  const sizeClass = cell.size === 'sm' ? 'text-lg' : cell.size === 'md' ? 'text-2xl' : 'text-3xl'
  return (
    <span className={`${sizeClass} ${COLOR_CLASS[cell.color]} leading-none`}>
      {cell.shape}
    </span>
  )
}

export function PatternGame({ config, onComplete }: Props) {
  const puzzle = generatePattern(config.gridSize, config.choices, config.seed)
  const [picked, setPicked] = useState<number | null>(null)
  const { elapsed, remaining, isExpired, start, stop } = useTimer(config.timeLimit)

  useEffect(() => { start() }, [start])
  useEffect(() => {
    if (isExpired) { stop(); onComplete(0, (config.timeLimit ?? 60) * 1000) }
  }, [isExpired, stop, onComplete, config.timeLimit])

  function pick(idx: number) {
    if (picked !== null) return
    setPicked(idx)
    const isCorrect = idx === puzzle.correctIndex
    if (isCorrect) playCorrect(); else playWrong()
    const stars = !isCorrect ? 0 : elapsed <= config.starThresholds[1] ? 3 : elapsed <= config.starThresholds[0] ? 2 : 1
    setTimeout(() => { stop(); onComplete(stars, elapsed * 1000) }, 800)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <p className="text-white/60 text-sm">Find the missing piece in the pattern</p>
      {config.timeLimit && remaining !== undefined && (
        <TimerBar remaining={remaining} total={config.timeLimit} />
      )}
      {/* Grid */}
      <div
        className="card-glass p-4"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`, gap: '8px' }}
      >
        {puzzle.grid.flatMap((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`}
              className="w-14 h-14 flex items-center justify-center card-glass rounded-xl">
              {cell ? <Cell cell={cell} /> : <span className="text-brand-purple text-2xl font-bold">?</span>}
            </div>
          ))
        )}
      </div>
      {/* Choices */}
      <p className="text-white/50 text-sm">Choose the missing piece:</p>
      <div className="grid grid-cols-3 gap-3 w-full">
        {puzzle.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={`
              card-glass h-14 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95
              ${picked === i
                ? i === puzzle.correctIndex
                  ? 'border-brand-green bg-brand-green/10'
                  : 'border-brand-red bg-brand-red/10'
                : picked !== null && i === puzzle.correctIndex
                  ? 'border-brand-green bg-brand-green/10'
                  : 'hover:border-brand-purple/60'
              }
            `}
          >
            <Cell cell={choice} />
          </button>
        ))}
      </div>
    </div>
  )
}
