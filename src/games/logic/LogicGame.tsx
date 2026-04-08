import { useState, useEffect } from 'react'
import type { LogicConfig } from '@/levels/types'
import { generateLogicPuzzle } from './engine'
import { useTimer } from '@/hooks/useTimer'
import { TimerBar } from '@/components/TimerBar'
import { playCorrect, playWrong } from '@/utils/sounds'

interface Props {
  config: LogicConfig
  onComplete: (stars: number, timeMs: number) => void
}

export function LogicGame({ config, onComplete }: Props) {
  const puzzle = generateLogicPuzzle(config.entityCount, config.clueCount, config.seed)
  const [picked, setPicked] = useState<string | null>(null)
  const { elapsed, remaining, isExpired, start, stop } = useTimer(config.timeLimit)

  useEffect(() => { start() }, [start])
  useEffect(() => {
    if (isExpired) { stop(); onComplete(0, (config.timeLimit ?? 60) * 1000) }
  }, [isExpired, stop, onComplete, config.timeLimit])

  function pick(item: string) {
    if (picked !== null) return
    setPicked(item)
    const questionName = puzzle.question.match(/does (\w+) have/)?.[1] ?? ''
    const isCorrect = puzzle.solution[questionName] === item
    if (isCorrect) playCorrect(); else playWrong()
    const stars = !isCorrect ? 0 : elapsed <= config.starThresholds[1] ? 3 : elapsed <= config.starThresholds[0] ? 2 : 1
    setTimeout(() => { stop(); onComplete(stars, elapsed * 1000) }, 900)
  }

  const correctItem = (() => {
    const name = puzzle.question.match(/does (\w+) have/)?.[1] ?? ''
    return puzzle.solution[name]
  })()

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <p className="text-white/60 text-sm">Read the clues and deduce the answer</p>
      {config.timeLimit && remaining !== undefined && (
        <TimerBar remaining={remaining} total={config.timeLimit} />
      )}
      {/* Clues */}
      <div className="card-glass p-4 w-full space-y-2">
        <p className="text-brand-cyan text-xs uppercase tracking-widest mb-3 font-semibold">Clues</p>
        {puzzle.clues.map((clue, i) => (
          <div key={i} className="flex gap-2 text-sm text-white/80">
            <span className="text-brand-violet mt-0.5">•</span>
            <span>{clue}</span>
          </div>
        ))}
      </div>
      {/* Question */}
      <div className="card-glass p-4 w-full text-center">
        <p className="text-white font-semibold text-lg">{puzzle.question}</p>
      </div>
      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {puzzle.choices.map(item => (
          <button
            key={item}
            onClick={() => pick(item)}
            className={`
              card-glass py-4 text-base font-semibold capitalize rounded-xl transition-all active:scale-95
              ${picked
                ? item === correctItem
                  ? 'border-brand-green bg-brand-green/10 text-brand-green'
                  : item === picked
                    ? 'border-brand-red bg-brand-red/10 text-brand-red'
                    : 'opacity-30'
                : 'hover:border-brand-purple/60'
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
