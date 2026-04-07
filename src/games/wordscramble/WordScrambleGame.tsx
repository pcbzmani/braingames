import { useState, useEffect } from 'react'
import type { WordScrambleConfig } from '@/levels/types'
import { generateScrambles } from './engine'
import { useTimer } from '@/hooks/useTimer'
import { TimerBar } from '@/components/TimerBar'

interface Props {
  config: WordScrambleConfig
  onComplete: (stars: number, timeMs: number) => void
}

export function WordScrambleGame({ config, onComplete }: Props) {
  const words = generateScrambles(config.category, config.wordCount, config.seed)
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const { elapsed, remaining, isExpired, start, stop } = useTimer(config.timeLimit)

  useEffect(() => { start() }, [start])
  useEffect(() => {
    if (isExpired) { stop(); onComplete(0, (config.timeLimit ?? 60) * 1000) }
  }, [isExpired, stop, onComplete, config.timeLimit])

  function submit() {
    const isCorrect = input.trim().toLowerCase() === words[current].original.toLowerCase()
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)
    setTimeout(() => {
      setFeedback(null)
      setInput('')
      setShowHint(false)
      if (current + 1 >= words.length) {
        stop()
        const finalScore = score + (isCorrect ? 1 : 0)
        const pct = finalScore / words.length
        const stars = pct === 1 ? (elapsed <= config.starThresholds[1] ? 3 : 2) : pct >= 0.6 ? 1 : 0
        onComplete(stars, elapsed * 1000)
      } else {
        setCurrent(c => c + 1)
      }
    }, 700)
  }

  const w = words[current]

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex justify-between w-full text-sm text-white/60">
        <span>{current + 1} / {words.length}</span>
        {config.timeLimit && remaining !== undefined && (
          <span className={remaining < 15 ? 'text-red-400 font-bold' : ''}>{remaining}s</span>
        )}
        <span className="capitalize">{config.category}</span>
      </div>
      {config.timeLimit && remaining !== undefined && (
        <TimerBar remaining={remaining} total={config.timeLimit} />
      )}
      <p className="text-white/50 text-sm">Unscramble the word</p>
      {/* Scrambled word */}
      <div className="flex gap-2 flex-wrap justify-center">
        {w.scrambled.split('').map((letter, i) => (
          <div key={i} className="card-glass w-10 h-12 flex items-center justify-center
                                   text-xl font-bold text-brand-cyan font-display uppercase">
            {letter}
          </div>
        ))}
      </div>
      {showHint && (
        <p className="text-brand-gold text-sm">{w.hint}</p>
      )}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && input && submit()}
        placeholder="Type your answer…"
        className={`
          w-full p-4 text-center text-xl rounded-xl outline-none border bg-brand-card
          transition-colors font-body
          ${feedback === 'correct' ? 'border-brand-green text-brand-green' :
            feedback === 'wrong' ? 'border-brand-red text-brand-red animate-shake' :
            'border-white/20 text-white focus:border-brand-purple'}
        `}
        autoCapitalize="none"
      />
      <div className="flex gap-3 w-full">
        <button className="btn-ghost flex-1 text-sm" onClick={() => setShowHint(true)}>
          💡 Hint
        </button>
        <button className="btn-primary flex-1" onClick={submit} disabled={!input}>
          Submit
        </button>
      </div>
    </div>
  )
}
