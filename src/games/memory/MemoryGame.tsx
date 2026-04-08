import { useState, useEffect, useCallback } from 'react'
import type { MemoryConfig } from '@/levels/types'
import { createBoard, isComplete, type MemCard } from './engine'
import { TimerBar } from '@/components/TimerBar'
import { useTimer } from '@/hooks/useTimer'
import { playFlip, playMatch, playWrong } from '@/utils/sounds'

interface Props {
  config: MemoryConfig
  onComplete: (stars: number, timeMs: number) => void
}

function calcStars(elapsed: number, thresholds: [number, number]): number {
  if (elapsed <= thresholds[1]) return 3
  if (elapsed <= thresholds[0]) return 2
  return 1
}

export function MemoryGame({ config, onComplete }: Props) {
  const [cards, setCards] = useState<MemCard[]>(() => createBoard(config.pairs, config.seed))
  const [flipped, setFlipped] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [showAll, setShowAll] = useState(true)
  const { elapsed, remaining, isExpired, start, stop } = useTimer(config.timeLimit)

  // Brief peek at all cards at start
  useEffect(() => {
    const t = setTimeout(() => {
      setShowAll(false)
      start()
    }, config.showTime)
    return () => clearTimeout(t)
  }, [config.showTime, start])

  useEffect(() => {
    if (isExpired) {
      stop()
      onComplete(0, (config.timeLimit ?? 60) * 1000)
    }
  }, [isExpired, stop, onComplete, config.timeLimit])

  const handleFlip = useCallback((idx: number) => {
    if (locked || showAll || cards[idx].matched || cards[idx].flipped) return
    playFlip()
    const newFlipped = [...flipped, idx]
    const newCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c)
    setCards(newCards)

    if (newFlipped.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)
      const [a, b] = newFlipped
      if (newCards[a].pairId === newCards[b].pairId) {
        playMatch()
        const matched = newCards.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c
        )
        setCards(matched)
        setFlipped([])
        setLocked(false)
        if (isComplete(matched)) {
          stop()
          const stars = calcStars(elapsed, config.starThresholds)
          onComplete(stars, elapsed * 1000)
        }
      } else {
        setTimeout(() => playWrong(), 400)
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c))
          setFlipped([])
          setLocked(false)
        }, 800)
      }
    } else {
      setFlipped(newFlipped)
    }
  }, [locked, showAll, cards, flipped, elapsed, config.starThresholds, onComplete, stop])

  const cols = config.pairs <= 4 ? 4 : config.pairs <= 6 ? 4 : config.pairs <= 8 ? 4 : 5

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <div className="flex justify-between w-full text-sm text-white/60">
        <span>Moves: <b className="text-white">{moves}</b></span>
        {config.timeLimit && remaining !== undefined && (
          <span className={remaining < 15 ? 'text-red-400 font-bold' : ''}>
            {remaining}s
          </span>
        )}
        <span>Pairs: <b className="text-white">{cards.filter(c => c.matched).length / 2}/{config.pairs}</b></span>
      </div>
      {config.timeLimit && remaining !== undefined && (
        <TimerBar remaining={remaining} total={config.timeLimit} />
      )}
      {showAll && (
        <div className="text-brand-cyan text-sm font-semibold animate-pulse">Memorize! 👀</div>
      )}
      <div
        className="grid gap-2 w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleFlip(idx)}
            className={`
              aspect-square rounded-xl text-3xl font-bold transition-all duration-300
              ${card.matched
                ? 'bg-brand-green/20 border border-brand-green/50 scale-95'
                : card.flipped || showAll
                  ? 'bg-brand-purple/30 border border-brand-purple'
                  : 'bg-brand-card border border-white/10 hover:border-brand-purple/50 active:scale-95'
              }
            `}
          >
            {(card.flipped || card.matched || showAll) ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  )
}
